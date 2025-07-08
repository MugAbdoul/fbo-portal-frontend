import React, { useState } from 'react';
import { 
  ChevronDownIcon, 
  ChevronUpIcon,
  QuestionMarkCircleIcon,
  DocumentIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';

const FAQPage = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqCategories = [
    {
      title: 'General Information',
      icon: QuestionMarkCircleIcon,
      faqs: [
        {
          question: 'What is the RGB Church Authorization Portal?',
          answer: 'The RGB Church Authorization Portal is the official digital platform for religious organizations to apply for and obtain authorization from Rwanda Governance Board to operate legally in Rwanda.'
        },
        {
          question: 'Who needs to apply for religious organization authorization?',
          answer: 'All religious organizations, churches, faith-based organizations, and spiritual groups that want to operate officially in Rwanda must obtain authorization from RGB.'
        },
        {
          question: 'Is this the official government platform?',
          answer: 'Yes, this is the official platform authorized by Rwanda Governance Board for processing religious organization applications.'
        },
        {
          question: 'Can I apply on behalf of my organization?',
          answer: 'Yes, authorized representatives of religious organizations can apply on behalf of their organization. You will need to provide proper documentation proving your authority to represent the organization.'
        }
      ]
    },
    {
      title: 'Application Process',
      icon: DocumentIcon,
      faqs: [
        {
          question: 'How do I start my application?',
          answer: 'First, create an account by registering with your personal information. Once verified, you can log in and start a new application by providing your organization details and uploading required documents.'
        },
        {
          question: 'What documents do I need to submit?',
          answer: 'Required documents include: Organization committee names and CVs, District certificate, Land UPI and church photos, organizational doctrine, annual action plan, proof of payment, and partnership documents (if applicable).'
        },
        {
          question: 'Can I save my application and complete it later?',
          answer: 'Yes, you can save your application as a draft and return to complete it later. Your progress will be automatically saved.'
        },
        {
          question: 'What file formats are accepted for document uploads?',
          answer: 'We accept PDF, DOC, DOCX, JPG, JPEG, and PNG files. Each file must be under 16MB in size.'
        },
        {
          question: 'Can I edit my application after submission?',
          answer: 'Once submitted, you cannot edit your application. However, if additional documents are requested during review, you will be able to upload them through the portal.'
        }
      ]
    },
    {
      title: 'Review Process & Timeline',
      icon: ClockIcon,
      faqs: [
        {
          question: 'How long does the review process take?',
          answer: 'The typical review process takes 2-4 weeks, depending on the completeness of your application and current volume. You will receive notifications about status updates throughout the process.'
        },
        {
          question: 'What happens after I submit my application?',
          answer: 'Your application goes through a structured review process: FBO Officer review → Division Manager → Head of Department → Secretary General → CEO approval. You will be notified at each stage.'
        },
        {
          question: 'How will I know the status of my application?',
          answer: 'You can track your application status in real-time through your dashboard. You will also receive email notifications and in-app notifications for any status changes.'
        },
        {
          question: 'What if my application is rejected?',
          answer: 'If rejected, you will receive detailed feedback about the reasons. You can address the issues and submit a new application.'
        },
        {
          question: 'Can I expedite my application?',
          answer: 'All applications are processed in the order received. However, complete applications with all required documents tend to move through the process faster.'
        }
      ]
    },
    {
      title: 'Fees & Payments',
      icon: CurrencyDollarIcon,
      faqs: [
        {
          question: 'How much does it cost to apply?',
          answer: 'Application fees are set by Rwanda Governance Board and may vary based on organization type. Current fee information will be provided during the application process.'
        },
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept bank transfers, mobile money payments, and other approved payment methods. Detailed payment instructions will be provided with your application.'
        },
        {
          question: 'Is the application fee refundable?',
          answer: 'Application fees are generally non-refundable, regardless of the outcome of your application. However, specific refund policies will be outlined in your payment terms.'
        },
        {
          question: 'When do I need to pay the application fee?',
          answer: 'Payment is typically required before final submission of your application. You will receive payment instructions during the application process.'
        }
      ]
    },
    {
      title: 'Certificates & Verification',
      icon: ShieldCheckIcon,
      faqs: [
        {
          question: 'How do I get my certificate once approved?',
          answer: 'Once approved, your certificate will be generated automatically and available for download from your dashboard. You will also receive notification when it\'s ready.'
        },
        {
          question: 'How can others verify my certificate?',
          answer: 'Each certificate includes a unique QR code and certificate number. Anyone can verify the authenticity through our public verification page.'
        },
        {
          question: 'What if I lose my certificate?',
          answer: 'You can always download a new copy of your certificate from your dashboard. The certificate remains valid and verifiable through our system.'
        },
        {
          question: 'How long is my authorization valid?',
          answer: 'Authorization validity periods are determined by RGB policy. You will be notified of any renewal requirements well in advance.'
        },
        {
          question: 'Can I get multiple copies of my certificate?',
          answer: 'Yes, you can download and print multiple copies of your certificate as needed. All copies are equally valid.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <QuestionMarkCircleIcon className="h-16 w-16 mx-auto mb-6 text-blue-200" />
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-blue-100">
            Find answers to common questions about the religious organization 
            authorization process in Rwanda.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {faqCategories.map((category, categoryIndex) => {
              const CategoryIcon = category.icon;
              return (
                <div key={categoryIndex}>
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <CategoryIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {category.title}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {category.faqs.map((faq, faqIndex) => {
                      const globalIndex = `${categoryIndex}-${faqIndex}`;
                      const isOpen = openFAQ === globalIndex;

                      return (
                        <Card key={faqIndex} className="overflow-hidden">
                          <button
                            onClick={() => toggleFAQ(globalIndex)}
                            className="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-medium text-gray-900 pr-4">
                                {faq.question}
                              </h3>
                              {isOpen ? (
                                <ChevronUpIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                              ) : (
                                <ChevronDownIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
                              )}
                            </div>
                          </button>
                          
                          {isOpen && (
                            <div className="px-6 pb-4">
                              <div className="pt-2 border-t border-gray-200">
                                <p className="text-gray-700 leading-relaxed">
                                  {faq.answer}
                                </p>
                              </div>
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h2>
            <p className="text-xl text-gray-600">
              Can't find the answer you're looking for? Get in touch with our support team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <PhoneIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Phone Support</h3>
              <p className="text-gray-600 mb-4">
                Speak directly with our support team
              </p>
              <p className="text-lg font-semibold text-blue-600">
                +250 788 123 456
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Monday - Friday, 8:00 AM - 5:00 PM
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <EnvelopeIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">
                Send us your questions via email
              </p>
              <p className="text-lg font-semibold text-green-600">
                support@rgb.gov.rw
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Response within 24 hours
              </p>
            </Card>
          </div>

          <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-lg font-semibold text-blue-800 mb-4">
              Before Contacting Support
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <p className="font-medium mb-2">For Application Issues:</p>
                <ul className="space-y-1">
                  <li>• Have your application ID ready</li>
                  <li>• Check your application status first</li>
                  <li>• Review error messages carefully</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">For Technical Issues:</p>
                <ul className="space-y-1">
                  <li>• Try refreshing your browser</li>
                  <li>• Clear browser cache and cookies</li>
                  <li>• Check your internet connection</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;