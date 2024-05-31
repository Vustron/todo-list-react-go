package main

// importing dependencies
import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// init Todo type
type Todo struct {
	ID primitive.ObjectID	`json:"_id,omitempty" bson:"_id,omitempty"`
	Completed bool          `json:"completed"`
	Body string             `json:"body"`
}

// init mongodb
var collection *mongo.Collection

// init main
func main() {

	// load env
	if os.Getenv("ENV") != "production" {
		// Load the .env file if not in production
		err := godotenv.Load(".env")
		if err != nil {
			log.Fatal("Error loading .env file:", err)
		}
	}

	// init db url
	MONGODB_URI := os.Getenv("MONGODB_URI")
	clientOptions := options.Client().ApplyURI(MONGODB_URI)
	client,err := mongo.Connect(context.Background(),clientOptions)

	if err != nil{
		log.Fatal(err)
	}

	defer client.Disconnect(context.Background())

	err = client.Ping(context.Background(), nil)
	if err != nil{
		log.Fatal(err)
	}

	fmt.Println("Connected to Mongodb Atlas")

	// init collections from db
	collection = (client.Database("react_todo_golang").Collection("todos"))

	// init fiber
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Origin,Content-Type,Accept",
	}))

	// init rest api routes
	app.Get("/api/todos", getTodos)
	app.Post("/api/todos", createTodo)
	app.Patch("/api/todos/:id", updateTodo)
	app.Delete("/api/todos/:id", deleteTodo)

	// init port
	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	log.Fatal(app.Listen("0.0.0.0:" + port))
}

// get todo route handler
func getTodos(c *fiber.Ctx) error{

	var todos []Todo

	cursor, err := collection.Find(context.Background(),bson.M{})

	if err != nil{
		return err
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()){
		var todo Todo
		if err := cursor.Decode(&todo); err != nil {
			return err
		}
		todos = append(todos, todo)
	}

	return c.JSON(todos)
}

// create todo route handler
func createTodo(c *fiber.Ctx) error{
	todo := new(Todo)

	if err := c.BodyParser(todo); err != nil {
		return err
	}

	if todo.Body == ""{
		return c.Status(400).JSON(fiber.Map{"error": "Todo body	cannot be empty"})
	}

	insertResult, err := collection.InsertOne(context.Background(),todo)
	if err != nil {
		return err
	}

	todo.ID = insertResult.InsertedID.(primitive.ObjectID)

	return c.Status(201).JSON(todo)

}

// update todo route handler
func updateTodo(c *fiber.Ctx) error{
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid todo ID"})
	}

	filter := bson.M{"_id":objectID}
	update := bson.M{"$set":bson.M{"completed":true}}

	_,err = collection.UpdateOne(context.Background(),filter,update)
	if err != nil{
		return err
	}

	return c.Status(200).JSON(fiber.Map{"success": true})
}

// delete todo route handler
func deleteTodo(c *fiber.Ctx) error{
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid todo ID"})
	}

	filter := bson.M{"_id":objectID}
	_,err = collection.DeleteOne(context.Background(),filter)

	if err != nil{
		return err
	}

	return c.Status(200).JSON(fiber.Map{"success": true})
}
