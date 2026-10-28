import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ResumeUploadPage } from './pages/ResumeUploadPage';
import { ResumeAnalysisPage } from './pages/ResumeAnalysisPage';
import { InterviewSetupPage } from './pages/InterviewSetupPage';
import { InterviewRoomPage } from './pages/InterviewRoomPage';
import { InterviewResultsPage } from './pages/InterviewResultsPage';
import { InterviewHistoryPage } from './pages/InterviewHistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { PrivacyPage } from './pages/PrivacyPage';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<string>('landing');
  const [viewData, setViewData] = useState<any>(null);

  const navigateTo = (view: string, data?: any) => {
    setViewData(data || null);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If initial load completes and user is authenticated and on landing, redirect to dashboard
  React.useEffect(() => {
    if (!isLoading && isAuthenticated && currentView === 'landing') {
      setCurrentView('dashboard');
    }
  }, [isAuthenticated, isLoading]);

  // Protected route check
  const protectedViews = [
    'dashboard', 'resume-upload', 'resume-analysis', 
    'interview-setup', 'interview-room', 'interview-results', 
    'interview-history', 'profile'
  ];

  if (!isLoading && !isAuthenticated && protectedViews.includes(currentView)) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Navbar currentView="login" onNavigate={navigateTo} />
        <LoginPage onNavigate={navigateTo} />
        <Footer onNavigate={navigateTo} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      <Navbar currentView={currentView} onNavigate={navigateTo} />

      <main className="flex-1">
        {currentView === 'landing' && <LandingPage onNavigate={navigateTo} />}
        {currentView === 'login' && <LoginPage onNavigate={navigateTo} />}
        {currentView === 'register' && <RegisterPage onNavigate={navigateTo} />}
        {currentView === 'dashboard' && <DashboardPage onNavigate={navigateTo} />}
        {currentView === 'resume-upload' && <ResumeUploadPage onNavigate={navigateTo} />}
        {currentView === 'resume-analysis' && (
          <ResumeAnalysisPage
            resume={viewData}
            onNavigate={navigateTo}
          />
        )}
        {currentView === 'interview-setup' && (
          <InterviewSetupPage
            initialResumeId={viewData?.resume_id}
            onNavigate={navigateTo}
          />
        )}
        {currentView === 'interview-room' && (
          <InterviewRoomPage
            initialSessionData={viewData?.sessionResponse}
            sessionConfig={viewData?.sessionConfig}
            onNavigate={navigateTo}
          />
        )}
        {currentView === 'interview-results' && (
          <InterviewResultsPage
            sessionId={viewData?.session_id}
            onNavigate={navigateTo}
          />
        )}
        {currentView === 'interview-history' && <InterviewHistoryPage onNavigate={navigateTo} />}
        {currentView === 'profile' && <ProfilePage onNavigate={navigateTo} />}
        {currentView === 'privacy' && <PrivacyPage onNavigate={navigateTo} />}
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
