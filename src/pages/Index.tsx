
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bike, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { authState } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-greenprimary to-greenaccent bg-clip-text text-transparent">
          GreenWheels Bike-Sharing
        </h1>
        <p className="text-xl max-w-3xl mx-auto mb-8 text-gray-600 dark:text-gray-300">
          Bringing sustainable transportation solutions to the beautiful streets of Addis Ababa
        </p>
        
        {!authState.isAuthenticated ? (
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/login">
              <Button size="lg" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={authState.role === 'admin' ? '/admin-dashboard' : 
                      authState.role === 'staff' ? '/staff-panel' : 
                      authState.role === 'station-admin' ? '/station-admin-dashboard' :
                      authState.role === 'maintenance' ? '/maintenance-dashboard' : '/'}>
              <Button size="lg" className="text-lg px-8">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        )}
      </section>
      
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-greenprimary dark:text-greenprimary">
              Transforming Transportation in Addis Ababa
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Addis Ababa's streets are being transformed with modern infrastructure, making it the perfect time 
              for bike sharing. GreenWheels is committed to providing an eco-friendly, convenient, and affordable 
              transportation option for residents and visitors of Ethiopia's capital city.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our stations are strategically located near major landmarks, business districts, and residential areas 
              to serve the growing demand for alternative transportation options in the city.
            </p>
            <div className="flex items-center mb-2">
              <MapPin className="text-greenprimary mr-2" />
              <span className="dark:text-gray-300">Multiple stations across Addis Ababa</span>
            </div>
            <div className="flex items-center mb-2">
              <Bike className="text-greenprimary mr-2" />
              <span className="dark:text-gray-300">Electric, regular, and scooter options</span>
            </div>
            <div className="flex items-center">
              <Users className="text-greenprimary mr-2" />
              <span className="dark:text-gray-300">For commuters, tourists, and everyone in between</span>
            </div>
          </div>
          
          <div className="bg-graylight dark:bg-gray-700 p-6 rounded-lg aspect-video flex items-center justify-center">
            <div className="text-center">
              <Bike size={72} className="mx-auto mb-4 text-greenprimary" />
              <p className="text-gray-500 dark:text-gray-400">Image of Addis Ababa streets with bike lanes</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-graydark dark:text-white">
          Why Choose GreenWheels in Addis Ababa?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-t-4 border-t-greenprimary dark:bg-gray-800">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Beautiful New Infrastructure</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Addis Ababa has recently invested in beautiful new streets and infrastructure, making bike travel 
                smoother and more enjoyable than ever before. Dedicated bike lanes and paths are being installed 
                throughout the city center and connecting to major neighborhoods.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-greenaccent dark:bg-gray-800">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Reducing Traffic Congestion</h3>
              <p className="text-gray-600 dark:text-gray-300">
                As Addis Ababa grows, traffic congestion has become a major challenge. GreenWheels offers a sustainable 
                solution by reducing the number of cars on the road, helping residents navigate the city more efficiently 
                while reducing their carbon footprint.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-greenprimary dark:bg-gray-800">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Supporting Local Tourism</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Explore the rich cultural heritage of Addis Ababa at your own pace. Our bikes provide tourists with 
                an intimate way to experience the city's museums, markets, restaurants, and historical sites while 
                supporting the local economy.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-graydark dark:text-white">
          Featured Locations in Addis Ababa
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-lg overflow-hidden shadow-md dark:bg-gray-800">
            <div className="h-48 bg-graylight dark:bg-gray-700 flex items-center justify-center">
              <MapPin size={32} className="text-greenprimary" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2 dark:text-white">Meskel Square</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                A central GreenWheels station at Addis Ababa's iconic public space, perfect for starting your city exploration.
              </p>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-md dark:bg-gray-800">
            <div className="h-48 bg-graylight dark:bg-gray-700 flex items-center justify-center">
              <MapPin size={32} className="text-greenprimary" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2 dark:text-white">Bole Road</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Multiple stations along this major commercial corridor, connecting shopping centers, restaurants, and businesses.
              </p>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-md dark:bg-gray-800">
            <div className="h-48 bg-graylight dark:bg-gray-700 flex items-center justify-center">
              <MapPin size={32} className="text-greenprimary" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2 dark:text-white">Unity Park</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Explore the beautiful grounds of this historical site and its surroundings with our convenient bike stations.
              </p>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-md dark:bg-gray-800">
            <div className="h-48 bg-graylight dark:bg-gray-700 flex items-center justify-center">
              <MapPin size={32} className="text-greenprimary" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2 dark:text-white">Entoto Park</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Experience the newly developed Entoto Park with our electric bikes, perfect for the hilly terrain with amazing views of the city.
              </p>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-md dark:bg-gray-800">
            <div className="h-48 bg-graylight dark:bg-gray-700 flex items-center justify-center">
              <MapPin size={32} className="text-greenprimary" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2 dark:text-white">National Museum of Ethiopia</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Park your GreenWheels bike and explore the rich cultural heritage of Ethiopia, including the famous Lucy fossil.
              </p>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-md dark:bg-gray-800">
            <div className="h-48 bg-graylight dark:bg-gray-700 flex items-center justify-center">
              <MapPin size={32} className="text-greenprimary" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2 dark:text-white">Merkato Market</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Ride to Africa's largest open market and experience the vibrant commerce and culture of Addis Ababa.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-16 bg-graylight dark:bg-gray-800 p-8 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4 dark:text-white">Join the Green Revolution in Addis Ababa</h2>
        <p className="text-xl mb-6 max-w-3xl mx-auto dark:text-gray-300">
          Be part of the transformation of Addis Ababa into a more sustainable, accessible, and environmentally friendly city.
        </p>
        {!authState.isAuthenticated && (
          <Link to="/login">
            <Button size="lg" className="text-lg px-8">
              Get Started Today
            </Button>
          </Link>
        )}
      </section>
    </div>
  );
};

export default Index;
