import React from 'react';
import { motion } from 'framer-motion';
import { Target, Heart, Flame, Brain, Zap, Coffee } from 'lucide-react';

interface StudyModeSelectorProps {
  currentMode: 'focus' | 'relax' | 'intense';
  onModeChange: (mode: 'focus' | 'relax' | 'intense') => void;
}

const StudyModeSelector: React.FC<StudyModeSelectorProps> = ({ currentMode, onModeChange }) => {
  const modes = [
    {
      id: 'focus' as const,
      name: 'Focus Mode',
      description: 'Deep concentration with minimal distractions',
      icon: Target,
      color: 'teal',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700',
      borderColor: 'border-teal-200'
    },
    {
      id: 'relax' as const,
      name: 'Relax Mode',
      description: 'Calm environment for leisurely learning',
      icon: Heart,
      color: 'coral',
      bgColor: 'bg-coral-50',
      textColor: 'text-coral-700',
      borderColor: 'border-coral-200'
    },
    {
      id: 'intense' as const,
      name: 'Intense Mode',
      description: 'High-energy environment for challenging topics',
      icon: Flame,
      color: 'mustard',
      bgColor: 'bg-mustard-50',
      textColor: 'text-mustard-700',
      borderColor: 'border-mustard-200'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-charcoal mb-4">Study Environment</h3>
      
      <div className="grid gap-3">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;
          
          return (
            <motion.button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                isActive 
                  ? `${mode.bgColor} ${mode.borderColor} ${mode.textColor}` 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${isActive ? 'bg-white/50' : 'bg-gray-100'}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{mode.name}</div>
                  <div className="text-sm opacity-80">{mode.description}</div>
                </div>
                {isActive && (
                  <motion.div
                    className="w-3 h-3 bg-current rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default StudyModeSelector;