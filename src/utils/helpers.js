import { APPLICATION_STATUS, RISK_LEVELS, USER_ROLES } from './constants';

// Format date utilities
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return new Date(date).toLocaleDateString('en-US', defaultOptions);
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(date);
};

// Status utilities
export const formatStatus = (status) => {
  if (!status) return '';
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

export const getStatusColor = (status) => {
  const colors = {
    [APPLICATION_STATUS.PENDING]: 'blue',
    [APPLICATION_STATUS.UNDER_REVIEW]: 'blue',
    [APPLICATION_STATUS.REVIEWING_AGAIN]: 'yellow',
    [APPLICATION_STATUS.DRAFT]: 'blue',
    [APPLICATION_STATUS.DM_REVIEW]: 'blue',
    [APPLICATION_STATUS.HOD_REVIEW]: 'blue',
    [APPLICATION_STATUS.SG_REVIEW]: 'blue',
    [APPLICATION_STATUS.CEO_REVIEW]: 'blue',
    [APPLICATION_STATUS.APPROVED]: 'green',
    [APPLICATION_STATUS.REJECTED]: 'red',
    [APPLICATION_STATUS.CERTIFICATE_ISSUED]: 'green'
  };
  
  return colors[status] || 'gray';
};

// Risk utilities
export const getRiskLevel = (score) => {
  if (score >= RISK_LEVELS.HIGH.min) return RISK_LEVELS.HIGH;
  if (score >= RISK_LEVELS.MEDIUM.min) return RISK_LEVELS.MEDIUM;
  return RISK_LEVELS.LOW;
};

export const getRiskColor = (score) => {
  const risk = getRiskLevel(score);
  return risk.color;
};

// Role utilities
export const formatRole = (role) => {
  const roleNames = {
    [USER_ROLES.FBO_OFFICER]: 'FBO Officer',
    [USER_ROLES.DIVISION_MANAGER]: 'Division Manager',
    [USER_ROLES.HOD]: 'Head of Department',
    [USER_ROLES.SECRETARY_GENERAL]: 'Secretary General',
    [USER_ROLES.CEO]: 'Chief Executive Officer'
  };
  
  return roleNames[role] || role;
};

// File utilities
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

export const isImageFile = (filename) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const extension = getFileExtension(filename).toLowerCase();
  return imageExtensions.includes(extension);
};

// Validation utilities
export const validateEmail = (email) => {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
};

export const validatePhone = (phone) => {
  const pattern = /^\+?[1-9]\d{1,14}$/;
  return pattern.test(phone.replace(/\s/g, ''));
};

export const validatePassword = (password) => {
  const rules = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  const isValid = Object.values(rules).every(rule => rule);
  
  return {
    isValid,
    rules,
    message: isValid ? 'Password is valid' : 'Password does not meet requirements'
  };
};

// URL utilities
export const generateApplicationUrl = (applicationId) => {
  return `/applicant/applications/${applicationId}`;
};

export const generateAdminApplicationUrl = (applicationId) => {
  return `/admin/applications/${applicationId}`;
};

export const generateCertificateVerificationUrl = (certificateNumber) => {
  return `/verify/${certificateNumber}`;
};

// Export utilities
export const downloadFile = (data, filename, type = 'text/csv') => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const generateCSV = (data, headers) => {
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => 
      `"${String(row[header] || '').replace(/"/g, '""')}"`
    ).join(','))
  ].join('\n');
  
  return csvContent;
};

// Debounce utility
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Local storage utilities
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};