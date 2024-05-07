// package name
package main

// imports
import (
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

// init Todo type
type Todo struct {
	ID int	`json:"id"`
	Completed bool `json:"completed"`
	Body string `json:"body"`
}

// main app
func main(){
	// init fiber
	app := fiber.New()
	// define variables
	todos := []Todo{}
	// init port
	err := godotenv.Load(".env")
	if err != nil {
			log.Fatal("Error loading .env file")
	}
	// get port
	PORT := os.Getenv("PORT")

	// get todos
	app.Get("/api/todos", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(todos)
	})

	// create a todo
	app.Post("/api/todos", func(c *fiber.Ctx) error {
		todo := &Todo{}

		if err := c.BodyParser(todo); err != nil {
			return err
		}

		if todo.Body == "" {
			return c.Status(400).JSON(fiber.Map{"error":"Todo body is required"})
		}

		todo.ID = len(todos) + 1
		todos = append(todos,*todo)

		

		return c.Status(201).JSON(todo)
	})


	// update todo
	app.Patch("/api/todos/:id",func(c *fiber.Ctx) error {
		id := c.Params("id")

		for i, todo := range todos {
			if fmt.Sprint(todo.ID) == id {
				todos[i].Completed = true
				return c.Status(200).JSON(todos[i])
			}
		}

		return c.Status(404).JSON(fiber.Map{"error": "Todo not found"})
	})

	// delete todo
	app.Delete("/api/todos/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")

		for i, todo := range todos {
			if fmt.Sprint(todo.ID) == id {
				todos = append(todos[:i],todos[i+1:]...)
				return c.Status(200).JSON(fiber.Map{"success":"true"})
			}
		}

		return c.Status(404).JSON(fiber.Map{"error": "Todo not found"})
	})

	// listener
	log.Fatal(app.Listen(":" + PORT))
}
