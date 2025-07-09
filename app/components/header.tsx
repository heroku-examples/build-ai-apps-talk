import { Link } from "react-router";

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-2 md:py-4">
      <div className="flex items-center space-x-4">
        <Link className="flex items-center space-x-2" to="/">
          <img src="/logo.png" alt="Heroku" className="w-12 h-12" />
          <span className="text-xl text-heroku-purple font-bold">
            Build AI Applications with Node and LangChain
          </span>
        </Link>
      </div>
      <Link
        className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-heroku-purple to-heroku-dark text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-heroku-dark hover:to-heroku-purple transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-heroku-light focus:ring-opacity-50"
        to="/resources"
      >
        📚 Learning Resources
      </Link>
    </header>
  );
}
