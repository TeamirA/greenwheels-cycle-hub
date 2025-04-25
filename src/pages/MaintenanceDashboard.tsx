
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StationMap from '@/components/StationMap';
import { useToast } from '@/hooks/use-toast';
import { bikes, maintenanceReports, stations, users } from '@/data/mockData';
import { MaintenanceReport } from '@/types';
import { Bike, MapPin, Search, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { CustomPagination } from '@/components/ui/custom-pagination';

const MaintenanceDashboard = ({ reportSource = 'all' }: { reportSource?: 'user' | 'staff' | 'all' }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [reports, setReports] = useState<MaintenanceReport[]>(maintenanceReports);
  const [filteredReports, setFilteredReports] = useState<MaintenanceReport[]>(reports);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Show 6 report cards per page
  
  useEffect(() => {
    let initialReports = maintenanceReports;

    if (reportSource === 'user') {
      initialReports = maintenanceReports.filter(report => report.userId);
    } else if (reportSource === 'staff') {
      initialReports = maintenanceReports.filter(report => report.staffId);
    }

    setReports(initialReports);
  }, [reportSource]);

  useEffect(() => {
    let results = [...reports];

    if (statusFilter !== 'all') {
      results = results.filter(report => report.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      results = results.filter(report => report.priority === priorityFilter);
    }

    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      results = results.filter(report =>
        report.bikeId.toLowerCase().includes(lowercasedSearchTerm) ||
        report.issue.toLowerCase().includes(lowercasedSearchTerm) ||
        report.description.toLowerCase().includes(lowercasedSearchTerm)
      );
    }

    setFilteredReports(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [reports, searchTerm, statusFilter, priorityFilter]);
  
  const indexOfLastReport = currentPage * itemsPerPage;
  const indexOfFirstReport = indexOfLastReport - itemsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  
  const handleUpdateStatus = (id: string, newStatus: 'pending' | 'in-progress' | 'resolved') => {
    toast({
      title: 'Status Updated',
      description: `Report ${id} has been marked as ${newStatus}`
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded p-2"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border rounded p-2"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentReports.map(report => {
          const reportUser = report.userId ? users.find(u => u.id === report.userId) : null;
          const reportBike = bikes.find(b => b.id === report.bikeId);
          
          return (
            <Card key={report.id} className="overflow-hidden">
              <CardHeader className={`
                ${report.priority === 'high' ? 'bg-red-50 dark:bg-red-900/20' : 
                  report.priority === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20' : 
                  'bg-green-50 dark:bg-green-900/20'}
              `}>
                <div className="flex justify-between">
                  <CardTitle className="text-base">Report #{report.id}</CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${report.priority === 'high' ? 'bg-error/20 text-error' : 
                      report.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}
                  >
                    {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)} Priority
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <h3 className="font-medium">{report.issue}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{report.description}</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Bike ID:</span>
                    <span className="font-medium">{report.bikeId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Reported by:</span>
                    <span className="font-medium">{reportUser?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Date:</span>
                    <span className="font-medium">{new Date(report.reportedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${report.status === 'pending' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' : 
                        report.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' : 
                        'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'}`}
                    >
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1).replace('-', ' ')}
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end space-x-2">
                  {report.status === 'pending' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex items-center"
                      onClick={() => handleUpdateStatus(report.id, 'in-progress')}
                    >
                      <Clock className="mr-1" size={14} />
                      Start Work
                    </Button>
                  )}
                  {report.status === 'in-progress' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex items-center"
                      onClick={() => handleUpdateStatus(report.id, 'resolved')}
                    >
                      <CheckCircle className="mr-1" size={14} />
                      Resolve
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {filteredReports.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          No maintenance issues found matching your criteria.
        </div>
      )}
      
      {filteredReports.length > itemsPerPage && (
        <div className="mt-4">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredReports.length}
          />
        </div>
      )}
    </div>
  );
};

export default MaintenanceDashboard;
