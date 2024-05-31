'use client';

import { useUpdateTodo } from '@/lib/hooks/api/use-Update-Todo';
import { useDeleteTodo } from '@/lib/hooks/api/use-Delete-Todo';
import { useConfirm } from '@/lib/hooks/misc/use-Confirm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoaderCircle } from 'lucide-react';
import { CircleCheck } from 'lucide-react';
import { CircleX } from 'lucide-react';
import { Todo } from './todoList';

const TodoItem = ({ todo }: { todo: Todo }) => {
	// confirmation handler
	const [ConfirmDialog, confirm] = useConfirm(
		'Are you sure?',
		'You are about to delete this transaction'
	);
	// update mutation
	const editMutation = useUpdateTodo(todo._id);
	// delete mutation
	const deleteMutation = useDeleteTodo(todo._id);

	// update handler
	const updateTodo = (completed: boolean) => {
		editMutation.mutate({ completed });
	};

	const isPending = editMutation.isPending || deleteMutation.isPending;

	const deleteTodo = async () => {
		const ok = await confirm();

		if (ok) {
			deleteMutation.mutate(undefined);
		}
	};

	return (
		<>
			<ConfirmDialog />

			<div className='flex justify-between items-center'>
				<h3
					className={`font-semibold ${
						todo.completed ? 'text-green-500 line-through' : 'text-yellow-500'
					}`}
				>
					{todo.body}
				</h3>

				<div>
					{todo.completed === true ? (
						<Badge className='bg-green-600'>Completed</Badge>
					) : (
						<Badge className='bg-yellow-300'>In progress</Badge>
					)}

					{isPending ? (
						<>
							<LoaderCircle className='size-6 animate-spin' />
						</>
					) : (
						<>
							<Button
								size='sm'
								variant='ghost'
								className='ml-2'
								onClick={() => updateTodo(true)}
								disabled={isPending}
							>
								<CircleCheck className='size-6 text-green-500' />
							</Button>

							<Button
								size='sm'
								variant='ghost'
								onClick={deleteTodo}
								disabled={isPending}
							>
								<CircleX className='size-6 text-red-500' />
							</Button>
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default TodoItem;
