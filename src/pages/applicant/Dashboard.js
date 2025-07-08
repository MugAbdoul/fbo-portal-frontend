import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getApplications } from '../../redux/slices/applicationSlice';
import {
  DocumentPlusIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FolderIcon,
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { applications, loading } = useSelector((state) => state.applications);

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
        return 'text-green-700 bg-green-100';
      case 'REJECTED':
        return 'text-red-700 bg-red-100';
      case 'MISSING_DOCUMENTS':
        return 'text-yellow-700 bg-yellow-100';
      default:
        return 'text-blue-700 bg-blue-100';
    }
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(app => 
      ['PENDING', 'UNDER_REVIEW', 'DRAFT', 'DM_REVIEW', 'HOD_REVIEW', 'SG_REVIEW', 'CEO_REVIEW'].includes(app.status)
    ).length,
    approved: applications.filter(app => app.status === 'APPROVED' || app.status === 'CERTIFICATE_ISSUED').length,
    rejected: applications.filter(app => app.status === 'REJECTED').length,
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstname}!
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your religious organization applications and track their progress.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <DocumentPlusIcon className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">New Application</h3>
                <p className="text-sm text-gray-600">Start a new authorization request</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/applicant/new-application">
                <Button className="w-full">
                  Start Application
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <FolderIcon className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">My Applications</h3>
                <p className="text-sm text-gray-600">View all your applications</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/applicant/applications">
                <Button variant="outline" className="w-full">
                  View Applications
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-purple-600 mr-4" />
              <div>
                <h3 className="font-semibold text-gray-900">Verify Certificate</h3>
                <p className="text-sm text-gray-600">Verify a certificate online</p>
              </div>
            </div>
            <div className="mt-4">
              <Link to="/verify">
                <Button variant="outline" className="w-full">
                  Verify Now
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600 mt-1">Total Applications</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600 mt-1">Pending Review</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-gray-600 mt-1">Approved</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-600 mt-1">Rejected</div>
          </Card>
        </div>
      </div>

      {/* Recent Applications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
          <Link to="/applicant/applications">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>

        {loading ? (
          <Card className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </Card>
        ) : applications.length === 0 ? (
          <Card className="p-8 text-center">
            <DocumentPlusIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600 mb-4">
              Start your first application to get your religious organization authorized.
            </p>
            <Link to="/applicant/new-application">
              <Button>
                Create New Application
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.slice(0, 3).map((application) => (
              <Card key={application.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {application.organization_name}
                      </h3>
                      {application.acronym && (
                        <span className="text-sm text-gray-500">({application.acronym})</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Submitted on {new Date(application.submitted_at).toLocaleDateString()}
                    </p>
                    {application.comments && (
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>Latest comment:</strong> {application.comments}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(application.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {formatStatus(application.status)}
                      </span>
                    </div>
                    
                    <Link to={`/applicant/applications/${application.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        View Details
                      </Button>
                    </Link>
                    
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;