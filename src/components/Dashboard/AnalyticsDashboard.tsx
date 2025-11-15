import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Trophy, Clock, Target, BookOpen, TrendingUp, Calendar } from 'lucide-react';
import { useStore } from '../../store/useStore';

const AnalyticsDashboard: React.FC = () => {
  const { subjects, user, tasks } = useStore();

  // Mock data for charts
  const weeklyProgressData = [
    { day: 'Mon', hours: 2.5, tasks: 4 },
    { day: 'Tue', hours: 3.2, tasks: 6 },
    { day: 'Wed', hours: 1.8, tasks: 3 },
    { day: 'Thu', hours: 4.1, tasks: 8 },
    { day: 'Fri', hours: 2.9, tasks: 5 },
    { day: 'Sat', hours: 5.2, tasks: 10 },
    { day: 'Sun', hours: 3.8, tasks: 7 }
  ];

  const subjectDistribution = subjects.map(subject => ({
    name: subject.name,
    value: subject.progress,
    color: subject.color
  }));

  const statsCards = [
    {
      title: 'Total Study Time',
      value: `${Math.floor((user?.totalStudyTime || 0) / 60)}h ${(user?.totalStudyTime || 0) % 60}m`,
      icon: Clock,
      color: 'text-teal-600',
      bg: 'bg-teal-50'
    },
    {
      title: 'Current Level',
      value: user?.level || 0,
      icon: Trophy,
      color: 'text-coral-600',
      bg: 'bg-coral-50'
    },
    {
      title: 'Study Streak',
      value: `${user?.streakDays || 0} days`,
      icon: Calendar,
      color: 'text-mustard-600',
      bg: 'bg-mustard-50'
    },
    {
      title: 'Tasks Completed',
      value: tasks.filter(t => t.completed).length,
      icon: Target,
      color: 'text-green-600',
      bg: 'bg-green-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-teal-50 py-8">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-charcoal mb-4">
            Your Learning <span className="text-teal-600">Analytics</span>
          </h1>
          <p className="text-xl text-gray-600">
            Track your progress and optimize your study habits
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                className={`${stat.bg} rounded-2xl p-6 border border-gray-200 shadow-lg`}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full ${stat.bg}`}>
                    <Icon className={`${stat.color}`} size={24} />
                  </div>
                  <TrendingUp className="text-green-500" size={16} />
                </div>
                <h3 className="text-3xl font-bold text-charcoal mb-2">{stat.value}</h3>
                <p className="text-gray-600 font-medium">{stat.title}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Progress Chart */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold text-charcoal mb-6 flex items-center">
              <BarChart className="mr-3 text-teal-600" />
              Weekly Study Hours
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis dataKey="day" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E5E5E5',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }} 
                />
                <Bar dataKey="hours" fill="#006D77" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Subject Progress Distribution */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold text-charcoal mb-6 flex items-center">
              <BookOpen className="mr-3 text-teal-600" />
              Subject Progress
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subjectDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subjectDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E5E5E5',
                    borderRadius: '12px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Task Completion Timeline */}
        <motion.div 
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-xl font-semibold text-charcoal mb-6">Task Completion Timeline</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyProgressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="day" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E5E5',
                  borderRadius: '12px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="tasks" 
                stroke="#FF6B6B" 
                strokeWidth={3}
                dot={{ fill: '#FF6B6B', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#FF6B6B', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Achievements Section */}
        <motion.div 
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <h2 className="text-xl font-semibold text-charcoal mb-6 flex items-center">
            <Trophy className="mr-3 text-mustard-600" />
            Recent Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {user?.achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className="flex items-center p-4 bg-gradient-to-r from-mustard-100 to-coral-100 rounded-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 bg-mustard-500 rounded-full flex items-center justify-center mr-4">
                  <Trophy className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal">{achievement}</h3>
                  <p className="text-sm text-gray-600">Unlocked recently</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;