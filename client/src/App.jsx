import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import AuthInitializer from './components/AuthInitializer';
import Landing from './pages/Landing';
import { useAuthStore } from './store/useAuthStore';
import { Loader2 } from 'lucide-react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Quest = lazy(() => import('./pages/Quest'));
const Theory = lazy(() => import('./pages/Theory'));
const WorldMap = lazy(() => import('./pages/WorldMap'));
const History = lazy(() => import('./pages/History'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Settings = lazy(() => import('./pages/Settings'));

const PageLoader = () => (
  <div className="flex items-center justify-center py-24">
    <Loader2 className="w-8 h-8 text-brand animate-spin" />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/" />;
};

const HomeRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthInitializer>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomeRoute />} />

            <Route element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/map" element={<WorldMap />} />
              <Route path="/history" element={<History />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="/quest" element={
              <ProtectedRoute>
                <Quest />
              </ProtectedRoute>
            } />

            <Route path="/theory" element={
              <ProtectedRoute>
                <Theory />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthInitializer>
    </BrowserRouter>
  );
}

export default App;
