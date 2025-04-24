
import { User, Bike, Station, MaintenanceReport, BikeCategory, CommonIssue, Reservation } from '@/types';

export const users: User[] = [
  {
    id: 'user-1',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    role: 'user',
    stationId: 'station-1',
    verified: true,
    createdAt: new Date(2024, 1, 15).toISOString()
  },
  {
    id: 'user-2',
    name: 'Bob Williams',
    email: 'bob.w@example.com',
    role: 'user',
    stationId: 'station-2',
    verified: true,
    createdAt: new Date(2024, 2, 5).toISOString()
  },
  {
    id: 'staff-1',
    name: 'Charlie Brown',
    email: 'charlie.b@staff.com',
    role: 'staff',
    stationId: 'station-1',
    verified: true,
    createdAt: new Date(2024, 0, 10).toISOString()
  },
  {
    id: 'staff-2',
    name: 'Diana Miller',
    email: 'diana.m@staff.com',
    role: 'staff',
    stationId: 'station-2',
    verified: true,
    createdAt: new Date(2024, 0, 12).toISOString()
  },
  {
    id: 'maintenance-1',
    name: 'John Smith',
    email: 'john.smith@maintenance.com',
    role: 'maintenance',
    stationId: 'station-1',
    verified: true,
    createdAt: new Date(2023, 11, 5).toISOString()
  },
  {
    id: 'maintenance-2',
    name: 'Sarah Johnson',
    email: 'sarah.j@maintenance.com',
    role: 'maintenance',
    stationId: 'station-2',
    verified: true,
    createdAt: new Date(2023, 10, 15).toISOString()
  },
  {
    id: 'station-admin-1',
    name: 'Michael Chen',
    email: 'michael.chen@stations.com',
    role: 'station-admin',
    stationId: 'station-1',
    verified: true,
    createdAt: new Date(2023, 9, 20).toISOString()
  },
  {
    id: 'station-admin-2',
    name: 'Lisa Wong',
    email: 'lisa.wong@stations.com',
    role: 'station-admin',
    stationId: 'station-2',
    verified: true,
    createdAt: new Date(2023, 9, 22).toISOString()
  },
  ...Array.from({ length: 20 }).map((_, i) => ({
    id: `user-${i + 10}`,
    name: `Test User ${i + 10}`,
    email: `user${i + 10}@example.com`,
    role: ['user', 'maintenance', 'station-admin'][Math.floor(Math.random() * 3)] as 'user' | 'maintenance' | 'station-admin',
    stationId: `station-${Math.floor(Math.random() * 5) + 1}`,
    verified: Math.random() > 0.2,
    createdAt: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString()
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
    category: ['regular', 'electric', 'scooter'][Math.floor(Math.random() * 3)] as BikeCategory,
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

// Adding the missing reservations data
export const reservations: Reservation[] = [
  ...Array.from({ length: 50 }).map((_, i) => ({
    id: `reservation-${i + 1}`,
    userId: users[Math.floor(Math.random() * users.length)].id,
    bikeId: bikes[Math.floor(Math.random() * bikes.length)].id,
    stationId: stations[Math.floor(Math.random() * stations.length)].id,
    startTime: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString(),
    endTime: Math.random() > 0.3 ? new Date(Date.now() + Math.floor(Math.random() * 3) * 24 * 60 * 60 * 1000).toISOString() : null,
    status: ['active', 'completed', 'overdue', 'cancelled'][Math.floor(Math.random() * 4)] as 'active' | 'completed' | 'overdue' | 'cancelled',
    code: Math.random().toString(36).substring(2, 8).toUpperCase()
  }))
];

// Adding common issues for maintenance
export const commonIssues: CommonIssue[] = [
  { id: 'issue-1', name: 'Flat Tire', category: 'Wheel' },
  { id: 'issue-2', name: 'Brake Issue', category: 'Brakes' },
  { id: 'issue-3', name: 'Chain Problem', category: 'Drivetrain' },
  { id: 'issue-4', name: 'Seat Loose', category: 'Comfort' },
  { id: 'issue-5', name: 'Light Not Working', category: 'Electrical' },
  { id: 'issue-6', name: 'Gear Shifting Issue', category: 'Drivetrain' },
  { id: 'issue-7', name: 'Handlebar Loose', category: 'Steering' },
  { id: 'issue-8', name: 'Pedal Issue', category: 'Drivetrain' },
  { id: 'issue-9', name: 'Wheel Alignment', category: 'Wheel' },
  { id: 'issue-10', name: 'Frame Damage', category: 'Structure' }
];

// Helper to get a user by ID
export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

// Calculate bike fleet summary
export const getBikeSummary = () => {
  const availableBikes = bikes.filter(bike => bike.status === 'available').length;
  const inUseBikes = bikes.filter(bike => bike.status === 'in-use').length;
  const maintenanceBikes = bikes.filter(bike => bike.status === 'maintenance').length;

  return {
    totalBikes: bikes.length,
    availableBikes,
    inUseBikes,
    maintenanceBikes,
    utilization: Math.round((inUseBikes / bikes.length) * 100)
  };
};

// Calculate station summary
export const getStationSummary = () => {
  const totalCapacity = stations.reduce((sum, station) => sum + station.capacity, 0);
  const totalAvailableBikes = stations.reduce((sum, station) => sum + station.availableBikes, 0);

  return {
    totalStations: stations.length,
    totalCapacity,
    totalAvailableBikes,
    utilization: Math.round((totalAvailableBikes / totalCapacity) * 100)
  };
};

// Calculate maintenance summary
export const getMaintenanceSummary = () => {
  const pendingIssues = maintenanceReports.filter(report => report.status === 'pending').length;
  const inProgressIssues = maintenanceReports.filter(report => report.status === 'in-progress').length;
  const resolvedIssues = maintenanceReports.filter(report => report.status === 'resolved').length;

  return {
    totalIssues: maintenanceReports.length,
    pendingIssues,
    inProgressIssues,
    resolvedIssues,
    resolutionRate: Math.round((resolvedIssues / maintenanceReports.length) * 100)
  };
};
