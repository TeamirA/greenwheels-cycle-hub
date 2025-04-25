import { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { maintenanceReports, bikes, commonIssues } from '@/data/mockData';
import { MaintenanceReport, Bike } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Wrench, Filter, Search, Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { CustomPagination } from '@/components/ui/custom-pagination';

const MaintenanceIssues = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showNewIssueDialog, setShowNewIssueDialog] = useState(false);
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const availableBikes = bikes.filter(bike => bike.status !== 'maintenance');

  const filteredReports = useMemo(() => {
    let results = maintenanceReports;
    
    if (statusFilter !== 'all') {
      results = results.filter(report => report.status === statusFilter);
    }
    
    if (priorityFilter !== 'all') {
      results = results.filter(report => report.priority === priorityFilter);
    }
    
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      results = results.filter(
        report => 
          report.bikeId.toLowerCase().includes(lowercasedFilter) ||
          report.issue.toLowerCase().includes(lowercasedFilter) ||
          report.description.toLowerCase().includes(lowercasedFilter)
      );
    }
    
    return results;
  }, [searchTerm, statusFilter, priorityFilter]);

  const indexOfLastReport = currentPage * itemsPerPage;
  const indexOfFirstReport = indexOfLastReport - itemsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const form = useForm({
    defaultValues: {
      bikeId: '',
      issue: '',
      description: '',
      priority: 'medium'
    }
  });

  const handleNewIssue = (data: any) => {
    toast({
      title: 'Maintenance Issue Reported',
      description: `Issue reported for bike ${data.bikeId}`
    });
    
    setShowNewIssueDialog(false);
    form.reset();
  };

  const handleUpdateStatus = (id: string, newStatus: 'pending' | 'in-progress' | 'resolved') => {
    toast({
      title: 'Status Updated',
      description: `Report ${id} has been marked as ${newStatus}`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-graydark">Maintenance Management</h1>
          <p className="text-muted-foreground">Track and manage bike maintenance issues</p>
        </div>
        <Button 
          onClick={() => setShowNewIssueDialog(true)}
          className="bg-greenprimary hover:bg-greenprimary/80"
        >
          <Plus className="mr-1" size={16} /> Report Issue
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search by bike ID, issue or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={18} className="text-graydark" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded p-2 focus:outline-none focus:ring-2"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border rounded p-2 focus:outline-none focus:ring-2"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-graylight">
          <h2 className="text-lg font-semibold flex items-center">
            <Wrench className="mr-2" size={18} />
            Maintenance Issues
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-graylight">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider">
                  Report ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider">
                  Bike ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider">
                  Issue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider">
                  Reported At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-graydark">
                    {report.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-graydark">
                    {report.bikeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-graydark">
                    {report.issue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${report.priority === 'high' ? 'bg-error/20 text-error' : 
                        report.priority === 'medium' ? 'bg-greenaccent/30 text-graydark' : 
                        'bg-gray-100 text-gray-500'}`}
                    >
                      {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${report.status === 'pending' ? 'bg-gray-100 text-gray-600' : 
                        report.status === 'in-progress' ? 'bg-greenaccent/30 text-graydark' : 
                        'bg-greenprimary/20 text-greenprimary'}`}
                    >
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1).replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-graydark">
                    {new Date(report.reportedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-graydark">
                    {report.status === 'pending' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex items-center"
                        onClick={() => handleUpdateStatus(report.id, 'in-progress')}
                      >
                        <Wrench className="mr-1" size={14} />
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
                    {report.status === 'resolved' && (
                      <span className="text-xs text-gray-500">No actions</span>
                    )}
                  </td>
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
        
        {filteredReports.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No maintenance issues found matching your criteria.
          </div>
        )}
      </div>

      <Dialog open={showNewIssueDialog} onOpenChange={setShowNewIssueDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Report New Maintenance Issue</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={form.handleSubmit(handleNewIssue)}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="bikeId" className="text-right text-sm font-medium">
                  Bike ID
                </label>
                <select
                  id="bikeId"
                  className="col-span-3 p-2 border rounded"
                  {...form.register('bikeId')}
                >
                  <option value="">Select a bike</option>
                  {availableBikes.map((bike) => (
                    <option key={bike.id} value={bike.id}>
                      {bike.id} - {bike.model} ({bike.category})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="issue" className="text-right text-sm font-medium">
                  Issue Type
                </label>
                <select
                  id="issue"
                  className="col-span-3 p-2 border rounded"
                  {...form.register('issue')}
                >
                  <option value="">Select an issue</option>
                  {commonIssues.map((issue) => (
                    <option key={issue.id} value={issue.name}>
                      {issue.name} ({issue.category})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="priority" className="text-right text-sm font-medium">
                  Priority
                </label>
                <select
                  id="priority"
                  className="col-span-3 p-2 border rounded"
                  {...form.register('priority')}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <label htmlFor="description" className="text-right text-sm font-medium pt-2">
                  Description
                </label>
                <Textarea
                  id="description"
                  rows={4}
                  className="col-span-3"
                  placeholder="Provide details about the issue..."
                  {...form.register('description')}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowNewIssueDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Report</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaintenanceIssues;
