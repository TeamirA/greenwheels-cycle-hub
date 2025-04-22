
import { useState, useEffect } from 'react';
import { Station } from '@/types';
import { MapPin } from 'lucide-react';

interface StationMapProps {
  stations: Station[];
  selectedStation: Station | null;
  onStationSelect: (station: Station) => void;
}

const StationMap = ({ stations, selectedStation, onStationSelect }: StationMapProps) => {
  // This is a simulated map - in a real app, this would use a mapping library like Mapbox or Google Maps
  const [mapLoaded, setMapLoaded] = useState(false);
  
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Function to calculate position based on coordinates
  const getPositionStyle = (station: Station) => {
    // These calculations are simplified for the demo
    // In a real app, these would map to actual geographical coordinates
    const x = (station.coordinates.lng + 180) / 360 * 100;
    const y = (90 - station.coordinates.lat) / 180 * 100;
    
    return {
      left: `${x}%`,
      top: `${y}%`,
    };
  };
  
  return (
    <div className="relative w-full h-full bg-gray-100 overflow-hidden">
      {/* Map Background - would be replaced with actual map in production */}
      <div className="absolute inset-0 bg-[url('https://i.imgur.com/5mVK6vB.png')] bg-cover bg-center opacity-50" />
      
      {/* Grid lines to simulate map */}
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
        {Array.from({ length: 64 }).map((_, i) => (
          <div key={i} className="border border-gray-200 opacity-20" />
        ))}
      </div>
      
      {/* Station markers */}
      {mapLoaded && stations.map((station) => (
        <div
          key={station.id}
          className={`absolute transition-all duration-300 transform ${
            selectedStation?.id === station.id ? 'scale-125 z-20' : 'z-10'
          }`}
          style={getPositionStyle(station)}
          onClick={() => onStationSelect(station)}
        >
          <div className="relative -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
            <div className={`
              flex items-center justify-center w-10 h-10 rounded-full 
              ${selectedStation?.id === station.id 
                ? 'bg-greenprimary text-white shadow-lg' 
                : 'bg-white text-greenprimary shadow'
              }
              hover:bg-greenprimary hover:text-white transition-colors
            `}>
              <MapPin size={16} />
              <span className="text-xs font-bold">{station.availableBikes}</span>
            </div>
            
            {/* Station name tooltip */}
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-max opacity-0 
                          group-hover:opacity-100 transition-opacity bg-white text-graydark 
                          text-xs px-2 py-1 rounded shadow pointer-events-none z-30">
              {station.name}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 
                            border-b-4 border-l-4 border-r-4 
                            border-transparent border-b-white" />
            </div>
            
            {/* Pulse effect for selected station */}
            {selectedStation?.id === station.id && (
              <div className="absolute inset-0 rounded-full bg-greenprimary/20 animate-ping" />
            )}
          </div>
        </div>
      ))}
      
      {/* Loading overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <div className="text-graydark animate-pulse">Loading map...</div>
        </div>
      )}
    </div>
  );
};

export default StationMap;
