'use client';

import { useGetTodos } from '@/lib/hooks/api/use-Get-Todos';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoaderCircle } from 'lucide-react';
import TodoItem from './todoItem';

export type Todo = {
	_id: string;
	body: string;
	completed: boolean;
};

const TodoList = () => {
	// get todos
	const todoQuery = useGetTodos();
	// init loading
	const isLoading = todoQuery.isLoading;
	// set data
	const todos = todoQuery.data || [];

	return (
		<div className='space-y-8 mt-6'>
			{isLoading ? (
				<>
					<div className='flex flex-col justify-center items-center'>
						<LoaderCircle className='size-12 animate-spin' />
					</div>
				</>
			) : (
				<>
					<h1
						className='mb-3 flex flex-col justify-center items-center text-3xl 
            font-bold bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% bg-clip-text text-transparent'
					>
						TODAY`S TASKS
					</h1>

					<Card>
						<ScrollArea className='h-[180px]'>
							<CardContent>
								{todos.map((todo: Todo) => (
									<div className='mt-5' key={todo._id}>
										<TodoItem todo={todo} />
									</div>
								))}
							</CardContent>
						</ScrollArea>
					</Card>
				</>
			)}
		</div>
	);
};

export default TodoList;
