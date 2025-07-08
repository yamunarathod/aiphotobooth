
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import { AuthProvider } from "contexts/AuthContext";
import LandingPage from "pages/landing-page";
import Login from "pages/auth/Login";
import Signup from "pages/auth/Signup";
import Dashboard from "pages/dashboard";
import SubscriptionPage from "pages/subscription";
import NotFound from "pages/NotFound";
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import EventManagement from "pages/event-management";
import CreateEvent from "pages/create-event";
import UserProfile from "pages/user-profile";

// Component to protect auth routes (login/signup) from logged-in users
export const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is already logged in, redirect to home page
  if (user) {
    return <Navigate to="/" replace />;
  }

  // If not logged in, show the auth page (login/signup)
  return children;
};

// Component to protect dashboard/subscription routes from non-logged-in users
export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, show the protected page
  return children;
};


const Routes = () => {
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <RouterRoutes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing-page" element={<LandingPage />} />

            {/* Auth routes - redirect to home if already logged in */}
            <Route
              path="/login"
              element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <AuthRoute>
                  <Signup />
                </AuthRoute>
              }
            />
            <Route path="/event-management" element={<EventManagement />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/user-profile" element={<UserProfile />} />

            {/* Protected routes - require authentication */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/subscription"
              element={
                <PrivateRoute>
                  <SubscriptionPage />
                </PrivateRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;