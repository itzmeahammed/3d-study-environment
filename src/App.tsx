import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import HeroSection from './components/Landing/HeroSection';
import LoginForm from './components/Auth/LoginForm';
import SubjectSetup from './components/Onboarding/SubjectSetup';
import StudyRoom3D from './components/StudyHub/StudyRoom3D';
import LibraryView from './components/Library/LibraryView';
import AnalyticsDashboard from './components/Dashboard/AnalyticsDashboard';
import FlashcardViewer from './components/Flashcards/FlashcardViewer';
import FlashcardGenerator from './components/Flashcards/FlashcardGenerator';
import SettingsPanel from './components/Settings/SettingsPanel';
import AdminDashboard from './components/Admin/AdminDashboard';
import Navigation from './components/Layout/Navigation';

function App() {
  const { currentView, isAuthenticated, user } = useStore();

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };

  const renderCurrentView = () => {
    if (!isAuthenticated) {
      return currentView === 'landing' ? <HeroSection /> : <LoginForm />;
    }

    switch (currentView) {
      case 'onboarding':
        return <SubjectSetup />;
      case 'hub':
        return <StudyRoom3D />;
      case 'library':
        return <LibraryView />;
      case 'dashboard':
        return <AnalyticsDashboard />;
      case 'flashcards':
        return <FlashcardViewer />;
      case 'generator':
        return <FlashcardGenerator />;
      case 'settings':
        return <SettingsPanel />;
      case 'admin':
        return user?.role === 'admin' ? <AdminDashboard /> : <StudyRoom3D />;
      default:
        return <StudyRoom3D />;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          {renderCurrentView()}
        </motion.div>
      </AnimatePresence>
      
      {isAuthenticated && currentView !== 'landing' && currentView !== 'onboarding' && (
        <Navigation />
      )}
    </div>
  );
}

export default App;