
import { User, Bike, Station, Reservation, MaintenanceReport, CommonIssue } from '../types';

// Mock Users
export const users: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'admin',
    verified: true,
    createdAt: '2025-01-15T08:30:00Z',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'staff',
    verified: true,
    createdAt: '2025-02-10T10:45:00Z',
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    role: 'user',
    verified: true,
    createdAt: '2025-03-05T14:20:00Z',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    role: 'user',
    verified: false,
    createdAt: '2025-04-01T09:15:00Z',
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    role: 'staff',
    verified: true,
    createdAt: '2025-02-18T11:30:00Z',
  },
];

// Mock Stations
export const stations: Station[] = [
  {
    id: '1',
    name: 'Central Park',
    location: '5th Ave & 59th St',
    capacity: 20,
    availableBikes: 12,
    coordinates: { lat: 40.7812, lng: -73.9665 },
  },
  {
    id: '2',
    name: 'Union Square',
    location: 'Broadway & E 14th St',
    capacity: 15,
    availableBikes: 8,
    coordinates: { lat: 40.7359, lng: -73.9911 },
  },
  {
    id: '3',
    name: 'Battery Park',
    location: 'State St & Battery Pl',
    capacity: 25,
    availableBikes: 20,
    coordinates: { lat: 40.7033, lng: -74.0170 },
  },
  {
    id: '4',
    name: 'Times Square',
    location: 'Broadway & W 45th St',
    capacity: 30,
    availableBikes: 5,
    coordinates: { lat: 40.7580, lng: -73.9855 },
  },
];

// Mock Bikes
export const bikes: Bike[] = [
  {
    id: 'B001',
    model: 'City Cruiser',
    status: 'available',
    stationId: '1',
    batteryPercentage: 85,
    lastMaintenance: '2025-03-28T10:00:00Z',
    totalRides: 127,
  },
  {
    id: 'B002',
    model: 'Mountain Explorer',
    status: 'in-use',
    stationId: '1',
    batteryPercentage: 62,
    lastMaintenance: '2025-03-15T14:30:00Z',
    totalRides: 98,
  },
  {
    id: 'B003',
    model: 'Commuter Pro',
    status: 'maintenance',
    stationId: '1',
    batteryPercentage: 12,
    lastMaintenance: '2025-02-20T09:15:00Z',
    totalRides: 156,
  },
  {
    id: 'B004',
    model: 'Urban Glider',
    status: 'available',
    stationId: '2',
    batteryPercentage: 91,
    lastMaintenance: '2025-04-02T11:45:00Z',
    totalRides: 73,
  },
  {
    id: 'B005',
    model: 'City Cruiser',
    status: 'available',
    stationId: '2',
    batteryPercentage: 77,
    lastMaintenance: '2025-03-22T08:30:00Z',
    totalRides: 112,
  },
  {
    id: 'B006',
    model: 'Mountain Explorer',
    status: 'in-use',
    stationId: '2',
    batteryPercentage: 54,
    lastMaintenance: '2025-03-10T15:20:00Z',
    totalRides: 85,
  },
  {
    id: 'B007',
    model: 'Commuter Pro',
    status: 'available',
    stationId: '3',
    batteryPercentage: 96,
    lastMaintenance: '2025-04-05T10:15:00Z',
    totalRides: 42,
  },
  {
    id: 'B008',
    model: 'Urban Glider',
    status: 'in-use',
    stationId: '3',
    batteryPercentage: 45,
    lastMaintenance: '2025-03-18T14:00:00Z',
    totalRides: 104,
  },
  {
    id: 'B009',
    model: 'City Cruiser',
    status: 'available',
    stationId: '4',
    batteryPercentage: 88,
    lastMaintenance: '2025-04-01T09:45:00Z',
    totalRides: 92,
  },
  {
    id: 'B010',
    model: 'Mountain Explorer',
    status: 'maintenance',
    stationId: '4',
    batteryPercentage: 23,
    lastMaintenance: '2025-03-05T11:30:00Z',
    totalRides: 134,
  },
];

// Mock Reservations
export const reservations: Reservation[] = [
  {
    id: 'R001',
    userId: '3',
    bikeId: 'B002',
    stationId: '1',
    startTime: '2025-04-21T10:30:00Z',
    endTime: null,
    status: 'active',
  },
  {
    id: 'R002',
    userId: '4',
    bikeId: 'B006',
    stationId: '2',
    startTime: '2025-04-21T09:15:00Z',
    endTime: null,
    status: 'active',
  },
  {
    id: 'R003',
    userId: '3',
    bikeId: 'B008',
    stationId: '3',
    startTime: '2025-04-21T11:45:00Z',
    endTime: null,
    status: 'active',
  },
  {
    id: 'R004',
    userId: '4',
    bikeId: 'B001',
    stationId: '1',
    startTime: '2025-04-20T14:30:00Z',
    endTime: '2025-04-20T15:45:00Z',
    status: 'completed',
  },
  {
    id: 'R005',
    userId: '3',
    bikeId: 'B004',
    stationId: '2',
    startTime: '2025-04-19T10:00:00Z',
    endTime: '2025-04-19T11:30:00Z',
    status: 'completed',
  },
  {
    id: 'R006',
    userId: '3',
    bikeId: 'B009',
    stationId: '4',
    startTime: '2025-04-18T16:30:00Z',
    endTime: '2025-04-18T17:45:00Z',
    status: 'completed',
  },
  {
    id: 'R007',
    userId: '4',
    bikeId: 'B005',
    stationId: '2',
    startTime: '2025-04-15T09:00:00Z',
    endTime: '2025-04-15T10:15:00Z',
    status: 'completed',
  },
  {
    id: 'R008',
    userId: '3',
    bikeId: 'B007',
    stationId: '3',
    startTime: '2025-04-20T09:15:00Z',
    endTime: null,
    status: 'overdue',
  },
];

