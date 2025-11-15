import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, RefreshCw, Download, Filter } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Flashcard } from '../../types';

const FlashcardGenerator: React.FC = () => {
  const { subjects, addFlashcard, flashcards } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [cardCount, setCardCount] = useState(50);
  const [difficulty, setDifficulty] = useState('mixed');
  const [cardTypes, setCardTypes] = useState({
    mcq: true,
    shortAnswer: true,
    trueFalse: true,
    fillBlank: true
  });

  // Enhanced flashcard templates for different subjects
  const flashcardTemplates = {
    Mathematics: [
      {
        type: 'mcq',
        question: 'What is the derivative of x²?',
        options: ['2x', 'x²', '2x²', 'x'],
        correctAnswer: 0,
        explanation: 'Using the power rule: d/dx(x²) = 2x¹ = 2x',
        difficulty: 'easy'
      },
      {
        type: 'shortAnswer',
        question: 'Define the limit of a function as x approaches a value.',
        answer: 'The limit describes the value that a function approaches as the input approaches some value.',
        explanation: 'Limits are fundamental to calculus and help define derivatives and integrals.',
        difficulty: 'medium'
      },
      {
        type: 'trueFalse',
        question: 'The integral is the reverse operation of differentiation.',
        answer: 'true',
        explanation: 'This is stated by the Fundamental Theorem of Calculus.',
        difficulty: 'easy'
      },
      {
        type: 'fillBlank',
        question: 'The area under a curve from a to b is calculated using _____ calculus.',
        answer: 'integral',
        explanation: 'Integral calculus deals with accumulation and areas under curves.',
        difficulty: 'medium'
      }
    ],
    Physics: [
      {
        type: 'mcq',
        question: 'What is Newton\'s first law of motion?',
        options: ['F = ma', 'Objects at rest stay at rest unless acted upon by force', 'For every action there is an equal and opposite reaction', 'Energy cannot be created or destroyed'],
        correctAnswer: 1,
        explanation: 'Newton\'s first law is also known as the law of inertia.',
        difficulty: 'easy'
      },
      {
        type: 'shortAnswer',
        question: 'Explain the relationship between kinetic and potential energy.',
        answer: 'Kinetic energy is energy of motion (½mv²), potential energy is stored energy. They can convert into each other while total mechanical energy remains constant.',
        explanation: 'This demonstrates conservation of energy in mechanical systems.',
        difficulty: 'medium'
      },
      {
        type: 'trueFalse',
        question: 'Light travels faster in water than in air.',
        answer: 'false',
        explanation: 'Light travels slower in denser media due to refraction.',
        difficulty: 'medium'
      }
    ],
    Chemistry: [
      {
        type: 'mcq',
        question: 'What determines the chemical properties of an element?',
        options: ['Number of protons', 'Number of neutrons', 'Number of electrons', 'Atomic mass'],
        correctAnswer: 2,
        explanation: 'The number of electrons, particularly valence electrons, determines chemical behavior.',
        difficulty: 'medium'
      },
      {
        type: 'shortAnswer',
        question: 'What is the difference between ionic and covalent bonds?',
        answer: 'Ionic bonds involve transfer of electrons between atoms, while covalent bonds involve sharing of electrons.',
        explanation: 'These different bonding types result in different material properties.',
        difficulty: 'medium'
      }
    ],
    Biology: [
      {
        type: 'mcq',
        question: 'What is the powerhouse of the cell?',
        options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic reticulum'],
        correctAnswer: 1,
        explanation: 'Mitochondria produce ATP, the energy currency of cells.',
        difficulty: 'easy'
      },
      {
        type: 'shortAnswer',
        question: 'Describe the process of photosynthesis.',
        answer: 'Plants convert light energy, carbon dioxide, and water into glucose and oxygen using chloroplasts.',
        explanation: 'This process is essential for most life on Earth as it produces oxygen and food.',
        difficulty: 'medium'
      }
    ]
  };

  const generateFlashcards = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const subjectsToGenerate = selectedSubject === 'all' 
      ? subjects 
      : subjects.filter(s => s.id === selectedSubject);

    const cardsPerSubject = Math.floor(cardCount / subjectsToGenerate.length);
    
    subjectsToGenerate.forEach(subject => {
      const templates = flashcardTemplates[subject.name as keyof typeof flashcardTemplates] || flashcardTemplates.Mathematics;
      
      for (let i = 0; i < cardsPerSubject; i++) {
        const template = templates[i % templates.length];
        const variations = generateVariations(template, subject.name, i);
        
        variations.forEach(variation => {
          const newCard: Flashcard = {
            id: `card-${Date.now()}-${Math.random()}`,
            subjectId: subject.id,
            question: variation.question,
            answer: variation.answer,
            difficulty: variation.difficulty,
            type: variation.type,
            options: variation.options,
            explanation: variation.explanation,
            lastReviewed: undefined,
            nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
            easiness: 2.5,
            interval: 1,
            repetitions: 0
          };
          
          addFlashcard(newCard);
        });
      }
    });
    
    setIsGenerating(false);
  };

  const generateVariations = (template: any, subjectName: string, index: number) => {
    // Generate variations of the base template
    const variations = [];
    const difficultyLevels = difficulty === 'mixed' ? ['easy', 'medium', 'hard'] : [difficulty];
    
    difficultyLevels.forEach(diff => {
      if (Object.values(cardTypes).some(Boolean)) {
        variations.push({
          ...template,
          question: `${template.question} (${subjectName} - Variation ${index + 1})`,
          difficulty: diff,
          type: template.type
        });
      }
    });
    
    return variations.slice(0, 2); // Limit variations per template
  };

  const existingCardsCount = flashcards.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-teal-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-charcoal mb-4">
            <span className="text-teal-600">AI</span> Flashcard Generator
          </h1>
          <p className="text-xl text-gray-600">
            Generate intelligent flashcards from your study materials
          </p>
        </motion.div>

        {/* Current Stats */}
        <motion.div 
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600 mb-2">{existingCardsCount}</div>
              <div className="text-gray-600">Total Flashcards</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-coral-600 mb-2">{subjects.length}</div>
              <div className="text-gray-600">Active Subjects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-mustard-600 mb-2">
                {flashcards.filter(c => c.lastReviewed).length}
              </div>
              <div className="text-gray-600">Cards Reviewed</div>
            </div>
          </div>
        </motion.div>

        {/* Generation Controls */}
        <motion.div 
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold text-charcoal mb-6 flex items-center">
            <Brain className="mr-3 text-teal-600" />
            Generate New Flashcards
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Card Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Cards
              </label>
              <input
                type="number"
                value={cardCount}
                onChange={(e) => setCardCount(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                min="10"
                max="200"
                step="10"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            {/* Card Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Types
              </label>
              <div className="space-y-2">
                {Object.entries(cardTypes).map(([type, enabled]) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => setCardTypes(prev => ({ ...prev, [type]: e.target.checked }))}
                      className="mr-2 rounded text-teal-600"
                    />
                    <span className="text-gray-700 capitalize">
                      {type.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <motion.button
            onClick={generateFlashcards}
            disabled={isGenerating || !Object.values(cardTypes).some(Boolean)}
            className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-2xl shadow-xl hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-3 animate-spin" size={20} />
                Generating AI Flashcards...
              </>
            ) : (
              <>
                <Sparkles className="mr-3" size={20} />
                Generate {cardCount} AI Flashcards
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Recent Generations */}
        <motion.div 
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-charcoal mb-4">Recent Flashcards</h3>
          <div className="grid gap-4">
            {flashcards.slice(-6).map((card, index) => (
              <motion.div
                key={card.id}
                className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-charcoal mb-2">{card.question}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        card.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        card.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {card.difficulty}
                      </span>
                      <span className="text-xs text-gray-500">
                        {subjects.find(s => s.id === card.subjectId)?.name}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FlashcardGenerator;