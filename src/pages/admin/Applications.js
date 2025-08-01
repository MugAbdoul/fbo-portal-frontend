import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getApplications } from '../../redux/slices/applicationSlice';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentIcon,
  ArrowDownTrayIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const Applications = () => {
  const dispatch = useDispatch();
  const { applications, loading } = useSelector((state) => state.applications);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    dispatch(getApplications());
  }, [dispatch]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'CERTIFICATE_ISSUED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'REJECTED':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'REVIEWING_AGAIN':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'CERTIFICATE_ISSUED':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'REJECTED':
        return 'text-red-700 bg-red-100 border-red-200';
      case 'REVIEWING_AGAIN':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      default:
        return 'text-blue-700 bg-blue-100 border-blue-200';
    }
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusProgress = (status) => {
    const progressMap = {
      'PENDING': 10,
      'FBO_REVIEW': 20,
      'REVIEWING_AGAIN': 15,
      'TRANSFER_TO_DM': 30,
      'DM_REVIEW': 35,
      'TRANSFER_TO_HOD': 45,
      'HOD_REVIEW': 50,
      'TRANSFER_TO_SG': 60,
      'SG_REVIEW': 65,
      'TRANSFER_TO_CEO': 75,
      'CEO_REVIEW': 80,
      'APPROVED': 90,
      'CERTIFICATE_ISSUED': 100,
      'REJECTED': 0
    };
    return progressMap[status] || 0;
  };

  // Filter and sort applications - Fixed with spread operator
  const filteredApplications = [...applications]
    .filter(app => {
      const matchesSearch = app.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (app.acronym && app.acronym.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (app.applicant?.firstname && `${app.applicant.firstname} ${app.applicant.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (app.district?.name && app.district.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (app.district?.province?.name && app.district.province.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = !statusFilter || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.submitted_at) - new Date(a.submitted_at);
        case 'oldest':
          return new Date(a.submitted_at) - new Date(b.submitted_at);
        case 'name':
          return a.organization_name.localeCompare(b.organization_name);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'progress':
          return getStatusProgress(b.status) - getStatusProgress(a.status);
        case 'location':
          const aLocation = `${a.district?.province?.name || ''} ${a.district?.name || ''}`;
          const bLocation = `${b.district?.province?.name || ''} ${b.district?.name || ''}`;
          return aLocation.localeCompare(bLocation);
        default:
          return 0;
      }
    });

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'FBO_REVIEW', label: 'FBO Review' },
    { value: 'REVIEWING_AGAIN', label: 'Review Again' },
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
    { value: 'CERTIFICATE_ISSUED', label: 'Certificate Issued' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name', label: 'Organization Name' },
    { value: 'status', label: 'Status' },
    { value: 'progress', label: 'Progress' },
    { value: 'location', label: 'Location' },
  ];

  const exportApplications = () => {
    // Create CSV content
    const headers = ['Organization Name', 'Applicant', 'Status', 'Progress (%)', 'Location', 'Submitted Date', 'Email', 'Phone'];
    const csvContent = [
      headers.join(','),
      ...filteredApplications.map(app => [
        `"${app.organization_name}"`,
        `"${app.applicant?.firstname || ''} ${app.applicant?.lastname || ''}"`,
        app.status,
        getStatusProgress(app.status),
        `"${app.district?.province?.name || 'N/A'}, ${app.district?.name || 'N/A'}"`,
        new Date(app.submitted_at).toLocaleDateString(),
        app.organization_email,
        app.organization_phone
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `applications_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate statistics
  const stats = {
    total: applications.length,
    pending: applications.filter(app => 
      [
        'PENDING', 
        'FBO_REVIEW', 
        'TRANSFER_TO_DM', 
        'DM_REVIEW', 
        'TRANSFER_TO_HOD', 
        'HOD_REVIEW', 
        'TRANSFER_TO_SG', 
        'SG_REVIEW', 
        'TRANSFER_TO_CEO', 
        'CEO_REVIEW'
      ].includes(app.status)
    ).length,
    approved: applications.filter(app => app.status === 'APPROVED' || app.status === 'CERTIFICATE_ISSUED').length,
    rejected: applications.filter(app => app.status === 'REJECTED').length,
    missingDocs: applications.filter(app => app.status === 'REVIEWING_AGAIN').length,
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
        <p className="mt-2 text-gray-600">
          Review and manage religious organization authorization applications
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-500">Total</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-500">In Review</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.missingDocs}</div>
          <div className="text-sm text-gray-500">Reviewing Again</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          <div className="text-sm text-gray-500">Approved</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-sm text-gray-500">Rejected</div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <Card.Content className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              placeholder="Filter by status"
            />
            
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            />
            
            <Button
              onClick={exportApplications}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span>Export CSV</span>
            </Button>
          </div>
        </Card.Content>
      </Card>

      {/* Results Summary */}
      <div className="mb-6 text-sm text-gray-600">
        Showing {filteredApplications.length} of {applications.length} applications
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <Card className="p-8 text-center">
          <DocumentIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600">
            {applications.length === 0 
              ? 'No applications have been submitted yet.'
              : 'No applications match your current filters.'
            }
          </p>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((application) => {
                  const progress = getStatusProgress(application.status);
                  
                  return (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {application.organization_name}
                          </div>
                          {application.acronym && (
                            <div className="text-sm text-gray-500">
                              ({application.acronym})
                            </div>
                          )}
                          {application.certificate_number && (
                            <div className="text-xs text-green-600 font-medium">
                              #{application.certificate_number}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {application.applicant?.firstname} {application.applicant?.lastname}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.applicant?.title}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(application.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                            {formatStatus(application.status)}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                application.status === 'REJECTED' ? 'bg-red-500' :
                                application.status === 'CERTIFICATE_ISSUED' ? 'bg-green-500' :
                                'bg-blue-500'
                              }`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{progress}%</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1 text-sm text-gray-900">
                          <MapPinIcon className="h-4 w-4 text-gray-400" />
                          <div>
                            <div>{application.district?.name || 'N/A'}</div>
                            <div className="text-xs text-gray-500">
                              {application.district?.province?.name || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{new Date(application.submitted_at).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(application.submitted_at).toLocaleTimeString()}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {application.organization_email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.organization_phone}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {
                          application.canEdit ?
                          (
                            <Link to={`/admin/applications/${application.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center space-x-1"
                              >
                                <EyeIcon className="h-4 w-4" />
                                <span>Review</span>
                              </Button>
                            </Link>
                          ) :

                          (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center space-x-1"
                                disabled={true}
                              >
                                <EyeIcon className="h-4 w-4" />
                                <span>Review</span>
                              </Button>
                          )
                        }
                        
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Applications;