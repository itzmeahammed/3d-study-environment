import React from 'react';
import { motion } from 'framer-motion';
import { Home, BookOpen, BarChart3, Settings, User, Library, Brain, Shield, Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';

const Navigation: React.FC = () => {
  const { currentView, setCurrentView, user } = useStore();

  const getNavItems = () => {
    const baseItems = [
      { id: 'hub', icon: Home, label: 'Study Hub' },
      { id: 'library', icon: Library, label: 'Library' },
      { id: 'flashcards', icon: BookOpen, label: 'Flashcards' },
      { id: 'generator', icon: Brain, label: 'Generator' },
      { id: 'dashboard', icon: BarChart3, label: 'Analytics' }
    ];

    if (user?.role === 'admin') {
      baseItems.push({ id: 'admin', icon: Shield, label: 'Admin' });
    }

    baseItems.push({ id: 'settings', icon: Settings, label: 'Settings' });
    
    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <motion.nav 
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-xl rounded-full px-6 py-3 shadow-2xl border border-gray-200 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center space-x-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => setCurrentView(item.id as any)}
              className={`relative p-3 rounded-full transition-all duration-300 ${
                isActive 
                  ? 'bg-teal-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={20} />
              
              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-teal-600 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              
              {/* Label on Hover */}
              <motion.div
                className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-charcoal text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: isActive ? 1 : 0, y: 0 }}
              >
                {item.label}
              </motion.div>
            </motion.button>
          );
        })}
        
        {/* Quick Add Button */}
        <div className="w-px h-8 bg-gray-300 mx-2"></div>
        <motion.button
          className="p-3 bg-coral-600 text-white rounded-full hover:bg-coral-700 transition-colors shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Navigation;