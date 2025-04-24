
import React, { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { maintenanceReports, bikes, users, commonIssues } from '@/data/mockData';
import { MaintenanceReport, CommonIssue, Bike } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface Report {
  id: string;
  bike: Bike;
  issue: string;
  reporter: string;
  dateReported: string;
  status: 'pending' | 'in-progress' | 'resolved';
}

const StaffMaintenanceDashboard = ({ reportSource = 'user' }: { reportSource?: 'user' | 'staff' }) => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedBike, setSelectedBike] = useState('');
  const [selectedIssue, setSelectedIssue] = useState('');
  const [description, setDescription] = useState('');

  const handleNewReport = () => {
    setShowForm(true);
  };

  const handleSubmitReport = () => {
    if (!selectedBike || !selectedIssue || !description) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    const newReport: Report = {
      id: `report-${reports.length + 1}`,
      bike: bikes.find((bike) => bike.id === selectedBike)!,
      issue: selectedIssue,
      reporter: users[0].name,
      dateReported: new Date().toLocaleDateString(),
      status: 'pending',
    };

    setReports([...reports, newReport]);
    setShowForm(false);
    setSelectedBike('');
    setSelectedIssue('');
    setDescription('');

    toast({
      title: 'Success',
      description: 'Report submitted successfully.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Maintenance Dashboard</h1>
        <Button onClick={handleNewReport}>
          <Plus className="mr-2 h-4 w-4" />
          New Report
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Total Reports
              </h2>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {maintenanceReports.length}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Pending Reports
              </h2>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {maintenanceReports.filter((report) => report.status === 'pending').length}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Resolved Reports
              </h2>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {maintenanceReports.filter((report) => report.status === 'resolved').length}
              </p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="reports">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Bike
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Issue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Reporter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Date Reported
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {maintenanceReports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {report.bikeId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {report.issue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {report.reportedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(report.reportedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {report.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md space-y-4 animate-fade-in">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Submit New Report
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="bike" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Bike
              </label>
              <select
                id="bike"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100 dark:bg-gray-800"
                value={selectedBike}
                onChange={(e) => setSelectedBike(e.target.value)}
              >
                <option value="">Select a bike</option>
                {bikes.map((bike) => (
                  <option key={bike.id} value={bike.id}>
                    {bike.model} ({bike.id})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="issue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Common Issues
              </label>
              <select
                id="issue"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100 dark:bg-gray-800"
                value={selectedIssue}
                onChange={(e) => setSelectedIssue(e.target.value)}
              >
                <option value="">Select an issue</option>
                {commonIssues.map((issue: CommonIssue) => (
                  <option key={issue.id} value={issue.name.toLowerCase()}>
                    {issue.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <Input
              id="description"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100 dark:bg-gray-800"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSubmitReport}>Submit Report</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffMaintenanceDashboard;
