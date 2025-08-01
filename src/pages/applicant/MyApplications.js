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
  MapPinIcon,
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const MyApplications = () => {
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

  // Filter and sort applications
  const filteredApplications = applications
    .filter(app => {
      const matchesSearch = app.organization_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (app.acronym && app.acronym.toLowerCase().includes(searchTerm.toLowerCase()));
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
        default:
          return 0;
      }
    });

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'FBO_REVIEW', label: 'FBO Review' },
    { value: 'REVIEWING_AGAIN', label: 'Reviewing again' },
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
  ];

  // Get statistics for the dashboard
  const getStats = () => {
    const stats = {
      total: applications.length,
      pending: applications.filter(app => 
        ['PENDING', 'FBO_REVIEW', 'TRANSFER_TO_DM', 'DM_REVIEW', 'TRANSFER_TO_HOD', 
         'HOD_REVIEW', 'TRANSFER_TO_SG', 'SG_REVIEW', 'TRANSFER_TO_CEO', 'CEO_REVIEW'].includes(app.status)
      ).length,
      approved: applications.filter(app => app.status === 'APPROVED').length,
      certificateIssued: applications.filter(app => app.status === 'CERTIFICATE_ISSUED').length,
      rejected: applications.filter(app => app.status === 'REJECTED').length,
      missingDocs: applications.filter(app => app.status === 'REVIEWING_AGAIN').length,
    };
    return stats;
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="mt-2 text-gray-600">
          View and manage all your organization authorization applications
        </p>
      </div>

      {/* Statistics Cards */}
      {applications.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-500">Total</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
            <div className="text-sm text-gray-500">In Review</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.missingDocs}</div>
            <div className="text-sm text-gray-500">Reviewing Again</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-gray-500">Approved</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-700">{stats.certificateIssued}</div>
            <div className="text-sm text-gray-500">Certified</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-500">Rejected</div>
          </Card>
        </div>
      )}

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
            
            <Link to="/applicant/new-application">
              <Button className="w-full">
                New Application
              </Button>
            </Link>
          </div>
        </Card.Content>
      </Card>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <Card className="p-8 text-center">
          {applications.length === 0 ? (
            <>
              <DocumentIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-600 mb-4">
                Start your first application to get your religious organization authorized.
              </p>
              <Link to="/applicant/new-application">
                <Button>
                  Create New Application
                </Button>
              </Link>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No matching applications</h3>
              <p className="text-gray-600">
                Try adjusting your search terms or filters.
              </p>
            </>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => {
            const progress = getStatusProgress(application.status);
            
            return (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <Card.Content className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.organization_name}
                        </h3>
                        {application.acronym && (
                          <span className="text-sm text-gray-500">({application.acronym})</span>
                        )}
                        {application.certificate_number && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                            #{application.certificate_number}
                          </span>
                        )}
                        {application.canEdit && (
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            Editable
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Submitted:</span>{' '}
                          {new Date(application.submitted_at).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Last Modified:</span>{' '}
                          {new Date(application.last_modified).toLocaleDateString()}
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPinIcon className="h-4 w-4 text-gray-400" />
                          <span>
                            {application.district?.name || 'N/A'}, {application.district?.province?.name || 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-gray-700">Progress</span>
                          <span className="text-xs text-gray-500">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              application.status === 'REJECTED' ? 'bg-red-500' :
                              application.status === 'CERTIFICATE_ISSUED' ? 'bg-green-500' :
                              'bg-blue-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Show latest comment if available */}
                      {application.comments && application.comments.length > 0 && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Latest update:</span> {application.comments[0]?.content}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {application.comments[0]?.performed_by?.firstname} {application.comments[0]?.performed_by?.lastname} • {' '}
                            {new Date(application.comments[0]?.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 ml-6">
                      <div className="text-center">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusIcon(application.status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                            {formatStatus(application.status)}
                          </span>
                        </div>
                      </div>
                      
                      <Link to={`/applicant/applications/${application.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-1"
                        >
                          <EyeIcon className="h-4 w-4" />
                          <span>View</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;