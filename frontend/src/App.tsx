import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { circleApi } from './services/api';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TutorialPage } from './pages/TutorialPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateCirclePage } from './pages/CreateCirclePage';
import { CirclePage } from './pages/CirclePage';
import { NewStoryPage } from './pages/NewStoryPage';
import { StoryPage } from './pages/StoryPage';
import {
  AdminLayout,
  AdminDashboard,
  AdminUsersPage,
  AdminUserDetailPage,
  AdminCirclesPage,
  AdminCircleDetailPage,
  AdminStoriesPage,
  AdminStoryDetailPage,
  AdminInvitationsPage,
} from './pages/admin';
import { AcceptInvitationPage } from './pages/AcceptInvitationPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [isCheckingCircles, setIsCheckingCircles] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isLoading && !isCheckingCircles && !redirectPath) {
      setIsCheckingCircles(true);
      circleApi.list()
        .then((res) => {
          if (res.data.length === 1) {
            setRedirectPath(`/circles/${res.data[0].id}`);
          } else {
            setRedirectPath('/dashboard');
          }
        })
        .catch(() => {
          setRedirectPath('/dashboard');
        });
    }
  }, [isAuthenticated, isLoading, isCheckingCircles, redirectPath]);

  if (isLoading || (isAuthenticated && !redirectPath)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return isAuthenticated && redirectPath ? <Navigate to={redirectPath} /> : <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/tutorial"
        element={
          <PrivateRoute>
            <TutorialPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/create-circle"
        element={
          <PrivateRoute>
            <CreateCirclePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/circles/:id"
        element={
          <PrivateRoute>
            <CirclePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/circles/:circleId/new-story"
        element={
          <PrivateRoute>
            <NewStoryPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/stories/:id"
        element={
          <PrivateRoute>
            <StoryPage />
          </PrivateRoute>
        }
      />

      {/* Invitation Route */}
      <Route path="/invitations/:token" element={<AcceptInvitationPage />} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="users/:id" element={<AdminUserDetailPage />} />
        <Route path="circles" element={<AdminCirclesPage />} />
        <Route path="circles/:id" element={<AdminCircleDetailPage />} />
        <Route path="stories" element={<AdminStoriesPage />} />
        <Route path="stories/:id" element={<AdminStoryDetailPage />} />
        <Route path="invitations" element={<AdminInvitationsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
