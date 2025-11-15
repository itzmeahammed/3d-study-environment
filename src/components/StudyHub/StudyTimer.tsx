import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, Clock, Coffee } from 'lucide-react';
import { StudySession } from '../../types';

interface StudyTimerProps {
  session: StudySession;
  onEnd: () => void;
}

const StudyTimer: React.FC<StudyTimerProps> = ({ session, onEnd }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [showBreakReminder, setShowBreakReminder] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const start = new Date(session.startTime).getTime();
        const elapsed = Math.floor((now - start) / 1000);
        setElapsedTime(elapsed);
        
        // Show break reminder every 25 minutes
        if (elapsed > 0 && elapsed % (25 * 60) === 0) {
          setShowBreakReminder(true);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, session.startTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <motion.div 
        className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-gray-200 z-30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Clock className="text-teal-600" size={20} />
            <span className="text-2xl font-mono font-bold text-charcoal">
              {formatTime(elapsedTime)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => setIsRunning(!isRunning)}
              className={`p-2 rounded-lg transition-colors ${
                isRunning 
                  ? 'bg-coral-100 text-coral-600 hover:bg-coral-200' 
                  : 'bg-teal-100 text-teal-600 hover:bg-teal-200'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isRunning ? <Pause size={16} /> : <Play size={16} />}
            </motion.button>
            
            <motion.button
              onClick={onEnd}
              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Square size={16} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Break Reminder */}
      {showBreakReminder && (
        <motion.div 
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 shadow-2xl border border-gray-200 z-40"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-center">
            <Coffee className="mx-auto text-coral-600 mb-4" size={48} />
            <h3 className="text-xl font-bold text-charcoal mb-2">Time for a Break!</h3>
            <p className="text-gray-600 mb-4">You've been studying for 25 minutes. Take a 5-minute break.</p>
            <div className="flex space-x-3">
              <motion.button
                onClick={() => setShowBreakReminder(false)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Take Break
              </motion.button>
              <motion.button
                onClick={() => setShowBreakReminder(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default StudyTimer;