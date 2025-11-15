import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, X, Star } from 'lucide-react';

interface AchievementNotificationProps {
  achievementId: string;
  onClose: () => void;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ achievementId, onClose }) => {
  const achievements = {
    'hour-study': {
      title: 'Study Marathon',
      description: 'Studied for 1 hour straight!',
      icon: '🏃‍♂️',
      rarity: 'rare',
      xp: 500
    },
    'first-book': {
      title: 'Book Worm',
      description: 'Opened your first book!',
      icon: '📚',
      rarity: 'common',
      xp: 100
    },
    'flashcard-master': {
      title: 'Memory Master',
      description: 'Reviewed 50 flashcards!',
      icon: '🧠',
      rarity: 'epic',
      xp: 1000
    }
  };

  const achievement = achievements[achievementId as keyof typeof achievements];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!achievement) return null;

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-yellow-600'
  };

  return (
    <motion.div
      className="fixed top-20 right-6 z-50"
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className={`bg-gradient-to-r ${rarityColors[achievement.rarity as keyof typeof rarityColors]} p-1 rounded-2xl shadow-2xl`}>
        <div className="bg-white rounded-xl p-6 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 20 }, (_, i) => (
              <Star 
                key={i}
                className="absolute animate-pulse"
                size={8}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-4xl">{achievement.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-charcoal">Achievement Unlocked!</h3>
                  <div className={`text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r ${rarityColors[achievement.rarity as keyof typeof rarityColors]} text-white`}>
                    {achievement.rarity.toUpperCase()}
                  </div>
                </div>
              </div>
              
              <motion.button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={16} />
              </motion.button>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-charcoal mb-1">{achievement.title}</h4>
              <p className="text-sm text-gray-600">{achievement.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trophy className="text-mustard-600" size={16} />
                <span className="text-sm font-medium text-mustard-600">+{achievement.xp} XP</span>
              </div>
              
              <motion.div
                className="flex space-x-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {Array.from({ length: 5 }, (_, i) => (
                  <Star 
                    key={i}
                    className="text-mustard-500"
                    size={12}
                    fill="currentColor"
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementNotification;