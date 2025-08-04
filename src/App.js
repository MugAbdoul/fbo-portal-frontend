import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './redux/slices/authSlice';
import { initializeSocket } from './utils/socket';

// Layout components
import LandingLayout from './components/layouts/LandingLayout';
import AuthLayout from './components/layouts/AuthLayout';
import ApplicantLayout from './components/layouts/ApplicantLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Public pages
import HomePage from './pages/public/HomePage';
import ServicesPage from './pages/public/ServicesPage';
import FAQPage from './pages/public/FAQPage';
import AboutPage from './pages/public/AboutPage';
import VerifyCertificate from './pages/public/VerifyCertificate';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Applicant pages
import ApplicantDashboard from './pages/applicant/Dashboard';
import NewApplication from './pages/applicant/NewApplication';
import MyApplications from './pages/applicant/MyApplications';
import ApplicationDetails from './pages/applicant/ApplicationDetails';
import Profile from './pages/applicant/Profile';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import Applications from './pages/admin/Applications';
import AdminApplicationDetails from './pages/admin/ApplicationDetails';
import UserManagement from './pages/admin/UserManagement';
import Reports from './pages/admin/Reports';
import AuditLogs from './pages/admin/AuditLogs';

// Protected Route component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      initializeSocket(user);
    }
  }, [isAuthenticated, user]);

  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<HomePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="verify/:certificateNumber" element={<VerifyCertificate />} />
          <Route path="verify/" element={<VerifyCertificate />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Applicant Routes */}
        <Route
          path="/applicant"
          element={
            <ProtectedRoute userType="applicant">
              <ApplicantLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/applicant/dashboard" replace />} />
          <Route path="dashboard" element={<ApplicantDashboard />} />
          <Route path="new-application" element={<NewApplication />} />
          <Route path="applications" element={<MyApplications />} />
          <Route path="applications/:id" element={<ApplicationDetails />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute userType="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="applications" element={<Applications />} />
          <Route path="applications/:id" element={<AdminApplicationDetails />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="audit-logs" element={<AuditLogs />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;