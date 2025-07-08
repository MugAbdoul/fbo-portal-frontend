import React from 'react';
import { 
  BuildingOfficeIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ChartBarIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';

const AboutPage = () => {
  const values = [
    {
      icon: ShieldCheckIcon,
      title: 'Transparency',
      description: 'We maintain open and transparent processes, ensuring all stakeholders understand the authorization requirements and procedures.'
    },
    {
      icon: UserGroupIcon,
      title: 'Integrity',
      description: 'We uphold the highest standards of integrity in all our operations, treating all applications fairly and without bias.'
    },
    {
      icon: HeartIcon,
      title: 'Service Excellence',
      description: 'We are committed to providing exceptional service to religious organizations and supporting their important work in communities.'
    },
    {
      icon: GlobeAltIcon,
      title: 'Unity in Diversity',
      description: 'We respect and celebrate the diversity of religious beliefs and practices while ensuring compliance with national regulations.'
    }
  ];

  const team = [
    {
      name: 'Dr. Sarah Mukamana',
      role: 'Chief Executive Officer',
      description: 'Leading RGB with over 15 years of experience in governance and religious affairs.',
      image: '/team-ceo.jpg'
    },
    {
      name: 'Rev. John Uwimana',
      role: 'Head of Religious Affairs',
      description: 'Overseeing religious organization authorization with deep understanding of faith communities.',
      image: '/team-hod.jpg'
    },
    {
      name: 'Ms. Grace Uwamahoro',
      role: 'Secretary General',
      description: 'Ensuring efficient operations and stakeholder coordination across all departments.',
      image: '/team-sg.jpg'
    }
  ];

  const achievements = [
    {
      icon: BuildingOfficeIcon,
      number: '1,800+',
      label: 'Organizations Authorized',
      description: 'Successfully authorized religious organizations across Rwanda'
    },
    {
      icon: ChartBarIcon,
      number: '94%',
      label: 'Success Rate',
      description: 'High approval rate for complete and compliant applications'
    },
    {
      icon: UserGroupIcon,
      number: '500,000+',
      label: 'Lives Impacted',
      description: 'Individuals served by authorized religious organizations'
    },
    {
      icon: ShieldCheckIcon,
      number: '99.9%',
      label: 'System Uptime',
      description: 'Reliable digital platform ensuring continuous service'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              About Rwanda Governance Board
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Facilitating proper governance and regulation of religious organizations 
              while respecting freedom of worship and belief in Rwanda.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                To ensure that religious organizations in Rwanda operate within the legal 
                framework while contributing positively to national development and social cohesion.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We facilitate transparent, efficient, and fair authorization processes that 
                respect religious freedom while maintaining public order and safety.
              </p>
            </div>
            <div className="bg-blue-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Our Vision</h3>
              <p className="text-blue-800 leading-relaxed">
                "A Rwanda where religious organizations operate harmoniously within the 
                legal framework, contributing to national unity, reconciliation, and 
                sustainable development while preserving the constitutional right to 
                freedom of worship."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our work and decision-making in serving 
              religious organizations and the people of Rwanda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Measurable results from our commitment to excellence in religious 
              organization governance and authorization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {achievement.number}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mb-2">
                    {achievement.label}
                  </div>
                  <p className="text-sm text-gray-600">
                    {achievement.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experienced leaders committed to serving Rwanda's religious communities 
              with integrity and excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <UserGroupIcon className="h-12 w-12 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* History & Legal Framework */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our History</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Rwanda Governance Board was established to ensure proper governance 
                  of various organizations, including religious institutions, in line 
                  with Rwanda's commitment to good governance and rule of law.
                </p>
                <p>
                  Following the 1994 Genocide against the Tutsi, Rwanda recognized the 
                  important role that religious organizations play in healing, 
                  reconciliation, and development, while also ensuring they operate 
                  within appropriate legal frameworks.
                </p>
                <p>
                  The digital authorization platform was launched to modernize and 
                  streamline the application process, making it more accessible, 
                  transparent, and efficient for religious organizations across the country.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Legal Framework</h2>
              <div className="space-y-4">
                <Card className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Constitution of Rwanda (2003, revised 2015)
                  </h4>
                  <p className="text-sm text-gray-600">
                    Guarantees freedom of conscience, religion, belief and opinion.
                  </p>
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Law N° 04/2012 Governing Non-Profit Organizations
                  </h4>
                  <p className="text-sm text-gray-600">
                    Provides the legal framework for registration and operation of 
                    faith-based organizations.
                  </p>
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    RGB Institutional Framework
                  </h4>
                  <p className="text-sm text-gray-600">
                    Establishes RGB's mandate in overseeing religious organization 
                    authorization and compliance.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-xl text-blue-100 mb-8">
            Have questions about our work or need assistance with your application?
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold mb-2">Visit Us</h4>
              <p className="text-blue-100 text-sm">
                Rwanda Governance Board<br />
                Kigali, Rwanda<br />
                KG 374 St, Kigali
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Call Us</h4>
              <p className="text-blue-100 text-sm">
                Phone: +250 788 123 456<br />
                Toll Free: 3003<br />
                Mon-Fri: 8:00 AM - 5:00 PM
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Email Us</h4>
              <p className="text-blue-100 text-sm">
                General: info@rgb.gov.rw<br />
                Support: support@rgb.gov.rw<br />
                Applications: applications@rgb.gov.rw
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;