// Mock Maintenance Reports
export const maintenanceReports: MaintenanceReport[] = [
  {
    id: 'M001',
    bikeId: 'B003',
    reportedBy: '2',
    issue: 'Flat Tire',
    description: 'Front tire completely flat, requires replacement.',
    status: 'in-progress',
    reportedAt: '2025-04-19T14:30:00Z',
    resolvedAt: null,
    priority: 'medium',
  },
  {
    id: 'M002',
    bikeId: 'B010',
    reportedBy: '5',
    issue: 'Battery Issue',
    description: 'Battery not holding charge, drops quickly during rides.',
    status: 'pending',
    reportedAt: '2025-04-20T10:15:00Z',
    resolvedAt: null,
    priority: 'high',
  },
  {
    id: 'M003',
    bikeId: 'B006',
    reportedBy: '2',
    issue: 'Brake Problem',
    description: 'Rear brake not responsive, needs adjustment.',
    status: 'resolved',
    reportedAt: '2025-04-15T09:30:00Z',
    resolvedAt: '2025-04-16T13:45:00Z',
    priority: 'high',
  },
  {
    id: 'M004',
    bikeId: 'B008',
    reportedBy: '5',
    issue: 'Gear Shifting',
    description: 'Difficulty shifting between gears, especially 3 to 4.',
    status: 'resolved',
    reportedAt: '2025-04-14T11:20:00Z',
    resolvedAt: '2025-04-15T10:30:00Z',
    priority: 'medium',
  },
  {
    id: 'M005',
    bikeId: 'B001',
    reportedBy: '2',
    issue: 'Seat Adjustment',
    description: 'Seat post slips down, not holding position.',
    status: 'resolved',
    reportedAt: '2025-04-10T15:45:00Z',
    resolvedAt: '2025-04-11T09:15:00Z',
    priority: 'low',
  },
];

// Mock Common Issues
export const commonIssues: CommonIssue[] = [
  {
    id: '1',
    name: 'Flat Tire',
    category: 'Mechanical',
  },
  {
    id: '2',
    name: 'Battery Not Charging',
    category: 'Electrical',
  },
  {
    id: '3',
    name: 'Brake Problem',
    category: 'Safety',
  },
  {
    id: '4',
    name: 'Gear Shifting Issue',
    category: 'Mechanical',
  },
  {
    id: '5',
    name: 'Display Not Working',
    category: 'Electrical',
  },
  {
    id: '6',
    name: 'Seat Adjustment Problem',
    category: 'Comfort',
  },
  {
    id: '7',
    name: 'Handlebar Loose',
    category: 'Safety',
  },
  {
    id: '8',
    name: 'Pedal Issue',
    category: 'Mechanical',
  },
  {
    id: '9',
    name: 'Lights Not Working',
    category: 'Electrical',
  },
  {
    id: '10',
    name: 'Chain Problem',
    category: 'Mechanical',
  },
];

// Helper function to get bike summary stats
export const getBikeSummary = () => {
  const totalBikes = bikes.length;
  const availableBikes = bikes.filter(bike => bike.status === 'available').length;
  const inUseBikes = bikes.filter(bike => bike.status === 'in-use').length;
  const maintenanceBikes = bikes.filter(bike => bike.status === 'maintenance').length;
  
  return {
    totalBikes,
    availableBikes,
    inUseBikes,
    maintenanceBikes
  };
};

// Helper function to get station summary
export const getStationSummary = () => {
  const totalStations = stations.length;
  const totalCapacity = stations.reduce((sum, station) => sum + station.capacity, 0);
  const totalAvailableBikes = stations.reduce((sum, station) => sum + station.availableBikes, 0);
  const utilization = (totalAvailableBikes / totalCapacity) * 100;
  
  return {
    totalStations,
    totalCapacity,
    totalAvailableBikes,
    utilization: Math.round(utilization)
  };
};

// Helper function to get maintenance summary
export const getMaintenanceSummary = () => {
  const pendingIssues = maintenanceReports.filter(report => report.status === 'pending').length;
  const inProgressIssues = maintenanceReports.filter(report => report.status === 'in-progress').length;
  const resolvedIssues = maintenanceReports.filter(report => report.status === 'resolved').length;
  const highPriorityIssues = maintenanceReports.filter(report => report.priority === 'high').length;
  
  return {
    pendingIssues,
    inProgressIssues,
    resolvedIssues,
    highPriorityIssues,
    totalIssues: maintenanceReports.length
  };
};
