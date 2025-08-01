import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { 
  getApplicationById, 
  updateApplicationStatus,
  getDocumentRequirements,
  getApplicationComments,
  addApplicationComment
} from '../../redux/slices/applicationSlice';
import {
  ArrowLeftIcon,
  DocumentIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftEllipsisIcon,
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const AdminApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentApplication, documentRequirements, applicationComments, loading } = useSelector(
    (state) => state.applications
  );
  const { user } = useSelector((state) => state.auth);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const {
    register: registerComment,
    handleSubmit: handleCommentSubmit,
    reset: resetComment,
    formState: { errors: commentErrors },
  } = useForm();

  const selectedStatus = watch('status');

  useEffect(() => {
    if (id) {
      dispatch(getApplicationById(id));
      dispatch(getDocumentRequirements(id));
      dispatch(getApplicationComments(id));
    }
  }, [dispatch, id]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'CERTIFICATE_ISSUED':
        return <CheckCircleIcon className="h-8 w-8 text-green-500" />;
      case 'REJECTED':
        return <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />;
      case 'PASTOR_DOCUMENT':
        return <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />;
      default:
        return <ClockIcon className="h-8 w-8 text-blue-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'CERTIFICATE_ISSUED':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'REJECTED':
        return 'text-red-700 bg-red-100 border-red-200';
      case 'PASTOR_DOCUMENT':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      default:
        return 'text-blue-700 bg-blue-100 border-blue-200';
    }
  };

  useEffect(()=> {

    const onStatusISubmit = async (status) => {
      try {
        await dispatch(updateApplicationStatus({
          applicationId: id,
          status: status,
          comment: ''
        })).unwrap();
      } catch (error) {
      console.log(error.error || 'Failed to update status');
      }
    };

    let status = currentApplication?.status;
    if (status === 'PENDING')
      status = 'FBO_REVIEW'
    else if (status === 'TRANSFER_TO_DM')
      status = 'DM_REVIEW'
    else if (status === 'TRANSFER_TO_HOD')
      status = 'HOD_REVIEW'
    else if (status === 'TRANSFER_TO_SG')
      status = 'SG_REVIEW'
    else if (status === 'TRANSFER_TO_CEO')
      status = 'CEO_REVIEW'

    onStatusISubmit(status)
  
  }, [id, currentApplication])

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get valid status transitions based on current status and user role
  const getValidStatusOptions = () => {
    if (!currentApplication || !user) return [];

    const validTransitions = {
      'FBO_OFFICER': {
        'PENDING': ['TRANSFER_TO_DM', 'PASTOR_DOCUMENT'],
        'FBO_REVIEW': ['TRANSFER_TO_DM', 'PASTOR_DOCUMENT'],
        'PASTOR_DOCUMENT': ['FBO_REVIEW']
      },
      'DIVISION_MANAGER': {
        'TRANSFER_TO_DM': ['DM_REVIEW'],
        'DM_REVIEW': ['TRANSFER_TO_HOD', 'PASTOR_DOCUMENT']
      },
      'HOD': {
        'TRANSFER_TO_HOD': ['HOD_REVIEW'],
        'HOD_REVIEW': ['TRANSFER_TO_SG', 'PASTOR_DOCUMENT']
      },
      'SECRETARY_GENERAL': {
        'TRANSFER_TO_SG': ['SG_REVIEW'],
        'SG_REVIEW': ['TRANSFER_TO_CEO', 'PASTOR_DOCUMENT', 'REJECTED']
      },
      'CEO': {
        'TRANSFER_TO_CEO': ['CEO_REVIEW'],
        'CEO_REVIEW': ['APPROVED', 'REJECTED']
      }
    };

    const userTransitions = validTransitions[user.role];
    if (!userTransitions || !userTransitions[currentApplication.status]) {
      return [];
    }

    return userTransitions[currentApplication.status].map(status => ({
      value: status,
      label: formatStatus(status)
    }));
  };

  

  const onStatusSubmit = async (data) => {
    setIsUpdatingStatus(true);
    try {
      await dispatch(updateApplicationStatus({
        applicationId: id,
        status: data.status,
        comment: data.comment || ''
      })).unwrap();
      
      toast.success('Application status updated successfully!');
      reset(); // Clear form after successful update
      // Refresh comments to show the new status change comment
      dispatch(getApplicationComments(id));
    } catch (error) {
      toast.error(error.error || 'Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const onCommentSubmit = async (data) => {
    setIsAddingComment(true);
    try {
      await dispatch(addApplicationComment({
        applicationId: id,
        content: data.content
      })).unwrap();
      
      toast.success('Comment added successfully!');
      resetComment(); // Clear comment form
      // Refresh comments
      dispatch(getApplicationComments(id));
    } catch (error) {
      toast.error(error.error || 'Failed to add comment');
    } finally {
      setIsAddingComment(false);
    }
  };

  const downloadDocument = async (documentId, filename) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Failed to download document');
    }
  };

  const downloadCertificate = async () => {
    try {
      const response = await api.post(`/certificates/generate/${id}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${currentApplication.organization_name}_certificate.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to download certificate');
    }
  };

  const viewCertificate = async () => {
    try {
      const response = await api.post(`/certificates/generate/${id}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      toast.error('Failed to view certificate');
    }
  };

  if (loading || !currentApplication) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const statusOptions = getValidStatusOptions();

  // Map actual application status to the corresponding step position
  const statusToStepIndex = {
    'PENDING': 1,
    'FBO_REVIEW': 1,
    'PASTOR_DOCUMENT': 1,
    'TRANSFER_TO_DM': 2,
    'DM_REVIEW': 2,
    'TRANSFER_TO_HOD': 3,
    'HOD_REVIEW': 3,
    'TRANSFER_TO_SG': 4,
    'SG_REVIEW': 4,
    'TRANSFER_TO_CEO': 5,
    'CEO_REVIEW': 5,
    'APPROVED': 6,
    'CERTIFICATE_ISSUED': 7,
    'REJECTED': 0 // Special case for rejected
  };

  const currentStatusIndex = statusToStepIndex[currentApplication.status] ?? 0;

  const steps = [
    { step: 'Application Submitted', status: currentStatusIndex > 0 ? 'completed' : 'current', role: 'Applicant' },
    { step: 'FBO Officer Review', status: currentStatusIndex > 1 ? 'completed' : currentStatusIndex === 1 ? 'current' : 'pending', role: 'FBO Officer' },
    { step: 'Division Manager Review', status: currentStatusIndex > 2 ? 'completed' : currentStatusIndex === 2 ? 'current' : 'pending', role: 'Division Manager' },
    { step: 'HOD Review', status: currentStatusIndex > 3 ? 'completed' : currentStatusIndex === 3 ? 'current' : 'pending', role: 'Head of Department' },
    { step: 'Secretary General Review', status: currentStatusIndex > 4 ? 'completed' : currentStatusIndex === 4 ? 'current' : 'pending', role: 'Secretary General' },
    { step: 'CEO Approval', status: currentStatusIndex > 5 ? 'completed' : currentStatusIndex === 5 ? 'current' : 'pending', role: 'CEO' },
    { step: 'Certificate Issued', status: currentStatusIndex === 7 ? 'completed' : 'pending', role: 'System' },
  ];

  // Show rejected step if application is rejected
  if (currentApplication.status === 'REJECTED') {
    steps.push({ step: 'Application Rejected', status: 'rejected', role: 'System' });
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/applications')}
            className="flex items-center space-x-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to Applications</span>
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {currentApplication.organization_name}
            </h1>
            {currentApplication.acronym && (
              <p className="text-lg text-gray-600">({currentApplication.acronym})</p>
            )}
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-sm text-gray-500">
                Application ID: #{currentApplication.id}
              </span>
              {currentApplication.certificate_number && (
                <span className="text-sm text-green-600 font-medium">
                  Certificate: #{currentApplication.certificate_number}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {getStatusIcon(currentApplication.status)}
            <div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(currentApplication.status)}`}>
                {formatStatus(currentApplication.status)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Update Form */}
          {statusOptions.length > 0 && currentApplication.canEdit && (
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold">Update Application Status</h2>
              </Card.Header>
              <Card.Content>
                <form onSubmit={handleSubmit(onStatusSubmit)} className="space-y-4">
                  <Select
                    label="New Status"
                    required
                    options={statusOptions}
                    placeholder="Select new status"
                    {...register('status', {
                      required: 'Please select a status',
                    })}
                    error={errors.status?.message}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comments
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Add comments about this status change..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      {...register('comment')}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    loading={isUpdatingStatus}
                    disabled={!selectedStatus}
                    className="w-full"
                  >
                    Update Status
                  </Button>
                </form>
              </Card.Content>
            </Card>
          )}

          {/* Application Details */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold">Application Information</h2>
            </Card.Header>
            <Card.Content>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Organization Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{currentApplication.organization_name}</dd>
                </div>
                
                {currentApplication.acronym && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Acronym</dt>
                    <dd className="mt-1 text-sm text-gray-900">{currentApplication.acronym}</dd>
                  </div>
                )}
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{currentApplication.organization_email}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{currentApplication.organization_phone}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Province</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {currentApplication.district?.province?.name || 'N/A'}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">District</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {currentApplication.district?.name || 'N/A'}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Submitted At</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(currentApplication.submitted_at).toLocaleString()}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Modified</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(currentApplication.last_modified).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </Card.Content>
          </Card>

          {/* Applicant Information */}
          {currentApplication.applicant && (
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold">Applicant Information</h2>
              </Card.Header>
              <Card.Content>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {currentApplication.applicant.title} {currentApplication.applicant.firstname} {currentApplication.applicant.lastname}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{currentApplication.applicant.email}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{currentApplication.applicant.phonenumber}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">ID/Passport</dt>
                    <dd className="mt-1 text-sm text-gray-900">{currentApplication.applicant.nid_or_passport}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nationality</dt>
                    <dd className="mt-1 text-sm text-gray-900">{currentApplication.applicant.nationality}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(currentApplication.applicant.date_of_birth).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </Card.Content>
            </Card>
          )}

          {/* Cluster Information */}
          {currentApplication.cluster_information && (
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold">Cluster Information</h2>
              </Card.Header>
              <Card.Content>
                <dl className="space-y-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Cluster of Intervention</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {currentApplication.cluster_information.cluster_of_intervention}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Source of Fund</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {currentApplication.cluster_information.source_of_fund}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {currentApplication.cluster_information.description}
                    </dd>
                  </div>
                </dl>
              </Card.Content>
            </Card>
          )}

          {/* Supporting Documents */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold">Supporting Documents</h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {documentRequirements && documentRequirements.map((req) => (
                  <div key={req.document_type} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <DocumentIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <h4 className="font-medium text-gray-900">{req.name}</h4>
                          <p className="text-sm text-gray-500">
                            {req.required ? 'Required' : 'Optional'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {req.uploaded ? (
                          <div className="flex items-center space-x-2">
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                            <span className="text-sm text-green-700">Uploaded</span>
                            {req.is_valid === false && (
                              <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-red-600">Not uploaded</span>
                        )}
                      </div>
                    </div>

                    {req.uploaded && (
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadDocument(req.document_id, `${req.name}.pdf`)}
                          className="flex items-center space-x-1"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                          <span>Download</span>
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex items-center space-x-1"
                        >
                          <EyeIcon className="h-4 w-4" />
                          <span>View</span>
                        </Button>
                      </div>
                    )}

                    {req.is_valid === false && req.validation_comments && (
                      <div className="mt-3 bg-red-50 border border-red-200 rounded p-3">
                        <p className="text-sm text-red-700">
                          <strong>Validation Issue:</strong> {req.validation_comments}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Comments History */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold flex items-center space-x-2">
                <ChatBubbleLeftEllipsisIcon className="h-5 w-5" />
                <span>Comments History</span>
              </h2>
            </Card.Header>
            <Card.Content>
              {applicationComments && applicationComments.length > 0 ? (
                <div className="space-y-4">
                  {applicationComments.map((comment) => (
                    <div key={comment.id} className="border-l-4 border-blue-200 pl-4 py-2">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-sm font-medium text-gray-900">
                          {comment.performed_by?.firstname} {comment.performed_by?.lastname}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        {comment.performed_by?.role && (
                          <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            {formatStatus(comment.performed_by.role)}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-700">
                        {comment.content}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No comments yet.</p>
              )}
            </Card.Content>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Application Timeline */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Review Progress</h3>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {steps.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-3 h-3 rounded-full mt-1 ${
                      item.status === 'completed' ? 'bg-green-500' :
                      item.status === 'current' ? 'bg-blue-500' : 
                      item.status === 'rejected' ? 'bg-red-500' : 'bg-gray-300'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${
                        item.status === 'completed' ? 'text-gray-900' :
                        item.status === 'current' ? 'text-blue-600 font-medium' : 
                        item.status === 'rejected' ? 'text-red-600 font-medium' : 'text-gray-500'
                      }`}>
                        {item.step}
                      </p>
                      <p className="text-xs text-gray-500">{item.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Quick Actions */}
          {(currentApplication.status === 'CERTIFICATE_ISSUED' || currentApplication.status === 'APPROVED') && (
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold">Certificate Actions</h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-2">
                  <Button className="w-full mb-2" onClick={downloadCertificate}>
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>

                  <Button variant="outline" className="w-full" onClick={viewCertificate}>
                    <EyeIcon className="h-4 w-4 mr-2" />
                    View Certificate
                  </Button>
                </div>
              </Card.Content>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminApplicationDetails;