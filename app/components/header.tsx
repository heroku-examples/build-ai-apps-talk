import { Link } from "@remix-run/react";

export function Header() {
	return (
		<header className="flex items-center justify-between px-4 py-2 md:py-4">
			<div className="flex items-center space-x-4">
				<Link className="flex items-center space-x-2" to="/">
					<img src="/logo.png" alt="Heroku" className="w-12 h-12" />
					<span className="text-lg font-bold">
						Build AI Applications with Node and LangChain
					</span>
				</Link>
			</div>
		</header>
	);
}
