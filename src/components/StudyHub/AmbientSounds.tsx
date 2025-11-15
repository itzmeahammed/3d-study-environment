import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

interface AmbientSoundsProps {
  mode: 'focus' | 'relax' | 'intense';
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  volume: number;
}

const AmbientSounds: React.FC<AmbientSoundsProps> = ({ mode, timeOfDay, volume }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('');

  const soundTracks = {
    focus: {
      morning: 'Forest Birds & Gentle Stream',
      afternoon: 'White Noise & Soft Rain',
      evening: 'Crackling Fireplace',
      night: 'Night Crickets & Distant Thunder'
    },
    relax: {
      morning: 'Ocean Waves & Seagulls',
      afternoon: 'Wind Through Trees',
      evening: 'Soft Piano & Nature',
      night: 'Deep Space Ambience'
    },
    intense: {
      morning: 'Energetic Instrumental',
      afternoon: 'Upbeat Lo-Fi',
      evening: 'Motivational Beats',
      night: 'Focus Frequencies'
    }
  };

  useEffect(() => {
    const track = soundTracks[mode][timeOfDay];
    setCurrentTrack(track);
    
    // In a real app, this would control actual audio playback
    console.log(`Playing: ${track} at ${volume * 100}% volume`);
  }, [mode, timeOfDay, volume]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div 
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-lg rounded-full px-6 py-3 shadow-lg border border-gray-200 z-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5 }}
    >
      <div className="flex items-center space-x-4">
        <motion.button
          onClick={togglePlayback}
          className={`p-2 rounded-full transition-colors ${
            isPlaying 
              ? 'bg-teal-100 text-teal-600' 
              : 'bg-gray-100 text-gray-600'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </motion.button>
        
        <div className="text-sm">
          <div className="font-medium text-charcoal">{currentTrack}</div>
          <div className="text-xs text-gray-500 capitalize">{mode} • {timeOfDay}</div>
        </div>
        
        <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-teal-500"
            animate={{ width: `${volume * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default AmbientSounds;