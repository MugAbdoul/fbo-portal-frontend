import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getApplications, getApplicationStats } from '../../redux/slices/applicationSlice';
import {
  FolderIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { applications, stats, loading } = useSelector((state) => state.applications);

  useEffect(() => {
    dispatch(getApplications());
    dispatch(getApplicationStats());
  }, [dispatch]);

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'FBO_OFFICER':
        return 'FBO Officer';
      case 'DIVISION_MANAGER':
        return 'Division Manager';
      case 'HOD':
        return 'Head of Department';
      case 'SECRETARY_GENERAL':
        return 'Secretary General';
      case 'CEO':
        return 'Chief Executive Officer';
      default:
        return role;
    }
  };

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

  // Prepare chart data
  const statusData = stats?.by_status ? Object.entries(stats.by_status).map(([status, count]) => ({
    name: formatStatus(status),
    value: count,
  })) : [];

  const monthlyData = stats?.monthly || [];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  // Quick stats for the current user's role
  const getQuickStats = () => {
    if (!stats) return [];

    const baseStats = [
      {
        name: 'Pending Review',
        value: stats.pending_review || 0,
        icon: ClockIcon,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
      },
    ];

    if (user?.role === 'CEO') {
      return [
        {
          name: 'Total Applications',
          value: stats.total_applications || 0,
          icon: FolderIcon,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
        },
        ...baseStats,
        {
          name: 'Approved',
          value: stats.approved || 0,
          icon: CheckCircleIcon,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
        },
        {
          name: 'Rejected',
          value: stats.rejected || 0,
          icon: ExclamationTriangleIcon,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
        },
      ];
    }

    return baseStats;
  };

  const quickStats = getQuickStats();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {user?.firstname}! Here's what's happening with applications.
        </p>
        <div className="mt-2 text-sm text-gray-500">
          Role: {getRoleDisplayName(user?.role)}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Applications by Status Chart */}
        {user?.role === 'CEO' && statusData.length > 0 && (
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Applications by Status</h3>
            </Card.Header>
            <Card.Content>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Content>
          </Card>
        )}

        {/* Monthly Applications Chart */}
        {user?.role === 'CEO' && monthlyData.length > 0 && (
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Monthly Applications</h3>
            </Card.Header>
            <Card.Content>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Content>
          </Card>
        )}
      </div>

      {/* Recent Applications */}
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Applications</h3>
            <Link to="/admin/applications">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </Card.Header>
        <Card.Content>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8">
              <FolderIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications</h3>
              <p className="text-gray-600">
                No applications are currently assigned to your review queue.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden">
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
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Score
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.slice(0, 5).map((application) => (
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
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {application.applicant?.firstname} {application.applicant?.lastname}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.applicant?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(application.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                            {formatStatus(application.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(application.submitted_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {application.risk_score?.toFixed(1)}%
                        </div>
                        <div className={`text-xs ${
                          application.risk_score > 70 ? 'text-red-600' :
                          application.risk_score > 40 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {application.risk_score > 70 ? 'High' :
                           application.risk_score > 40 ? 'Medium' : 'Low'} Risk
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link to={`/admin/applications/${application.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-1"
                          >
                            <EyeIcon className="h-4 w-4" />
                            <span>View</span>
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
};

export default AdminDashboard;