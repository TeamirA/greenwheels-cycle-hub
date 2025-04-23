
export type UserRole = 'admin' | 'staff' | 'user' | 'station-admin' | 'maintenance';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  verified: boolean;
  createdAt: string;
  stationId?: string; // For station staff and maintenance staff
}

export type BikeStatus = 'available' | 'in-use' | 'maintenance';
export type BikeCategory = 'regular' | 'electric' | 'scooter';

export interface Bike {
  id: string;
  model: string;
  status: BikeStatus;
  stationId: string;
  lastMaintenance: string;
  totalRides: number;
  category: BikeCategory;
  batteryPercentage?: number; // Adding batteryPercentage as an optional property
}

export interface Station {
  id: string;
  name: string;
  location: string;
  capacity: number;
  availableBikes: number;
  coordinates: { lat: number; lng: number };
}

export interface Reservation {
  id: string;
  userId: string;
  bikeId: string;
  stationId: string;
  startTime: string;
  endTime: string | null;
  status: 'active' | 'completed' | 'overdue' | 'cancelled';
  code?: string;
}

export interface MaintenanceReport {
  id: string;
  bikeId: string;
  reportedBy: string;
  issue: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  reportedAt: string;
  resolvedAt: string | null;
  priority: 'low' | 'medium' | 'high';
}

export interface CommonIssue {
  id: string;
  name: string;
  category: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole | null;
}
