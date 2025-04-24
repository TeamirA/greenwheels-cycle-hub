
import { User, Bike, Station, Reservation, MaintenanceReport, CommonIssue, BikeCategory } from '../types';

// Mock Users with more realistic data
export const users: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'admin@gmail.com',
    role: 'admin',
    verified: true,
    createdAt: '2025-01-15T08:30:00Z',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'staff@gmail.com',
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
  {
    id: '6',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@example.com',
    role: 'user',
    verified: true,
    createdAt: '2025-01-22T13:15:00Z',
  },
  {
    id: '7',
    name: 'Robert Martin',
    email: 'robert.martin@example.com',
    role: 'user',
    verified: true,
    createdAt: '2025-03-12T10:30:00Z',
  },
  {
    id: '8',
    name: 'Jennifer Wilson',
    email: 'jennifer.wilson@example.com',
    role: 'staff',
    verified: true,
    createdAt: '2025-02-28T09:45:00Z',
  },
  {
    id: '9',
    name: 'Daniel Lee',
    email: 'daniel.lee@example.com',
    role: 'user',
    verified: true,
    createdAt: '2025-03-18T15:20:00Z',
  },
  {
    id: '10',
    name: 'Jessica Taylor',
    email: 'jessica.taylor@example.com',
    role: 'user',
    verified: true,
    createdAt: '2025-02-05T08:45:00Z',
  },
  {
    id: '11',
    name: 'Christopher Harris',
    email: 'christopher.harris@example.com',
    role: 'staff',
    verified: true,
    createdAt: '2025-01-30T14:20:00Z',
  },
  {
    id: '12',
    name: 'Amanda Martinez',
    email: 'amanda.martinez@example.com',
    role: 'user',
    verified: true,
    createdAt: '2025-03-25T09:30:00Z',
  },
];

// Mock Stations with more stations and realistic data
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
  {
    id: '5',
    name: 'Brooklyn Heights',
    location: 'Montague St & Clinton St',
    capacity: 18,
    availableBikes: 12,
    coordinates: { lat: 40.6935, lng: -73.9915 },
  },
  {
    id: '6',
    name: 'Prospect Park',
    location: 'Grand Army Plaza',
    capacity: 22,
    availableBikes: 15,
    coordinates: { lat: 40.6737, lng: -73.9703 },
  },
  {
    id: '7',
    name: 'Hudson River Park',
    location: 'West St & Christopher St',
    capacity: 24,
    availableBikes: 17,
    coordinates: { lat: 40.7327, lng: -74.0120 },
  },
  {
    id: '8',
    name: 'Bryant Park',
    location: '6th Ave & W 42nd St',
    capacity: 28,
    availableBikes: 9,
    coordinates: { lat: 40.7536, lng: -73.9832 },
  },
  {
    id: '9',
    name: 'Washington Square Park',
    location: '5th Ave & Washington Sq N',
    capacity: 20,
    availableBikes: 14,
    coordinates: { lat: 40.7312, lng: -73.9976 },
  },
  {
    id: '10',
    name: 'Madison Square Park',
    location: 'Broadway & E 23rd St',
    capacity: 16,
    availableBikes: 11,
    coordinates: { lat: 40.7412, lng: -73.9883 },
  },
];

