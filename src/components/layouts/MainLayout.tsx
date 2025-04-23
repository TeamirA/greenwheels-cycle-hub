
import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, Bike, MapPin, Users, FileText, 
  LogOut, Menu, X, ChevronDown, ChevronLeft, ChevronRight,
  ListCheck, Wrench, UserPlus, PlusCircle, Car, Sun, Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { authState, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user has already set a preference
    const savedMode = localStorage.getItem('darkMode');
    return savedMode === 'true' || (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const { toast } = useToast();

  const isActive = (path: string) => location.pathname === path;

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    
    logout();
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
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
    } else if (authState.role === 'station-admin') {
      return [
        { name: 'Dashboard', path: '/station-admin-dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Station Staff', path: '/station-staff', icon: <Users size={20} /> },
        { name: 'Station Bikes', path: '/station-bikes', icon: <Bike size={20} /> },
        { name: 'Maintenance Team', path: '/maintenance-team', icon: <Wrench size={20} /> },
        { name: 'Register Staff', path: '/register-station-staff', icon: <UserPlus size={20} /> },
        { name: 'Station Reports', path: '/station-reports', icon: <FileText size={20} /> },
      ];
    } else if (authState.role === 'maintenance') {
      return [
        { name: 'Maintenance Dashboard', path: '/maintenance-dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'User Reports', path: '/user-reports', icon: <Users size={20} /> },
        { name: 'Staff Reports', path: '/staff-reports', icon: <ListCheck size={20} /> },
        { name: 'Maintenance Queue', path: '/maintenance-queue', icon: <Wrench size={20} /> },
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
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900 text-white' : 'bg-graylight text-graydark'} flex flex-col`}>
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-greenprimary text-white'} shadow-md z-10`}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            {authState.isAuthenticated && (
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-md hover:bg-opacity-80 mr-2"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
            <Link to="/" className="flex items-center space-x-2">
              <Bike className="h-8 w-8" />
              <span className="text-xl font-bold">GreenWheels</span>
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-graydark/10 text-greenprimary'}`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {authState.isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-6">
                <div className="relative group">
                  <button className="flex items-center space-x-1 focus:outline-none">
                    <span>{authState.user?.name}</span>
                    <ChevronDown size={16} />
                  </button>
                  <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-10 hidden group-hover:block ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className={`px-4 py-2 text-sm border-b ${darkMode ? 'text-gray-300 border-gray-700' : 'text-graydark border-gray-200'}`}>
                      Logged in as <span className="font-semibold">{authState.role}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-graylight text-graydark'}`}
                    >
                      <LogOut size={16} className="mr-2" /> Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex space-x-4">
                <Link to="/login" className="hover:underline">Sign in</Link>
              </div>
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
                `shadow-lg fixed inset-y-0 left-0 transform transition-all z-30 mt-14 md:mt-0 md:static`,
                isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                isSidebarCollapsed ? "w-16" : "w-64",
                darkMode ? "bg-gray-800 text-white" : "bg-white text-graydark"
              )}
            >
              <div className="flex justify-end p-2">
                <button 
                  onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                  className={`hidden md:flex p-1 rounded-md ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-graylight text-graydark'}`}
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
                      "flex items-center px-4 py-3 rounded-md transition-colors",
                      isActive(link.path)
                        ? darkMode ? "bg-greenprimary text-white" : "bg-greenprimary text-white"
                        : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-graydark hover:bg-graylight",
                      isSidebarCollapsed ? "justify-center" : "space-x-3"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon}
                    {!isSidebarCollapsed && <span>{link.name}</span>}
                  </Link>
                ))}
                
                <button
                  onClick={handleLogout}
                  className={cn(
                    "md:hidden w-full flex items-center px-4 py-3 rounded-md",
                    darkMode ? "text-gray-300 hover:bg-gray-700" : "text-graydark hover:bg-graylight",
                    isSidebarCollapsed ? "justify-center" : "space-x-3"
                  )}
                >
                  <LogOut size={20} />
                  {!isSidebarCollapsed && <span>Sign out</span>}
                </button>
              </nav>
            </aside>
          </>
        )}

        <main className={cn(
          "flex-1 p-6 transition-colors",
          authState.isAuthenticated ? "md:ml-0" : ""
        )}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
