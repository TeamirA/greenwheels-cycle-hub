
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarItem,
  SidebarGroup,
} from '@/components/ui/sidebar';
import { Bike } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  MapPin,
  Wrench,
  Settings,
  Calendar,
  Search,
  ChevronRight,
  FileText,
  BarChart2,
  UserCheck,
  ShieldAlert
} from 'lucide-react';

export function AppSidebar() {
  const location = useLocation();
  const { authState } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const isAdmin = authState.role === 'admin';
  const isStaff = authState.role === 'staff';
  
  return (
    <Sidebar className="bg-white border-r border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <SidebarHeader>
        <div className="flex items-center">
          <Bike className="h-6 w-6 text-greenprimary" />
          <span className="ml-2 text-xl font-bold text-graydark dark:text-white">GreenWheels</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup title="Navigation">
          {isAdmin && (
            <SidebarItem 
              icon={<LayoutDashboard size={18} />} 
              title="Dashboard"
              active={isActive('/admin-dashboard')}
              href="/admin-dashboard"
            >
              Dashboard
            </SidebarItem>
          )}
          
          {isStaff && (
            <SidebarItem 
              icon={<LayoutDashboard size={18} />} 
              title="Dashboard"
              active={isActive('/staff-panel')}
              href="/staff-panel"
            >
              Dashboard
            </SidebarItem>
          )}
          
          {(!isAdmin && !isStaff) && (
            <SidebarItem 
              icon={<Bike size={18} />} 
              title="Home"
              active={location.pathname === '/'}
              href="/"
            >
              Home
            </SidebarItem>
          )}
          
          <SidebarItem 
            icon={<Calendar size={18} />} 
            title="My Rides"
            active={isActive('/my-rides')}
            href="/my-rides"
          >
            My Rides
          </SidebarItem>
          
          <SidebarItem 
            icon={<MapPin size={18} />} 
            title="Stations"
            active={isActive('/stations')}
            href="/stations"
          >
            Stations
          </SidebarItem>
        </SidebarGroup>
        
        {(isAdmin || isStaff) && (
          <SidebarGroup title="Management">
            {isAdmin && (
              <>
                <SidebarItem 
                  icon={<Users size={18} />} 
                  title="Users"
                  active={isActive('/user-management')}
                  href="/user-management"
                >
                  Users
                </SidebarItem>
                
                <SidebarItem 
                  icon={<Bike size={18} />} 
                  title="Bike Fleet"
                  active={isActive('/bike-fleet')}
                  href="/bike-fleet"
                >
                  Bike Fleet
                </SidebarItem>
                
                <SidebarItem 
                  icon={<MapPin size={18} />} 
                  title="Stations"
                  active={isActive('/station-management')}
                  href="/station-management"
                >
                  Stations
                </SidebarItem>
              </>
            )}
            
            <SidebarItem 
              icon={<Wrench size={18} />} 
              title="Maintenance"
              active={isActive('/maintenance-dashboard') || isActive('/user-reports') || isActive('/staff-reports')}
              href="/maintenance-dashboard"
            >
              Maintenance
            </SidebarItem>
            
            {isStaff && (
              <SidebarItem 
                icon={<UserCheck size={18} />} 
                title="Reservations"
                active={isActive('/reservations')}
                href="/reservations"
              >
                Reservations
              </SidebarItem>
            )}
            
            {isAdmin && (
              <SidebarItem 
                icon={<BarChart2 size={18} />} 
                title="Reports"
                active={isActive('/reports')}
                href="/reports"
              >
                Reports
              </SidebarItem>
            )}
          </SidebarGroup>
        )}
        
        <SidebarGroup title="General">
          <SidebarItem 
            icon={<Search size={18} />} 
            title="Find Bikes"
            active={isActive('/available-bikes')}
            href="/available-bikes"
          >
            Find Bikes
          </SidebarItem>
          
          <SidebarItem 
            icon={<Settings size={18} />} 
            title="Settings"
            active={isActive('/settings')}
            href="/settings"
          >
            Settings
          </SidebarItem>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
