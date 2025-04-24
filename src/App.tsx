import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "@/components/layouts/MainLayout";

import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StaffPanel from "./pages/StaffPanel";
import StationManagement from "./pages/StationManagement";
import UserManagement from "./pages/UserManagement";
import Reports from "./pages/Reports";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import BikeFleet from "./pages/BikeFleet";
import ActiveRides from "./pages/ActiveRides";
import AvailableBikes from "./pages/AvailableBikes";
import Reservations from "./pages/staff/Reservations";
import MaintenanceIssues from "./pages/staff/MaintenanceIssues";
import RegisterUser from "./pages/admin/RegisterUser";
import RegisterBike from "./pages/admin/RegisterBike";
import CreateStation from "./pages/admin/CreateStation";
import StationAdminDashboard from "./pages/StationAdminDashboard";
import RegisterStationStaff from "./pages/RegisterStationStaff";
import MaintenanceDashboard from "./pages/MaintenanceDashboard";

// Define MaintenanceDashboardWithProps to handle the reportSource prop
const StaffReports = () => <MaintenanceDashboard reportSource="staff" />;
const UserReports = () => <MaintenanceDashboard />;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout><Index /></MainLayout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Admin Routes */}
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <MainLayout>
                    <AdminDashboard />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/station-management" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <MainLayout>
                    <StationManagement />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user-management" 
              element={
                <ProtectedRoute roles={['admin', 'station-admin']}>
                  <MainLayout>
                    <UserManagement />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <MainLayout>
                    <Reports />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* New Admin Routes */}
            <Route 
              path="/register-user" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <MainLayout>
                    <RegisterUser />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/register-bike" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <MainLayout>
                    <RegisterBike />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-station" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <MainLayout>
                    <CreateStation />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Station Admin Routes */}
            <Route 
              path="/station-admin-dashboard" 
              element={
                <ProtectedRoute roles={['station-admin']}>
                  <MainLayout>
                    <StationAdminDashboard />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/station-staff" 
              element={
                <ProtectedRoute roles={['station-admin']}>
                  <MainLayout>
                    <UserManagement />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/station-bikes" 
              element={
                <ProtectedRoute roles={['station-admin']}>
                  <MainLayout>
                    <AvailableBikes />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/register-station-staff" 
              element={
                <ProtectedRoute roles={['station-admin']}>
                  <MainLayout>
                    <RegisterStationStaff />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/maintenance-team" 
              element={
                <ProtectedRoute roles={['station-admin']}>
                  <MainLayout>
                    <UserManagement />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/station-reports" 
              element={
                <ProtectedRoute roles={['station-admin']}>
                  <MainLayout>
                    <Reports />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />

            {/* Maintenance Team Routes */}
            <Route 
              path="/maintenance-dashboard" 
              element={
                <ProtectedRoute roles={['maintenance']}>
                  <MainLayout>
                    <MaintenanceDashboard />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user-reports" 
              element={
                <ProtectedRoute roles={['maintenance']}>
                  <MainLayout>
                    <UserReports />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/staff-reports" 
              element={
                <ProtectedRoute roles={['maintenance']}>
                  <MainLayout>
                    <StaffReports />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/maintenance-queue" 
              element={
                <ProtectedRoute roles={['maintenance']}>
                  <MainLayout>
                    <MaintenanceDashboard />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Detail Routes */}
            <Route 
              path="/bike-fleet" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <MainLayout>
                    <BikeFleet />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/active-rides" 
              element={
                <ProtectedRoute roles={['admin', 'staff', 'station-admin']}>
                  <MainLayout>
                    <ActiveRides />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/available-bikes" 
              element={
                <ProtectedRoute roles={['admin', 'staff', 'station-admin']}>
                  <MainLayout>
                    <AvailableBikes />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Staff Routes */}
            <Route 
              path="/staff-panel" 
              element={
                <ProtectedRoute roles={['staff', 'admin']}>
                  <MainLayout>
                    <StaffPanel />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reservations" 
              element={
                <ProtectedRoute roles={['staff', 'admin', 'station-admin']}>
                  <MainLayout>
                    <Reservations />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/maintenance-issues" 
              element={
                <ProtectedRoute roles={['staff', 'admin', 'station-admin']}>
                  <MainLayout>
                    <MaintenanceIssues />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
