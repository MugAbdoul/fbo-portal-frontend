import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getApplicationById, 
  getDocumentRequirements, 
  uploadDocument 
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
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import FileUpload from '../../components/ui/FileUpload';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentApplication, documentRequirements, loading } = useSelector(
    (state) => state.applications
  );
  const [uploadingDoc, setUploadingDoc] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(getApplicationById(id));
      dispatch(getDocumentRequirements(id));
    }
  }, [dispatch, id]);

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
      case 'MISSING_DOCUMENTS':
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
      case 'MISSING_DOCUMENTS':
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
      setSelectedDocType('')
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

  const getRiskLevel = (score) => {
    if (score > 70) return { level: 'High', color: 'text-red-600' };
    if (score > 40) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'Low', color: 'text-green-600' };
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

  const riskInfo = getRiskLevel(currentApplication.risk_score);

    const statusToStepIndex = {
    'PENDING': 1,
    'UNDER_REVIEW': 1,
    'MISSING_DOCUMENTS': 1,
    'DRAFT': 2,
    'DM_REVIEW': 3,
    'HOD_REVIEW': 4,
    'SG_REVIEW': 5,
    'CEO_REVIEW': 6,
    'APPROVED': 6,
    'CERTIFICATE_ISSUED': 7
  };

  const currentStatusIndex = statusToStepIndex[currentApplication.status] ?? 0;

  const steps = [
    { step: 'Application Submitted', status: currentStatusIndex > 0 ? 'completed' : 'current', role: 'Applicant' },
    { step: 'FBO Officer Review', status: currentStatusIndex > 1 ? 'completed' : currentStatusIndex === 1 ? 'current' : 'pending', role: 'FBO Officer' },
    { step: 'Division Manager Review', status: currentStatusIndex > 2 ? 'completed' : currentStatusIndex === 2 ? 'current' : 'pending', role: 'Division Manager' },
    { step: 'HoD Review', status: currentStatusIndex > 3 ? 'completed' : currentStatusIndex === 3 ? 'current' : 'pending', role: 'Head of Department' },
    { step: 'Secretary General Review', status: currentStatusIndex > 4 ? 'completed' : currentStatusIndex === 4 ? 'current' : 'pending', role: 'Secretary General' },
    { step: 'CEO Approval', status: currentStatusIndex > 5 ? 'completed' : currentStatusIndex === 5 ? 'current' : 'pending', role: 'CEO' },
    { step: 'Certificate Issued', status: currentStatusIndex === 7 ? 'completed' : 'pending', role: 'System' },
  ]

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
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {currentApplication.organization_name}
            </h1>
            {currentApplication.acronym && (
              <p className="text-lg text-gray-600">({currentApplication.acronym})</p>
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
                
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{currentApplication.address}</dd>
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

          {/* Comments */}
          {currentApplication.comments && (
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold">Latest Comments</h2>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-700">{currentApplication.comments}</p>
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
                {documentRequirements.map((req) => (
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
                              onClick={() => setSelectedDocType(req.document_type)}
                              className="flex items-center space-x-1"
                            >
                              <CloudArrowUpIcon className="h-4 w-4" />
                              <span>Replace</span>
                            </Button>
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
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Risk Assessment */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold">Risk Assessment</h3>
            </Card.Header>
            <Card.Content>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2" style={{ color: riskInfo.color.replace('text-', '') }}>
                  {currentApplication.risk_score?.toFixed(1)}%
                </div>
                <div className={`text-sm font-medium ${riskInfo.color}`}>
                  {riskInfo.level} Risk
                </div>
                
                {currentApplication.ml_predictions?.recommendation && (
                  <div className="mt-4 text-sm text-gray-600">
                    <p className="font-medium mb-2">AI Recommendation:</p>
                    <p>{currentApplication.ml_predictions.recommendation}</p>
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>

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
                      item.status === 'current' ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    <span className={`text-sm ${
                      item.status === 'completed' ? 'text-gray-900' :
                      item.status === 'current' ? 'text-blue-600 font-medium' : 'text-gray-500'
                    }`}>
                      {item.step}
                    </span>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>

          {/* Actions */}
          {(currentApplication.status === 'CERTIFICATE_ISSUED' || currentApplication.status ==='APPROVED' ) && (
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold">Certificate</h3>
              </Card.Header>
              <Card.Content>
              <Button className="w-full mb-2" onClick={downloadCertificate}>
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Download Certificate
                </Button>

                <Button variant="outline" className="w-full" onClick={viewCertificate}>
                  <EyeIcon className="h-4 w-4 mr-2" />
                  View Certificate
                </Button>
              </Card.Content>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;