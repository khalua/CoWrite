import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  children?: React.ReactNode;
}

export function Navbar({ children }: NavbarProps) {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-2xl font-display italic text-yellow-400">
            CoWrite
          </Link>
          {user?.is_super_admin && (
            <span className="px-2 py-1 bg-red-900/50 text-red-400 text-xs font-semibold rounded">
              SUPER ADMIN
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {children}
          {user?.is_super_admin && (
            <Link
              to="/admin"
              className="px-3 py-1 bg-red-900/50 text-red-400 text-sm font-medium rounded hover:bg-red-900/70 transition"
            >
              Admin
            </Link>
          )}
          <span className="text-gray-400">Hi, {user?.name}</span>
          <button
            onClick={() => logout()}
            className="text-gray-400 hover:text-gray-200"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}
