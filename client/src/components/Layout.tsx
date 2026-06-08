import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-extrabold text-gray-900 tracking-tight">
              <span className="text-blue-600">English</span>Reader
            </Link>
            <div className="hidden sm:flex items-center gap-1">
              {[
                ['/', 'Home'],
                ['/words', 'My Words'],
                ['/favorites', 'Favorites'],
                ['/history', 'History'],
                ['/intro', 'Intro'],
              ].map(([path, label]) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive(path)
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-gray-600 hidden sm:inline">{user?.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
