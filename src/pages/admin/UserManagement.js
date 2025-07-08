import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { getUsers, createUser, updateUser, deleteUser } from '../../redux/slices/adminSlice';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  UserIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'FBO_OFFICER', label: 'FBO Officer' },
    { value: 'DIVISION_MANAGER', label: 'Division Manager' },
    { value: 'HOD', label: 'Head of Department' },
    { value: 'SECRETARY_GENERAL', label: 'Secretary General' },
    { value: 'CEO', label: 'Chief Executive Officer' },
  ];

  const genderOptions = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
  ];

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'FBO_OFFICER':
        return 'FBO Officer';
      case 'DIVISION_MANAGER':
        return 'Division Manager';
      case 'HOD':
        return 'Head of Department';
      case 'SECRETARY_GENERAL':
        return 'Secretary General';
      case 'CEO':
        return 'Chief Executive Officer';
      default:
        return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'CEO':
        return 'text-purple-700 bg-purple-100';
      case 'SECRETARY_GENERAL':
        return 'text-blue-700 bg-blue-100';
      case 'HOD':
        return 'text-green-700 bg-green-100';
      case 'DIVISION_MANAGER':
        return 'text-yellow-700 bg-yellow-100';
      case 'FBO_OFFICER':
        return 'text-gray-700 bg-gray-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !roleFilter || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const openModal = (user = null) => {
    setEditingUser(user);
    if (user) {
      setValue('firstname', user.firstname);
      setValue('lastname', user.lastname);
      setValue('email', user.email);
      setValue('phonenumber', user.phonenumber);
      setValue('role', user.role);
      setValue('gender', user.gender);
    } else {
      reset();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      if (editingUser) {
        await dispatch(updateUser({
          userId: editingUser.id,
          userData: data
        })).unwrap();
        toast.success('User updated successfully!');
      } else {
        await dispatch(createUser(data)).unwrap();
        toast.success('User created successfully!');
      }
      closeModal();
    } catch (error) {
      toast.error(error.error || 'Operation failed');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (userId === currentUser.id) {
      toast.error('You cannot delete your own account');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        toast.success('User deleted successfully!');
      } catch (error) {
        toast.error(error.error || 'Failed to delete user');
      }
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="mt-2 text-gray-600">
              Manage admin users and their roles in the system
            </p>
          </div>
          <Button
            onClick={() => openModal()}
            className="flex items-center space-x-2"
          >
            <UserPlusIcon className="h-5 w-5" />
            <span>Add User</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <Card.Content className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select
              options={roleOptions}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              placeholder="Filter by role"
            />
            
            <div className="text-sm text-gray-600 flex items-center">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Users List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstname} {user.lastname}
                          {user.id === currentUser.id && (
                            <span className="ml-2 text-xs text-blue-600">(You)</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                      {getRoleDisplayName(user.role)}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.phonenumber}</div>
                    <div className="text-sm text-gray-500">{user.gender}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.enabled ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                    }`}>
                      {user.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openModal(user)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      
                      {user.id !== currentUser.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id, `${user.firstname} ${user.lastname}`)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModal}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      {editingUser ? 'Edit User' : 'Add New User'}
                    </h3>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        required
                        {...register('firstname', {
                          required: 'First name is required',
                        })}
                        error={errors.firstname?.message}
                      />
                      
                      <Input
                        label="Last Name"
                        required
                        {...register('lastname', {
                          required: 'Last name is required',
                        })}
                        error={errors.lastname?.message}
                      />
                    </div>
                    
                    <Input
                      label="Email"
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
                      required
                      {...register('phonenumber', {
                        required: 'Phone number is required',
                      })}
                      error={errors.phonenumber?.message}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label="Role"
                        required
                        options={roleOptions.slice(1)} // Remove "All Roles" option
                        {...register('role', {
                          required: 'Role is required',
                        })}
                        error={errors.role?.message}
                      />
                      
                      <Select
                        label="Gender"
                        required
                        options={genderOptions}
                        {...register('gender', {
                          required: 'Gender is required',
                        })}
                        error={errors.gender?.message}
                      />
                    </div>
                    
                    {!editingUser && (
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
                        })}
                        error={errors.password?.message}
                      />
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <Button type="submit" className="w-full sm:w-auto sm:ml-3">
                    {editingUser ? 'Update User' : 'Create User'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    className="mt-3 w-full sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;