import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Pagination from '../../components/ui/Pagination';
import api from '../../utils/api';
import { formatDateTime } from '../../utils/helpers';

const AuditLogs = () => {
  const { user } = useSelector((state) => state.auth);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    action: '',
    page: 1
  });

  useEffect(() => {
    fetchLogs();
  }, [filters.page]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: filters.page,
        per_page: 20
      });

      const response = await api.get(`/admin/audit/logs?${params}`);
      setLogs(response.data.logs);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
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

  const getActionIcon = (action) => {
    if (action.includes('APPROVED')) return '✅';
    if (action.includes('REJECTED')) return '❌';
    if (action.includes('PENDING')) return '⏳';
    if (action.includes('REVIEW')) return '👁️';
    return '📄';
  };

  const getActionColor = (action) => {
    if (action.includes('APPROVED')) return 'text-green-600 bg-green-100';
    if (action.includes('REJECTED')) return 'text-red-600 bg-red-100';
    if (action.includes('PENDING')) return 'text-yellow-600 bg-yellow-100';
    if (action.includes('REVIEW')) return 'text-blue-600 bg-blue-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
        <p className="mt-2 text-gray-600">
          Track system activities and changes for compliance and monitoring
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <Card.Content className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search activities..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="pl-10"
              />
            </div>
            
            <Select
              options={[
                { value: '', label: 'All Actions' },
                { value: 'APPROVED', label: 'Approved' },
                { value: 'REJECTED', label: 'Rejected' },
                { value: 'REVIEW', label: 'Under Review' },
                { value: 'PENDING', label: 'Pending' }
              ]}
              value={filters.action}
              onChange={(e) => setFilters({...filters, action: e.target.value})}
              placeholder="Filter by action"
            />
            
            <div className="text-sm text-gray-600 flex items-center">
              <ClockIcon className="h-4 w-4 mr-2" />
              Last 30 days
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Logs List */}
      <Card>
        {loading ? (
          <div className="p-8">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{getActionIcon(log.action)}</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {log.entity_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {log.entity_type} #{log.entity_id}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{log.user}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                        {formatDateTime(log.timestamp)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {log.details.comments && (
                          <div className="mb-1">
                            <strong>Comment:</strong> {log.details.comments}
                          </div>
                        )}
                        {log.details.risk_score && (
                          <div>
                            <strong>Risk Score:</strong> {log.details.risk_score}%
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {pagination && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={(page) => setFilters({...filters, page})}
            totalItems={pagination.total}
            itemsPerPage={pagination.per_page}
          />
        )}
      </Card>
    </div>
  );
};

export default AuditLogs;