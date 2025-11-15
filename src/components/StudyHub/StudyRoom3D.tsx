import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  ContactShadows, 
  PerspectiveCamera, 
  Text, 
  Float, 
  Sparkles,
  Stars,
  Cloud,
  Sky,
  Plane,
  Box,
  Sphere,
  Cylinder,
  useTexture,
  Html
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Play, 
  Pause, 
  Volume2, 
  Settings, 
  Search, 
  Filter,
  Clock,
  Target,
  Trophy,
  Zap,
  Brain,
  Star,
  Users,
  TrendingUp,
  Calendar,
  Award,
  Bookmark,
  Eye,
  Heart,
  Share2,
  Download,
  Edit,
  Plus,
  Lightbulb,
  Coffee,
  Moon,
  Sun,
  Wind,
  Flame,
  Sparkles as SparklesIcon
} from 'lucide-react';
import Book3D from './Book3D';
import BookReader from './BookReader';
import StudyTimer from './StudyTimer';
import AmbientSounds from './AmbientSounds';
import QuickActions from './QuickActions';
import ProgressOverlay from './ProgressOverlay';
import AchievementNotification from './AchievementNotification';
import { useStore } from '../../store/useStore';
import { Subject } from '../../types';

// Enhanced 3D Environment Components
const StudyDesk: React.FC = () => {
  const meshRef = useRef<any>();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  return (
    <group ref={meshRef} position={[0, -1.5, 4]}>
      {/* Main Desk Surface */}
      <Box args={[6, 0.15, 3]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#8B4513" roughness={0.3} metalness={0.1} />
      </Box>
      
      {/* Desk Legs */}
      {[[-2.7, -1, -1.3], [2.7, -1, -1.3], [-2.7, -1, 1.3], [2.7, -1, 1.3]].map((pos, i) => (
        <Cylinder key={i} args={[0.08, 0.08, 2]} position={pos as [number, number, number]}>
          <meshStandardMaterial color="#654321" />
        </Cylinder>
      ))}
      
      {/* Desk Items */}
      <Float speed={2} rotationIntensity={0.1}>
        <Box args={[0.3, 0.05, 0.2]} position={[-2, 0.1, 0.5]}>
          <meshStandardMaterial color="#FF6B6B" />
        </Box>
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.2}>
        <Cylinder args={[0.05, 0.05, 0.4]} position={[2, 0.25, 0.8]}>
          <meshStandardMaterial color="#FFD166" />
        </Cylinder>
      </Float>
    </group>
  );
};

const EnhancedBookshelf: React.FC = () => {
  return (
    <group position={[0, 0.5, -2]}>
      {/* Main Bookshelf Structure */}
      <Box args={[10, 8, 0.8]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#8B4513" roughness={0.4} />
      </Box>
      
      {/* Shelf Planks */}
      {[0, 1, 2, 3].map((row) => (
        <Box key={row} args={[9.5, 0.15, 1]} position={[0, 3 - row * 1.8, 0.1]}>
          <meshStandardMaterial color="#A0522D" roughness={0.3} />
        </Box>
      ))}
      
      {/* Decorative Elements */}
      <Float speed={1} rotationIntensity={0.1}>
        <Sphere args={[0.2]} position={[-4, 3.5, 0.6]}>
          <meshStandardMaterial color="#FFD166" emissive="#FFD166" emissiveIntensity={0.2} />
        </Sphere>
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.2}>
        <Box args={[0.3, 0.8, 0.1]} position={[4, 2, 0.6]}>
          <meshStandardMaterial color="#83C5BE" />
        </Box>
      </Float>
    </group>
  );
};

const StudyEnvironmentLighting: React.FC<{ timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' }> = ({ timeOfDay }) => {
  const lightConfigs = {
    morning: { ambient: 0.6, sun: '#FFE4B5', intensity: 1.2 },
    afternoon: { ambient: 0.8, sun: '#FFFFFF', intensity: 1.5 },
    evening: { ambient: 0.4, sun: '#FF8C00', intensity: 0.8 },
    night: { ambient: 0.2, sun: '#4169E1', intensity: 0.3 }
  };
  
  const config = lightConfigs[timeOfDay];
  
  return (
    <>
      <ambientLight intensity={config.ambient} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={config.intensity}
        color={config.sun}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 5, 5]} intensity={0.5} color="#FFD166" />
      <spotLight 
        position={[0, 8, 0]} 
        angle={0.4} 
        penumbra={0.1} 
        intensity={0.8}
        color="#006D77"
        castShadow
      />
    </>
  );
};

