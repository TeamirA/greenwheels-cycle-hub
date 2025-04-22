
import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, Bike, MapPin, Users, FileText, 
  LogOut, Menu, X, ChevronDown 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { authState, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation links based on user role
  const getNavLinks = () => {
    if (authState.role === 'admin') {
      return [
        { name: 'Dashboard', path: '/admin-dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Bikes', path: '/bikes', icon: <Bike size={20} /> },
        { name: 'Stations', path: '/station-management', icon: <MapPin size={20} /> },
        { name: 'Users', path: '/user-management', icon: <Users size={20} /> },
        { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
      ];
    } else if (authState.role === 'staff') {
      return [
        { name: 'Staff Panel', path: '/staff-panel', icon: <LayoutDashboard size={20} /> },
        { name: 'Reservations', path: '/reservations', icon: <FileText size={20} /> },
      ];
    }
    return [];
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-graylight flex flex-col">
      {/* Header */}
      <header className="bg-greenprimary text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Bike className="h-8 w-8" />
            <span className="text-xl font-bold">GreenWheels</span>
          </Link>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md hover:bg-greenprimary/80"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {authState.isAuthenticated ? (
              <>
                <div className="relative group">
                  <button className="flex items-center space-x-1 focus:outline-none">
                    <span>{authState.user?.name}</span>
                    <ChevronDown size={16} />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <div className="px-4 py-2 text-sm text-graydark border-b">
                      Logged in as <span className="font-semibold">{authState.role}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-graydark hover:bg-graylight flex items-center"
                    >
                      <LogOut size={16} className="mr-2" /> Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline">Sign in</Link>
                <Link to="/signup" className="bg-white text-greenprimary px-4 py-2 rounded-md hover:bg-gray-100 transition">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - only show if authenticated */}
        {authState.isAuthenticated && (
          <>
            {/* Mobile sidebar */}
            <div 
              className={cn(
                "fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity",
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
              onClick={() => setIsOpen(false)}
            />
            
            <aside 
              className={cn(
                "w-64 bg-white shadow-lg fixed inset-y-0 left-0 transform transition-transform z-30 mt-14 md:mt-0 md:static md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
              )}
            >
              <nav className="p-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-md transition-colors",
                      isActive(link.path)
                        ? "bg-greenprimary text-white"
                        : "text-graydark hover:bg-graylight"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                ))}
                
                <button
                  onClick={handleLogout}
                  className="md:hidden w-full flex items-center space-x-3 px-4 py-3 rounded-md text-graydark hover:bg-graylight"
                >
                  <LogOut size={20} />
                  <span>Sign out</span>
                </button>
              </nav>
            </aside>
          </>
        )}

        {/* Main content */}
        <main className={cn(
          "flex-1 p-6",
          authState.isAuthenticated ? "md:ml-0" : ""
        )}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
