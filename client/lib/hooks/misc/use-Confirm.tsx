import {
	Dialog,
	DialogTitle,
	DialogFooter,
	DialogHeader,
	DialogContent,
	DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const useConfirm = (
	title: string,
	message: string
): [() => JSX.Element, () => Promise<unknown>] => {
	const [promise, setPromise] = useState<{
		resolve: (value: boolean) => void;
	} | null>(null);

	const confirm = () =>
		new Promise((resolve, reject) => {
			setPromise({ resolve });
		});

	const handleClose = () => {
		setPromise(null);
	};

	const handleConfirm = () => {
		promise?.resolve(true);
		handleClose();
	};

	const handleCancel = () => {
		promise?.resolve(false);
		handleClose();
	};

	const ConfirmationDialog = () => (
		<Dialog open={promise !== null}>
			<DialogContent className='border-none shadow-xl'>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{message}</DialogDescription>
				</DialogHeader>
				<DialogFooter className='pt-2'>
					<Button onClick={handleConfirm} className='border-none shadow-xl'>
						Confirm
					</Button>
					<Button
						onClick={handleCancel}
						variant='ghost'
						className=' border-none shadow-xl'
					>
						Cancel
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);

	return [ConfirmationDialog, confirm];
};
