import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getApplicationById, 
  getDocumentRequirements, 
  uploadDocument,
  getApplicationComments,
  updateApplication
} from '../../redux/slices/applicationSlice';
import {
  ArrowLeftIcon,
  DocumentIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftEllipsisIcon,
  PencilIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import FileUpload from '../../components/ui/FileUpload';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentApplication, documentRequirements, applicationComments, loading } = useSelector(
    (state) => state.applications
  );
  const [uploadingDoc, setUploadingDoc] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getApplicationById(id));
      dispatch(getDocumentRequirements(id));
      dispatch(getApplicationComments(id));
    }
  }, [dispatch, id]);

  // Initialize edit form data when application data is loaded
  useEffect(() => {
    if (currentApplication) {
      setEditFormData({
        organization_name: currentApplication.organization_name,
        acronym: currentApplication.acronym || '',
        organization_email: currentApplication.organization_email,
        organization_phone: currentApplication.organization_phone,
        cluster_of_intervention: currentApplication.cluster_information?.cluster_of_intervention || '',
        source_of_fund: currentApplication.cluster_information?.source_of_fund || '',
        description: currentApplication.cluster_information?.description || '',
      });
    }
  }, [currentApplication]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveApplicationChanges = async () => {
    setSubmitting(true);
    try {
      await dispatch(updateApplication({
        applicationId: id,
        data: editFormData
      })).unwrap();
      
      toast.success('Application updated successfully');
      setIsEditMode(false);
      // Refresh application data
      dispatch(getApplicationById(id));
    } catch (error) {
      toast.error(error.error || 'Failed to update application');
    } finally {
      setSubmitting(false);
    }
  };

  const cancelEdit = () => {
    // Reset form data to original values
    if (currentApplication) {
      setEditFormData({
        organization_name: currentApplication.organization_name,
        acronym: currentApplication.acronym || '',
        organization_email: currentApplication.organization_email,
        organization_phone: currentApplication.organization_phone,
        cluster_of_intervention: currentApplication.cluster_information?.cluster_of_intervention || '',
        source_of_fund: currentApplication.cluster_information?.source_of_fund || '',
        description: currentApplication.cluster_information?.description || '',
      });
    }
    setIsEditMode(false);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'CERTIFICATE_ISSUED':
        return <CheckCircleIcon className="h-8 w-8 text-green-500" />;
      case 'REJECTED':
        return <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />;
      case 'REVIEWING_AGAIN':
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
      case 'REVIEWING_AGAIN':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      default:
        return 'text-blue-700 bg-blue-100 border-blue-200';
    }
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleFileUpload = async (files, documentType) => {
    if (files.length === 0) return;

    setUploadingDoc(documentType);
    try {
      await dispatch(uploadDocument({
        applicationId: id,
        documentType,
        file: files[0]
      })).unwrap();
      
      toast.success('Document uploaded successfully!');
      dispatch(getDocumentRequirements(id)); // Refresh requirements
    } catch (error) {
      toast.error(error.error || 'Failed to upload document');
    } finally {
      setUploadingDoc(null);
      setSelectedDocType('');
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

  const viewDocument = async (documentId) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to view document');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      toast.error('Failed to view document');
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

  // Updated status mapping for new workflow
  const statusToStepIndex = {
    'PENDING': 1,
    'FBO_REVIEW': 1,
    'REVIEWING_AGAIN': 1,
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
            onClick={() => navigate('/applicant/applications')}
            className="flex items-center space-x-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to Applications</span>
          </Button>
          
          {/* Edit Application Button - Show only when status is REVIEWING_AGAIN */}
          {currentApplication.status === 'REVIEWING_AGAIN' && !isEditMode && (
            <Button
              variant="outline"
              className="flex items-center space-x-2 ml-auto"
              onClick={() => setIsEditMode(true)}
            >
              <PencilIcon className="h-4 w-4" />
              <span>Edit Application</span>
            </Button>
          )}
          
          {/* Save/Cancel Buttons - Show only in edit mode */}
          {isEditMode && (
            <div className="flex items-center space-x-2 ml-auto">
              <Button
                variant="outline"
                onClick={cancelEdit}
                className="flex items-center space-x-2"
              >
                <XMarkIcon className="h-4 w-4" />
                <span>Cancel</span>
              </Button>
              <Button
                onClick={saveApplicationChanges}
                loading={submitting}
                className="flex items-center space-x-2"
              >
                <CheckCircleIcon className="h-4 w-4" />
                <span>Save Changes</span>
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {
                currentApplication.organization_name
              }
            </h1>
            {(currentApplication.acronym || isEditMode) && (
              <div className="mt-2">
                
                  <p className="text-lg text-gray-600">({currentApplication.acronym})</p>
                
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {getStatusIcon(currentApplication.status)}
            <div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(currentApplication.status)}`}>
                {formatStatus(currentApplication.status)}
              </span>
              {currentApplication.certificate_number && (
                <div className="mt-2 text-sm text-gray-600">
                  Certificate: #{currentApplication.certificate_number}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Details */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold">Application Details</h2>
            </Card.Header>
            <Card.Content>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Organization Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {isEditMode ? (
                      <Input
                        name="organization_name"
                        value={editFormData.organization_name}
                        onChange={handleInputChange}
                      />
                    ) : (
                      currentApplication.organization_name
                    )}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Acronym</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {isEditMode ? (
                      <Input
                        name="acronym"
                        value={editFormData.acronym}
                        onChange={handleInputChange}
                        placeholder="Optional"
                      />
                    ) : (
                      currentApplication.acronym || 'N/A'
                    )}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {isEditMode ? (
                      <Input
                        name="organization_email"
                        value={editFormData.organization_email}
                        onChange={handleInputChange}
                        type="email"
                      />
                    ) : (
                      currentApplication.organization_email
                    )}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {isEditMode ? (
                      <Input
                        name="organization_phone"
                        value={editFormData.organization_phone}
                        onChange={handleInputChange}
                        type="tel"
                      />
                    ) : (
                      currentApplication.organization_phone
                    )}
                  </dd>
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
                    {new Date(currentApplication.submitted_at).toLocaleDateString()}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Modified</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(currentApplication.last_modified).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </Card.Content>
          </Card>

          {/* Cluster Information */}
          {(currentApplication.cluster_information || isEditMode) && (
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold">Cluster Information</h2>
              </Card.Header>
              <Card.Content>
                <dl className="space-y-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Cluster of Intervention</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {isEditMode ? (
                        <Input
                          name="cluster_of_intervention"
                          value={editFormData.cluster_of_intervention}
                          onChange={handleInputChange}
                        />
                      ) : (
                        currentApplication.cluster_information?.cluster_of_intervention
                      )}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Source of Fund</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {isEditMode ? (
                        <Input
                          name="source_of_fund"
                          value={editFormData.source_of_fund}
                          onChange={handleInputChange}
                        />
                      ) : (
                        currentApplication.cluster_information?.source_of_fund
                      )}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {isEditMode ? (
                        <textarea
                          name="description"
                          value={editFormData.description}
                          onChange={handleInputChange}
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        currentApplication.cluster_information?.description
                      )}
                    </dd>
                  </div>
                </dl>
              </Card.Content>
            </Card>
          )}

          {/* Document Requirements */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold">Required Documents</h2>
            </Card.Header>
            <Card.Content>
              <div className="space-y-6">
                {documentRequirements && documentRequirements.map((req) => (
                  <div key={req.document_type} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <DocumentIcon className="h-6 w-6 text-gray-400" />
                        <div>
                          <h3 className="font-medium text-gray-900">{req.name}</h3>
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
                          <span className="text-sm text-gray-500">Not uploaded</span>
                        )}
                      </div>
                    </div>

                    {req.uploaded ? (
                      <div className="space-y-2">
                        {selectedDocType === req.document_type ? (
                          <div className="space-y-4">
                            <FileUpload
                              onFilesSelect={(files) => handleFileUpload(files, req.document_type)}
                              multiple={false}
                              accept={{
                                'application/pdf': ['.pdf'],
                                'application/msword': ['.doc'],
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                                'image/jpeg': ['.jpg', '.jpeg'],
                                'image/png': ['.png']
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedDocType('')}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
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
                              onClick={() => viewDocument(req.document_id)}
                              className="flex items-center space-x-1"
                            >
                              <EyeIcon className="h-4 w-4" />
                              <span>View</span>
                            </Button>

                            {/* Only show Replace button in edit mode or when REVIEWING_AGAIN */}
                            {(isEditMode || currentApplication.status === 'REVIEWING_AGAIN') && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedDocType(req.document_type)}
                                className="flex items-center space-x-1"
                              >
                                <CloudArrowUpIcon className="h-4 w-4" />
                                <span>Replace</span>
                              </Button>
                            )}
                          </div>
                        )}

                        {req.is_valid === false && req.validation_comments && (
                          <div className="bg-red-50 border border-red-200 rounded p-3">
                            <p className="text-sm text-red-700">
                              <strong>Validation Issue:</strong> {req.validation_comments}
                            </p>
                          </div>
                        )}
                      </div>

                    ) : (
                      <div>
                        {/* Only show Upload button in edit mode or when REVIEWING_AGAIN */}
                        {(isEditMode || currentApplication.status === 'REVIEWING_AGAIN') && (
                          <>
                            {selectedDocType === req.document_type ? (
                              <div className="space-y-4">
                                <FileUpload
                                  onFilesSelect={(files) => handleFileUpload(files, req.document_type)}
                                  multiple={false}
                                  accept={{
                                    'application/pdf': ['.pdf'],
                                    'application/msword': ['.doc'],
                                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                                    'image/jpeg': ['.jpg', '.jpeg'],
                                    'image/png': ['.png']
                                  }}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedDocType('')}
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => setSelectedDocType(req.document_type)}
                                disabled={uploadingDoc === req.document_type}
                                loading={uploadingDoc === req.document_type}
                              >
                                Upload Document
                              </Button>
                            )}
                          </>
                        )}
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
                <span>Comments & Updates</span>
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
                <p className="text-gray-500 text-sm">No comments or updates yet.</p>
              )}
            </Card.Content>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Edit Mode Banner - Only show in edit mode */}
          {isEditMode && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-yellow-800 mb-2">Edit Mode</h3>
              <p className="text-sm text-yellow-700 mb-3">
                You are currently editing your application. Make the necessary changes and click "Save Changes" when you're done.
              </p>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={cancelEdit}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={saveApplicationChanges}
                  loading={submitting}
                  className="flex-1"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
          
          {/* Application Progress */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Application Progress</h3>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {steps.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
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

          {/* Certificate Actions */}
          {(currentApplication.status === 'CERTIFICATE_ISSUED' || currentApplication.status === 'APPROVED') && (
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold">Certificate</h3>
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

          {/* Application Info */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Application Info</h3>
            </Card.Header>
            <Card.Content>
              <dl className="space-y-2">
                <div>
                  <dt className="text-xs font-medium text-gray-500">Application ID</dt>
                  <dd className="text-sm text-gray-900">#{currentApplication.id}</dd>
                </div>
                
                <div>
                  <dt className="text-xs font-medium text-gray-500">Status</dt>
                  <dd className="text-sm text-gray-900">{formatStatus(currentApplication.status)}</dd>
                </div>
                
                {currentApplication.certificate_number && (
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Certificate Number</dt>
                    <dd className="text-sm text-gray-900">{currentApplication.certificate_number}</dd>
                  </div>
                )}
                
                <div>
                  <dt className="text-xs font-medium text-gray-500">Can Edit</dt>
                  <dd className="text-sm text-gray-900">
                    {currentApplication.status === 'REVIEWING_AGAIN' ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-red-500">No</span>
                    )}
                  </dd>
                </div>
              </dl>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;