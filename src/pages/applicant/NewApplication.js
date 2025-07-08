import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createApplication } from '../../redux/slices/applicationSlice';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

const NewApplication = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.applications);
  const [step, setStep] = useState(1);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const watchAllFields = watch();

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(createApplication(data)).unwrap();
      toast.success('Application created successfully!');
      navigate(`/applicant/applications/${result.application.id}`);
    } catch (error) {
      toast.error(error.error || 'Failed to create application');
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const steps = [
    { id: 1, name: 'Organization Details' },
    { id: 2, name: 'Cluster Information' },
    { id: 3, name: 'Review & Submit' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">New Application</h1>
        <p className="mt-2 text-gray-600">
          Apply for religious organization authorization
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8 w-full">
        <nav aria-label="Progress">
          <ol className="relative flex justify-between">
            {/* Connector line spanning the entire width */}
            <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200" aria-hidden="true"></div>
            
            {steps.map((stepItem) => (
              <li key={stepItem.id} className="relative flex flex-col items-center">
                {/* Circle indicator */}
                <div
                  className={`z-10 flex h-8 w-8 items-center justify-center rounded-full 
                    ${stepItem.id === step
                      ? 'bg-blue-600 text-white'
                      : stepItem.id < step
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border-2 border-gray-300 text-gray-500'
                    }`}
                >
                  <span className="text-sm font-medium">{stepItem.id}</span>
                </div>
                
                {/* Step name */}
                <span className="mt-2 text-xs sm:text-sm text-center font-medium text-gray-500 max-w-[80px]">
                  {stepItem.name}
                </span>
              </li>
            ))}
            
            {/* Completed line */}
            <div 
              className="absolute top-4 left-0 h-0.5 bg-blue-600 transition-all duration-300" 
              style={{ 
                width: `${Math.max(0, ((step - 1) / (steps.length - 1)) * 100)}%` 
              }}
              aria-hidden="true"
            ></div>
          </ol>
        </nav>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <Card.Content className="p-8">
            {/* Step 1: Organization Details */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Organization Details
                </h2>

                <Input
                  label="Organization Name"
                  required
                  placeholder="Enter the full name of your organization"
                  {...register('organization_name', {
                    required: 'Organization name is required',
                    minLength: {
                      value: 3,
                      message: 'Organization name must be at least 3 characters',
                    },
                  })}
                  error={errors.organization_name?.message}
                />

                <Input
                  label="Acronym (Optional)"
                  placeholder="e.g., CCC, ADEPR, etc."
                  {...register('acronym')}
                  error={errors.acronym?.message}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Organization Email"
                    type="email"
                    required
                    placeholder="organization@example.com"
                    {...register('organization_email', {
                      required: 'Organization email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    error={errors.organization_email?.message}
                  />

                  <Input
                    label="Organization Phone"
                    type="tel"
                    required
                    placeholder="+250XXXXXXXXX"
                    {...register('organization_phone', {
                      required: 'Organization phone is required',
                      pattern: {
                        value: /^\+?[1-9]\d{1,14}$/,
                        message: 'Invalid phone number format',
                      },
                    })}
                    error={errors.organization_phone?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Enter the complete address of your organization including Province, District, Sector, Cell, and Village"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    {...register('address', {
                      required: 'Address is required',
                      minLength: {
                        value: 10,
                        message: 'Address must be at least 10 characters',
                      },
                    })}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Cluster Information */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Cluster Information
                </h2>

                <Input
                  label="Cluster of Intervention"
                  required
                  placeholder="e.g., Youth Development, Community Health, Education"
                  {...register('cluster_of_intervention', {
                    required: 'Cluster of intervention is required',
                  })}
                  error={errors.cluster_of_intervention?.message}
                />

                <Input
                  label="Source of Fund"
                  required
                  placeholder="e.g., Donations, Government Support, International Aid"
                  {...register('source_of_fund', {
                    required: 'Source of fund is required',
                  })}
                  error={errors.source_of_fund?.message}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description of Activities <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Provide a detailed description of your organization's activities, mission, and how you plan to serve the community"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    {...register('description', {
                      required: 'Description is required',
                      minLength: {
                        value: 50,
                        message: 'Description must be at least 50 characters',
                      },
                    })}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Review Your Application
                </h2>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Organization Details
                  </h3>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Organization Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">{watchAllFields.organization_name}</dd>
                    </div>
                    {watchAllFields.acronym && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Acronym</dt>
                        <dd className="mt-1 text-sm text-gray-900">{watchAllFields.acronym}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">{watchAllFields.organization_email}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">{watchAllFields.organization_phone}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Address</dt>
                      <dd className="mt-1 text-sm text-gray-900">{watchAllFields.address}</dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Cluster Information
                  </h3>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Cluster of Intervention</dt>
                      <dd className="mt-1 text-sm text-gray-900">{watchAllFields.cluster_of_intervention}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Source of Fund</dt>
                      <dd className="mt-1 text-sm text-gray-900">{watchAllFields.source_of_fund}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Description</dt>
                      <dd className="mt-1 text-sm text-gray-900">{watchAllFields.description}</dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Next Steps</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• After submitting, you'll need to upload required documents</li>
                    <li>• Your application will be reviewed by RGB officials</li>
                    <li>• You'll receive notifications about status updates</li>
                    <li>• The review process typically takes 2-4 weeks</li>
                  </ul>
                </div>
              </div>
            )}
          </Card.Content>

          <Card.Footer className="flex justify-between">
            <div>
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
            </div>

            <div>
              {step < 3 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit" loading={loading}>
                  Submit Application
                </Button>
              )}
            </div>
          </Card.Footer>
        </Card>
      </form>
    </div>
  );
};

export default NewApplication;