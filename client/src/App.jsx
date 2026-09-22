import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { I18nProvider } from './context/I18nContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import { SplashScreen } from './components/splash/SplashScreen';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { TransactionModal } from './components/transactions/TransactionModal';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { InsightsPage } from './pages/InsightsPage';
import { SettingsPage } from './pages/SettingsPage';

// Protected Route Guard
const ProtectedRoute = ({ children, onOpenAuth }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Sign In Required
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          Please sign in or use the Instant Demo account to access your personal financial dashboard.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
        >
          Sign In / Demo Access
        </button>
      </div>
    );
  }

  return children;
};

const MainLayout = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [txModalOpen, setTxModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  // Splash Screen check: show only once per genuine browser session
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('artha_splash_seen');
  });

  return (
    <>
      {/* 3-second Animated Intro on Fresh Session */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-primary)] transition-colors">
        {/* Top Navbar */}
        <Navbar
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenTransactionModal={() => setTxModalOpen(true)}
        />

        {/* Core Layout Body */}
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* Desktop Left Sidebar (Visible when Authenticated) */}
          {isAuthenticated && (
            <Sidebar onOpenTransactionModal={() => setTxModalOpen(true)} />
          )}

          {/* Main View Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 pb-24 lg:pb-12">
            <Routes>
              <Route
                path="/"
                element={<LandingPage onOpenAuth={() => setAuthModalOpen(true)} />}
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute onOpenAuth={() => setAuthModalOpen(true)}>
                    <DashboardPage onOpenTransactionModal={() => setTxModalOpen(true)} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions"
                element={
                  <ProtectedRoute onOpenAuth={() => setAuthModalOpen(true)}>
                    <TransactionsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/budgets"
                element={
                  <ProtectedRoute onOpenAuth={() => setAuthModalOpen(true)}>
                    <BudgetsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/insights"
                element={
                  <ProtectedRoute onOpenAuth={() => setAuthModalOpen(true)}>
                    <InsightsPage onOpenTransactionModal={() => setTxModalOpen(true)} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute onOpenAuth={() => setAuthModalOpen(true)}>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

        {/* Mobile Navigation Floating Bottom Bar */}
        {isAuthenticated && <MobileNav />}

        {/* Global Footer */}
        <Footer />

        {/* Global Modals */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
        <TransactionModal
          isOpen={txModalOpen}
          onClose={() => setTxModalOpen(false)}
          onSuccess={() => window.location.reload()}
        />
      </div>
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <ToastProvider>
          <AuthProvider>
            <BrowserRouter>
              <MainLayout />
            </BrowserRouter>
          </AuthProvider>
        </ToastProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
