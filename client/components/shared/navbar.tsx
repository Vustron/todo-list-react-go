'use client';

import ThemeButton from '@/components/ui/themeButton';

const Navbar = () => {
	return (
		<nav className='flex flex-row z-50 justify-center items-center'>
			<h1 className='font-semibold text-3xl p-5'>Daily Tasks</h1>

			<ThemeButton />
		</nav>
	);
};

export default Navbar;
