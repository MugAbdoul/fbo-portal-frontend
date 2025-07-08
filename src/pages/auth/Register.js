import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { register as registerUser, clearError } from '../../redux/slices/authSlice';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import toast from 'react-hot-toast';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/applicant/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  const titleOptions = [
    { value: 'Mr', label: 'Mr.' },
    { value: 'Mrs', label: 'Mrs.' },
    { value: 'Ms', label: 'Ms.' },
    { value: 'Dr', label: 'Dr.' },
    { value: 'Rev', label: 'Rev.' },
    { value: 'Pastor', label: 'Pastor' },
    { value: 'Bishop', label: 'Bishop' },
  ];

  const genderOptions = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
  ];

  const civilStatusOptions = [
    { value: 'SINGLE', label: 'Single' },
    { value: 'MARRIED', label: 'Married' },
    { value: 'DIVORCED', label: 'Divorced' },
    { value: 'WIDOWED', label: 'Widowed' },
    { value: 'SEPARATED', label: 'Separated' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/auth/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in here
          </Link>
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Select
            label="Title"
            required
            options={titleOptions}
            {...register('title', {
              required: 'Title is required',
            })}
            error={errors.title?.message}
          />

          <Input
            label="First Name"
            required
            {...register('firstname', {
              required: 'First name is required',
              minLength: {
                value: 2,
                message: 'First name must be at least 2 characters',
              },
            })}
            error={errors.firstname?.message}
          />
        </div>

        <Input
          label="Last Name"
          required
          {...register('lastname', {
            required: 'Last name is required',
            minLength: {
              value: 2,
              message: 'Last name must be at least 2 characters',
            },
          })}
          error={errors.lastname?.message}
        />

        <Input
          label="Email Address"
          type="email"
          required
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          error={errors.email?.message}
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+250XXXXXXXXX"
          required
          {...register('phonenumber', {
            required: 'Phone number is required',
            pattern: {
              value: /^\+?[1-9]\d{1,14}$/,
              message: 'Invalid phone number format',
            },
          })}
          error={errors.phonenumber?.message}
        />

        <Input
          label="National ID or Passport Number"
          required
          {...register('nid_or_passport', {
            required: 'National ID or Passport is required',
            minLength: {
              value: 6,
              message: 'Must be at least 6 characters',
            },
          })}
          error={errors.nid_or_passport?.message}
        />

        <Input
          label="Nationality"
          required
          defaultValue="Rwandan"
          {...register('nationality', {
            required: 'Nationality is required',
          })}
          error={errors.nationality?.message}
        />

        <Input
          label="Date of Birth"
          type="date"
          required
          {...register('date_of_birth', {
            required: 'Date of birth is required',
            validate: {
              notFuture: (value) => {
                const today = new Date();
                const birthDate = new Date(value);
                return birthDate < today || 'Date of birth cannot be in the future';
              },
              minimumAge: (value) => {
                const today = new Date();
                const birthDate = new Date(value);
                const age = today.getFullYear() - birthDate.getFullYear();
                return age >= 18 || 'You must be at least 18 years old';
              },
            },
          })}
          error={errors.date_of_birth?.message}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Select
            label="Gender"
            required
            options={genderOptions}
            {...register('gender', {
              required: 'Gender is required',
            })}
            error={errors.gender?.message}
          />

          <Select
            label="Civil Status"
            required
            options={civilStatusOptions}
            {...register('civil_status', {
              required: 'Civil status is required',
            })}
            error={errors.civil_status?.message}
          />
        </div>

        <Input
          label="Password"
          type="password"
          required
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
              message: 'Password must contain uppercase, lowercase, number and special character',
            },
          })}
          error={errors.password?.message}
        />

        <Input
          label="Confirm Password"
          type="password"
          required
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) =>
              value === password || 'Passwords do not match',
          })}
          error={errors.confirmPassword?.message}
        />

        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            {...register('acceptTerms', {
              required: 'You must accept the terms and conditions',
            })}
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
            I agree to the{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </a>
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
        )}

        <Button
          type="submit"
          className="w-full"
          loading={loading}
          disabled={loading}
        >
          Create Account
        </Button>
      </form>
    </div>
  );
};

export default Register;