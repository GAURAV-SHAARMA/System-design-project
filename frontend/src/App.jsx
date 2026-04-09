import { Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './layouts/AppShell';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PlansPage from './pages/PlansPage';
import RecommendationsPage from './pages/RecommendationsPage';
import ClaimsPage from './pages/ClaimsPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminPage from './pages/AdminPage';

function ShellPage({ children }) {
  return <AppShell>{children}</AppShell>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<ProtectedRoute><ShellPage><DashboardPage /></ShellPage></ProtectedRoute>} />
      <Route path="/plans" element={<ProtectedRoute><ShellPage><PlansPage /></ShellPage></ProtectedRoute>} />
      <Route path="/recommendations" element={<ProtectedRoute><ShellPage><RecommendationsPage /></ShellPage></ProtectedRoute>} />
      <Route path="/claims" element={<ProtectedRoute><ShellPage><ClaimsPage /></ShellPage></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><ShellPage><NotificationsPage /></ShellPage></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute role="ROLE_ADMIN"><ShellPage><AdminPage /></ShellPage></ProtectedRoute>} />
    </Routes>
  );
}
