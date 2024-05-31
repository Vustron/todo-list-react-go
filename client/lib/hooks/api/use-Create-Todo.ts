import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

type CreatePayload = {
	body: string;
};

export const useCreateTodo = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (values: CreatePayload) => {
			const { data } = await axios.post(
				`http://localhost:5000/api/todos`,
				values
			);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['todos'] });
		},
		onError: (error: any) => {
			console.error(`${error.message}`);
		},
	});

	return mutation;
};
