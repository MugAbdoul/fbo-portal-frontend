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
  MapPinIcon,
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
        return 'text-green-700 bg-green-100';
      case 'REJECTED':
        return 'text-red-700 bg-red-100';
      case 'REVIEWING_AGAIN':
        return 'text-yellow-700 bg-yellow-100';
      default:
        return 'text-blue-700 bg-blue-100';
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

  // Updated stats calculation with new status values
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

  // Fixed: Create a copy of the array before sorting
  const getRecentActivity = () => {
    return [...applications] // Create a copy using spread operator
      .sort((a, b) => new Date(b.last_modified) - new Date(a.last_modified))
      .slice(0, 5);
  };

  const recentActivity = getRecentActivity();

  // Fixed: Create a copy for filtering as well
  const attentionApplications = [...applications].filter(app => 
    app.status === 'REVIEWING_AGAIN' || (app.canEdit && app.status === 'PENDING')
  );

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600 mt-1">Total Applications</div>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600 mt-1">In Review</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600">{stats.missingDocs}</div>
            <div className="text-sm text-gray-600 mt-1">Missing Documents</div>
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

      {/* Recent Activity */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
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
            {recentActivity.slice(0, 3).map((application) => {
              const progress = getStatusProgress(application.status);
              
              return (
                <Card key={application.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
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
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Submitted:</span>{' '}
                          {new Date(application.submitted_at).toLocaleDateString()}
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
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusIcon(application.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                            {formatStatus(application.status)}
                          </span>
                        </div>
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
              );
            })}
          </div>
        )}
      </div>

      {/* Applications Requiring Attention */}
      {attentionApplications.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Requires Your Attention</h2>
          <div className="space-y-4">
            {attentionApplications
              .slice(0, 2)
              .map((application) => (
                <Card key={application.id} className="p-6 border-yellow-200 bg-yellow-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.organization_name}
                        </h3>
                        {application.acronym && (
                          <span className="text-sm text-gray-500">({application.acronym})</span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600">
                        {application.status === 'REVIEWING_AGAIN' 
                          ? 'Please upload the required documents to continue the review process.'
                          : 'Your application is ready for submission.'
                        }
                      </p>
                    </div>
                    
                    <Link to={`/applicant/applications/${application.id}`}>
                      <Button size="sm">
                        {application.status === 'REVIEWING_AGAIN' ? 'Upload Documents' : 'Complete Application'}
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;