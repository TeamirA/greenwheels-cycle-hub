
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StationMap from '@/components/StationMap';
import { useToast } from '@/hooks/use-toast';
import { bikes, maintenanceReports, stations, users } from '@/data/mockData';
import { MaintenanceReport } from '@/types';
import { Bike, MapPin, Search, AlertCircle } from 'lucide-react';
import MaintenanceDashboard from '@/pages/MaintenanceDashboard';

const UserReports = () => {
  return <MaintenanceDashboard reportSource="user" />;
};

export default UserReports;
