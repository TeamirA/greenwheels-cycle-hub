import { User, Bike, Station, MaintenanceReport } from '@/types';

export const users: User[] = [
  {
    id: 'user-1',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    role: 'user',
    stationId: 'station-1'
  },
  {
    id: 'user-2',
    name: 'Bob Williams',
    email: 'bob.w@example.com',
    role: 'user',
    stationId: 'station-2'
  },
  {
    id: 'staff-1',
    name: 'Charlie Brown',
    email: 'charlie.b@staff.com',
    role: 'staff',
    stationId: 'station-1'
  },
  {
    id: 'staff-2',
    name: 'Diana Miller',
    email: 'diana.m@staff.com',
    role: 'staff',
    stationId: 'station-2'
  },
  {
    id: 'maintenance-1',
    name: 'John Smith',
    email: 'john.smith@maintenance.com',
    role: 'maintenance',
    stationId: 'station-1'
  },
  {
    id: 'maintenance-2',
    name: 'Sarah Johnson',
    email: 'sarah.j@maintenance.com',
    role: 'maintenance',
    stationId: 'station-2'
  },
  {
    id: 'station-admin-1',
    name: 'Michael Chen',
    email: 'michael.chen@stations.com',
    role: 'station-admin',
    stationId: 'station-1'
  },
  {
    id: 'station-admin-2',
    name: 'Lisa Wong',
    email: 'lisa.wong@stations.com',
    role: 'station-admin',
    stationId: 'station-2'
  },
  ...Array.from({ length: 20 }).map((_, i) => ({
    id: `user-${i + 10}`,
    name: `Test User ${i + 10}`,
    email: `user${i + 10}@example.com`,
    role: ['user', 'maintenance', 'station-admin'][Math.floor(Math.random() * 3)] as 'user' | 'maintenance' | 'station-admin',
    stationId: `station-${Math.floor(Math.random() * 5) + 1}`
  }))
];

export const stations: Station[] = [
  {
    id: 'station-1',
    name: 'Central Station',
    location: '123 Main St',
    capacity: 40,
    coordinates: { lat: 40.7128, lng: -74.006 },
    availableBikes: 25
  },
  {
    id: 'station-2',
    name: 'Uptown Hub',
    location: '456 Elm St',
    capacity: 60,
    coordinates: { lat: 40.7484, lng: -73.9857 },
    availableBikes: 40
  },
  {
    id: 'station-3',
    name: 'Downtown Center',
    location: 'Main St & 5th Ave',
    capacity: 50,
    coordinates: { lat: 40.7128, lng: -74.006 },
    availableBikes: 35
  },
  {
    id: 'station-4',
    name: 'University Hub',
    location: 'College Ave',
    capacity: 75,
    coordinates: { lat: 40.7282, lng: -73.9942 },
    availableBikes: 60
  },
  {
    id: 'station-5',
    name: 'Shopping District',
    location: 'Market Square',
    capacity: 40,
    coordinates: { lat: 40.7589, lng: -73.9851 },
    availableBikes: 25
  }
];

export const bikes: Bike[] = [
  ...Array.from({ length: 200 }).map((_, i) => ({
    id: `bike-${i + 1}`,
    model: ['City Cruiser', 'Mountain Explorer', 'Urban Commuter'][Math.floor(Math.random() * 3)],
    status: ['available', 'in-use', 'maintenance'][Math.floor(Math.random() * 3)] as 'available' | 'in-use' | 'maintenance',
    stationId: `station-${Math.floor(Math.random() * 5) + 1}`,
    category: ['regular', 'electric', 'scooter'][Math.floor(Math.random() * 3)],
    lastMaintenance: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    totalRides: Math.floor(Math.random() * 1000)
  }))
];

export const maintenanceReports: MaintenanceReport[] = [
  ...Array.from({ length: 100 }).map((_, i) => ({
    id: `report-${i + 1}`,
    bikeId: `bike-${Math.floor(Math.random() * 200) + 1}`,
    reportedBy: users[Math.floor(Math.random() * users.length)].id,
    status: ['pending', 'in-progress', 'resolved'][Math.floor(Math.random() * 3)] as 'pending' | 'in-progress' | 'resolved',
    issue: ['Flat Tire', 'Brake Issue', 'Chain Problem', 'Seat Loose', 'Light Not Working'][Math.floor(Math.random() * 5)],
    description: 'Detailed description of the issue...',
    priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
    reportedAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: Math.random() > 0.5 ? new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000).toISOString() : null
  }))
];
