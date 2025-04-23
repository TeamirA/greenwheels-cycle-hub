
import { useState, useEffect } from 'react';
import { users as initialUsers } from '@/data/mockData';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Search, UserCheck, UserX } from 'lucide-react';

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'verify' | 'delete'>('verify');

  const usersPerPage = 10;

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = [...users];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term)
      );
    }
    
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    if (verificationFilter !== 'all') {
      const isVerified = verificationFilter === 'verified';
      filtered = filtered.filter(user => user.verified === isVerified);
    }
    
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [users, searchTerm, roleFilter, verificationFilter]);

  // Paginate users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map(user => user.id));
    }
  };

  const showVerifyConfirmation = () => {
    if (selectedUsers.length === 0) {
      toast({
        title: 'No users selected',
        description: 'Please select users to verify',
        variant: 'destructive',
      });
      return;
    }
    setConfirmAction('verify');
    setShowConfirmDialog(true);
  };

  const showDeleteConfirmation = () => {
    if (selectedUsers.length === 0) {
      toast({
        title: 'No users selected',
        description: 'Please select users to delete',
        variant: 'destructive',
      });
      return;
    }
    setConfirmAction('delete');
    setShowConfirmDialog(true);
  };

  const handleConfirmAction = () => {
    if (confirmAction === 'verify') {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          selectedUsers.includes(user.id)
            ? { ...user, verified: true }
            : user
        )
      );
      toast({
        title: 'Users Verified',
        description: `${selectedUsers.length} users have been verified`,
        variant: 'default',
      });
    } else {
      setUsers(prevUsers => 
        prevUsers.filter(user => !selectedUsers.includes(user.id))
      );
      toast({
        title: 'Users Deleted',
        description: `${selectedUsers.length} users have been deleted`,
        variant: 'default',
      });
    }
    
    setSelectedUsers([]);
    setShowConfirmDialog(false);
  };

  const cancelConfirmation = () => {
    setShowConfirmDialog(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white">User Management</h1>
        <p className="text-muted-foreground dark:text-gray-400">Manage all users in the GreenWheels system</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between space-y-3 md:space-y-0 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-graydark/60 dark:text-gray-400" size={16} />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-64 text-graydark dark:text-white dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-graydark dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="station-admin">Station Admin</option>
              <option value="staff">Staff</option>
              <option value="maintenance">Maintenance</option>
              <option value="user">User</option>
            </select>
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-graydark dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={showVerifyConfirmation}
              disabled={selectedUsers.length === 0}
              className="flex items-center dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <UserCheck size={16} className="mr-1" />
              Verify Selected
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={showDeleteConfirmation}
              disabled={selectedUsers.length === 0}
              className="flex items-center"
            >
              <UserX size={16} className="mr-1" />
              Delete Selected
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-greenprimary focus:ring-greenprimary dark:bg-gray-600 dark:border-gray-500"
                    />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider dark:text-gray-300">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider dark:text-gray-300">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider dark:text-gray-300">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider dark:text-gray-300">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-graydark uppercase tracking-wider dark:text-gray-300">
                  Join Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="rounded border-gray-300 text-greenprimary focus:ring-greenprimary dark:bg-gray-600 dark:border-gray-500"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-graydark dark:text-white">
                    {user.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-graydark dark:text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-graydark dark:text-gray-300">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${user.role === 'admin' ? 'bg-greenprimary/20 text-greenprimary dark:bg-greenprimary/40' : 
                      user.role === 'station-admin' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      user.role === 'staff' ? 'bg-greenaccent/30 text-graydark dark:bg-greenaccent/50 dark:text-gray-200' : 
                      user.role === 'maintenance' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-graydark dark:text-gray-300">
                    {user.verified ? (
                      <span className="flex items-center text-greenprimary dark:text-green-400">
                        <Check size={16} className="mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center text-error dark:text-red-400">
                        <X size={16} className="mr-1" />
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-graydark dark:text-gray-300">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-graydark dark:text-gray-400">
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? 
                    "bg-greenprimary hover:bg-greenprimary/80" : 
                    "dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4 dark:text-white">
              {confirmAction === 'verify' ? 'Confirm Verification' : 'Confirm Deletion'}
            </h3>
            <p className="mb-6 dark:text-gray-300">
              {confirmAction === 'verify' 
                ? `Are you sure you want to verify ${selectedUsers.length} selected user(s)?` 
                : `Are you sure you want to delete ${selectedUsers.length} selected user(s)?`}
              <br />
              <span className="text-sm text-red-500 mt-2 block">This action cannot be undone.</span>
            </p>
            
            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={cancelConfirmation}
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                Cancel
              </Button>
              <Button 
                variant={confirmAction === 'verify' ? "default" : "destructive"}
                onClick={handleConfirmAction}
              >
                {confirmAction === 'verify' ? 'Verify' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
