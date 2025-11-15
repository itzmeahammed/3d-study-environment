import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Html } from '@react-three/drei';
import { Mesh } from 'three';
import { motion } from 'framer-motion';
import { BookOpen, Star, Users, Clock } from 'lucide-react';
import { Subject } from '../../types';

interface Book3DProps {
  subject: Subject;
  position: [number, number, number];
  onClick: () => void;
  studyMode?: 'focus' | 'relax' | 'intense';
  isActive?: boolean;
}

const Book3D: React.FC<Book3DProps> = ({ subject, position, onClick, studyMode = 'focus', isActive = false }) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      if (hovered || isActive) {
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.05;
      } else {
        meshRef.current.rotation.y = 0;
        meshRef.current.position.y = position[1];
      }
      
      // Intense mode effects
      if (studyMode === 'intense' && isActive) {
        meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 4) * 0.02;
      }
    }
  });

  const progressColor = subject.progress > 70 ? '#10B981' : subject.progress > 40 ? '#F59E0B' : '#EF4444';
  const glowIntensity = subject.progress / 100;
  const activeGlow = isActive ? 0.5 : 0;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#10B981';
      case 'intermediate': return '#F59E0B';
      case 'advanced': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <Float 
      speed={studyMode === 'intense' ? 3 : 1.5} 
      rotationIntensity={studyMode === 'relax' ? 0.1 : 0.3} 
      floatIntensity={studyMode === 'intense' ? 0.3 : 0.1}
    >
      <group position={position}>
        {/* Enhanced Book Base with Rounded Edges */}
        <mesh
          ref={meshRef}
          onClick={onClick}
          onPointerEnter={() => {
            setHovered(true);
            setShowInfo(true);
          }}
          onPointerLeave={() => {
            setHovered(false);
            setShowInfo(false);
          }}
          scale={hovered ? [1.15, 1.15, 1.15] : [1, 1, 1]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.9, 1.3, 0.18]} />
          <meshStandardMaterial 
            color={subject.color} 
            emissive={subject.color} 
            emissiveIntensity={hovered ? 0.4 : glowIntensity * 0.2 + activeGlow}
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>

        {/* Book Spine with Enhanced Details */}
        <mesh position={[0, 0, 0.1]} castShadow>
          <boxGeometry args={[0.92, 1.32, 0.02]} />
          <meshStandardMaterial color="#2D2D2D" roughness={0.4} />
        </mesh>

        {/* Subject Name with Better Typography */}
        <Text
          position={[0, 0.2, 0.12]}
          fontSize={0.08}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          rotation={[0, 0, Math.PI / 2]}
          maxWidth={1.2}
                  >
          {subject.name}
        </Text>

        {/* Author/Creator Text */}
        <Text
          position={[0, -0.3, 0.12]}
          fontSize={0.04}
          color="#CCCCCC"
          anchorX="center"
          anchorY="middle"
          rotation={[0, 0, Math.PI / 2]}
          maxWidth={1}
        >
          {subject.enrolledStudents} students
        </Text>

        {/* Enhanced Progress Indicator */}
        <mesh position={[0.5, 0.4, 0.12]}>
          <ringGeometry args={[0.08, 0.12, 16]} />
          <meshStandardMaterial color={progressColor} emissive={progressColor} emissiveIntensity={0.3} />
        </mesh>

        <Text
          position={[0.5, 0.4, 0.14]}
          fontSize={0.04}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          {Math.round(subject.progress)}%
        </Text>

        {/* Difficulty Indicator */}
        <mesh position={[0.5, -0.4, 0.12]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial 
            color={getDifficultyColor(subject.difficulty)} 
            emissive={getDifficultyColor(subject.difficulty)}
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Rating Stars */}
        <group position={[0, -0.5, 0.12]}>
          {Array.from({ length: 5 }, (_, i) => (
            <mesh key={i} position={[(i - 2) * 0.08, 0, 0]}>
              <sphereGeometry args={[0.02, 6, 6]} />
              <meshStandardMaterial 
                color={i < Math.floor(subject.rating) ? "#FFD166" : "#CCCCCC"}
                emissive={i < Math.floor(subject.rating) ? "#FFD166" : "#000000"}
                emissiveIntensity={i < Math.floor(subject.rating) ? 0.3 : 0}
              />
            </mesh>
          ))}
        </group>

        {/* Completion Glow Effect */}
        {subject.progress > 90 && (
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshStandardMaterial 
              color="#FFD166" 
              transparent 
              opacity={0.15}
              emissive="#FFD166"
              emissiveIntensity={0.6}
            />
          </mesh>
        )}

        {/* Active Study Session Indicator */}
        {isActive && (
          <mesh position={[0, 0.7, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial 
              color="#00FF00" 
              emissive="#00FF00"
              emissiveIntensity={0.8}
              transparent
              opacity={0.8}
            />
          </mesh>
        )}

        {/* Hover Information Panel */}
        {showInfo && (
          <Html position={[0, 1.5, 0]} center>
            <motion.div
              className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-200 min-w-64"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className="text-center">
                <h4 className="font-bold text-charcoal mb-2">{subject.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{subject.description}</p>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center justify-center space-x-1">
                    <Users size={12} className="text-teal-600" />
                    <span>{subject.enrolledStudents}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <Clock size={12} className="text-coral-600" />
                    <span>{subject.estimatedHours}h</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <Star size={12} className="text-mustard-600" />
                    <span>{(subject.rating || 0).toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <BookOpen size={12} className="text-green-600" />
                    <span>{subject.completedTasks}/{subject.totalTasks}</span>
                  </div>
                </div>
                
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                  }}
                  className="mt-3 w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Reading
                </motion.button>
              </div>
            </motion.div>
          </Html>
        )}

        {/* Particle Trail for Intense Mode */}
        {studyMode === 'intense' && hovered && (
          <group>
            {Array.from({ length: 10 }, (_, i) => (
              <mesh 
                key={i} 
                position={[
                  Math.sin(i * 0.5) * 0.3,
                  Math.cos(i * 0.3) * 0.2,
                  0.2 + i * 0.05
                ]}
              >
                <sphereGeometry args={[0.02, 4, 4]} />
                <meshStandardMaterial 
                  color={subject.color}
                  emissive={subject.color}
                  emissiveIntensity={0.8}
                  transparent
                  opacity={0.8 - i * 0.08}
                />
              </mesh>
            ))}
          </group>
        )}
      </group>
    </Float>
  );
};

export default Book3D;