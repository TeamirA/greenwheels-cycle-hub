import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, Bike, MapPin, Users, FileText, 
  LogOut, Menu, X, ChevronDown, ChevronLeft, ChevronRight,
  ListCheck, Wrench, UserPlus, PlusCircle, Car
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
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    if (authState.role === 'admin') {
      return [
        { name: 'Dashboard', path: '/admin-dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Bike Fleet', path: '/bike-fleet', icon: <Bike size={20} /> },
        { name: 'Stations', path: '/station-management', icon: <MapPin size={20} /> },
        { name: 'Users', path: '/user-management', icon: <Users size={20} /> },
        { name: 'Active Rides', path: '/active-rides', icon: <Car size={20} /> },
        { name: 'Available Bikes', path: '/available-bikes', icon: <Bike size={20} /> },
        { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
        { name: 'Register User', path: '/register-user', icon: <UserPlus size={20} /> },
        { name: 'Register Bike', path: '/register-bike', icon: <PlusCircle size={20} /> },
        { name: 'Create Station', path: '/create-station', icon: <MapPin size={20} /> },
      ];
    } else if (authState.role === 'staff') {
      return [
        { name: 'Staff Panel', path: '/staff-panel', icon: <LayoutDashboard size={20} /> },
        { name: 'Reservations', path: '/reservations', icon: <ListCheck size={20} /> },
        { name: 'Maintenance', path: '/maintenance-issues', icon: <Wrench size={20} /> },
        { name: 'Active Rides', path: '/active-rides', icon: <Car size={20} /> },
        { name: 'Available Bikes', path: '/available-bikes', icon: <Bike size={20} /> },
      ];
    }
    return [];
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-graylight flex flex-col">
      <header className="bg-greenprimary text-white shadow-md z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            {authState.isAuthenticated && (
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-md hover:bg-greenprimary/80 mr-2"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
            <Link to="/" className="flex items-center space-x-2">
              <Bike className="h-8 w-8" />
              <span className="text-xl font-bold">GreenWheels</span>
            </Link>
          </div>

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
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {authState.isAuthenticated && (
          <>
            <div 
              className={cn(
                "fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity",
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
              onClick={() => setIsOpen(false)}
            />
            
            <aside 
              className={cn(
                "bg-white shadow-lg fixed inset-y-0 left-0 transform transition-all z-30 mt-14 md:mt-0 md:static",
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                isSidebarCollapsed ? "w-16" : "w-64"
              )}
            >
              <div className="flex justify-end p-2">
                <button 
                  onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                  className="hidden md:flex p-1 rounded-md hover:bg-graylight text-graydark"
                >
                  {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
              </div>
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
                    {!isSidebarCollapsed && <span>{link.name}</span>}
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
