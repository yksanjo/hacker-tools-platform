import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-hacker-gray border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-hacker-green text-2xl font-bold">🔒</span>
            <span className="text-xl font-bold text-white">Hacker Tools</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-300 hover:text-hacker-green transition-colors"
            >
              Browse Tools
            </Link>
            <Link
              to="/submit"
              className="bg-hacker-green text-black px-4 py-2 rounded font-semibold hover:bg-green-400 transition-colors"
            >
              Submit Tool
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

