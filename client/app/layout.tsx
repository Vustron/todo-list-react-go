import ThemeProvider from '@/components/providers/themeProvider';
import QueryProvider from '@/components/providers/queryProvider';
import localFont from 'next/font/local';
import type { Metadata } from 'next';
import './globals.css';

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
});
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
});

export const metadata: Metadata = {
	title: 'Todo',
	description: 'Todo app made using next and golang',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<ThemeProvider attribute='class' defaultTheme='light'>
					<QueryProvider>{children}</QueryProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