// Expanded list of bikes with categories and battery percentages
export const bikes: Bike[] = [
  {
    id: 'B001',
    model: 'City Cruiser',
    status: 'available',
    stationId: '1',
    lastMaintenance: '2025-03-28T10:00:00Z',
    totalRides: 127,
    category: 'regular',
    batteryPercentage: 0,
  },
  {
    id: 'B002',
    model: 'Mountain Explorer',
    status: 'in-use',
    stationId: '1',
    lastMaintenance: '2025-03-15T14:30:00Z',
    totalRides: 98,
    category: 'regular',
    batteryPercentage: 0,
  },
  {
    id: 'B003',
    model: 'Commuter Pro',
    status: 'maintenance',
    stationId: '1',
    lastMaintenance: '2025-02-20T09:15:00Z',
    totalRides: 156,
    category: 'electric',
    batteryPercentage: 85,
  },
  {
    id: 'B004',
    model: 'Urban Glider',
    status: 'available',
    stationId: '2',
    lastMaintenance: '2025-04-02T11:45:00Z',
    totalRides: 73,
    category: 'electric',
    batteryPercentage: 92,
  },
  {
    id: 'B005',
    model: 'City Cruiser',
    status: 'available',
    stationId: '2',
    lastMaintenance: '2025-03-22T08:30:00Z',
    totalRides: 112,
    category: 'regular',
    batteryPercentage: 0,
  },
  {
    id: 'B006',
    model: 'Mountain Explorer',
    status: 'in-use',
    stationId: '2',
    lastMaintenance: '2025-03-10T15:20:00Z',
    totalRides: 85,
    category: 'regular',
    batteryPercentage: 0,
  },
  {
    id: 'B007',
    model: 'Commuter Pro',
    status: 'available',
    stationId: '3',
    lastMaintenance: '2025-04-05T10:15:00Z',
    totalRides: 42,
    category: 'electric',
    batteryPercentage: 78,
  },
  {
    id: 'B008',
    model: 'Urban Glider',
    status: 'in-use',
    stationId: '3',
    lastMaintenance: '2025-03-18T14:00:00Z',
    totalRides: 104,
    category: 'scooter',
    batteryPercentage: 45,
  },
  {
    id: 'B009',
    model: 'City Cruiser',
    status: 'available',
    stationId: '4',
    lastMaintenance: '2025-04-01T09:45:00Z',
    totalRides: 92,
    category: 'regular',
    batteryPercentage: 0,
  },
  {
    id: 'B010',
    model: 'Mountain Explorer',
    status: 'maintenance',
    stationId: '4',
    lastMaintenance: '2025-03-05T11:30:00Z',
    totalRides: 134,
    category: 'regular',
    batteryPercentage: 0,
  },
  {
    id: 'B011',
    model: 'SpeedScoot',
    status: 'available',
    stationId: '5',
    lastMaintenance: '2025-03-30T14:45:00Z',
    totalRides: 67,
    category: 'scooter',
    batteryPercentage: 67,
  },
  {
    id: 'B012',
    model: 'ZipScoot',
    status: 'available',
    stationId: '5',
    lastMaintenance: '2025-04-03T09:30:00Z',
    totalRides: 42,
    category: 'scooter',
    batteryPercentage: 88,
  },
  {
    id: 'B013',
    model: 'ElectroPro',
    status: 'in-use',
    stationId: '6',
    lastMaintenance: '2025-03-25T11:00:00Z',
    totalRides: 89,
    category: 'electric',
    batteryPercentage: 53,
  },
  {
    id: 'B014',
    model: 'TurboScoot',
    status: 'available',
    stationId: '6',
    lastMaintenance: '2025-04-01T10:15:00Z',
    totalRides: 56,
    category: 'scooter',
    batteryPercentage: 76,
  },
  {
    id: 'B015',
    model: 'City Cruiser',
    status: 'available',
    stationId: '1',
    lastMaintenance: '2025-03-20T09:00:00Z',
    totalRides: 103,
    category: 'regular',
    batteryPercentage: 0,
  },
  {
    id: 'B016',
    model: 'UrbanRider',
    status: 'available',
    stationId: '7',
    lastMaintenance: '2025-04-03T13:45:00Z',
    totalRides: 78,
    category: 'regular',
    batteryPercentage: 0,
  },
  {
    id: 'B017',
    model: 'PowerPedal',
    status: 'in-use',
    stationId: '7',
    lastMaintenance: '2025-03-22T10:30:00Z',
    totalRides: 91,
    category: 'electric',
    batteryPercentage: 72,
  },
  {
    id: 'B018',
    model: 'CityScooter',
    status: 'maintenance',
    stationId: '8',
    lastMaintenance: '2025-02-28T09:15:00Z',
    totalRides: 115,
    category: 'scooter',
    batteryPercentage: 15,
  },
  {
    id: 'B019',
    model: 'PathFinder',
    status: 'available',
    stationId: '8',
    lastMaintenance: '2025-04-05T11:30:00Z',
    totalRides: 67,
    category: 'regular',
    batteryPercentage: 0,
  },
  {
    id: 'B020',
    model: 'SwiftGlide',
    status: 'in-use',
    stationId: '9',
    lastMaintenance: '2025-03-18T14:20:00Z',
    totalRides: 83,
    category: 'electric',
    batteryPercentage: 64,
  },
  {
    id: 'B021',
    model: 'UrbanVoyager',
    status: 'available',
    stationId: '9',
    lastMaintenance: '2025-04-02T10:45:00Z',
    totalRides: 59,
    category: 'regular',
    batteryPercentage: 0,
  },
  {
    id: 'B022',
    model: 'ElectroGlide',
    status: 'maintenance',
    stationId: '10',
    lastMaintenance: '2025-03-10T09:30:00Z',
    totalRides: 128,
    category: 'electric',
    batteryPercentage: 32,
  },
  {
    id: 'B023',
    model: 'CityExpress',
    status: 'available',
    stationId: '10',
    lastMaintenance: '2025-04-04T13:15:00Z',
    totalRides: 74,
    category: 'regular',
    batteryPercentage: 0,
  },
  {
    id: 'B024',
    model: 'ZipRider',
    status: 'in-use',
    stationId: '3',
    lastMaintenance: '2025-03-25T12:30:00Z',
    totalRides: 95,
    category: 'scooter',
    batteryPercentage: 81,
  },
  {
    id: 'B025',
    model: 'EcoGlider',
    status: 'available',
    stationId: '4',
    lastMaintenance: '2025-04-06T09:45:00Z',
    totalRides: 51,
    category: 'electric',
    batteryPercentage: 94,
  },
];

