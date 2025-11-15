import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Subject, StudyTask, Flashcard, User, StudySession, Book, Quiz, AdminStats, Achievement } from '../types';

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // Study data
  subjects: Subject[];
  tasks: StudyTask[];
  flashcards: Flashcard[];
  books: Book[];
  quizzes: Quiz[];
  studySessions: StudySession[];
  
  // UI state
  currentView: 'landing' | 'onboarding' | 'hub' | 'dashboard' | 'flashcards' | 'generator' | 'settings' | 'admin' | 'library' | 'quiz' | 'profile';
  selectedSubject: string | null;
  selectedBook: string | null;
  isLoading: boolean;
  activeStudySession: StudySession | null;
  
  // Admin state
  adminStats: AdminStats | null;
  allUsers: User[];
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (auth: boolean) => void;
  setCurrentView: (view: AppState['currentView']) => void;
  setSelectedSubject: (subjectId: string | null) => void;
  setSelectedBook: (bookId: string | null) => void;
  addSubject: (subject: Subject) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  addTask: (task: StudyTask) => void;
  completeTask: (taskId: string) => void;
  addFlashcard: (flashcard: Flashcard) => void;
  addBook: (book: Book) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  addQuiz: (quiz: Quiz) => void;
  startStudySession: (subjectId: string) => void;
  endStudySession: () => void;
  setLoading: (loading: boolean) => void;
  initializeMockData: () => void;
  initializeAdminData: () => void;
  generateBulkFlashcards: (subjectId: string, count: number) => void;
  unlockAchievement: (achievementId: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      subjects: [],
      tasks: [],
      flashcards: [],
      books: [],
      quizzes: [],
      studySessions: [],
      currentView: 'landing',
      selectedSubject: null,
      selectedBook: null,
      isLoading: false,
      activeStudySession: null,
      adminStats: null,
      allUsers: [],

      // Actions
      setUser: (user) => set({ user }),
      setAuthenticated: (auth) => set({ isAuthenticated: auth }),
      setCurrentView: (view) => set({ currentView: view }),
      setSelectedSubject: (subjectId) => set({ selectedSubject: subjectId }),
      setSelectedBook: (bookId) => set({ selectedBook: bookId }),
      
      addSubject: (subject) => set((state) => ({
        subjects: [...state.subjects, subject]
      })),
      
      updateSubject: (id, updates) => set((state) => ({
        subjects: state.subjects.map(subject => 
          subject.id === id ? { ...subject, ...updates } : subject
        )
      })),

      deleteSubject: (id) => set((state) => ({
        subjects: state.subjects.filter(subject => subject.id !== id),
        tasks: state.tasks.filter(task => task.subjectId !== id),
        flashcards: state.flashcards.filter(card => card.subjectId !== id)
      })),
      
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, task]
      })),
      
      completeTask: (taskId) => set((state) => {
        const task = state.tasks.find(t => t.id === taskId);
        if (!task) return state;
        
        const updatedTasks = state.tasks.map(t => 
          t.id === taskId ? { ...t, completed: true, completedAt: new Date().toISOString() } : t
        );
        
        // Update subject progress
        const subject = state.subjects.find(s => s.id === task.subjectId);
        if (subject) {
          const subjectTasks = updatedTasks.filter(t => t.subjectId === subject.id);
          const completedCount = subjectTasks.filter(t => t.completed).length;
          const progress = (completedCount / subjectTasks.length) * 100;
          
          const updatedSubjects = state.subjects.map(s => 
            s.id === subject.id 
              ? { ...s, progress, completedTasks: completedCount }
              : s
          );
          
          return { tasks: updatedTasks, subjects: updatedSubjects };
        }
        
        return { tasks: updatedTasks };
      }),
      
      addFlashcard: (flashcard) => set((state) => ({
        flashcards: [...state.flashcards, flashcard]
      })),

      addBook: (book) => set((state) => ({
        books: [...state.books, book]
      })),

      updateBook: (id, updates) => set((state) => ({
        books: state.books.map(book => 
          book.id === id ? { ...book, ...updates } : book
        )
      })),

      addQuiz: (quiz) => set((state) => ({
        quizzes: [...state.quizzes, quiz]
      })),

      startStudySession: (subjectId) => {
        const session: StudySession = {
          id: `session-${Date.now()}`,
          userId: get().user?.id || '',
          subjectId,
          startTime: new Date().toISOString(),
          duration: 0,
          tasksCompleted: 0,
          flashcardsReviewed: 0,
          pagesRead: 0,
          focusScore: 100,
          breaksTaken: 0,
          sessionType: 'focused'
        };
        
        set({ activeStudySession: session });
      },

      endStudySession: () => {
        const session = get().activeStudySession;
        if (session) {
          const endTime = new Date().toISOString();
          const duration = new Date(endTime).getTime() - new Date(session.startTime).getTime();
          
          const completedSession = {
            ...session,
            endTime,
            duration: Math.floor(duration / 1000 / 60) // minutes
          };
          
          set((state) => ({
            studySessions: [...state.studySessions, completedSession],
            activeStudySession: null
          }));
        }
      },
      
      setLoading: (loading) => set({ isLoading: loading }),

      generateBulkFlashcards: (subjectId, count) => {
        const subject = get().subjects.find(s => s.id === subjectId);
        if (!subject) return;

        const newFlashcards: Flashcard[] = [];
        const templates = getFlashcardTemplates(subject.name);
        
        for (let i = 0; i < count; i++) {
          const template = templates[i % templates.length];
          const variation = Math.floor(i / templates.length) + 1;
          
          const flashcard: Flashcard = {
            id: `card-${Date.now()}-${i}`,
            subjectId,
            question: `${template.question}${variation > 1 ? ` (Variation ${variation})` : ''}`,
            answer: template.answer,
            type: template.type as any,
            options: template.options,
            correctAnswer: template.correctAnswer,
            explanation: template.explanation,
            difficulty: template.difficulty as any,
            easiness: 2.5,
            interval: 1,
            repetitions: 0,
            nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            tags: [subject.name.toLowerCase()],
            createdBy: get().user?.id || 'system',
            isPublic: true,
            successRate: 0
          };
          
          newFlashcards.push(flashcard);
        }
        
        set((state) => ({
          flashcards: [...state.flashcards, ...newFlashcards]
        }));
      },

      unlockAchievement: (achievementId) => {
        const user = get().user;
        if (!user) return;

        const achievement: Achievement = {
          id: achievementId,
          title: getAchievementTitle(achievementId),
          description: getAchievementDescription(achievementId),
          icon: getAchievementIcon(achievementId),
          unlockedAt: new Date().toISOString(),
          rarity: getAchievementRarity(achievementId)
        };

        set((state) => ({
          user: state.user ? {
            ...state.user,
            achievements: [...state.user.achievements, achievement],
            experience: state.user.experience + getAchievementXP(achievementId)
          } : null
        }));
      },
      
      initializeMockData: () => {
        const mockUser: User = {
          id: 'user-1',
          name: 'Alex Chen',
          email: 'alex@example.com',
          role: 'student',
          totalStudyTime: 2450,
          level: 8,
          experience: 3200,
          achievements: [
            {
              id: 'first-session',
              title: 'First Study Session',
              description: 'Completed your first study session',
              icon: '🎯',
              unlockedAt: '2025-01-10T10:00:00Z',
              rarity: 'common'
            },
            {
              id: 'week-streak',
              title: 'Week Streak',
              description: 'Studied for 7 consecutive days',
              icon: '🔥',
              unlockedAt: '2025-01-12T15:30:00Z',
              rarity: 'rare'
            }
          ],
          streakDays: 12,
          preferences: {
            theme: 'light',
            language: 'en',
            notifications: {
              studyReminders: true,
              achievementAlerts: true,
              weeklyReports: false,
              flashcardReviews: true
            },
            studySettings: {
              sessionDuration: 45,
              breakDuration: 15,
              dailyGoal: 120,
              preferredDifficulty: 'adaptive'
            },
            accessibility: {
              fontSize: 'medium',
              highContrast: false,
              reducedMotion: false,
              screenReader: false
            }
          },
          enrolledSubjects: ['1', '2', '3', '4'],
          createdSubjects: [],
          statistics: {
            totalBooksRead: 12,
            totalFlashcardsReviewed: 450,
            averageSessionTime: 38,
            strongestSubjects: ['Chemistry', 'Biology'],
            weakestSubjects: ['Physics'],
            studyStreak: 12,
            weeklyGoalCompletion: 85,
            monthlyProgress: 78
          }
        };
        
        const mockSubjects: Subject[] = [
          {
            id: '1',
            name: 'Advanced Mathematics',
            color: '#FF6B6B',
            progress: 75,
            totalTasks: 20,
            completedTasks: 15,
            examDate: '2025-02-15',
            description: 'Comprehensive calculus and linear algebra course',
            difficulty: 'advanced',
            estimatedHours: 120,
            tags: ['calculus', 'algebra', 'mathematics'],
            createdBy: 'admin',
            isPublic: true,
            rating: 4.8,
            enrolledStudents: 1250
          },
          {
            id: '2',
            name: 'Quantum Physics',
            color: '#006D77',
            progress: 45,
            totalTasks: 16,
            completedTasks: 7,
            examDate: '2025-02-20',
            description: 'Introduction to quantum mechanics and modern physics',
            difficulty: 'advanced',
            estimatedHours: 100,
            tags: ['quantum', 'physics', 'mechanics'],
            createdBy: 'admin',
            isPublic: true,
            rating: 4.6,
            enrolledStudents: 890
          },
          {
            id: '3',
            name: 'Organic Chemistry',
            color: '#FFD166',
            progress: 90,
            totalTasks: 12,
            completedTasks: 11,
            examDate: '2025-02-10',
            description: 'Comprehensive organic chemistry with lab work',
            difficulty: 'intermediate',
            estimatedHours: 80,
            tags: ['chemistry', 'organic', 'lab'],
            createdBy: 'admin',
            isPublic: true,
            rating: 4.9,
            enrolledStudents: 1100
          },
          {
            id: '4',
            name: 'Molecular Biology',
            color: '#83C5BE',
            progress: 30,
            totalTasks: 18,
            completedTasks: 5,
            examDate: '2025-02-25',
            description: 'Advanced molecular biology and genetics',
            difficulty: 'advanced',
            estimatedHours: 110,
            tags: ['biology', 'molecular', 'genetics'],
            createdBy: 'admin',
            isPublic: true,
            rating: 4.7,
            enrolledStudents: 750
          },
          {
            id: '5',
            name: 'Data Structures',
            color: '#A8E6CF',
            progress: 60,
            totalTasks: 14,
            completedTasks: 8,
            examDate: '2025-03-01',
            description: 'Computer science fundamentals and algorithms',
            difficulty: 'intermediate',
            estimatedHours: 90,
            tags: ['computer-science', 'algorithms', 'programming'],
            createdBy: 'admin',
            isPublic: true,
            rating: 4.5,
            enrolledStudents: 2100
          },
          {
            id: '6',
            name: 'World History',
            color: '#FFB3BA',
            progress: 20,
            totalTasks: 22,
            completedTasks: 4,
            examDate: '2025-03-05',
            description: 'Comprehensive world history from ancient to modern times',
            difficulty: 'beginner',
            estimatedHours: 70,
            tags: ['history', 'world', 'civilization'],
            createdBy: 'admin',
            isPublic: true,
            rating: 4.3,
            enrolledStudents: 1800
          }
        ];

        // Generate 500+ flashcards
        const allFlashcards: Flashcard[] = [];
        mockSubjects.forEach(subject => {
          const templates = getFlashcardTemplates(subject.name);
          const cardsPerSubject = Math.floor(500 / mockSubjects.length) + (subject.name === 'Advanced Mathematics' ? 50 : 0);
          
          for (let i = 0; i < cardsPerSubject; i++) {
            const template = templates[i % templates.length];
            const variation = Math.floor(i / templates.length) + 1;
            
            const flashcard: Flashcard = {
              id: `card-${subject.id}-${i}`,
              subjectId: subject.id,
              question: `${template.question}${variation > 1 ? ` (Level ${variation})` : ''}`,
              answer: template.answer,
              type: template.type as any,
              options: template.options,
              correctAnswer: template.correctAnswer,
              explanation: template.explanation,
              difficulty: template.difficulty as any,
              easiness: 2.5,
              interval: 1,
              repetitions: 0,
              nextReview: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
              tags: [subject.name.toLowerCase()],
              createdBy: 'system',
              isPublic: true,
              successRate: Math.random() * 100
            };
            
            allFlashcards.push(flashcard);
          }
        });

        // Generate mock books
        const mockBooks: Book[] = mockSubjects.map(subject => ({
          id: `book-${subject.id}`,
          title: `${subject.name} - Complete Guide`,
          author: 'AI Generated',
          subjectId: subject.id,
          description: `Comprehensive guide covering all aspects of ${subject.name}`,
          coverColor: subject.color,
          pages: generateBookPages(subject.name, 25),
          totalPages: 25,
          readingProgress: Math.random() * 100,
          lastReadPage: Math.floor(Math.random() * 25),
          bookmarks: [1, 5, 12],
          notes: [],
          highlights: [],
          createdBy: 'system',
          isPublic: true,
          rating: 4.5 + Math.random() * 0.5,
          downloadCount: Math.floor(Math.random() * 1000),
          language: 'en',
          difficulty: subject.difficulty,
          estimatedReadTime: Math.floor(Math.random() * 300) + 180
        }));
        
        set({
          user: mockUser,
          isAuthenticated: true,
          subjects: mockSubjects,
          flashcards: allFlashcards,
          books: mockBooks
        });
      },

      initializeAdminData: () => {
        const adminUser: User = {
          id: 'admin-1',
          name: 'Dr. Sarah Johnson',
          email: 'admin@studyplanner.com',
          role: 'admin',
          totalStudyTime: 0,
          level: 50,
          experience: 50000,
          achievements: [],
          streakDays: 0,
          preferences: {
            theme: 'light',
            language: 'en',
            notifications: {
              studyReminders: false,
              achievementAlerts: false,
              weeklyReports: true,
              flashcardReviews: false
            },
            studySettings: {
              sessionDuration: 60,
              breakDuration: 15,
              dailyGoal: 0,
              preferredDifficulty: 'adaptive'
            },
            accessibility: {
              fontSize: 'medium',
              highContrast: false,
              reducedMotion: false,
              screenReader: false
            }
          },
          enrolledSubjects: [],
          createdSubjects: ['1', '2', '3', '4', '5', '6'],
          statistics: {
            totalBooksRead: 0,
            totalFlashcardsReviewed: 0,
            averageSessionTime: 0,
            strongestSubjects: [],
            weakestSubjects: [],
            studyStreak: 0,
            weeklyGoalCompletion: 0,
            monthlyProgress: 0
          }
        };

        const adminStats: AdminStats = {
          totalUsers: 15420,
          totalSubjects: 156,
          totalBooks: 890,
          totalFlashcards: 12500,
          activeUsers: 3240,
          popularSubjects: get().subjects.slice(0, 5),
          systemHealth: {
            uptime: 99.8,
            memoryUsage: 65,
            activeConnections: 1250
          }
        };

        set({
          user: adminUser,
          isAuthenticated: true,
          adminStats,
          allUsers: [adminUser, ...generateMockUsers(50)]
        });
      }
    }),
    {
      name: 'study-planner-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        subjects: state.subjects,
        flashcards: state.flashcards,
        books: state.books
      })
    }
  )
);

