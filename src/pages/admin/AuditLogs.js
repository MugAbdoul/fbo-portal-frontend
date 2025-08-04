import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as ClockSolidIcon,
  EyeIcon,
  DocumentCheckIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Pagination from '../../components/ui/Pagination';
import api from '../../utils/api';
import { formatDateTime } from '../../utils/helpers';

const AuditLogs = () => {
  const { user } = useSelector((state) => state.auth);
  const [allLogs, setAllLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedLog, setExpandedLog] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    action: '',
    page: 1
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    per_page: 10,
    total: 0
  });

  // Fetch logs from API once
  useEffect(() => {
    fetchLogs();
  }, []);

  // Apply filters whenever filters change or logs are loaded
  useEffect(() => {
    if (allLogs.length > 0) {
      applyFilters();
    }
  }, [allLogs, filters.action, filters.search, filters.page]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/audit/logs?per_page=100');
      setAllLogs(response.data.logs);
      setFilteredLogs(response.data.logs);
      setPagination({
        ...response.data.pagination,
        per_page: 10 // We'll handle pagination client-side with 10 items per page
      });
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      setAllLogs([]);
      setFilteredLogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply client-side filtering
  const applyFilters = () => {
    // Start with all logs
    let result = [...allLogs];
    
    // Apply action filter
    if (filters.action) {
      result = result.filter(log => 
        log.action.includes(filters.action) || 
        (log.details.status && log.details.status.includes(filters.action))
      );
    }
    
    // Apply search filter
    if (filters.search && filters.search.trim() !== '') {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(log => 
        log.entity_name.toLowerCase().includes(searchTerm) || 
        log.user.toLowerCase().includes(searchTerm)
      );
    }
    
    // Update pagination
    const totalItems = result.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pagination.per_page));
    
    setPagination({
      ...pagination,
      pages: totalPages,
      total: totalItems,
      page: filters.page > totalPages ? 1 : filters.page
    });
    
    // Apply pagination
    const startIndex = (filters.page - 1) * pagination.per_page;
    const paginatedResult = result.slice(startIndex, startIndex + pagination.per_page);
    
    // Update filtered logs
    setFilteredLogs(paginatedResult);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      search: '',
      action: '',
      page: 1
    });
  };

  // Format status text for better readability
  const formatStatus = (status) => {
    if (!status) return '';
    
    return status
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getActionIcon = (action) => {
    if (action.includes('APPROVED')) return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    if (action.includes('REJECTED')) return <XCircleIcon className="h-5 w-5 text-red-500" />;
    if (action.includes('PENDING')) return <ClockSolidIcon className="h-5 w-5 text-yellow-500" />;
    if (action.includes('REVIEW')) return <EyeIcon className="h-5 w-5 text-blue-500" />;
    if (action.includes('CERTIFICATE')) return <DocumentCheckIcon className="h-5 w-5 text-purple-500" />;
    if (action.includes('TRANSFER')) return <AdjustmentsHorizontalIcon className="h-5 w-5 text-indigo-500" />;
    return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
  };

  const getActionColor = (action) => {
    if (action.includes('APPROVED')) return 'text-green-700 bg-green-50 border-green-200';
    if (action.includes('REJECTED')) return 'text-red-700 bg-red-50 border-red-200';
    if (action.includes('PENDING')) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    if (action.includes('REVIEW')) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (action.includes('CERTIFICATE')) return 'text-purple-700 bg-purple-50 border-purple-200';
    if (action.includes('TRANSFER')) return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    return 'text-gray-700 bg-gray-50 border-gray-200';
  };

  const timeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    
    return formatDateTime(timestamp);
  };

  const toggleExpandLog = (id) => {
    if (expandedLog === id) {
      setExpandedLog(null);
    } else {
      setExpandedLog(id);
    }
  };

  // Only CEO and Secretary General can access audit logs
  if (!['CEO', 'SECRETARY_GENERAL'].includes(user?.role)) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 text-center">
          <DocumentTextIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only CEO and Secretary General can access audit logs.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
        <p className="mt-2 text-gray-600">
          Track system activities and changes for compliance and monitoring
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6 shadow-sm border border-gray-200">
        <Card.Content className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="relative md:col-span-5">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by entity name or user..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value, page: 1})}
                className="pl-10"
              />
            </div>
            
            <div className="md:col-span-4">
              <Select
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'PENDING', label: 'Pending' },
                  { value: 'REVIEWING_AGAIN', label: 'Reviewing Again' },
                  { value: 'FBO_REVIEW', label: 'FBO Review' },
                  { value: 'TRANSFER_TO_DM', label: 'Transfer to DM' },
                  { value: 'DM_REVIEW', label: 'DM Review' },
                  { value: 'TRANSFER_TO_HOD', label: 'Transfer to HOD' },
                  { value: 'HOD_REVIEW', label: 'HOD Review' },
                  { value: 'TRANSFER_TO_SG', label: 'Transfer to SG' },
                  { value: 'SG_REVIEW', label: 'SG Review' },
                  { value: 'TRANSFER_TO_CEO', label: 'Transfer to CEO' },
                  { value: 'CEO_REVIEW', label: 'CEO Review' },
                  { value: 'APPROVED', label: 'Approved' },
                  { value: 'REJECTED', label: 'Rejected' },
                  { value: 'CERTIFICATE_ISSUED', label: 'Certificate Issued' }
                ]}
                value={filters.action}
                onChange={(e) => setFilters({...filters, action: e.target.value, page: 1})}
                placeholder="Filter by status"
              />
            </div>
            
            <div className="md:col-span-3 flex items-center justify-between">
              <button 
                onClick={resetFilters}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <XMarkIcon className="h-4 w-4 mr-2" />
                Reset Filters
              </button>
              
              <div className="text-sm text-gray-600 flex items-center">
                <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Filtered:</span> {filteredLogs.length}/{allLogs.length}
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Logs List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="overflow-hidden shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLogs.length === 0 ? (
            <Card className="p-12 text-center shadow-sm border border-gray-200">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No audit logs found</h3>
              <p className="text-gray-500">Try adjusting your filters or search criteria</p>
            </Card>
          ) : (
            filteredLogs.map((log) => (
              <Card key={log.id} className="overflow-hidden shadow-sm border border-gray-200">
                <div 
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleExpandLog(log.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getActionIcon(log.action)}
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-gray-900">
                          {formatStatus(log.action.replace('Application ', ''))} for {log.entity_name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {log.entity_type} #{log.entity_id} • Performed by {log.user}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getActionColor(log.action)}`}>
                        {formatStatus(log.details.status || log.action.replace('Application ', ''))}
                      </span>
                      <span className="ml-4 text-sm text-gray-500 whitespace-nowrap">
                        {timeAgo(log.timestamp)}
                      </span>
                      <div className="ml-2">
                        {expandedLog === log.id ? 
                          <ChevronUpIcon className="h-5 w-5 text-gray-400" /> : 
                          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {expandedLog === log.id && log.details.comments && log.details.comments.length > 0 && (
                  <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Activity Timeline</h4>
                    <div className="space-y-4">
                      {log.details.comments.map((comment, index) => (
                        <div key={index} className="flex space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <UserIcon className="h-4 w-4 text-gray-600" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {comment.performed_by.firstname} {comment.performed_by.lastname}
                              <span className="text-xs font-normal text-gray-500 ml-2">
                                ({formatStatus(comment.performed_by.role)})
                              </span>
                            </div>
                            <div className="mt-1 text-sm text-gray-700 bg-white p-3 rounded-md border border-gray-200">
                              {comment.content}
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                              {formatDateTime(comment.created_at)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
          
          {pagination && pagination.pages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={(page) => setFilters({...filters, page})}
              totalItems={pagination.total}
              itemsPerPage={pagination.per_page}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AuditLogs;