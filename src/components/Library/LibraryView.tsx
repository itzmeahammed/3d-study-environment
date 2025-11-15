import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, BookOpen, Star, Users, Clock, Download, Eye, Heart } from 'lucide-react';
import { useStore } from '../../store/useStore';

const LibraryView: React.FC = () => {
  const { books, subjects, setSelectedBook, setCurrentView } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredBooks = books.filter(book => {
    const matchesSearch = searchQuery === '' || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubject = selectedSubject === 'all' || book.subjectId === selectedSubject;
    
    return matchesSearch && matchesSubject;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
        return b.downloadCount - a.downloadCount;
      case 'recent':
      default:
        return new Date(b.pages[0]?.lastModified || 0).getTime() - new Date(a.pages[0]?.lastModified || 0).getTime();
    }
  });

  const handleBookClick = (bookId: string) => {
    setSelectedBook(bookId);
    setCurrentView('hub');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-teal-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-charcoal mb-4">
            Digital <span className="text-teal-600">Library</span>
          </h1>
          <p className="text-xl text-gray-600">
            Explore your collection of interactive study materials
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search books, authors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500"
              >
                <option value="recent">Recently Added</option>
                <option value="title">Title A-Z</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
              </select>
              
              <motion.button
                className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="mr-2" size={16} />
                Add Book
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Books Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {sortedBooks.map((book, index) => {
            const subject = subjects.find(s => s.id === book.subjectId);
            
            return (
              <motion.div
                key={book.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => handleBookClick(book.id)}
              >
                {/* Book Cover */}
                <div 
                  className="h-48 relative overflow-hidden"
                  style={{ backgroundColor: book.coverColor }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="text-white/80" size={48} />
                  </div>
                  
                  {/* Progress Indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                    <motion.div 
                      className="h-full bg-white/80"
                      initial={{ width: 0 }}
                      animate={{ width: `${book.readingProgress}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                    />
                  </div>
                  
                  {/* Difficulty Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      book.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                      book.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {book.difficulty}
                    </span>
                  </div>
                </div>

                {/* Book Info */}
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="font-bold text-charcoal mb-1 group-hover:text-teal-600 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600">by {book.author}</p>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {book.description}
                  </p>
                  
                  {/* Book Stats */}
                  <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Star className="mr-1" size={12} />
                      {book.rating.toFixed(1)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1" size={12} />
                      {book.estimatedReadTime}m
                    </div>
                    <div className="flex items-center">
                      <Eye className="mr-1" size={12} />
                      {book.downloadCount}
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="mr-1" size={12} />
                      {book.totalPages} pages
                    </div>
                  </div>
                  
                  {/* Subject Tag */}
                  {subject && (
                    <div className="flex items-center justify-between">
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: subject.color }}
                      >
                        {subject.name}
                      </span>
                      
                      <div className="flex items-center space-x-1">
                        <motion.button
                          className="p-1 text-gray-400 hover:text-coral-600 transition-colors"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Heart size={14} />
                        </motion.button>
                        <motion.button
                          className="p-1 text-gray-400 hover:text-teal-600 transition-colors"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Download size={14} />
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {sortedBooks.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No books found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? 'Try adjusting your search terms' : 'Start building your library'}
            </p>
            <motion.button
              className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="mr-2" size={16} />
              Add Your First Book
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LibraryView;