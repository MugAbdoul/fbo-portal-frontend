import React from 'react';
import { Link } from 'react-router-dom';
import {
  BuildingOfficeIcon,
  DocumentCheckIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowRightIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const ServicesPage = () => {
  const services = [
    {
      icon: BuildingOfficeIcon,
      title: 'Religious Organization Authorization',
      description: 'Official authorization for churches and faith-based organizations to operate in Rwanda.',
      features: [
        'Legal recognition and authorization',
        'Official certificate issuance',
        'Compliance with national regulations',
        'Access to government programs'
      ],
      duration: '2-4 weeks',
      fee: 'As per government regulations'
    },
    {
      icon: DocumentCheckIcon,
      title: 'Document Verification',
      description: 'Verification and validation of organizational documents and requirements.',
      features: [
        'Document authenticity verification',
        'Compliance checking',
        'Digital validation',
        'Secure storage'
      ],
      duration: '1-2 weeks',
      fee: 'Included in application'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Certificate Verification',
      description: 'Online verification system for issued certificates.',
      features: [
        'QR code verification',
        'Real-time validation',
        'Public access',
        'Fraud prevention'
      ],
      duration: 'Instant',
      fee: 'Free'
    }
  ];

  const process = [
    {
      step: 1,
      title: 'Registration',
      description: 'Create an account with your personal information and email verification.',
      icon: UserGroupIcon
    },
    {
      step: 2,
      title: 'Application Submission',
      description: 'Fill out the comprehensive application form with organization details.',
      icon: DocumentCheckIcon
    },
    {
      step: 3,
      title: 'Document Upload',
      description: 'Upload all required supporting documents in approved formats.',
      icon: DocumentCheckIcon
    },
    {
      step: 4,
      title: 'Review Process',
      description: 'Multi-level review by RGB officials including risk assessment.',
      icon: ShieldCheckIcon
    },
    {
      step: 5,
      title: 'Certificate Issuance',
      description: 'Receive your official authorization certificate upon approval.',
      icon: CheckIcon
    }
  ];

  const requirements = [
    'Names and CVs of Organization Committee',
    'District Certificate of Authorization',
    'Land UPI and Photos of the Church',
    'Organizational Doctrine or Constitution',
    'Annual Action Plan',
    'Proof of Payment (Application Fee)',
    'Partnership Documents (if applicable)'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Our Services
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Comprehensive authorization services for religious organizations in Rwanda, 
              designed to ensure compliance and facilitate legitimate operations.
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional services to help your religious organization obtain proper 
              authorization and maintain compliance with Rwanda's regulations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
                  <div className="text-center mb-6">
                    <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600">
                      {service.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Features:</h4>
                      <ul className="space-y-1">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="font-medium text-gray-900">Duration:</span>
                        <span className="text-gray-600 ml-1">{service.duration}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Fee:</span>
                        <span className="text-gray-600 ml-1">{service.fee}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Authorization Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined 5-step process ensures efficient and transparent 
              handling of your authorization application.
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-blue-200 transform -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {process.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="relative text-center">
                    <div className="bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border-4 border-blue-600 relative z-10">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Step {item.step}: {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Required Documents
            </h2>
            <p className="text-xl text-gray-600">
              Ensure you have all necessary documents ready before starting your application.
            </p>
          </div>

          <Card className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{requirement}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Important Notes:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• All documents must be in PDF, DOC, or image format (max 16MB each)</li>
                <li>• Documents should be clear and legible</li>
                <li>• Original documents may be requested for verification</li>
                <li>• Incomplete applications will be returned for additional documentation</li>
              </ul>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Application?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of religious organizations that have successfully 
            obtained their authorization through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="xl" 
              className="bg-white text-blue-600 hover:bg-blue-50"
              as={Link}
              to="/auth/register"
            >
              Start Application
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="xl" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600"
              as={Link}
              to="/faq"
            >
              View FAQ
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;