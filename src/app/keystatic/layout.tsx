// This route sits outside app/[lang]/layout.tsx's subtree — that's the only
// place <html>/<body> exist in this app (there is no root app/layout.tsx) —
// so the admin UI needs its own here.
export default function KeystaticLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body>{children}</body>
		</html>
	)
}
