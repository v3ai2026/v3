import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './hooks/useAuth';
import { NeuralSpinner, NeuralBadge } from './components/UIElements';

// Page imports
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Profile } from './pages/Profile';
import { Billing } from './pages/Billing';
import { Settings } from './pages/Settings';
import { Teams } from './pages/Teams';
import { ApiKeys } from './pages/ApiKeys';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Auth wrapper component
const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#020420]">
        <NeuralSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Auth page wrapper
const AuthPage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#020420]">
        <NeuralSpinner />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#020420] p-4">
      {children}
    </div>
  );
};

// Sidebar navigation component
const Sidebar: React.FC = () => {
  const location = useLocation();
  const { profile } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/projects', icon: '📁', label: 'Projects' },
    { path: '/teams', icon: '👥', label: 'Teams' },
    { path: '/billing', icon: '💳', label: 'Billing' },
    { path: '/api-keys', icon: '🔑', label: 'API Keys' },
    { path: '/profile', icon: '👤', label: 'Profile' },
    { path: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex w-64 border-r border-[#1a1e43] bg-[#020420] flex-col">
        <div className="p-6 border-b border-[#1a1e43]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-nuxt-gradient flex items-center justify-center text-black font-black text-xl">
              A
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Admin Panel</h2>
              <p className="text-xs text-slate-500">{profile?.full_name}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#00DC82]/10 text-[#00DC82] border border-[#00DC82]/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-bold">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#1a1e43]">
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#00DC82]/10 to-blue-500/10 border border-[#00DC82]/20">
            <NeuralBadge variant="primary" className="mb-2">
              {profile?.subscription_tier?.toUpperCase()}
            </NeuralBadge>
            <p className="text-xs text-slate-400 mb-2">
              {profile?.ai_credits || 0} AI credits left
            </p>
            <Link to="/billing">
              <button className="w-full px-3 py-2 rounded-lg bg-[#00DC82] text-black text-xs font-black uppercase tracking-wider hover:bg-[#00DC82]/80 transition-colors">
                Upgrade
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#020420]/95 backdrop-blur-xl border-b border-[#1a1e43] z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-nuxt-gradient flex items-center justify-center text-black font-black">
            A
          </div>
          <span className="text-sm font-black text-white">Admin Panel</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg bg-white/5 text-white"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#020420]/95 backdrop-blur-xl">
          <div className="p-4 border-b border-[#1a1e43] flex items-center justify-between">
            <span className="text-lg font-black text-white">Menu</span>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 rounded-lg bg-white/5 text-white"
            >
              ✕
            </button>
          </div>
          <div className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#00DC82]/10 text-[#00DC82] border border-[#00DC82]/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-bold">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

// Main layout component
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#020420] text-white flex">
      <Sidebar />
      <div className="flex-1 md:pt-0 pt-16">
        {children}
      </div>
    </div>
  );
};

export const AdminApp: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Auth routes */}
          <Route
            path="/login"
            element={
              <AuthPage>
                <LoginForm onSuccess={() => {}} />
              </AuthPage>
            }
          />
          <Route
            path="/register"
            element={
              <AuthPage>
                <RegisterForm onSuccess={() => {}} />
              </AuthPage>
            }
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <AuthWrapper>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </AuthWrapper>
            }
          />
          <Route
            path="/projects"
            element={
              <AuthWrapper>
                <MainLayout>
                  <Projects />
                </MainLayout>
              </AuthWrapper>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthWrapper>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </AuthWrapper>
            }
          />
          <Route
            path="/billing"
            element={
              <AuthWrapper>
                <MainLayout>
                  <Billing />
                </MainLayout>
              </AuthWrapper>
            }
          />
          <Route
            path="/settings"
            element={
              <AuthWrapper>
                <MainLayout>
                  <Settings />
                </MainLayout>
              </AuthWrapper>
            }
          />
          <Route
            path="/teams"
            element={
              <AuthWrapper>
                <MainLayout>
                  <Teams />
                </MainLayout>
              </AuthWrapper>
            }
          />
          <Route
            path="/api-keys"
            element={
              <AuthWrapper>
                <MainLayout>
                  <ApiKeys />
                </MainLayout>
              </AuthWrapper>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