// Helper functions
function getFlashcardTemplates(subjectName: string) {
  const templates = {
    'Advanced Mathematics': [
      { question: 'What is the derivative of sin(x)?', answer: 'cos(x)', type: 'shortAnswer', explanation: 'The derivative of sine is cosine', difficulty: 'medium' },
      { question: 'The integral of 1/x is:', options: ['ln|x| + C', 'x²/2 + C', '1/x² + C', 'e^x + C'], correctAnswer: 0, type: 'mcq', explanation: 'The antiderivative of 1/x is the natural logarithm', difficulty: 'medium' },
      { question: 'A matrix is invertible if its determinant is non-zero', answer: 'true', type: 'trueFalse', explanation: 'Non-zero determinant is required for matrix invertibility', difficulty: 'hard' },
      { question: 'The limit of (sin x)/x as x approaches 0 is ____', answer: '1', type: 'fillBlank', explanation: 'This is a fundamental limit in calculus', difficulty: 'hard' }
    ],
    'Quantum Physics': [
      { question: 'What is the uncertainty principle?', answer: 'You cannot simultaneously know both position and momentum of a particle with perfect accuracy', type: 'shortAnswer', explanation: 'Heisenberg uncertainty principle is fundamental to quantum mechanics', difficulty: 'hard' },
      { question: 'Schrödinger\'s equation describes:', options: ['Wave function evolution', 'Particle decay', 'Energy conservation', 'Force interactions'], correctAnswer: 0, type: 'mcq', explanation: 'Schrödinger equation governs quantum wave function dynamics', difficulty: 'hard' },
      { question: 'Quantum entanglement allows faster-than-light communication', answer: 'false', type: 'trueFalse', explanation: 'Entanglement does not allow information transfer', difficulty: 'hard' },
      { question: 'The wave-particle duality means light behaves as both ____ and ____', answer: 'wave and particle', type: 'fillBlank', explanation: 'Light exhibits both wave and particle properties', difficulty: 'medium' }
    ],
    'Organic Chemistry': [
      { question: 'What functional group characterizes alcohols?', answer: 'Hydroxyl group (-OH)', type: 'shortAnswer', explanation: 'The -OH group defines alcohols', difficulty: 'easy' },
      { question: 'Benzene has how many carbon atoms?', options: ['4', '5', '6', '7'], correctAnswer: 2, type: 'mcq', explanation: 'Benzene is a 6-carbon aromatic ring', difficulty: 'easy' },
      { question: 'Alkenes contain double bonds between carbon atoms', answer: 'true', type: 'trueFalse', explanation: 'Alkenes are defined by C=C double bonds', difficulty: 'easy' },
      { question: 'The process of adding hydrogen to alkenes is called ____', answer: 'hydrogenation', type: 'fillBlank', explanation: 'Hydrogenation converts alkenes to alkanes', difficulty: 'medium' }
    ],
    'Molecular Biology': [
      { question: 'What is the central dogma of molecular biology?', answer: 'DNA → RNA → Protein', type: 'shortAnswer', explanation: 'Information flows from DNA to RNA to proteins', difficulty: 'medium' },
      { question: 'Which enzyme synthesizes RNA from DNA?', options: ['DNA polymerase', 'RNA polymerase', 'Ligase', 'Helicase'], correctAnswer: 1, type: 'mcq', explanation: 'RNA polymerase transcribes DNA to RNA', difficulty: 'medium' },
      { question: 'mRNA carries genetic information from nucleus to ribosomes', answer: 'true', type: 'trueFalse', explanation: 'mRNA is the messenger between DNA and protein synthesis', difficulty: 'easy' },
      { question: 'The genetic code is read in groups of ____ nucleotides called codons', answer: 'three', type: 'fillBlank', explanation: 'Codons are triplets of nucleotides', difficulty: 'easy' }
    ],
    'Data Structures': [
      { question: 'What is the time complexity of binary search?', answer: 'O(log n)', type: 'shortAnswer', explanation: 'Binary search halves the search space each iteration', difficulty: 'medium' },
      { question: 'Which data structure uses LIFO principle?', options: ['Queue', 'Stack', 'Array', 'Tree'], correctAnswer: 1, type: 'mcq', explanation: 'Stack follows Last In, First Out principle', difficulty: 'easy' },
      { question: 'A balanced binary tree has O(log n) search time', answer: 'true', type: 'trueFalse', explanation: 'Balanced trees maintain logarithmic height', difficulty: 'medium' },
      { question: 'A hash table provides ____ average case lookup time', answer: 'O(1)', type: 'fillBlank', explanation: 'Hash tables offer constant time average lookup', difficulty: 'medium' }
    ],
    'World History': [
      { question: 'When did World War II end?', answer: '1945', type: 'shortAnswer', explanation: 'WWII ended in 1945 with Japan\'s surrender', difficulty: 'easy' },
      { question: 'The Renaissance began in which country?', options: ['France', 'Germany', 'Italy', 'England'], correctAnswer: 2, type: 'mcq', explanation: 'The Renaissance started in Italy in the 14th century', difficulty: 'easy' },
      { question: 'The Industrial Revolution began in the 18th century', answer: 'true', type: 'trueFalse', explanation: 'The Industrial Revolution started around 1760', difficulty: 'easy' },
      { question: 'The ____ Empire was known as the "Empire on which the sun never sets"', answer: 'British', type: 'fillBlank', explanation: 'The British Empire spanned the globe', difficulty: 'medium' }
    ]
  };

  return templates[subjectName as keyof typeof templates] || templates['Advanced Mathematics'];
}

