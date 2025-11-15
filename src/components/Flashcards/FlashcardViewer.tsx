import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Brain, CheckCircle, X, Check } from 'lucide-react';
import { useStore } from '../../store/useStore';

const FlashcardViewer: React.FC = () => {
  const { flashcards, subjects } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Set<string>>(new Set());
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const currentCard = flashcards[currentIndex];
  const currentSubject = subjects.find(s => s.id === currentCard?.subjectId);

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const markAsMastered = () => {
    if (currentCard) {
      setMasteredCards(prev => new Set([...prev, currentCard.id]));
      nextCard();
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
  };

  const handleTrueFalseAnswer = (answer: boolean) => {
    setSelectedAnswer(answer ? 1 : 0);
    setShowResult(true);
  };

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-100 to-teal-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Brain className="mx-auto text-teal-600 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-charcoal mb-2">No Flashcards Yet</h2>
          <p className="text-gray-600">Upload your notes to generate AI flashcards</p>
        </motion.div>
      </div>
    );
  }

  const isMastered = masteredCards.has(currentCard.id);
  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-teal-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-charcoal mb-4">
            <span className="text-teal-600">AI</span> Flashcards
          </h1>
          <p className="text-xl text-gray-600">
            Master your subjects with intelligent spaced repetition
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Card {currentIndex + 1} of {flashcards.length}
            </span>
            <span className="text-sm font-medium text-teal-600">
              {currentSubject?.name}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Flashcard */}
        <motion.div 
          className="relative w-full max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="relative h-80 perspective-1000">
            <motion.div
              className="relative w-full h-full transform-style-preserve-3d cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Front of card (Question) */}
              <div className="absolute inset-0 w-full h-full backface-hidden">
                <div className="w-full h-full bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 flex flex-col justify-center items-center relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-4 right-4 w-32 h-32 border border-teal-300 rounded-full"></div>
                    <div className="absolute bottom-4 left-4 w-24 h-24 border border-coral-300 rounded-full"></div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-medium mb-4 ${difficultyColors[currentCard.difficulty]}`}>
                    {currentCard.difficulty}
                  </div>
                  
                  <h2 className="text-2xl lg:text-3xl font-bold text-charcoal text-center leading-relaxed">
                    {currentCard.question}
                  </h2>
                  
                  {/* MCQ Options */}
                  {currentCard.type === 'mcq' && currentCard.options && (
                    <div className="w-full max-w-md space-y-3">
                      {currentCard.options.map((option, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          className={`w-full p-3 text-left rounded-xl border-2 transition-all duration-300 ${
                            selectedAnswer === index
                              ? showResult
                                ? index === currentCard.correctAnswer
                                  ? 'border-green-500 bg-green-50 text-green-700'
                                  : 'border-red-500 bg-red-50 text-red-700'
                                : 'border-teal-500 bg-teal-50 text-teal-700'
                              : 'border-gray-200 hover:border-teal-300 hover:bg-teal-50'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={showResult}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            {showResult && selectedAnswer === index && (
                              index === currentCard.correctAnswer ? 
                                <Check className="text-green-600" size={20} /> :
                                <X className="text-red-600" size={20} />
                            )}
                          </div>
                        </motion.button>
                      ))}
                      
                      {showResult && currentCard.explanation && (
                        <motion.div
                          className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <p className="text-sm text-blue-800">
                            <strong>Explanation:</strong> {currentCard.explanation}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  )}
                  
                  {/* True/False Options */}
                  {currentCard.type === 'trueFalse' && (
                    <div className="flex space-x-4">
                      <motion.button
                        onClick={() => handleTrueFalseAnswer(true)}
                        className={`px-8 py-3 rounded-xl border-2 transition-all duration-300 ${
                          selectedAnswer === 1
                            ? showResult
                              ? currentCard.answer === 'true'
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-red-500 bg-red-50 text-red-700'
                              : 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={showResult}
                      >
                        True
                      </motion.button>
                      
                      <motion.button
                        onClick={() => handleTrueFalseAnswer(false)}
                        className={`px-8 py-3 rounded-xl border-2 transition-all duration-300 ${
                          selectedAnswer === 0
                            ? showResult
                              ? currentCard.answer === 'false'
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-red-500 bg-red-50 text-red-700'
                              : 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={showResult}
                      >
                        False
                      </motion.button>
                    </div>
                  )}
                  
                  {/* Regular flashcard flip instruction */}
                  {(!currentCard.type || currentCard.type === 'shortAnswer') && (
                  <motion.div 
                    className="mt-8 text-teal-600 font-medium"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Click to reveal answer
                  </motion.div>
                  )}
                </div>
              </div>

              {/* Back of card (Answer) */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                <div className="w-full h-full bg-gradient-to-br from-teal-50 to-coral-50 rounded-3xl shadow-2xl border border-gray-200 p-8 flex flex-col justify-center items-center relative overflow-hidden">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium mb-4 ${difficultyColors[currentCard.difficulty]}`}>
                    Answer
                  </div>
                  
                  <p className="text-xl lg:text-2xl text-charcoal text-center leading-relaxed font-medium">
                    {currentCard.answer}
                  </p>
                  
                  {currentCard.explanation && (
                    <div className="mt-6 p-4 bg-white/80 rounded-xl border border-gray-200">
                      <p className="text-sm text-gray-700">
                        <strong>Explanation:</strong> {currentCard.explanation}
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-8 text-gray-600 font-medium">
                    Click again to see question
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div 
          className="flex items-center justify-center space-x-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={prevCard}
            className="p-4 bg-white rounded-full shadow-lg border border-gray-200 text-gray-600 hover:text-teal-600 hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={24} />
          </motion.button>

          <motion.button
            onClick={() => setIsFlipped(!isFlipped)}
            className="p-4 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <RotateCcw size={24} />
          </motion.button>

          <motion.button
            onClick={markAsMastered}
            disabled={isMastered}
            className={`p-4 rounded-full shadow-lg border border-gray-200 transition-all duration-300 ${
              isMastered 
                ? 'bg-green-100 text-green-600 cursor-not-allowed' 
                : 'bg-white text-gray-600 hover:text-green-600 hover:shadow-xl'
            }`}
            whileHover={!isMastered ? { scale: 1.1 } : {}}
            whileTap={!isMastered ? { scale: 0.9 } : {}}
          >
            <CheckCircle size={24} />
          </motion.button>

          <motion.button
            onClick={nextCard}
            className="p-4 bg-white rounded-full shadow-lg border border-gray-200 text-gray-600 hover:text-teal-600 hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={24} />
          </motion.button>
        </motion.div>

        {/* Mastered Counter */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-gray-600">
            Mastered: <span className="font-bold text-green-600">{masteredCards.size}</span> / {flashcards.length} cards
            {flashcards.length > 100 && (
              <span className="ml-4 text-sm bg-teal-100 text-teal-700 px-3 py-1 rounded-full">
                500+ Cards Available!
              </span>
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default FlashcardViewer;