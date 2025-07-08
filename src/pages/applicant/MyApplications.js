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
      case 'MISSING_DOCUMENTS':
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
      case 'MISSING_DOCUMENTS':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      default:
        return 'text-blue-700 bg-blue-100 border-blue-200';
    }
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const getRiskLevel = (score) => {
    if (score > 70) return { level: 'High', color: 'text-red-600' };
    if (score > 40) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'Low', color: 'text-green-600' };
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
    { value: 'UNDER_REVIEW', label: 'Under Review' },
    { value: 'MISSING_DOCUMENTS', label: 'Missing Documents' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'DM_REVIEW', label: 'DM Review' },
    { value: 'HOD_REVIEW', label: 'HOD Review' },
    { value: 'SG_REVIEW', label: 'SG Review' },
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
            const riskInfo = getRiskLevel(application.risk_score);
            
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
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Submitted:</span>{' '}
                          {new Date(application.submitted_at).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Last Modified:</span>{' '}
                          {new Date(application.last_modified).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Risk Score:</span>{' '}
                          <span className={riskInfo.color}>
                            {application.risk_score?.toFixed(1)}% ({riskInfo.level})
                          </span>
                        </div>
                      </div>
                      
                      {application.comments && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Latest comment:</span> {application.comments}
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
                      
                      <Link
                        to={`/applicant/applications/${application.id}`}
                      >
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