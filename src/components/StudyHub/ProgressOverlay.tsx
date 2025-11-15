import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Target, Award } from 'lucide-react';
import { Subject, User } from '../../types';

interface ProgressOverlayProps {
  subjects: Subject[];
  studyStats: {
    todayTime: number;
    weekTime: number;
    monthTime: number;
    totalSessions: number;
  };
  user: User | null;
}

const ProgressOverlay: React.FC<ProgressOverlayProps> = ({ subjects, studyStats, user }) => {
  const overallProgress = subjects.length > 0 
    ? subjects.reduce((acc, subject) => acc + subject.progress, 0) / subjects.length 
    : 0;

  const todayGoal = user?.preferences.studySettings.dailyGoal || 120;
  const goalProgress = (studyStats.todayTime / todayGoal) * 100;

  return (
    <motion.div 
      className="absolute top-40 left-6 bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200 max-w-xs z-10"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2 }}
    >
      <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center">
        <TrendingUp className="mr-2 text-teal-600" size={20} />
        Today's Progress
      </h3>
      
      <div className="space-y-4">
        {/* Daily Goal Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Daily Goal</span>
            <span className="text-sm font-bold text-teal-600">
              {studyStats.todayTime}m / {todayGoal}m
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(goalProgress, 100)}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>

        {/* Overall Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-bold text-coral-600">
              {Math.round(overallProgress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-coral-500 to-coral-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="text-center">
            <div className="text-lg font-bold text-mustard-600">{user?.streakDays}</div>
            <div className="text-xs text-gray-500">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{user?.level}</div>
            <div className="text-xs text-gray-500">Level</div>
          </div>
        </div>

        {/* Recent Achievement */}
        {user?.achievements.length > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <Award className="text-mustard-600" size={16} />
              <div>
                <div className="text-sm font-medium text-charcoal">Latest Achievement</div>
                <div className="text-xs text-gray-500">
                  {user.achievements[user.achievements.length - 1]?.title}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProgressOverlay;