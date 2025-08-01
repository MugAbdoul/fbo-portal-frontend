import React, { useEffect, useState } from 'react';
import {
  DocumentArrowDownIcon,
  ChartBarIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  MapPinIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell} from 'recharts';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [reportParams, setReportParams] = useState({
    reportType: 'summary',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0],
    status: '',
    format: 'pdf'
  });
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchReportStats = async () => {
      try {
        const response = await api.get('/reports/stats');
          
        const data = await response.data;
        setReportData(data);
      } catch (error) {
        toast.error(error.message || 'Failed to fetch report data');
      }
    };
    
    fetchReportStats();
  }, []);

  const reportTypes = [
    { value: 'summary', label: 'Application Summary Report' },
    { value: 'detailed', label: 'Detailed Application Report' },
    { value: 'analytics', label: 'Analytics Report' },
    { value: 'compliance', label: 'Compliance Report' },
    { value: 'demographic', label: 'Demographic Report' },
    { value: 'processing', label: 'Processing Efficiency Report' },
    { value: 'geographic', label: 'Geographic Distribution Report' },
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'FBO_REVIEW', label: 'FBO Review' },
    { value: 'PASTOR_DOCUMENT', label: 'Missing Documents' },
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

  const formatOptions = [
    { value: 'pdf', label: 'PDF' },
    { value: 'excel', label: 'Excel' },
    { value: 'csv', label: 'CSV' },
  ];

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const response = await api.post(
        '/reports/generate',
        reportParams,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const filename = `${reportParams.reportType}_${reportParams.startDate}_${reportParams.endDate}.${reportParams.format}`;

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Report generated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  // Get color based on status
  const getStatusColor = (status) => {
    const colors = {
      'PENDING': '#3B82F6',
      'FBO_REVIEW': '#F59E0B', 
      'PASTOR_DOCUMENT': '#6B7280',
      'TRANSFER_TO_DM': '#8B5CF6',
      'DM_REVIEW': '#8B5CF6',
      'TRANSFER_TO_HOD': '#06B6D4',
      'HOD_REVIEW': '#06B6D4',
      'TRANSFER_TO_SG': '#EC4899',
      'SG_REVIEW': '#EC4899',
      'TRANSFER_TO_CEO': '#F97316',
      'CEO_REVIEW': '#F97316',
      'APPROVED': '#10B981',
      'REJECTED': '#EF4444',
      'CERTIFICATE_ISSUED': '#22C55E',
    };
    
    return colors[status] || '#6B7280';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#10B981'; // Green
    if (progress >= 60) return '#3B82F6'; // Blue
    if (progress >= 40) return '#F59E0B'; // Yellow
    if (progress >= 20) return '#F97316'; // Orange
    return '#6B7280'; // Gray
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="mt-2 text-gray-600">
          Generate reports and view analytics for application processing
        </p>
      </div>

      {/* Report Generation */}
      <Card className="mb-8">
        <Card.Header>
          <div className="flex items-center space-x-2">
            <DocumentArrowDownIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Generate Custom Report</h2>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Select
              label="Report Type"
              options={reportTypes}
              value={reportParams.reportType}
              onChange={(e) => setReportParams({...reportParams, reportType: e.target.value})}
            />
            
            <Input
              label="Start Date"
              type="date"
              value={reportParams.startDate}
              onChange={(e) => setReportParams({...reportParams, startDate: e.target.value})}
            />
            
            <Input
              label="End Date"
              type="date"
              value={reportParams.endDate}
              onChange={(e) => setReportParams({...reportParams, endDate: e.target.value})}
            />
            
            <Select
              label="Status Filter"
              options={statusOptions}
              value={reportParams.status}
              onChange={(e) => setReportParams({...reportParams, status: e.target.value})}
            />
            
            <Select
              label="Format"
              options={formatOptions}
              value={reportParams.format}
              onChange={(e) => setReportParams({...reportParams, format: e.target.value})}
            />
          </div>
          
          <Button
            onClick={handleGenerateReport}
            loading={generating}
            className="flex items-center space-x-2"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            <span>Generate Report</span>
          </Button>
        </Card.Content>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{reportData?.overview?.total_applications || 0}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{reportData?.overview?.in_progress || 0}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{reportData?.overview?.approved || 0}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="bg-emerald-100 p-3 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Certificates Issued</p>
              <p className="text-2xl font-bold text-gray-900">{reportData?.overview?.certificate_issued || 0}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{reportData?.overview?.rejected || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts - First Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Application Status Distribution */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Application Status Distribution</h3>
          </Card.Header>
          <Card.Content>
            {reportData?.status_distribution ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(reportData.status_distribution).map(([status, count]) => ({
                      name: status.replace(/_/g, ' '),
                      value: count,
                      color: getStatusColor(status)
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.entries(reportData.status_distribution).map(([status, _], index) => (
                      <Cell key={`cell-${index}`} fill={getStatusColor(status)} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-gray-500">
                Loading data...
              </div>
            )}
          </Card.Content>
        </Card>

        {/* Applications by Province */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Applications by Province</h3>
          </Card.Header>
          <Card.Content>
            {reportData?.province_distribution ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.province_distribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="province" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-gray-500">
                Loading data...
              </div>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* Charts - Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Applications */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Monthly Application Trends</h3>
          </Card.Header>
          <Card.Content>
            {reportData?.monthly_trends ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reportData.monthly_trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-gray-500">
                Loading data...
              </div>
            )}
          </Card.Content>
        </Card>

        {/* Processing Time by Stage */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Average Processing Time by Stage</h3>
          </Card.Header>
          <Card.Content>
            {reportData?.processing_time ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.processing_time}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} days`, 'Average Days']} />
                  <Bar dataKey="avgDays" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-gray-500">
                Loading data...
              </div>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* Charts - Third Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Applications by District (Top 10) */}
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <MapPinIcon className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold">Top Districts by Applications</h3>
            </div>
          </Card.Header>
          <Card.Content>
            {reportData?.district_distribution ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.district_distribution.slice(0, 10)} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="district" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-gray-500">
                Loading data...
              </div>
            )}
          </Card.Content>
        </Card>

        {/* Applications by Age Group */}
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <UserGroupIcon className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Applications by Age Group</h3>
            </div>
          </Card.Header>
          <Card.Content>
            {reportData?.age_distribution ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.age_distribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age_group" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#EC4899" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-gray-500">
                Loading data...
              </div>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* Charts - Fourth Row */}
      <div className="grid grid-cols-1 gap-8 mb-8">
        {/* Application Progress Distribution */}
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">Application Progress Distribution</h3>
            </div>
          </Card.Header>
          <Card.Content>
            {reportData?.progress_distribution ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.progress_distribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="progress_range" />
                  <YAxis label={{ value: 'Number of Applications', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${value}`, 'Applications']} />
                  <Bar dataKey="count" fill="#06B6D4">
                    {reportData.progress_distribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getProgressColor(parseInt(entry.progress_range.split('-')[1]) || 0)} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-gray-500">
                Loading data...
              </div>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* Report Templates */}
      <Card className="mt-8">
        <Card.Header>
          <h3 className="text-lg font-semibold">Quick Report Templates</h3>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="p-4 h-auto flex flex-col items-center space-y-2"
              onClick={() => {
                setReportParams({
                  ...reportParams,
                  reportType: 'summary',
                  startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  endDate: new Date().toISOString().split('T')[0],
                  format: 'pdf'
                });
                handleGenerateReport();
              }}
            >
              <CalendarIcon className="h-8 w-8 text-blue-600" />
              <span className="font-medium">Weekly Summary</span>
              <span className="text-sm text-gray-500">Last 7 days report</span>
            </Button>
            
            <Button
              variant="outline"
              className="p-4 h-auto flex flex-col items-center space-y-2"
              onClick={() => {
                setReportParams({
                  ...reportParams,
                  reportType: 'detailed',
                  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  endDate: new Date().toISOString().split('T')[0],
                  format: 'pdf'
                });
                handleGenerateReport();
              }}
            >
              <DocumentArrowDownIcon className="h-8 w-8 text-green-600" />
              <span className="font-medium">Monthly Detailed</span>
              <span className="text-sm text-gray-500">Last 30 days detailed report</span>
            </Button>
            
            <Button
              variant="outline"
              className="p-4 h-auto flex flex-col items-center space-y-2"
              onClick={() => {
                setReportParams({
                  ...reportParams,
                  reportType: 'analytics',
                  startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  endDate: new Date().toISOString().split('T')[0],
                  format: 'pdf'
                });
                handleGenerateReport();
              }}
            >
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
              <span className="font-medium">Quarterly Analytics</span>
              <span className="text-sm text-gray-500">Last 90 days analytics</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Button
              variant="outline"
              className="p-4 h-auto flex flex-col items-center space-y-2"
              onClick={() => {
                setReportParams({
                  ...reportParams,
                  reportType: 'processing',
                  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  endDate: new Date().toISOString().split('T')[0],
                  format: 'excel'
                });
                handleGenerateReport();
              }}
            >
              <ClockIcon className="h-8 w-8 text-yellow-600" />
              <span className="font-medium">Processing Efficiency</span>
              <span className="text-sm text-gray-500">Review time analysis</span>
            </Button>
            
            <Button
              variant="outline"
              className="p-4 h-auto flex flex-col items-center space-y-2"
              onClick={() => {
                setReportParams({
                  ...reportParams,
                  reportType: 'demographic',
                  startDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  endDate: new Date().toISOString().split('T')[0],
                  format: 'excel'
                });
                handleGenerateReport();
              }}
            >
              <UserGroupIcon className="h-8 w-8 text-indigo-600" />
              <span className="font-medium">Demographic Report</span>
              <span className="text-sm text-gray-500">Applicant demographics</span>
            </Button>
            
            <Button
              variant="outline"
              className="p-4 h-auto flex flex-col items-center space-y-2"
              onClick={() => {
                setReportParams({
                  ...reportParams,
                  reportType: 'geographic',
                  startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  endDate: new Date().toISOString().split('T')[0],
                  format: 'excel'
                });
                handleGenerateReport();
              }}
            >
              <MapPinIcon className="h-8 w-8 text-green-600" />
              <span className="font-medium">Geographic Distribution</span>
              <span className="text-sm text-gray-500">Province & district analysis</span>
            </Button>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Reports;