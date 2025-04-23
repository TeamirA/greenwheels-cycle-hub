
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Bike, MapPin, Users, Map, Sun, Moon } from 'lucide-react';

const Index = () => {
  const { authState } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  // Check if dark mode is enabled on component mount
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setDarkMode(isDarkMode);
  }, []);

  const getStartedLink = () => {
    if (authState.isAuthenticated) {
      if (authState.role === 'admin') return '/admin-dashboard';
      if (authState.role === 'station-admin') return '/station-admin-dashboard';
      if (authState.role === 'maintenance') return '/maintenance-dashboard';
      if (authState.role === 'staff') return '/staff-panel';
      return '/';
    }
    return '/login';
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <div className="relative">
        <div className={`absolute inset-0 overflow-hidden z-0 ${darkMode ? 'opacity-30' : 'opacity-100'}`}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10"></div>
          <img 
            src="/assets/addis-ababa-city.jpg" 
            alt="Addis Ababa City" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80';
            }}
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-24 sm:py-32">
          <div className="max-w-2xl">
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              GreenWheels Bike Sharing in Addis Ababa
            </h1>
            <p className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Discover the beauty of Addis Ababa's newly developed streets and boulevards with our eco-friendly bike sharing service.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="px-6">
                <Link to={getStartedLink()}>
                  Get Started
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className={`px-6 ${darkMode ? 'bg-gray-800 text-white border-gray-700' : ''}`}>
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Explore Addis Ababa Like Never Before</h2>
          <p className={`max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Our bike sharing system brings a new way to explore the vibrant streets and boulevards of Ethiopia's capital city.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
            <div className="mb-4 p-3 rounded-full inline-block bg-green-100 dark:bg-green-900">
              <Bike className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Modern Bike Fleet</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Our bikes are designed for comfort and efficiency, perfect for navigating the urban landscape of Addis Ababa.
            </p>
          </div>
          
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
            <div className="mb-4 p-3 rounded-full inline-block bg-blue-100 dark:bg-blue-900">
              <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Strategic Stations</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Conveniently located stations across the city make it easy to pick up and drop off bikes near major attractions and transit hubs.
            </p>
          </div>
          
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
            <div className="mb-4 p-3 rounded-full inline-block bg-purple-100 dark:bg-purple-900">
              <Map className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Explore the City</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Discover hidden gems, historic sites, and the beautiful urban landscape of Addis Ababa at your own pace.
            </p>
          </div>
        </div>
      </div>

      {/* Addis Ababa Section */}
      <div className={`${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-16`}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>The New Addis Ababa</h2>
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                In recent years, Addis Ababa has undergone significant urban development with beautiful new streets, boulevards, and public spaces designed for pedestrians and cyclists.
              </p>
              <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                The city's transformation includes dedicated bike lanes, expanded sidewalks, and green spaces that make cycling a joy. From the historic Piazza district to the modern Bole Road, our bike sharing system connects you to all the important landmarks.
              </p>
              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Experience the unique blend of traditional Ethiopian culture and modern urban development as you ride through neighborhoods like Kazanchis, Arat Kilo, and the diplomatic quarter of the city.
              </p>
              <Button asChild>
                <Link to="/about-addis">
                  Discover Addis Ababa Routes
                </Link>
              </Button>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src="/assets/addis-ababa-boulevard.jpg" 
                alt="Addis Ababa Boulevard" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1495562569060-2eec283d3391?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80';
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>How GreenWheels Works</h2>
          <p className={`max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Our system is designed to be simple and convenient for both tourists and locals.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className={`mx-auto w-12 h-12 flex items-center justify-center rounded-full text-white text-xl font-bold mb-4 ${darkMode ? 'bg-green-700' : 'bg-greenprimary'}`}>1</div>
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Register</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Create an account and choose from our flexible subscription plans or pay-as-you-go options.
            </p>
          </div>
          
          <div className="text-center">
            <div className={`mx-auto w-12 h-12 flex items-center justify-center rounded-full text-white text-xl font-bold mb-4 ${darkMode ? 'bg-green-700' : 'bg-greenprimary'}`}>2</div>
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Unlock</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Use the app to locate a nearby station and unlock a bike by entering the code displayed or scanning the QR code.
            </p>
          </div>
          
          <div className="text-center">
            <div className={`mx-auto w-12 h-12 flex items-center justify-center rounded-full text-white text-xl font-bold mb-4 ${darkMode ? 'bg-green-700' : 'bg-greenprimary'}`}>3</div>
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Ride & Return</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Enjoy your ride and return the bike to any of our stations when you're done. The system will automatically complete your trip.
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <Button asChild size="lg">
            <Link to="/how-it-works">
              Learn More About Our Process
            </Link>
          </Button>
        </div>
      </div>

      {/* Testimonials */}
      <div className={`${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-16`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>What Our Users Say</h2>
            <p className={`max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              GreenWheels has transformed the way people experience Addis Ababa.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <p className={`italic mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                "Using GreenWheels to explore Addis Ababa gave me a unique perspective of the city. I discovered beautiful streets and local cafes I would have missed otherwise."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Sarah T.</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tourist from Canada</p>
                </div>
              </div>
            </div>
            
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <p className={`italic mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                "As a local, GreenWheels has become my go-to transportation for short trips. It's affordable, convenient, and helps me avoid traffic jams!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Abel M.</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Local Resident</p>
                </div>
              </div>
            </div>
            
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <p className={`italic mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                "The new bike lanes in Addis Ababa combined with GreenWheels service have made my daily commute enjoyable. I arrive at work refreshed and energized."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Fatima H.</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Business Professional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call To Action */}
      <div className="container mx-auto px-4 py-16">
        <div className={`rounded-xl p-8 ${darkMode ? 'bg-gray-800' : 'bg-greenprimary/10'}`}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Ready to explore Addis Ababa on two wheels?
            </h2>
            <p className={`mb-8 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Join GreenWheels today and discover the beauty of Ethiopia's capital city while contributing to sustainable urban mobility.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="px-6">
                <Link to={getStartedLink()}>
                  Get Started Now
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className={`px-6 ${darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-600 text-white' : ''}`}>
                <Link to="/pricing">
                  View Pricing Plans
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
