import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Clock, Target } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Subject, StudyTask } from '../../types';

const SubjectSetup: React.FC = () => {
  const { setCurrentView, addSubject, addTask } = useStore();
  const [subjects, setSubjects] = useState<Partial<Subject>[]>([]);
  const [availableHours, setAvailableHours] = useState(3);
  const [mainExamDate, setMainExamDate] = useState('2025-02-15');

  const subjectColors = ['#FF6B6B', '#006D77', '#FFD166', '#83C5BE', '#FFEAA7', '#74B9FF'];

  const addNewSubject = () => {
    setSubjects([...subjects, { 
      name: '',
      color: subjectColors[subjects.length % subjectColors.length],
      examDate: mainExamDate 
    }]);
  };

  const updateSubject = (index: number, field: string, value: string) => {
    const updated = [...subjects];
    updated[index] = { ...updated[index], [field]: value };
    setSubjects(updated);
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const generateStudyPlan = async () => {
    // Generate AI study plan (mock implementation)
    for (let i = 0; i < subjects.length; i++) {
      const subject = subjects[i];
      if (subject.name) {
        const newSubject: Subject = {
          id: `subject-${Date.now()}-${i}`,
          name: subject.name,
          color: subject.color!,
          progress: 0,
          totalTasks: 15,
          completedTasks: 0,
          examDate: subject.examDate
        };
        
        addSubject(newSubject);

        // Generate sample tasks for each subject
        for (let j = 0; j < 5; j++) {
          const task: StudyTask = {
            id: `task-${newSubject.id}-${j}`,
            subjectId: newSubject.id,
            title: `Study Session ${j + 1}: ${subject.name}`,
            description: `Complete assigned reading and practice problems for ${subject.name}`,
            duration: 60,
            completed: false,
            dueDate: new Date(Date.now() + (j + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            difficulty: ['easy', 'medium', 'hard'][j % 3] as 'easy' | 'medium' | 'hard'
          };
          addTask(task);
        }
      }
    }
    
    setCurrentView('hub');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-teal-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-charcoal mb-4">
            Let's Create Your <span className="text-teal-600">Study Plan</span>
          </h1>
          <p className="text-xl text-gray-600">
            Tell me about your subjects and I'll generate a personalized AI study schedule
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Study Preferences */}
          <motion.div 
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-charcoal mb-6 flex items-center">
              <Clock className="mr-3 text-teal-600" />
              Study Preferences
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Hours Per Day
                </label>
                <input
                  type="number"
                  value={availableHours}
                  onChange={(e) => setAvailableHours(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  min="1"
                  max="12"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Exam Date
                </label>
                <input
                  type="date"
                  value={mainExamDate}
                  onChange={(e) => setMainExamDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Subjects */}
          <motion.div 
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold text-charcoal mb-6 flex items-center">
              <Target className="mr-3 text-teal-600" />
              Your Subjects
            </h2>
            
            <div className="space-y-4 mb-6">
              {subjects.map((subject, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: subject.color }}
                  ></div>
                  
                  <input
                    type="text"
                    placeholder="Subject name (e.g., Mathematics)"
                    value={subject.name || ''}
                    onChange={(e) => updateSubject(index, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                  
                  <input
                    type="date"
                    value={subject.examDate || mainExamDate}
                    onChange={(e) => updateSubject(index, 'examDate', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                  
                  <motion.button
                    onClick={() => removeSubject(index)}
                    className="text-red-500 hover:text-red-700 p-2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ×
                  </motion.button>
                </motion.div>
              ))}
            </div>
            
            <motion.button
              onClick={addNewSubject}
              className="w-full py-4 border-2 border-dashed border-teal-300 text-teal-600 rounded-xl hover:bg-teal-50 transition-colors duration-300 flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="mr-2" size={20} />
              Add Subject
            </motion.button>
          </motion.div>

          {/* Generate Plan Button */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              onClick={generateStudyPlan}
              disabled={subjects.length === 0 || subjects.some(s => !s.name)}
              className="px-12 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-2xl shadow-xl hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(0,109,119,0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              Generate My AI Study Plan ✨
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SubjectSetup;