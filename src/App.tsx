
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
import Signup from "./pages/Signup";
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
            <Route path="/signup" element={<Signup />} />
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
                <ProtectedRoute roles={['admin']}>
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
            
            {/* New Detail Routes */}
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
                <ProtectedRoute roles={['admin']}>
                  <MainLayout>
                    <ActiveRides />
                  </MainLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/available-bikes" 
              element={
                <ProtectedRoute roles={['admin']}>
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
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
