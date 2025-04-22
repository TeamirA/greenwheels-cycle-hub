import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Bike, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { authState } = useAuth();

  // Determine the dashboard link based on user role
  const getDashboardLink = () => {
    if (!authState.isAuthenticated) return "/login";
    if (authState.role === "admin") return "/admin-dashboard";
    if (authState.role === "staff") return "/staff-panel";
    return "/login";
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col lg:flex-row items-center">
        <div className="container mx-auto px-8 py-12 lg:py-24 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6 animate-fade-in">
            <h1 className="text-4xl lg:text-5xl font-bold text-graydark leading-tight">
              Green Wheels <span className="text-greenprimary">Bike-Sharing</span> Management System
            </h1>
            <p className="text-xl text-gray-600 max-w-xl">
              Efficient and eco-friendly bicycle management for administrators and station staff.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Button
                asChild
                className="bg-greenprimary hover:bg-greenprimary/80 text-white text-lg px-6"
              >
                <Link to={getDashboardLink()} className="inline-flex items-center">
                  {authState.isAuthenticated ? "Go to Dashboard" : "Sign In"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              {!authState.isAuthenticated && (
                <Button
                  asChild
                  variant="outline"
                  className="text-graydark text-lg px-6 border-graydark/20"
                >
                  <Link to="/signup">Create Account</Link>
                </Button>
              )}
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center animate-slide-in">
            <div className="relative w-full max-w-lg aspect-square">
              <div className="absolute inset-0 flex items-center justify-center">
                <Bike size={180} className="text-greenaccent" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-greenprimary/20 animate-spin" style={{ animationDuration: '30s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="bg-graylight py-16">
        <div className="container mx-auto px-8">
          <h2 className="text-3xl font-bold text-center text-graydark mb-12">Key System Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-greenprimary/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-greenprimary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-graydark mb-2">Real-time Dashboard</h3>
              <p className="text-gray-600">
                Monitor the entire fleet with live updates and comprehensive analytics.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-greenprimary/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-greenprimary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-graydark mb-2">QR-Based Check-in/out</h3>
              <p className="text-gray-600">
                Fast and efficient process for station staff to manage bike rentals.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-greenprimary/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-greenprimary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-graydark mb-2">Maintenance Reporting</h3>
              <p className="text-gray-600">
                Simple issue logging system with prioritization and tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-graydark text-white py-8">
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Bike size={24} className="mr-2" />
              <span className="font-bold text-lg">GreenWheels</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 GreenWheels Cycle Hub. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
