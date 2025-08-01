import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createApplication } from '../../redux/slices/applicationSlice';
import { fetchProvinces } from '../../redux/slices/provinceSlice';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';
import { 
  DocumentTextIcon, 
  DocumentCheckIcon, 
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';

const DOCUMENT_TYPES = [
  {
    key: 'ORGANIZATION_COMMITTEE_NAMES_CVS',
    name: 'Names and CVs of Organization Committee',
    description: 'Include names, contacts, and short CVs of all committee members',
    required: true,
  },
  {
    key: 'DISTRICT_CERTIFICATE',
    name: 'District Certificate',
    description: 'Certificate from your district confirming your organization',
    required: true,
  },
  {
    key: 'LAND_UPI_PHOTOS',
    name: 'Land UPI and Photos of the Church',
    description: 'Proof of land ownership and photos of church building',
    required: true,
  },
  {
    key: 'ORGANIZATIONAL_DOCTRINE',
    name: 'Organizational Doctrine',
    description: 'Document explaining your organization\'s beliefs and practices',
    required: true,
  },
  {
    key: 'ANNUAL_ACTION_PLAN',
    name: 'Annual Action Plan',
    description: 'Detailed plan of activities for the coming year',
    required: true,
  },
  {
    key: 'PROOF_OF_PAYMENT',
    name: 'Proof of Payment',
    description: 'Receipt or proof of application fee payment',
    required: true,
  },
  {
    key: 'PARTNERSHIP_DOCUMENT',
    name: 'Partnership Document',
    description: 'Documentation of partnerships with other organizations (if applicable)',
    required: false,
  },
  {
    key: 'PASTOR_DOCUMENT',
    name: 'Pastor Document',
    description: 'CV, ordination letter, and other credentials of your pastor',
    required: true,
  },
];

const NewApplication = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.applications);
  const { provinces, loading: provincesLoading } = useSelector((state) => state.provinces);
  const [step, setStep] = useState(1);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [documents, setDocuments] = useState({});
  const [documentErrors, setDocumentErrors] = useState({});
  const [manualSubmit, setManualSubmit] = useState(false); // Add this state to track manual submission
  const formRef = useRef(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm();

  const watchAllFields = watch();
  const watchProvinceId = watch('province_id');
  const watchDistrictId = watch('district_id');
  const watchOrganizationName = watch('organization_name');

  // Custom validation function for acronym
  const validateAcronym = (acronym, organizationName) => {
    if (!acronym || !organizationName) return true; // Skip validation if either is empty
    
    // Remove spaces and convert to lowercase for comparison
    const orgNameCleaned = organizationName.replace(/\s+/g, '').toLowerCase();
    const acronymCleaned = acronym.replace(/\s+/g, '').toLowerCase();
    
    // Check if each letter in acronym exists in organization name
    for (let char of acronymCleaned) {
      if (!orgNameCleaned.includes(char)) {
        return false;
      }
    }
    
    return true;
  };

  // Fetch provinces on component mount
  useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);

  // Update available districts when province changes
  useEffect(() => {
    if (watchProvinceId) {
      const province = provinces.find(p => p.id === parseInt(watchProvinceId));
      if (province) {
        setSelectedProvince(province.name);
        setAvailableDistricts(province.districts || []);
        // Reset district selection when province changes
        setValue('district_id', '');
      }
    } else {
      setAvailableDistricts([]);
      setSelectedProvince('');
    }
  }, [watchProvinceId, provinces, setValue]);

  const handleFileChange = (docType, e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setDocumentErrors({
          ...documentErrors,
          [docType]: 'File size exceeds 5MB limit'
        });
        e.target.value = null; // Reset the input
        return;
      }
      
      // Validate file type (PDF, DOC, DOCX, JPG, JPEG, PNG)
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setDocumentErrors({
          ...documentErrors,
          [docType]: 'Invalid file type. Please upload PDF, DOC, DOCX, JPG or PNG files'
        });
        e.target.value = null; // Reset the input
        return;
      }
      
      // Clear any errors
      const newErrors = {...documentErrors};
      delete newErrors[docType];
      setDocumentErrors(newErrors);
      
      // Store the file
      setDocuments({
        ...documents,
        [docType]: file
      });
    } else {
      // Remove the file if canceled
      const newDocuments = {...documents};
      delete newDocuments[docType];
      setDocuments(newDocuments);
    }
  };

  const validateDocuments = () => {
    const newErrors = {};
    let isValid = true;
    
    // Check required documents
    DOCUMENT_TYPES.forEach(doc => {
      if (doc.required && !documents[doc.key]) {
        newErrors[doc.key] = `${doc.name} is required`;
        isValid = false;
      }
    });
    
    setDocumentErrors(newErrors);
    return isValid;
  };

  // Modified onSubmit function to check for manual submission
  const onSubmit = async (data) => {
    // Only proceed if the manual submit button was clicked
    if (!manualSubmit) {
      return; // This prevents auto-submission
    }
    
    try {
      // Create a data object that separates form fields from files
      const submitData = {
        ...data,
        files: documents  // Pass the documents separately
      };
      
      const result = await dispatch(createApplication(submitData)).unwrap();
      toast.success('Application created successfully!');
      navigate(`/applicant/applications/${result.application.id}`);
    } catch (error) {
      toast.error(error.error || 'Failed to create application');
    } finally {
      setManualSubmit(false); // Reset the manual submit flag
    }
  };

  const nextStep = async () => {
    let fieldsToValidate = [];
    let shouldProceed = false;
    
    if (step === 1) {
      fieldsToValidate = [
        'organization_name', 
        'acronym',
        'organization_email', 
        'organization_phone', 
        'province_id', 
        'district_id'
      ];
      shouldProceed = await trigger(fieldsToValidate);
    } else if (step === 2) {
      fieldsToValidate = [
        'cluster_of_intervention', 
        'source_of_fund', 
        'description'
      ];
      shouldProceed = await trigger(fieldsToValidate);
    } else if (step === 3) {
      // Validate documents
      shouldProceed = validateDocuments();
    }

    if (shouldProceed) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  // Handle the manual submit button click
  const handleManualSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    setManualSubmit(true); // Set the flag to true
    
    // Manually trigger form submission
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  const steps = [
    { id: 1, name: 'Organization Details' },
    { id: 2, name: 'Cluster Information' },
    { id: 3, name: 'Required Documents' },
    { id: 4, name: 'Review & Submit' },
  ];

  // Get selected district and province names for display
  const getSelectedProvinceAndDistrict = () => {
    const province = provinces.find(p => p.id === parseInt(watchProvinceId));
    const district = availableDistricts.find(d => d.id === parseInt(watchDistrictId));
    
    return {
      provinceName: province?.name || '',
      districtName: district?.name || ''
    };
  };

  const { provinceName, districtName } = getSelectedProvinceAndDistrict();

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

      {/* Use onSubmit={handleSubmit(onSubmit)} for the form submission handler */}
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
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

                <div>
                  <Input
                    label="Acronym (Optional)"
                    placeholder="e.g., CCC, ADEPR, etc."
                    {...register('acronym', {
                      validate: (value) => {
                        if (!value) return true; // Skip validation if empty (optional field)
                        
                        if (!watchOrganizationName) {
                          return 'Please enter organization name first';
                        }
                        
                        if (value.length < 2) {
                          return 'Acronym must be at least 2 characters';
                        }
                        
                        if (value.length > 10) {
                          return 'Acronym must be 10 characters or less';
                        }
                        
                        if (!validateAcronym(value, watchOrganizationName)) {
                          return 'Acronym should contain letters from the organization name';
                        }
                        
                        return true;
                      }
                    })}
                    error={errors.acronym?.message}
                  />
                  {watchOrganizationName && (
                    <p className="mt-1 text-xs text-gray-500">
                      Hint: Create an acronym using letters from "{watchOrganizationName}"
                    </p>
                  )}
                </div>

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

                {/* Location Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Province Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Province <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      {...register('province_id', {
                        required: 'Province is required',
                      })}
                      disabled={provincesLoading}
                    >
                      <option value="">
                        {provincesLoading ? 'Loading provinces...' : 'Select Province'}
                      </option>
                      {provinces.map((province) => (
                        <option key={province.id} value={province.id}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                    {errors.province_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.province_id.message}</p>
                    )}
                  </div>

                  {/* District Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      {...register('district_id', {
                        required: 'District is required',
                      })}
                      disabled={!watchProvinceId || availableDistricts.length === 0}
                    >
                      <option value="">
                        {!watchProvinceId 
                          ? 'Select Province first' 
                          : availableDistricts.length === 0 
                          ? 'No districts available'
                          : 'Select District'
                        }
                      </option>
                      {availableDistricts.map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                    {errors.district_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.district_id.message}</p>
                    )}
                  </div>
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

            {/* Step 3: Required Documents */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Required Documents
                </h2>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Document Requirements</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• All files must be in PDF, DOC, DOCX, JPG or PNG format</li>
                    <li>• Maximum file size is 5MB per document</li>
                    <li>• Make sure all information is clearly visible and readable</li>
                    <li>• Documents marked with * are required</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  {DOCUMENT_TYPES.map((doc) => (
                    <div 
                      key={doc.key}
                      className={`border rounded-lg p-4 ${documents[doc.key] ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}
                    >
                      <div className="flex items-start">
                        <div className={`mt-0.5 mr-3 flex-shrink-0 ${documents[doc.key] ? 'text-green-500' : 'text-gray-400'}`}>
                          {documents[doc.key] ? (
                            <DocumentCheckIcon className="h-6 w-6" />
                          ) : (
                            <DocumentTextIcon className="h-6 w-6" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <label className="block text-sm font-medium text-gray-900">
                              {doc.name} {doc.required && <span className="text-red-500">*</span>}
                            </label>
                            {documents[doc.key] && (
                              <span className="text-xs text-green-600 font-medium">File selected</span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-gray-500">{doc.description}</p>
                          
                          <div className="mt-3">
                            <input
                              type="file"
                              id={`document_${doc.key}`}
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-medium
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                              onChange={(e) => handleFileChange(doc.key, e)}
                            />
                          </div>
                          
                          {documentErrors[doc.key] && (
                            <div className="mt-2 flex items-center text-sm text-red-600">
                              <ExclamationCircleIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                              {documentErrors[doc.key]}
                            </div>
                          )}
                          
                          {documents[doc.key] && (
                            <div className="mt-2 text-xs text-gray-500">
                              Selected: {documents[doc.key].name} ({(documents[doc.key].size / 1024 / 1024).toFixed(2)} MB)
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {step === 4 && (
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
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Province</dt>
                      <dd className="mt-1 text-sm text-gray-900">{provinceName}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">District</dt>
                      <dd className="mt-1 text-sm text-gray-900">{districtName}</dd>
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

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Uploaded Documents
                  </h3>
                  <ul className="divide-y divide-gray-200">
                    {DOCUMENT_TYPES.map((doc) => (
                      <li key={doc.key} className="py-3 flex items-center">
                        <div className={`flex-shrink-0 mr-3 ${documents[doc.key] ? 'text-green-500' : 'text-red-500'}`}>
                          {documents[doc.key] ? (
                            <DocumentCheckIcon className="h-5 w-5" />
                          ) : (
                            <ExclamationCircleIcon className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          {documents[doc.key] && (
                            <p className="text-xs text-gray-500">
                              {documents[doc.key].name} ({(documents[doc.key].size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Next Steps</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Your application with documents will be submitted for review</li>
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
              {step < steps.length ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                // Use onClick instead of type="submit" to handle the submission manually
                <Button 
                  onClick={handleManualSubmit} 
                  loading={loading}>
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