import React from 'react';
import { motion } from 'framer-motion';
import { X, Plus, BookOpen, Brain, Target, Settings, Download, Share2 } from 'lucide-react';
import StudyModeSelector from './StudyModeSelector';

interface QuickActionsProps {
  onClose: () => void;
  studyMode: 'focus' | 'relax' | 'intense';
  onStudyModeChange: (mode: 'focus' | 'relax' | 'intense') => void;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  onTimeOfDayChange: (time: 'morning' | 'afternoon' | 'evening' | 'night') => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ 
  onClose, 
  studyMode, 
  onStudyModeChange,
  timeOfDay,
  onTimeOfDayChange 
}) => {
  const quickActionItems = [
    { icon: Plus, label: 'Add Subject', action: () => console.log('Add subject') },
    { icon: BookOpen, label: 'Import Book', action: () => console.log('Import book') },
    { icon: Brain, label: 'Generate Quiz', action: () => console.log('Generate quiz') },
    { icon: Target, label: 'Set Goal', action: () => console.log('Set goal') },
    { icon: Download, label: 'Export Data', action: () => console.log('Export data') },
    { icon: Share2, label: 'Share Progress', action: () => console.log('Share progress') }
  ];

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-charcoal">Study Environment</h2>
          <motion.button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={24} />
          </motion.button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Study Mode Selection */}
          <div>
            <StudyModeSelector 
              currentMode={studyMode}
              onModeChange={onStudyModeChange}
            />
          </div>

          {/* Time of Day Selection */}
          <div>
            <h3 className="text-lg font-semibold text-charcoal mb-4">Lighting & Atmosphere</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'morning', label: 'Morning', emoji: '🌅' },
                { id: 'afternoon', label: 'Afternoon', emoji: '☀️' },
                { id: 'evening', label: 'Evening', emoji: '🌆' },
                { id: 'night', label: 'Night', emoji: '🌙' }
              ].map((time) => (
                <motion.button
                  key={time.id}
                  onClick={() => onTimeOfDayChange(time.id as any)}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                    timeOfDay === time.id
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-2xl mb-1">{time.emoji}</div>
                  <div className="text-sm font-medium">{time.label}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-charcoal mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickActionItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={index}
                  onClick={item.action}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-teal-50 hover:border-teal-200 transition-all duration-300 text-center"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="mx-auto text-gray-600 mb-2" size={24} />
                  <div className="text-sm font-medium text-gray-700">{item.label}</div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuickActions;