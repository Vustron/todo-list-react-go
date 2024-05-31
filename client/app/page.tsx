import TodoList from '@/components/todo/todoList';
import AddForm from '@/components/forms/addForm';
import Navbar from '@/components/shared/navbar';

export default function Index() {
	return (
		<main className='h-[100vh] w-full'>
			<div className='flex flex-col justify-center items-center'>
				{/* Navbar */}
				<div className='h-[500px] w-[500px]'>
					<Navbar />

					{/* add form */}
					<AddForm />

					{/* Todo lists */}
					<TodoList />
				</div>
			</div>
		</main>
	);
}