// Generate a random 6-digit uppercase alphanumeric code
const generateReservationCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

// Mock Reservations with codes and more entries
export const reservations: Reservation[] = [
  {
    id: 'R001',
    userId: '3',
    bikeId: 'B002',
    stationId: '1',
    startTime: '2025-04-21T10:30:00Z',
    endTime: null,
    status: 'active',
    code: generateReservationCode(),
  },
  {
    id: 'R002',
    userId: '4',
    bikeId: 'B006',
    stationId: '2',
    startTime: '2025-04-21T09:15:00Z',
    endTime: null,
    status: 'active',
    code: generateReservationCode(),
  },
  {
    id: 'R003',
    userId: '3',
    bikeId: 'B008',
    stationId: '3',
    startTime: '2025-04-21T11:45:00Z',
    endTime: null,
    status: 'active',
    code: generateReservationCode(),
  },
  {
    id: 'R004',
    userId: '4',
    bikeId: 'B001',
    stationId: '1',
    startTime: '2025-04-20T14:30:00Z',
    endTime: '2025-04-20T15:45:00Z',
    status: 'completed',
    code: generateReservationCode(),
  },
  {
    id: 'R005',
    userId: '3',
    bikeId: 'B004',
    stationId: '2',
    startTime: '2025-04-19T10:00:00Z',
    endTime: '2025-04-19T11:30:00Z',
    status: 'completed',
    code: generateReservationCode(),
  },
  {
    id: 'R006',
    userId: '3',
    bikeId: 'B009',
    stationId: '4',
    startTime: '2025-04-18T16:30:00Z',
    endTime: '2025-04-18T17:45:00Z',
    status: 'completed',
    code: generateReservationCode(),
  },
  {
    id: 'R007',
    userId: '4',
    bikeId: 'B005',
    stationId: '2',
    startTime: '2025-04-15T09:00:00Z',
    endTime: '2025-04-15T10:15:00Z',
    status: 'completed',
    code: generateReservationCode(),
  },
  {
    id: 'R008',
    userId: '3',
    bikeId: 'B007',
    stationId: '3',
    startTime: '2025-04-20T09:15:00Z',
    endTime: null,
    status: 'overdue',
    code: generateReservationCode(),
  },
  {
    id: 'R009',
    userId: '6',
    bikeId: 'B011',
    stationId: '5',
    startTime: '2025-04-22T08:30:00Z',
    endTime: null,
    status: 'active',
    code: generateReservationCode(),
  },
  {
    id: 'R010',
    userId: '7',
    bikeId: 'B013',
    stationId: '6',
    startTime: '2025-04-22T10:15:00Z',
    endTime: null,
    status: 'active',
    code: generateReservationCode(),
  },
  {
    id: 'R011',
    userId: '9',
    bikeId: 'B017',
    stationId: '7',
    startTime: '2025-04-22T11:30:00Z',
    endTime: null,
    status: 'active',
    code: generateReservationCode(),
  },
  {
    id: 'R012',
    userId: '10',
    bikeId: 'B020',
    stationId: '9',
    startTime: '2025-04-22T09:45:00Z',
    endTime: null,
    status: 'active',
    code: generateReservationCode(),
  },
  {
    id: 'R013',
    userId: '6',
    bikeId: 'B024',
    stationId: '3',
    startTime: '2025-04-22T14:15:00Z',
    endTime: null,
    status: 'active',
    code: generateReservationCode(),
  },
  {
    id: 'R014',
    userId: '12',
    bikeId: 'B016',
    stationId: '7',
    startTime: '2025-04-20T13:30:00Z',
    endTime: '2025-04-20T14:45:00Z',
    status: 'completed',
    code: generateReservationCode(),
  },
  {
    id: 'R015',
    userId: '9',
    bikeId: 'B021',
    stationId: '9',
    startTime: '2025-04-19T15:00:00Z',
    endTime: '2025-04-19T16:30:00Z',
    status: 'completed',
    code: generateReservationCode(),
  },
  {
    id: 'R016',
    userId: '7',
    bikeId: 'B023',
    stationId: '10',
    startTime: '2025-04-21T08:45:00Z',
    endTime: '2025-04-21T09:30:00Z',
    status: 'completed',
    code: generateReservationCode(),
  },
];