function generateBookPages(subjectName: string, pageCount: number) {
  const pages = [];
  for (let i = 0; i < pageCount; i++) {
    pages.push({
      id: `page-${i}`,
      pageNumber: i + 1,
      title: `Chapter ${Math.floor(i / 3) + 1}: ${subjectName} Fundamentals`,
      content: generatePageContent(subjectName, i + 1),
      plainText: generatePlainText(subjectName, i + 1),
      wordCount: 250 + Math.floor(Math.random() * 200),
      readingTime: 2 + Math.floor(Math.random() * 3),
      lastModified: new Date().toISOString()
    });
  }
  return pages;
}

function generatePageContent(subject: string, pageNum: number): string {
  const contentMap = {
    'Advanced Mathematics': [
      '<h2>Introduction to Calculus</h2><p>Calculus is the mathematical study of continuous change, comprising differential and integral calculus. It provides tools for analyzing rates of change and accumulation.</p><h3>Key Concepts</h3><ul><li>Limits and continuity</li><li>Derivatives and differentiation</li><li>Integrals and integration</li><li>Applications in physics and engineering</li></ul>',
      '<h2>Derivatives and Rates of Change</h2><p>A derivative represents the instantaneous rate of change of a function. The derivative of f(x) at point x is defined as the limit of [f(x+h) - f(x)]/h as h approaches 0.</p><h3>Common Derivatives</h3><ul><li>d/dx(x²) = 2x</li><li>d/dx(sin x) = cos x</li><li>d/dx(e^x) = e^x</li><li>d/dx(ln x) = 1/x</li></ul>',
      '<h2>Integration Techniques</h2><p>Integration is the reverse process of differentiation. The integral of a function f(x) over an interval [a,b] represents the area under the curve.</p><h3>Integration Methods</h3><ul><li>Substitution method</li><li>Integration by parts</li><li>Partial fractions</li><li>Trigonometric substitution</li></ul>'
    ],
    'Quantum Physics': [
      '<h2>Wave-Particle Duality</h2><p>Light and matter exhibit both wave and particle properties. This fundamental concept revolutionized our understanding of the microscopic world.</p><h3>Key Experiments</h3><ul><li>Double-slit experiment</li><li>Photoelectric effect</li><li>Compton scattering</li><li>Electron diffraction</li></ul>',
      '<h2>Heisenberg Uncertainty Principle</h2><p>You cannot simultaneously know both the position and momentum of a particle with perfect accuracy. This is not a limitation of measurement but a fundamental property of nature.</p><h3>Mathematical Expression</h3><p>Δx × Δp ≥ ℏ/2</p>',
      '<h2>Quantum Entanglement</h2><p>When particles become entangled, measuring one instantly affects the other, regardless of distance. This "spooky action at a distance" puzzled Einstein.</p><h3>Applications</h3><ul><li>Quantum computing</li><li>Quantum cryptography</li><li>Quantum teleportation</li><li>Quantum sensors</li></ul>'
    ]
  };

  const defaultContent = '<h2>Study Material</h2><p>This page contains important information about the subject. Review carefully and take notes as needed.</p><h3>Learning Objectives</h3><ul><li>Understand key concepts</li><li>Apply knowledge practically</li><li>Prepare for assessments</li></ul>';
  
  const subjectContent = contentMap[subject as keyof typeof contentMap];
  return subjectContent ? subjectContent[pageNum % subjectContent.length] : defaultContent;
}

