import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StationMap from '@/components/StationMap';
import { useToast } from '@/hooks/use-toast';
import { bikes, maintenanceReports, stations, users } from '@/data/mockData';
import { MaintenanceReport } from '@/types';
import { Bike, MapPin, Search, AlertCircle } from 'lucide-react';
import { CustomPagination } from '@/components/ui/custom-pagination';

const MaintenanceDashboard = ({ reportSource = 'all' }: { reportSource?: 'user' | 'staff' | 'all' }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [reports, setReports] = useState<MaintenanceReport[]>(maintenanceReports);
  const [filteredReports, setFilteredReports] = useState<MaintenanceReport[]>(reports);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  
  useEffect(() => {
    let initialReports = maintenanceReports;

    if (reportSource === 'user') {
      initialReports = maintenanceReports.filter(report => users.find(user => user.id === report.userId));
    } else if (reportSource === 'staff') {
      initialReports = maintenanceReports.filter(report => users.find(user => user.id === report.staffId));
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
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bike ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reported By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reported At
                </th>
              </tr>
            </thead>
            <tbody className="dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentReports.map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{report.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.bikeId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.issue}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {report.userId ? users.find(user => user.id === report.userId)?.name : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{report.priority}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(report.reportedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredReports.length > itemsPerPage && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
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
    </div>
  );
};

export default MaintenanceDashboard;