// Mock Maintenance Reports with more entries
export const maintenanceReports: MaintenanceReport[] = [
  {
    id: 'M001',
    bikeId: 'B003',
    reportedBy: '2', // Staff
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
    reportedBy: '5', // Staff
    issue: 'Power Issue',
    description: 'Not powering on, may need electrical inspection.',
    status: 'pending',
    reportedAt: '2025-04-20T10:15:00Z',
    resolvedAt: null,
    priority: 'high',
  },
  {
    id: 'M003',
    bikeId: 'B006',
    reportedBy: '2', // Staff
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
    reportedBy: '5', // Staff
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
    reportedBy: '2', // Staff
    issue: 'Seat Adjustment',
    description: 'Seat post slips down, not holding position.',
    status: 'resolved',
    reportedAt: '2025-04-10T15:45:00Z',
    resolvedAt: '2025-04-11T09:15:00Z',
    priority: 'low',
  },
  {
    id: 'M006',
    bikeId: 'B018',
    reportedBy: '8', // Staff
    issue: 'Battery Not Charging',
    description: 'Battery stuck at 15%, will not accept a charge.',
    status: 'pending',
    reportedAt: '2025-04-22T09:30:00Z',
    resolvedAt: null,
    priority: 'high',
  },
  {
    id: 'M007',
    bikeId: 'B022',
    reportedBy: '5', // Staff
    issue: 'Display Malfunction',
    description: 'Screen showing garbled data, battery indicator not working.',
    status: 'in-progress',
    reportedAt: '2025-04-21T13:45:00Z',
    resolvedAt: null,
    priority: 'medium',
  },
  {
    id: 'M008',
    bikeId: 'B013',
    reportedBy: '7', // User
    issue: 'Strange Noise',
    description: 'Loud clicking noise coming from the drivetrain when pedaling.',
    status: 'pending',
    reportedAt: '2025-04-22T11:30:00Z',
    resolvedAt: null,
    priority: 'medium',
  },
  {
    id: 'M009',
    bikeId: 'B020',
    reportedBy: '10', // User
    issue: 'Handlebar Loose',
    description: 'Handlebars feel loose and wobble when turning.',
    status: 'in-progress',
    reportedAt: '2025-04-22T10:15:00Z',
    resolvedAt: null,
    priority: 'high',
  },
  {
    id: 'M010',
    bikeId: 'B009',
    reportedBy: '6', // User
    issue: 'Chain Problem',
    description: 'Chain keeps dropping off when shifting to higher gears.',
    status: 'pending',
    reportedAt: '2025-04-21T15:30:00Z',
    resolvedAt: null,
    priority: 'medium',
  },
  {
    id: 'M011',
    bikeId: 'B016',
    reportedBy: '12', // User
    issue: 'Brake Squeal',
    description: 'Very loud squealing noise when brakes are applied.',
    status: 'resolved',
    reportedAt: '2025-04-20T14:45:00Z',
    resolvedAt: '2025-04-21T09:30:00Z',
    priority: 'low',
  },
  {
    id: 'M012',
    bikeId: 'B024',
    reportedBy: '4', // User
    issue: 'Throttle Sticking',
    description: 'Electric throttle sticks in the on position occasionally.',
    status: 'pending',
    reportedAt: '2025-04-22T09:15:00Z',
    resolvedAt: null,
    priority: 'high',
  },
  {
    id: 'M013',
    bikeId: 'B011',
    reportedBy: '3', // User
    issue: 'Scooter Deck Crack',
    description: 'Small crack forming in the deck near the front wheel.',
    status: 'in-progress',
    reportedAt: '2025-04-19T11:30:00Z',
    resolvedAt: null,
    priority: 'medium',
  },
  {
    id: 'M014',
    bikeId: 'B014',
    reportedBy: '9', // User
    issue: 'Light Not Working',
    description: 'Front headlight flickers and then turns off completely.',
    status: 'pending',
    reportedAt: '2025-04-21T16:45:00Z',
    resolvedAt: null,
    priority: 'low',
  },
  {
    id: 'M015',
    bikeId: 'B017',
    reportedBy: '11', // Staff
    issue: 'Motor Overheating',
    description: 'Electric motor gets very hot after just a few minutes of use.',
    status: 'in-progress',
    reportedAt: '2025-04-20T13:15:00Z',
    resolvedAt: null,
    priority: 'high',
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
    name: 'Power Issue',
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
  {
    id: '11',
    name: 'Battery Not Charging',
    category: 'Electrical',
  },
  {
    id: '12',
    name: 'Motor Overheating',
    category: 'Electrical',
  },
  {
    id: '13',
    name: 'Throttle Sticking',
    category: 'Safety',
  },
  {
    id: '14',
    name: 'Brake Squeal',
    category: 'Mechanical',
  },
  {
    id: '15',
    name: 'Scooter Deck Crack',
    category: 'Structural',
  },
];

// Helper function to get bike summary stats
export const getBikeSummary = () => {
  const totalBikes = bikes.length;
  const availableBikes = bikes.filter(bike => bike.status === 'available').length;
  const inUseBikes = bikes.filter(bike => bike.status === 'in-use').length;
  const maintenanceBikes = bikes.filter(bike => bike.status === 'maintenance').length;
  
  const regularBikes = bikes.filter(bike => bike.category === 'regular').length;
  const electricBikes = bikes.filter(bike => bike.category === 'electric').length;
  const scooters = bikes.filter(bike => bike.category === 'scooter').length;
  
  return {
    totalBikes,
    availableBikes,
    inUseBikes,
    maintenanceBikes,
    regularBikes,
    electricBikes,
    scooters
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

// Function to get bikes by station
export const getBikesByStation = (stationId: string) => {
  return bikes.filter(bike => bike.stationId === stationId);
};

// Function to get user by ID
export const getUserById = (userId: string) => {
  return users.find(user => user.id === userId);
};
