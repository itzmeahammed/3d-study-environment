import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, Stars } from '@react-three/drei';
import { Mesh, MeshStandardMaterial, Group } from 'three';
import { ArrowRight, Play, Users, Award, BookOpen, Brain } from 'lucide-react';
import { useStore } from '../../store/useStore';

const AnimatedBook: React.FC = () => {
  const bookRef = useRef<Group>(null);
  const pagesRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (bookRef.current) {
      bookRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      bookRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
    }
    if (pagesRef.current) {
      pagesRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  // Page material with a subtle paper texture
  const pagesMaterial = new MeshStandardMaterial({
    color: '#f5f5f5',
    roughness: 0.8,
    metalness: 0.1,
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={bookRef}>
        {/* Book cover */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[2.5, 3, 0.4]} />
          <meshStandardMaterial 
            color="#006D77" 
            roughness={0.3} 
            metalness={0.1} 
          />
        </mesh>
        
        {/* Book spine */}
        <mesh position={[-1.25, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 3, 0.4]} />
          <meshStandardMaterial 
            color="#004D54" 
            roughness={0.4} 
            metalness={0.2}
          />
        </mesh>
        
        {/* Pages */}
        <group ref={pagesRef}>
          <mesh position={[0, 0, 0.21]} castShadow>
            <boxGeometry args={[2.3, 2.8, 0.01]} />
            <primitive object={pagesMaterial.clone()} />
          </mesh>
          
          {/* Page edges */}
          <mesh position={[1.15, 0, 0.2]} rotation={[0, Math.PI / 2, 0]} castShadow>
            <planeGeometry args={[2.8, 0.4, 1]} />
            <primitive object={pagesMaterial.clone()} />
          </mesh>
        </group>
        
        <Sparkles count={50} scale={4} size={3} speed={0.3} color="#FFD166" />
        <Stars radius={8} depth={5} count={100} factor={2} saturation={0.5} fade />
      </group>
    </Float>
  );
};

const HeroSection: React.FC = () => {
  const { setCurrentView } = useStore();

  const handleGetStarted = () => {
    setCurrentView('onboarding');
  };

  const handleLogin = () => {
    setCurrentView('onboarding');
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Planning',
      description: 'Smart study schedules tailored to your learning style'
    },
    {
      icon: BookOpen,
      title: '3D Learning Hub',
      description: 'Immersive study environment with interactive books'
    },
    {
      icon: Award,
      title: 'Gamified Progress',
      description: 'Earn achievements and track your learning journey'
    },
    {
      icon: Users,
      title: 'Collaborative Learning',
      description: 'Study with friends and share knowledge'
    }
  ];

  const stats = [
    { value: '15,000+', label: 'Active Students' },
    { value: '500+', label: 'Study Materials' },
    { value: '50,000+', label: 'Flashcards' },
    { value: '98%', label: 'Success Rate' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-white to-teal-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-coral-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-mustard-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-200/10 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-6 z-10 relative">
        {/* Navigation Header */}
        <motion.header 
          className="flex items-center justify-between py-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-coral-600 rounded-xl flex items-center justify-center">
              <Brain className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-charcoal">StudyHub</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={handleLogin}
              className="px-6 py-2 text-teal-600 hover:text-teal-700 font-medium transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
            <motion.button
              onClick={handleGetStarted}
              className="px-6 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </div>
        </motion.header>

        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4">
                  🚀 Next-Gen Learning Platform
                </span>
              </motion.div>
              
              <motion.h1 
                className="text-5xl lg:text-7xl font-bold text-charcoal leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                AI-Powered
                <span className="text-teal-600 block">Study Planner</span>
                <span className="text-coral-600 block text-4xl lg:text-5xl">with 3D Hub</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Transform your learning with personalized AI study plans, immersive 3D environments, 
                and gamified progress tracking. Make studying engaging, effective, and fun.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <motion.button
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-2xl shadow-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 flex items-center justify-center"
                  whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(0,109,119,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Your AI Study Journey
                  <ArrowRight className="ml-2" size={20} />
                </motion.button>
                
                <motion.button
                  className="px-8 py-4 border-2 border-teal-600 text-teal-600 font-semibold rounded-2xl hover:bg-teal-50 transition-all duration-300 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="mr-2" size={20} />
                  Watch Demo
                </motion.button>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl lg:text-3xl font-bold text-teal-600 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right 3D Canvas */}
          <motion.div 
            className="h-96 lg:h-[600px] relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }} shadows>
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} intensity={1.2} color="#FFD166" castShadow />
              <pointLight position={[-10, -10, -10]} intensity={0.6} color="#FF6B6B" />
              <spotLight position={[0, 15, 0]} angle={0.3} penumbra={0.1} intensity={1} color="#006D77" castShadow />
              
              <AnimatedBook />
              
              <OrbitControls 
                enableZoom={false} 
                enablePan={false} 
                autoRotate 
                autoRotateSpeed={0.8}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 1.5}
              />
            </Canvas>
            
            {/* Floating UI Elements */}
            <motion.div
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
            >
              <div className="text-center">
                <div className="text-lg font-bold text-teal-600">500+</div>
                <div className="text-xs text-gray-600">AI Flashcards</div>
              </div>
            </motion.div>
            
            <motion.div
              className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
            >
              <div className="text-center">
                <div className="text-lg font-bold text-coral-600">3D</div>
                <div className="text-xs text-gray-600">Interactive</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div 
          className="py-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-charcoal mb-4">
              Why Choose <span className="text-teal-600">StudyHub</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of learning with our cutting-edge platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  key={index}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-coral-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-white" size={32} />
                  </div>
                  <h3 className="font-bold text-charcoal mb-2 text-lg">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center py-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <h2 className="text-4xl font-bold text-charcoal mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have revolutionized their study habits with AI
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={handleGetStarted}
              className="px-10 py-4 bg-gradient-to-r from-teal-600 to-coral-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Free Trial
            </motion.button>
            
            <motion.button
              onClick={handleLogin}
              className="px-10 py-4 bg-white text-teal-600 font-bold rounded-2xl shadow-lg border-2 border-teal-600 hover:bg-teal-50 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;