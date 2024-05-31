'use client';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import { useCreateTodo } from '@/lib/hooks/api/use-Create-Todo';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { z } from 'zod';

// form schema
const formSchema = z.object({
	body: z.string().min(1, {
		message: 'Body must be at least 1 character.',
	}),
});

// init form type
type FormValues = z.input<typeof formSchema>;

const AddForm = () => {
	// create todo mutation
	const mutation = useCreateTodo();
	const isPending = mutation.isPending;

	// init form
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			body: '',
		},
	});

	// submit handler
	function onSubmit(values: FormValues) {
		mutation.mutateAsync(values);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-10 flex flex-row gap-5'
			>
				<FormField
					control={form.control}
					name='body'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-2xl'>Add Tasks</FormLabel>
							<FormControl>
								<Input
									placeholder='e.g. learn python'
									className='w-[430px]'
									required
									disabled={isPending}
									{...field}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type='submit'
					className='w-[50px] rounded-md'
					disabled={isPending}
				>
					{isPending ? (
						<>
							<LoaderCircle className='size-6 animate-spin' />
						</>
					) : (
						<>
							<Plus className='size-6' />
						</>
					)}
				</Button>
			</form>
		</Form>
	);
};

export default AddForm;
