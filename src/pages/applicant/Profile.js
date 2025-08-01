import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { updateProfile, changePassword } from '../../redux/slices/authSlice';
import { UserIcon, LockClosedIcon, CheckIcon } from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import toast from 'react-hot-toast';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm({
    defaultValues: {
      firstname: user?.firstname || '',
      lastname: user?.lastname || '',
      phonenumber: user?.phonenumber || '',
      nationality: user?.nationality || '',
      title: user?.title || '',
    }
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch,
  } = useForm();

  const newPassword = watch('newPassword');

  const onProfileSubmit = async (data) => {
    setLoading(true);
    try {
      await dispatch(updateProfile(data)).unwrap();
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setLoading(true);
    try {
      await dispatch(changePassword({
        current_password: data.currentPassword,
        new_password: data.newPassword,
      })).unwrap();
      toast.success('Password changed successfully!');
      resetPassword();
    } catch (error) {
      toast.error(error.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile Information', icon: UserIcon },
    { id: 'security', name: 'Security', icon: LockClosedIcon },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account information and security settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <Card>
              <Card.Header>
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-6 w-6 text-gray-400" />
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                </div>
              </Card.Header>
              <Card.Content>
                <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                  <Input
                    label="First Name"
                    {...registerProfile('firstname', {
                      required: 'First name is required',
                      minLength: {
                        value: 2,
                        message: 'First name must be at least 2 characters',
                      },
                    })}
                    error={profileErrors.firstname?.message}
                  />

                  <Input
                    label="Last Name"
                    {...registerProfile('lastname', {
                      required: 'Last name is required',
                      minLength: {
                        value: 2,
                        message: 'Last name must be at least 2 characters',
                      },
                    })}
                    error={profileErrors.lastname?.message}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Phone Number"
                      type="tel"
                      {...registerProfile('phonenumber', {
                        required: 'Phone number is required',
                        pattern: {
                          value: /^\+?[1-9]\d{1,14}$/,
                          message: 'Invalid phone number format',
                        },
                      })}
                      error={profileErrors.phonenumber?.message}
                    />

                    <Input
                      label="Nationality"
                      {...registerProfile('nationality', {
                        required: 'Nationality is required',
                      })}
                      error={profileErrors.nationality?.message}
                    />
                  </div>

                  {/* Read-only fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-500">
                        {user?.email}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Email cannot be changed
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        National ID / Passport
                      </label>
                      <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-500">
                        {user?.nid_or_passport}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        ID cannot be changed
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => resetProfile()}
                    >
                      Reset
                    </Button>
                    <Button type="submit" loading={loading}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Card.Content>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <Card.Header>
                <div className="flex items-center space-x-3">
                  <LockClosedIcon className="h-6 w-6 text-gray-400" />
                  <h2 className="text-xl font-semibold">Change Password</h2>
                </div>
              </Card.Header>
              <Card.Content>
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
                  <Input
                    label="Current Password"
                    type="password"
                    {...registerPassword('currentPassword', {
                      required: 'Current password is required',
                    })}
                    error={passwordErrors.currentPassword?.message}
                  />

                  <Input
                    label="New Password"
                    type="password"
                    {...registerPassword('newPassword', {
                      required: 'New password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                        message: 'Password must contain uppercase, lowercase, number and special character',
                      },
                    })}
                    error={passwordErrors.newPassword?.message}
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    {...registerPassword('confirmPassword', {
                      required: 'Please confirm your new password',
                      validate: (value) =>
                        value === newPassword || 'Passwords do not match',
                    })}
                    error={passwordErrors.confirmPassword?.message}
                  />

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">
                      Password Requirements
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li className="flex items-center space-x-2">
                        <CheckIcon className="h-4 w-4" />
                        <span>At least 8 characters long</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckIcon className="h-4 w-4" />
                        <span>Contains uppercase and lowercase letters</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckIcon className="h-4 w-4" />
                        <span>Contains at least one number</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckIcon className="h-4 w-4" />
                        <span>Contains at least one special character</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => resetPassword()}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" loading={loading}>
                      Change Password
                    </Button>
                  </div>
                </form>
              </Card.Content>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;