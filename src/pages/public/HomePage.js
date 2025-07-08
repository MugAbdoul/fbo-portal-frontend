import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BuildingOfficeIcon,
  ShieldCheckIcon,
  ClockIcon,
  DocumentCheckIcon,
  UserGroupIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const HomePage = () => {
  const features = [
    {
      icon: ClockIcon,
      title: 'Fast Processing',
      description: 'Streamlined workflow ensures quick application review and approval process.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Reliable',
      description: 'Your documents and data are protected with enterprise-grade security.'
    },
    {
      icon: DocumentCheckIcon,
      title: 'Digital Documents',
      description: 'Upload and manage all required documents digitally with ease.'
    },
    {
      icon: UserGroupIcon,
      title: 'Expert Support',
      description: 'Get assistance from our dedicated team throughout the process.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Account',
      description: 'Register for a new account with your personal information'
    },
    {
      number: '02',
      title: 'Submit Application',
      description: 'Fill out the application form with your organization details'
    },
    {
      number: '03',
      title: 'Upload Documents',
      description: 'Submit all required supporting documents'
    },
    {
      number: '04',
      title: 'Review Process',
      description: 'Your application goes through our structured review workflow'
    },
    {
      number: '05',
      title: 'Get Authorized',
      description: 'Receive your official authorization certificate'
    }
  ];

  const stats = [
    { label: 'Applications Processed', value: '2,500+' },
    { label: 'Organizations Authorized', value: '1,800+' },
    { label: 'Average Processing Time', value: '14 days' },
    { label: 'Success Rate', value: '94%' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Church Authorization 
                <span className="block text-blue-200">Made Simple</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                The official digital platform for religious organizations to obtain 
                authorization from Rwanda Governance Board. Secure, efficient, and transparent.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth/register">
                <Button 
                  size="xl" 
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Start Application
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
                </Link>
                <Link to="/services">
                  <Button 
                    size="xl" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="glass-effect rounded-2xl p-8">
                <BuildingOfficeIcon className="h-32 w-32 text-blue-200 mx-auto mb-6" />
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Digital Authorization</h3>
                  <p className="text-blue-200">
                    Get your religious organization officially recognized by the 
                    Government of Rwanda through our streamlined digital process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've designed the most efficient and user-friendly platform for 
              religious organization authorization in Rwanda.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-100 p-4 rounded-full">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these simple steps to get your religious organization authorized
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full">
                    <ArrowRightIcon className="h-6 w-6 text-gray-300 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join hundreds of religious organizations that have successfully 
            obtained their authorization through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/auth/register">
            <Button 
              size="xl"
            >
              Start Your Application
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/faq">
            <Button 
              size="xl" 
              variant="outline"
            >
              Have Questions?
            </Button>
          </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;