function generatePlainText(subject: string, pageNum: number): string {
  return generatePageContent(subject, pageNum).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function generateMockUsers(count: number): User[] {
  const users = [];
  const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Emily Davis', 'Chris Wilson'];
  
  for (let i = 0; i < count; i++) {
    users.push({
      id: `user-${i + 2}`,
      name: names[i % names.length] + ` ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: 'student' as const,
      totalStudyTime: Math.floor(Math.random() * 5000),
      level: Math.floor(Math.random() * 20) + 1,
      experience: Math.floor(Math.random() * 10000),
      achievements: [],
      streakDays: Math.floor(Math.random() * 30),
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: {
          studyReminders: true,
          achievementAlerts: true,
          weeklyReports: false,
          flashcardReviews: true
        },
        studySettings: {
          sessionDuration: 45,
          breakDuration: 15,
          dailyGoal: 120,
          preferredDifficulty: 'adaptive'
        },
        accessibility: {
          fontSize: 'medium',
          highContrast: false,
          reducedMotion: false,
          screenReader: false
        }
      },
      enrolledSubjects: [],
      createdSubjects: [],
      statistics: {
        totalBooksRead: Math.floor(Math.random() * 50),
        totalFlashcardsReviewed: Math.floor(Math.random() * 1000),
        averageSessionTime: Math.floor(Math.random() * 60) + 20,
        strongestSubjects: [],
        weakestSubjects: [],
        studyStreak: Math.floor(Math.random() * 15),
        weeklyGoalCompletion: Math.floor(Math.random() * 100),
        monthlyProgress: Math.floor(Math.random() * 100)
      }
    });
  }
  
  return users;
}

function getAchievementTitle(id: string): string {
  const titles = {
    'first-session': 'First Study Session',
    'week-streak': 'Week Streak',
    'flashcard-master': 'Flashcard Master',
    'book-worm': 'Book Worm',
    'quiz-champion': 'Quiz Champion'
  };
  return titles[id as keyof typeof titles] || 'Achievement Unlocked';
}

function getAchievementDescription(id: string): string {
  const descriptions = {
    'first-session': 'Completed your first study session',
    'week-streak': 'Studied for 7 consecutive days',
    'flashcard-master': 'Reviewed 100 flashcards',
    'book-worm': 'Read 10 complete books',
    'quiz-champion': 'Scored 90% or higher on 5 quizzes'
  };
  return descriptions[id as keyof typeof descriptions] || 'You achieved something great!';
}

function getAchievementIcon(id: string): string {
  const icons = {
    'first-session': '🎯',
    'week-streak': '🔥',
    'flashcard-master': '🧠',
    'book-worm': '📚',
    'quiz-champion': '🏆'
  };
  return icons[id as keyof typeof icons] || '⭐';
}

function getAchievementRarity(id: string): 'common' | 'rare' | 'epic' | 'legendary' {
  const rarities = {
    'first-session': 'common',
    'week-streak': 'rare',
    'flashcard-master': 'epic',
    'book-worm': 'epic',
    'quiz-champion': 'legendary'
  };
  return rarities[id as keyof typeof rarities] as any || 'common';
}

function getAchievementXP(id: string): number {
  const xpValues = {
    'first-session': 100,
    'week-streak': 500,
    'flashcard-master': 1000,
    'book-worm': 1500,
    'quiz-champion': 2000
  };
  return xpValues[id as keyof typeof xpValues] || 100;
}