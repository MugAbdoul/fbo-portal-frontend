import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  UserIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../utils/api';

const VerifyCertificate = () => {
  const { certificateNumber } = useParams();
  const [searchParams] = useSearchParams();
  const [searchNumber, setSearchNumber] = useState(certificateNumber || '');
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Auto-verify if certificate number is in URL
    if (certificateNumber) {
      handleVerify(certificateNumber);
    }
  }, [certificateNumber]);

  const handleVerify = async (certNumber = searchNumber) => {
    if (!certNumber.trim()) {
      setError('Please enter a certificate number');
      return;
    }

    setLoading(true);
    setError(null);
    setVerification(null);

    try {
      const response = await api.get(`/certificates/verify/${certNumber}`);
      setVerification(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setError('Certificate not found. Please check the certificate number and try again.');
      } else {
        setError('Verification failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleVerify();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <DocumentIcon className="h-16 w-16 mx-auto mb-6 text-blue-200" />
          <h1 className="text-4xl font-bold mb-4">
            Certificate Verification
          </h1>
          <p className="text-xl text-blue-100">
            Verify the authenticity of religious organization authorization certificates
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Form */}
        <Card className="mb-8">
          <Card.Header>
            <h2 className="text-2xl font-semibold flex items-center">
              <MagnifyingGlassIcon className="h-6 w-6 mr-2" />
              Verify Certificate
            </h2>
          </Card.Header>
          <Card.Content>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  label="Certificate Number"
                  placeholder="Enter certificate number (e.g., RGB-2024-001234)"
                  value={searchNumber}
                  onChange={(e) => setSearchNumber(e.target.value)}
                  className="text-lg"
                />
                <p className="mt-2 text-sm text-gray-600">
                  The certificate number can be found on the official certificate document 
                  or by scanning the QR code.
                </p>
              </div>
              
              <Button 
                type="submit" 
                size="lg" 
                loading={loading}
                className="w-full"
              >
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Verify Certificate
              </Button>
            </form>
          </Card.Content>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-8 border-red-200">
            <Card.Content className="p-6">
              <div className="flex items-center space-x-3">
                <XCircleIcon className="h-8 w-8 text-red-500 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-red-800">
                    Verification Failed
                  </h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </Card.Content>
          </Card>
        )}

        {/* Verification Result */}
        {verification && (
          <Card className="mb-8 border-green-200">
            <Card.Header className="bg-green-50">
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
                <div>
                  <h2 className="text-2xl font-semibold text-green-800">
                    Certificate Verified
                  </h2>
                  <p className="text-green-700">
                    This certificate is valid and authentic
                  </p>
                </div>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <DocumentIcon className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Certificate Number</dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {verification.certificate_number}
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Organization Name</dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {verification.organization_name}
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <UserIcon className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Authorized Representative</dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {verification.applicant_name}
                      </dd>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Date Issued</dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {new Date(verification.issued_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Address</dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {verification.address}
                      </dd>
                    </div>
                  </div>

                  {verification.cluster_of_intervention && (
                    <div className="flex items-start space-x-3">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Cluster of Intervention</dt>
                        <dd className="text-lg font-semibold text-gray-900">
                          {verification.cluster_of_intervention}
                        </dd>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-green-800">
                    This organization is officially authorized by Rwanda Governance Board
                  </span>
                </div>
              </div>
            </Card.Content>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <Card.Header>
            <h3 className="text-xl font-semibold">How to Verify</h3>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Manual Verification</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Locate the certificate number on the document</li>
                  <li>Enter the complete certificate number above</li>
                  <li>Click "Verify Certificate" to check authenticity</li>
                  <li>Review the verification results</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">QR Code Verification</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Locate the QR code on the certificate</li>
                  <li>Scan with your mobile device camera</li>
                  <li>Follow the link to this verification page</li>
                  <li>The certificate will be automatically verified</li>
                </ol>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Important Notes</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• All authentic certificates issued by RGB can be verified through this system</li>
                <li>• If a certificate cannot be verified, it may be fraudulent or expired</li>
                <li>• For questions about certificate verification, contact RGB support</li>
                <li>• This verification system is available 24/7 and free to use</li>
              </ul>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default VerifyCertificate;