const ParticleSystem: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;
  
  return (
    <>
      <Sparkles count={100} scale={15} size={3} speed={0.2} color="#FFD166" />
      <Stars radius={50} depth={50} count={200} factor={2} saturation={0.5} fade />
    </>
  );
};

const StudyRoom3D: React.FC = () => {
  const { 
    subjects, 
    books, 
    user, 
    activeStudySession, 
    startStudySession, 
    endStudySession,
    unlockAchievement 
  } = useStore();
  
  const [openBookId, setOpenBookId] = useState<string | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('afternoon');
  const [ambientSoundsEnabled, setAmbientSoundsEnabled] = useState(false);
  const [studyMode, setStudyMode] = useState<'focus' | 'relax' | 'intense'>('focus');
  const [showParticles, setShowParticles] = useState(true);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 3, 10]);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [studyStats, setStudyStats] = useState({
    todayTime: 0,
    weekTime: 0,
    monthTime: 0,
    totalSessions: 0
  });
  const [achievements, setAchievements] = useState<string[]>([]);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);

  // Enhanced book positioning with multiple shelves and better organization
  const getBookPosition = (index: number, total: number): [number, number, number] => {
    const booksPerShelf = 4;
    const shelfCount = Math.ceil(total / booksPerShelf);
    const shelf = Math.floor(index / booksPerShelf);
    const positionOnShelf = index % booksPerShelf;
    
    const shelfSpacing = 1.8;
    const bookSpacing = 2.2;
    const startX = -(booksPerShelf - 1) * bookSpacing / 2;
    const startY = 3 - shelf * shelfSpacing;
    
    return [
      startX + positionOnShelf * bookSpacing,
      startY,
      -1.5 + Math.sin(index * 0.5) * 0.1 // Slight depth variation
    ];
  };

  const handleBookClick = (subjectId: string) => {
    const book = books.find(b => b.subjectId === subjectId);
    if (book) {
      setOpenBookId(book.id);
      if (!activeStudySession) {
        startStudySession(subjectId);
      }
    }
  };

  const handleCloseBook = () => {
    setOpenBookId(null);
  };

  const filteredSubjects = subjects.filter(subject => {
    const matchesFilter = selectedSubjectFilter === 'all' || subject.id === selectedSubjectFilter;
    const matchesSearch = searchQuery === '' || 
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleTimeOfDayChange = (newTime: typeof timeOfDay) => {
    setTimeOfDay(newTime);
  };

  const handleStudyModeChange = (mode: typeof studyMode) => {
    setStudyMode(mode);
    // Trigger different environmental effects based on mode
    if (mode === 'intense') {
      setShowParticles(true);
    }
  };

  // Study session timer effect
  useEffect(() => {
        let interval: number;
    
    if (activeStudySession) {
      interval = setInterval(() => {
        setStudyStats(prev => ({
          ...prev,
          todayTime: prev.todayTime + 1
        }));
      }, 60000); // Update every minute
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeStudySession]);

  // Achievement system
  useEffect(() => {
    if (studyStats.todayTime > 60 && !achievements.includes('hour-study')) {
      setAchievements(prev => [...prev, 'hour-study']);
      setShowAchievement('hour-study');
      unlockAchievement('hour-study');
    }
  }, [studyStats.todayTime]);

  return (
    <div className="h-screen bg-gradient-to-b from-stone-100 to-teal-50 relative overflow-hidden">
      {/* Enhanced Header with Real-time Stats */}
      <motion.div 
        className="absolute top-4 left-4 right-4 z-20"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-coral-500 rounded-full flex items-center justify-center">
                  <Brain className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-charcoal">
                    3D Learning Hub
                  </h1>
                  <p className="text-gray-600">
                    Welcome back, {user?.name}! Ready to learn?
                  </p>
                </div>
              </div>
              
              {/* Real-time Study Stats */}
              <div className="hidden lg:flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">{studyStats.todayTime}m</div>
                  <div className="text-xs text-gray-500">Today</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-coral-600">{user?.streakDays}</div>
                  <div className="text-xs text-gray-500">Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-mustard-600">{user?.level}</div>
                  <div className="text-xs text-gray-500">Level</div>
                </div>
              </div>
            </div>
            
            {/* Environment Controls */}
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="p-3 bg-teal-100 text-teal-600 rounded-full hover:bg-teal-200 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Settings size={20} />
              </motion.button>
              
              <motion.button
                onClick={() => setAmbientSoundsEnabled(!ambientSoundsEnabled)}
                className={`p-3 rounded-full transition-colors ${
                  ambientSoundsEnabled 
                    ? 'bg-coral-100 text-coral-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Volume2 size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filter Panel */}
      <motion.div 
        className="absolute top-28 left-4 right-4 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search subjects, books, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>{subject.name}</option>
              ))}
            </select>
            
            <div className="flex items-center space-x-2">
              {['morning', 'afternoon', 'evening', 'night'].map((time) => (
                <motion.button
                  key={time}
                  onClick={() => handleTimeOfDayChange(time as any)}
                  className={`p-2 rounded-lg transition-colors ${
                    timeOfDay === time 
                      ? 'bg-teal-100 text-teal-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {time === 'morning' && <Sun size={16} />}
                  {time === 'afternoon' && <Lightbulb size={16} />}
                  {time === 'evening' && <Coffee size={16} />}
                  {time === 'night' && <Moon size={16} />}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Study Mode Selector */}
      <AnimatePresence>
        {showQuickActions && (
          <QuickActions 
            onClose={() => setShowQuickActions(false)}
            studyMode={studyMode}
            onStudyModeChange={handleStudyModeChange}
            timeOfDay={timeOfDay}
            onTimeOfDayChange={handleTimeOfDayChange}
          />
        )}
      </AnimatePresence>

      {/* Active Study Session Timer */}
      {activeStudySession && (
        <StudyTimer 
          session={activeStudySession}
          onEnd={endStudySession}
        />
      )}

      {/* 3D Canvas with Enhanced Environment */}
      <Canvas 
        className="w-full h-full"
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <PerspectiveCamera makeDefault position={cameraPosition} fov={65} />
        
        {/* Dynamic Lighting System */}
        <StudyEnvironmentLighting timeOfDay={timeOfDay} />
        
        {/* Fog for Atmosphere */}
        <fog attach="fog" args={['#f0f9ff', 10, 50]} />

        <Suspense fallback={
          <Html center>
            <div className="text-teal-600 font-semibold">Loading 3D Environment...</div>
          </Html>
        }>
          {/* Sky and Environment */}
          <Sky 
            distance={450000}
            sunPosition={timeOfDay === 'night' ? [0, -1, 0] : [0, 1, 0]}
            inclination={timeOfDay === 'evening' ? 0.6 : 0.49}
            azimuth={0.25}
          />
          
          <Environment preset={timeOfDay === 'night' ? 'night' : 'apartment'} />
          
          {/* Enhanced Room Structure */}
          <group>
            {/* Floor with Pattern */}
            <Plane 
              args={[30, 30]} 
              rotation={[-Math.PI / 2, 0, 0]} 
              position={[0, -2.5, 0]}
              receiveShadow
            >
              <meshStandardMaterial 
                color="#F5F5F5" 
                roughness={0.8}
                metalness={0.1}
              />
            </Plane>
            
            {/* Walls */}
            <Plane args={[30, 15]} position={[0, 5, -8]} receiveShadow>
              <meshStandardMaterial color="#FAFAFA" roughness={0.9} />
            </Plane>
            
            <Plane args={[16, 15]} position={[-8, 5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
              <meshStandardMaterial color="#FAFAFA" roughness={0.9} />
            </Plane>
            
            {/* Ceiling */}
            <Plane args={[30, 30]} rotation={[Math.PI / 2, 0, 0]} position={[0, 12, 0]}>
              <meshStandardMaterial color="#FFFFFF" roughness={0.7} />
            </Plane>
          </group>

          {/* Enhanced Bookshelf */}
          <EnhancedBookshelf />
          
          {/* Study Desk */}
          <StudyDesk />

          {/* Interactive Books */}
          {filteredSubjects.map((subject, index) => (
            <Book3D
              key={subject.id}
              subject={subject}
              position={getBookPosition(index, filteredSubjects.length)}
              onClick={() => handleBookClick(subject.id)}
              studyMode={studyMode}
              isActive={activeStudySession?.subjectId === subject.id}
            />
          ))}

          {/* Particle Effects */}
          <ParticleSystem active={showParticles && studyMode === 'intense'} />

          {/* Floating Study Elements */}
          <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
            <group position={[-6, 2, 2]}>
              <Sphere args={[0.3]} position={[0, 0, 0]}>
                <meshStandardMaterial 
                  color="#FF6B6B" 
                  emissive="#FF6B6B" 
                  emissiveIntensity={0.3}
                  transparent
                  opacity={0.8}
                />
              </Sphere>
              <Html position={[0, 0, 0]} center>
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                  <Trophy className="text-mustard-600" size={16} />
                </div>
              </Html>
            </group>
          </Float>

          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            <group position={[6, 1.5, 3]}>
              <Box args={[0.4, 0.4, 0.4]} rotation={[0.5, 0.5, 0]}>
                <meshStandardMaterial 
                  color="#FFD166" 
                  emissive="#FFD166" 
                  emissiveIntensity={0.2}
                />
              </Box>
              <Html position={[0, 0, 0]} center>
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                  <Zap className="text-teal-600" size={16} />
                </div>
              </Html>
            </group>
          </Float>

          {/* Interactive Study Zones */}
          <group position={[8, 0, 0]}>
            <Float speed={0.5} rotationIntensity={0.1}>
              <Cylinder args={[1, 1, 0.2]} position={[0, -2, 0]}>
                <meshStandardMaterial color="#83C5BE" transparent opacity={0.7} />
              </Cylinder>
              <Html position={[0, -1.5, 0]} center>
                <motion.div 
                  className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowQuickActions(true)}
                >
                  <div className="text-center">
                    <Target className="mx-auto text-teal-600 mb-2" size={24} />
                    <div className="text-sm font-semibold text-charcoal">Focus Zone</div>
                    <div className="text-xs text-gray-500">Deep Work</div>
                  </div>
                </motion.div>
              </Html>
            </Float>
          </group>

          <group position={[-8, 0, 2]}>
            <Float speed={0.8} rotationIntensity={0.15}>
              <Sphere args={[0.8]} position={[0, -1.5, 0]}>
                <meshStandardMaterial 
                  color="#FF6B6B" 
                  transparent 
                  opacity={0.6}
                  emissive="#FF6B6B"
                  emissiveIntensity={0.2}
                />
              </Sphere>
              <Html position={[0, -1.5, 0]} center>
                <motion.div 
                  className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-center">
                    <Heart className="mx-auto text-coral-600 mb-2" size={24} />
                    <div className="text-sm font-semibold text-charcoal">Relax Zone</div>
                    <div className="text-xs text-gray-500">Mindful Learning</div>
                  </div>
                </motion.div>
              </Html>
            </Float>
          </group>

          {/* Ambient Elements */}
          {timeOfDay === 'evening' && (
            <group>
              {Array.from({ length: 5 }, (_, i) => (
                <Float key={i} speed={0.5 + i * 0.1} rotationIntensity={0.1}>
                  <Sphere 
                    args={[0.05]} 
                    position={[
                      (Math.random() - 0.5) * 20,
                      Math.random() * 8 + 2,
                      (Math.random() - 0.5) * 20
                    ]}
                  >
                    <meshStandardMaterial 
                      color="#FFD166" 
                      emissive="#FFD166" 
                      emissiveIntensity={0.8}
                    />
                  </Sphere>
                </Float>
              ))}
            </group>
          )}

          {/* Weather Effects */}
          {studyMode === 'relax' && (
            <group>
              {Array.from({ length: 3 }, (_, i) => (
                <Cloud
                  key={i}
                  position={[
                    (i - 1) * 8,
                    8 + Math.sin(i) * 2,
                    -5 + i * 2
                  ]}
                  speed={0.1}
                  opacity={0.3}
                  color="#FFFFFF"
                />
              ))}
            </group>
          )}

          <ContactShadows 
            opacity={0.6} 
            scale={25} 
            blur={2} 
            far={15} 
            resolution={512} 
            color="#000000"
          />
        </Suspense>

        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={6}
          maxDistance={20}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate={studyMode === 'relax'}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Enhanced Subject Progress Panel */}
      <motion.div 
        className="absolute bottom-32 right-6 bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-gray-200 max-w-sm"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-charcoal">Study Progress</h3>
          <motion.button
            className="p-2 text-gray-400 hover:text-teal-600 transition-colors"
            whileHover={{ scale: 1.1 }}
          >
            <TrendingUp size={20} />
          </motion.button>
        </div>
        
        <div className="space-y-4">
          {filteredSubjects.slice(0, 6).map((subject) => (
            <motion.div 
              key={subject.id} 
              className="group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => handleBookClick(subject.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3 shadow-sm"
                    style={{ backgroundColor: subject.color }}
                  ></div>
                  <div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-teal-600 transition-colors">
                      {subject.name}
                    </span>
                    <div className="text-xs text-gray-500">
                      {subject.enrolledStudents} students • {subject.difficulty}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-teal-600">
                    {Math.round(subject.progress)}%
                  </span>
                  <div className="flex items-center text-xs text-gray-500">
                    <Star className="mr-1" size={10} />
                    {subject.rating.toFixed(1)}
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="h-2 rounded-full bg-gradient-to-r from-teal-500 to-teal-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${subject.progress}%` }}
                  transition={{ duration: 1, delay: 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Quick Stats */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-coral-600">{books.length}</div>
              <div className="text-xs text-gray-500">Books</div>
            </div>
            <div>
              <div className="text-lg font-bold text-mustard-600">{subjects.length}</div>
              <div className="text-xs text-gray-500">Subjects</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Study Session Controls */}
      {activeStudySession && (
        <motion.div 
          className="absolute bottom-32 left-6 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-gray-200"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <div className="text-sm font-semibold text-charcoal">Study Session Active</div>
              <div className="text-xs text-gray-500">
                {subjects.find(s => s.id === activeStudySession.subjectId)?.name}
              </div>
            </div>
            <motion.button
              onClick={endStudySession}
              className="px-3 py-1 bg-coral-100 text-coral-600 rounded-lg text-sm hover:bg-coral-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              End Session
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Floating Action Buttons */}
      <div className="absolute bottom-6 left-6 flex flex-col space-y-3">
        <motion.button
          className="w-14 h-14 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowParticles(!showParticles)}
        >
          <SparklesIcon size={20} />
        </motion.button>
        
        <motion.button
          className="w-14 h-14 bg-coral-600 text-white rounded-full shadow-lg hover:bg-coral-700 transition-colors flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Plus size={20} />
        </motion.button>
      </div>

      {/* Ambient Sounds Component */}
      {ambientSoundsEnabled && (
        <AmbientSounds 
          mode={studyMode} 
          timeOfDay={timeOfDay}
          volume={0.3}
        />
      )}

      {/* Progress Overlay */}
      <ProgressOverlay 
        subjects={subjects}
        studyStats={studyStats}
        user={user}
      />

      {/* Achievement Notifications */}
      <AnimatePresence>
        {showAchievement && (
          <AchievementNotification 
            achievementId={showAchievement}
            onClose={() => setShowAchievement(null)}
          />
        )}
      </AnimatePresence>

      {/* Enhanced Book Reader Modal */}
      <AnimatePresence>
        {openBookId && (
          <BookReader 
            bookId={openBookId} 
            onClose={handleCloseBook}
                      />
        )}
      </AnimatePresence>

      {/* Study Mode Indicator */}
      <motion.div 
        className="absolute top-4 right-4 z-30"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <div className={`px-4 py-2 rounded-full text-sm font-medium shadow-lg ${
          studyMode === 'focus' ? 'bg-teal-100 text-teal-700' :
          studyMode === 'relax' ? 'bg-coral-100 text-coral-700' :
          'bg-mustard-100 text-mustard-700'
        }`}>
          {studyMode === 'focus' && <><Target className="inline mr-1" size={14} /> Focus Mode</>}
          {studyMode === 'relax' && <><Heart className="inline mr-1" size={14} /> Relax Mode</>}
          {studyMode === 'intense' && <><Flame className="inline mr-1" size={14} /> Intense Mode</>}
        </div>
      </motion.div>

      {/* Weather and Atmosphere Controls */}
      <motion.div 
        className="absolute bottom-6 right-6 flex flex-col space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <motion.button
          className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-teal-600 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Wind size={18} />
        </motion.button>
        
        <motion.button
          className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-coral-600 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Eye size={18} />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default StudyRoom3D;