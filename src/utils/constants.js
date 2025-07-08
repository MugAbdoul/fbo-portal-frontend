// Application statuses
export const APPLICATION_STATUS = {
  PENDING: 'PENDING',
  UNDER_REVIEW: 'UNDER_REVIEW',
  MISSING_DOCUMENTS: 'MISSING_DOCUMENTS',
  DRAFT: 'DRAFT',
  DM_REVIEW: 'DM_REVIEW',
  HOD_REVIEW: 'HOD_REVIEW',
  SG_REVIEW: 'SG_REVIEW',
  CEO_REVIEW: 'CEO_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CERTIFICATE_ISSUED: 'CERTIFICATE_ISSUED'
};

// User roles
export const USER_ROLES = {
  FBO_OFFICER: 'FBO_OFFICER',
  DIVISION_MANAGER: 'DIVISION_MANAGER',
  HOD: 'HOD',
  SECRETARY_GENERAL: 'SECRETARY_GENERAL',
  CEO: 'CEO'
};

// Document types
export const DOCUMENT_TYPES = {
  ORGANIZATION_COMMITTEE_NAMES_CVS: 'ORGANIZATION_COMMITTEE_NAMES_CVS',
  DISTRICT_CERTIFICATE: 'DISTRICT_CERTIFICATE',
  LAND_UPI_PHOTOS: 'LAND_UPI_PHOTOS',
  ORGANIZATIONAL_DOCTRINE: 'ORGANIZATIONAL_DOCTRINE',
  ANNUAL_ACTION_PLAN: 'ANNUAL_ACTION_PLAN',
  PROOF_OF_PAYMENT: 'PROOF_OF_PAYMENT',
  PARTNERSHIP_DOCUMENT: 'PARTNERSHIP_DOCUMENT'
};

// File upload constants
export const FILE_UPLOAD = {
  MAX_SIZE: 16 * 1024 * 1024, // 16MB
  ALLOWED_TYPES: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
  MIME_TYPES: {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png']
  }
};

// Risk levels
export const RISK_LEVELS = {
  LOW: { min: 0, max: 40, label: 'Low', color: 'green' },
  MEDIUM: { min: 40, max: 70, label: 'Medium', color: 'yellow' },
  HIGH: { min: 70, max: 100, label: 'High', color: 'red' }
};

// Notification types
export const NOTIFICATION_TYPES = {
  STATUS_CHANGE: 'STATUS_CHANGE',
  DOCUMENT_REQUEST: 'DOCUMENT_REQUEST',
  APPROVAL: 'APPROVAL',
  REJECTION: 'REJECTION',
  REMINDER: 'REMINDER',
  CERTIFICATE_READY: 'CERTIFICATE_READY'
};

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password'
  },
  APPLICATIONS: {
    BASE: '/applications',
    BY_ID: (id) => `/applications/${id}`,
    STATUS: '/applications/status',
    STATS: '/applications/stats',
    DOCUMENTS: (id) => `/applications/${id}/documents/requirements`
  },
  DOCUMENTS: {
    UPLOAD: '/documents/upload',
    DOWNLOAD: (id) => `/documents/${id}`,
    VALIDATE: (id) => `/documents/${id}/validate`
  },
  CERTIFICATES: {
    GENERATE: (id) => `/certificates/generate/${id}`,
    VERIFY: (number) => `/certificates/verify/${number}`,
    DOWNLOAD: (id) => `/certificates/download/${id}`
  },
  ADMIN: {
    USERS: '/admin/users',
    STATS: '/admin/dashboard/stats',
    REPORTS: '/admin/reports/generate'
  }
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  LANGUAGE: 'language',
  THEME: 'theme'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};