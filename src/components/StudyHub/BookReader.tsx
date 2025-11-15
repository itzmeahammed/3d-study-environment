import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Bookmark, 
  Edit3, 
  Save, 
  Volume2, 
  VolumeX,
  Settings,
  X,
  Plus,
  Highlighter
} from 'lucide-react';
import { useStore } from '../../store/useStore';

interface BookPage {
  id: string;
  pageNumber: number;
  title: string;
  content: string;
  notes: string[];
  highlights: Array<{ text: string; color: string; id: string }>;
}

interface BookReaderProps {
  bookId: string;
  onClose: () => void;
}

const BookReader: React.FC<BookReaderProps> = ({ bookId, onClose }) => {
  const { subjects } = useStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [selectedText, setSelectedText] = useState('');
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [highlightPosition, setHighlightPosition] = useState({ x: 0, y: 0 });
  
  const contentRef = useRef<HTMLDivElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Mock book data - in a real app this would come from the backend
  const book = {
    id: bookId,
    title: subjects.find(s => s.id === bookId)?.name || 'Study Material',
    author: 'AI Generated Content',
    totalPages: 25,
    pages: Array.from({ length: 25 }, (_, i) => ({
      id: `page-${i}`,
      pageNumber: i + 1,
      title: `Chapter ${Math.floor(i / 3) + 1}: ${subjects.find(s => s.id === bookId)?.name} Fundamentals`,
      content: generatePageContent(subjects.find(s => s.id === bookId)?.name || 'Subject', i + 1),
      notes: [],
      highlights: []
    }))
  };

  function generatePageContent(subject: string, pageNum: number): string {
    const contents = {
      'Mathematics': [
        'Calculus is the mathematical study of continuous change. It has two major branches: differential calculus and integral calculus. Differential calculus concerns instantaneous rates of change and slopes of curves, while integral calculus concerns accumulation of quantities and areas under curves.',
        'A derivative represents the rate of change of a function with respect to a variable. The derivative of f(x) at point x is defined as the limit of [f(x+h) - f(x)]/h as h approaches 0. This fundamental concept allows us to analyze motion, optimization problems, and curve behavior.',
        'Integration is the reverse process of differentiation. The integral of a function f(x) over an interval [a,b] represents the area under the curve. The Fundamental Theorem of Calculus connects derivatives and integrals, showing they are inverse operations.',
        'Linear algebra deals with vector spaces and linear mappings between them. Matrices are rectangular arrays of numbers that represent linear transformations. Matrix multiplication, determinants, and eigenvalues are key concepts in solving systems of equations.',
        'Probability theory studies random events and uncertainty. The probability of an event is a number between 0 and 1, where 0 means impossible and 1 means certain. Conditional probability and Bayes\' theorem help us update probabilities based on new information.'
      ],
      'Physics': [
        'Newton\'s laws of motion form the foundation of classical mechanics. The first law states that objects at rest stay at rest, and objects in motion stay in motion, unless acted upon by an external force. This is also known as the law of inertia.',
        'Energy is the capacity to do work. Kinetic energy is the energy of motion, calculated as ½mv². Potential energy is stored energy due to position or configuration. The law of conservation of energy states that energy cannot be created or destroyed, only transformed.',
        'Waves are disturbances that transfer energy through space and time. Sound waves are longitudinal pressure waves that travel through air at approximately 343 m/s at room temperature. Light waves are electromagnetic waves that travel at 3×10⁸ m/s in vacuum.',
        'Thermodynamics studies heat, temperature, and energy transfer. The first law states that energy is conserved. The second law introduces entropy and explains why heat flows from hot to cold objects. Temperature is a measure of average kinetic energy of particles.',
        'Electricity and magnetism are closely related phenomena. Electric charges create electric fields, and moving charges create magnetic fields. Electromagnetic induction allows us to generate electricity by moving conductors through magnetic fields.'
      ],
      'Chemistry': [
        'Atoms are the basic building blocks of matter. They consist of a nucleus containing protons and neutrons, surrounded by electrons in orbitals. The number of protons determines the element, while the number of electrons determines chemical properties.',
        'Chemical bonds form when atoms share or transfer electrons. Covalent bonds involve sharing electrons between atoms, while ionic bonds involve transfer of electrons from one atom to another. These bonds determine molecular structure and properties.',
        'Chemical reactions involve breaking and forming bonds between atoms. Reactants are converted to products, and the process follows conservation of mass and energy. Catalysts can speed up reactions without being consumed in the process.',
        'The periodic table organizes elements by atomic number and reveals patterns in properties. Elements in the same group have similar chemical properties due to having the same number of valence electrons. Periodic trends include atomic radius, ionization energy, and electronegativity.',
        'Solutions are homogeneous mixtures where one substance (solute) is dissolved in another (solvent). Concentration can be expressed in various ways including molarity, molality, and percentage. pH measures the acidity or basicity of aqueous solutions.'
      ],
      'Biology': [
        'Cells are the fundamental units of life. All living organisms are composed of one or more cells. Prokaryotic cells lack a membrane-bound nucleus, while eukaryotic cells have a nucleus and other membrane-bound organelles like mitochondria and chloroplasts.',
        'DNA (deoxyribonucleic acid) carries genetic information in all living organisms. It consists of two complementary strands forming a double helix. The sequence of nucleotides (A, T, G, C) encodes instructions for making proteins through transcription and translation.',
        'Evolution is the change in heritable traits of biological populations over successive generations. Natural selection, proposed by Charles Darwin, explains how organisms with favorable traits are more likely to survive and reproduce, passing these traits to offspring.',
        'Photosynthesis is the process by which plants convert light energy into chemical energy. Chloroplasts capture sunlight and use it to convert carbon dioxide and water into glucose and oxygen. This process is essential for most life on Earth.',
        'The human body consists of multiple organ systems working together. The circulatory system transports nutrients and oxygen, the nervous system coordinates responses, and the immune system defends against pathogens. Homeostasis maintains stable internal conditions.'
      ]
    };

    const subjectContent = contents[subject as keyof typeof contents] || contents['Mathematics'];
    const baseContent = subjectContent[pageNum % subjectContent.length];
    
    return `
      <h2>Page ${pageNum}</h2>
      <p>${baseContent}</p>
      <br>
      <h3>Key Concepts:</h3>
      <ul>
        <li>Understanding fundamental principles</li>
        <li>Practical applications and examples</li>
        <li>Problem-solving techniques</li>
        <li>Real-world connections</li>
      </ul>
      <br>
      <p><strong>Practice Problems:</strong> Try applying these concepts to solve related problems and deepen your understanding.</p>
    `;
  }

  const currentPageData = book.pages[currentPage];

  const nextPage = () => {
    if (currentPage < book.totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const toggleBookmark = () => {
    setBookmarks(prev => 
      prev.includes(currentPage) 
        ? prev.filter(p => p !== currentPage)
        : [...prev, currentPage]
    );
  };

  const toggleTTS = () => {
    if (isTTSPlaying) {
      speechSynthesis.cancel();
      setIsTTSPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(currentPageData.content.replace(/<[^>]*>/g, ''));
      utterance.rate = 0.8;
      utterance.onend = () => setIsTTSPlaying(false);
      speechSynthesis.speak(utterance);
      speechRef.current = utterance;
      setIsTTSPlaying(true);
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectedText(selection.toString());
      setHighlightPosition({ x: rect.left + rect.width / 2, y: rect.top - 10 });
      setShowHighlightMenu(true);
    } else {
      setShowHighlightMenu(false);
    }
  };

  const addHighlight = (color: string) => {
    if (selectedText) {
      // In a real app, this would save to backend
      console.log('Adding highlight:', selectedText, color);
      setShowHighlightMenu(false);
      window.getSelection()?.removeAllRanges();
    }
  };

  useEffect(() => {
    return () => {
      if (speechRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ zIndex: "50000000 !important" }}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-coral-50">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-charcoal">{book.title}</h1>
            <span className="text-sm text-gray-600">by {book.author}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Search Toggle */}
            <motion.button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 rounded-lg transition-colors ${isSearchOpen ? 'bg-teal-100 text-teal-600' : 'text-gray-600 hover:bg-gray-100'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search size={20} />
            </motion.button>

            {/* Bookmark Toggle */}
            <motion.button
              onClick={toggleBookmark}
              className={`p-2 rounded-lg transition-colors ${bookmarks.includes(currentPage) ? 'bg-mustard-100 text-mustard-600' : 'text-gray-600 hover:bg-gray-100'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bookmark size={20} />
            </motion.button>

            {/* TTS Toggle */}
            <motion.button
              onClick={toggleTTS}
              className={`p-2 rounded-lg transition-colors ${isTTSPlaying ? 'bg-coral-100 text-coral-600' : 'text-gray-600 hover:bg-gray-100'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isTTSPlaying ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </motion.button>

            {/* Edit Toggle */}
            <motion.button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-2 rounded-lg transition-colors ${isEditing ? 'bg-green-100 text-green-600' : 'text-gray-600 hover:bg-gray-100'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isEditing ? <Save size={20} /> : <Edit3 size={20} />}
            </motion.button>

            {/* Close */}
            <motion.button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={20} />
            </motion.button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              className="p-4 border-b border-gray-200 bg-gray-50"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search in this book..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Page Content */}
          <div className="flex-1 relative">
            {/* Page Flip Container */}
            <div className="h-full flex items-center justify-center p-8 relative">
              <motion.div
                key={currentPage}
                className="w-full max-w-4xl h-full bg-white rounded-2xl shadow-lg border border-gray-200 relative overflow-hidden"
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Page Content */}
                <div className="h-full flex flex-col p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-charcoal">{currentPageData.title}</h2>
                    <span className="text-sm text-gray-500">Page {currentPage + 1} of {book.totalPages}</span>
                  </div>
                  
                  <div 
                    ref={contentRef}
                    className="flex-1 overflow-y-auto prose prose-lg max-w-none"
                    onMouseUp={handleTextSelection}
                    contentEditable={isEditing}
                    suppressContentEditableWarning={true}
                    dangerouslySetInnerHTML={{ __html: currentPageData.content }}
                  />
                </div>

                {/* Page Number */}
                <div className="absolute bottom-4 right-4 text-sm text-gray-400">
                  {currentPage + 1}
                </div>
              </motion.div>
            </div>

            {/* Navigation Arrows */}
            <motion.button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={24} className="text-gray-600" />
            </motion.button>

            <motion.button
              onClick={nextPage}
              disabled={currentPage === book.totalPages - 1}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={24} className="text-gray-600" />
            </motion.button>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col">
            {/* Progress Bar */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Reading Progress</span>
                <span className="text-sm font-bold text-teal-600">
                  {Math.round(((currentPage + 1) / book.totalPages) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentPage + 1) / book.totalPages) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Table of Contents */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="font-semibold text-charcoal mb-4">Table of Contents</h3>
              <div className="space-y-2">
                {Array.from({ length: Math.ceil(book.totalPages / 3) }, (_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setCurrentPage(i * 3)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      Math.floor(currentPage / 3) === i 
                        ? 'bg-teal-100 text-teal-700 border border-teal-200' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    whileHover={{ x: 5 }}
                  >
                    <div className="font-medium">Chapter {i + 1}</div>
                    <div className="text-sm text-gray-500">Pages {i * 3 + 1}-{Math.min((i + 1) * 3, book.totalPages)}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t border-gray-200 space-y-3">
              <motion.button
                className="w-full flex items-center justify-center px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="mr-2" size={16} />
                Generate Flashcards
              </motion.button>
              
              <motion.button
                className="w-full flex items-center justify-center px-4 py-3 bg-coral-100 text-coral-600 rounded-lg hover:bg-coral-200 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Bookmark className="mr-2" size={16} />
                View Bookmarks ({bookmarks.length})
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Page {currentPage + 1} of {book.totalPages}
              </span>
              {bookmarks.includes(currentPage) && (
                <span className="text-xs bg-mustard-100 text-mustard-700 px-2 py-1 rounded-full">
                  Bookmarked
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max={book.totalPages - 1}
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="w-32"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Highlight Menu */}
      <AnimatePresence>
        {showHighlightMenu && (
          <motion.div
            className="fixed bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-60"
            style={{ 
              left: highlightPosition.x - 100, 
              top: highlightPosition.y - 60 
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex space-x-1">
              {['#FFD166', '#FF6B6B', '#006D77', '#83C5BE'].map((color) => (
                <motion.button
                  key={color}
                  onClick={() => addHighlight(color)}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: color }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BookReader;