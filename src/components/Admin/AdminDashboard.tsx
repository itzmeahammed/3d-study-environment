import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  Brain, 
  TrendingUp, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Search,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  Database,
  Server
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { useStore } from '../../store/useStore';

const AdminDashboard: React.FC = () => {
  const { adminStats, allUsers, subjects, flashcards, books } = useStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'content', label: 'Content', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'system', label: 'System', icon: Server }
  ];

  const overviewStats = [
    {
      title: 'Total Users',
      value: adminStats?.totalUsers || 0,
      change: '+12%',
      icon: Users,
      color: 'text-teal-600',
      bg: 'bg-teal-50'
    },
    {
      title: 'Active Subjects',
      value: adminStats?.totalSubjects || 0,
      change: '+8%',
      icon: BookOpen,
      color: 'text-coral-600',
      bg: 'bg-coral-50'
    },
    {
      title: 'Total Flashcards',
      value: adminStats?.totalFlashcards || 0,
      change: '+25%',
      icon: Brain,
      color: 'text-mustard-600',
      bg: 'bg-mustard-50'
    },
    {
      title: 'System Health',
      value: `${adminStats?.systemHealth.uptime || 99}%`,
      change: 'Stable',
      icon: Activity,
      color: 'text-green-600',
      bg: 'bg-green-50'
    }
  ];

  const userActivityData = [
    { month: 'Jan', users: 1200, sessions: 3400 },
    { month: 'Feb', users: 1350, sessions: 3800 },
    { month: 'Mar', users: 1500, sessions: 4200 },
    { month: 'Apr', users: 1420, sessions: 4000 },
    { month: 'May', users: 1680, sessions: 4800 },
    { month: 'Jun', users: 1850, sessions: 5200 }
  ];

  const subjectPopularityData = subjects.map(subject => ({
    name: subject.name,
    students: subject.enrolledStudents,
    color: subject.color
  }));

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              className={`${stat.bg} rounded-2xl p-6 border border-gray-200 shadow-lg`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <Icon className={stat.color} size={24} />
                </div>
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <h3 className="text-3xl font-bold text-charcoal mb-2">{stat.value}</h3>
              <p className="text-gray-600 font-medium">{stat.title}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div 
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-charcoal mb-6">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="month" stroke="#666" />
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
                dataKey="users" 
                stroke="#006D77" 
                strokeWidth={3}
                dot={{ fill: '#006D77', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div 
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-xl font-semibold text-charcoal mb-6">Subject Popularity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={subjectPopularityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="students"
              >
                {subjectPopularityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-charcoal">User Management</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <motion.button
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="mr-2" size={16} />
            Add User
          </motion.button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Study Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Level</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allUsers.slice(0, 10).map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-coral-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium text-charcoal">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-red-100 text-red-700' :
                      user.role === 'creator' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {Math.floor(user.totalStudyTime / 60)}h {user.totalStudyTime % 60}m
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-teal-600">
                    {user.level}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        className="p-1 text-gray-400 hover:text-teal-600 transition-colors"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Edit size={16} />
                      </motion.button>
                      <motion.button
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-charcoal">Content Management</h2>
        <div className="flex items-center space-x-3">
          <motion.button
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <Upload className="mr-2" size={16} />
            Bulk Import
          </motion.button>
          <motion.button
            className="px-4 py-2 bg-coral-600 text-white rounded-lg hover:bg-coral-700 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <Plus className="mr-2" size={16} />
            Create Subject
          </motion.button>
        </div>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <BookOpen className="text-teal-600" size={32} />
            <span className="text-sm text-green-600 font-medium">+15 this week</span>
          </div>
          <h3 className="text-3xl font-bold text-charcoal mb-2">{subjects.length}</h3>
          <p className="text-gray-600">Active Subjects</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Brain className="text-coral-600" size={32} />
            <span className="text-sm text-green-600 font-medium">+127 today</span>
          </div>
          <h3 className="text-3xl font-bold text-charcoal mb-2">{flashcards.length}</h3>
          <p className="text-gray-600">Total Flashcards</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Database className="text-mustard-600" size={32} />
            <span className="text-sm text-green-600 font-medium">+8 this month</span>
          </div>
          <h3 className="text-3xl font-bold text-charcoal mb-2">{books.length}</h3>
          <p className="text-gray-600">Digital Books</p>
        </div>
      </div>

      {/* Subject Management */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-charcoal mb-6">Subject Management</h3>
        <div className="space-y-4">
          {subjects.map((subject) => (
            <div key={subject.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: subject.color }}
                ></div>
                <div>
                  <h4 className="font-semibold text-charcoal">{subject.name}</h4>
                  <p className="text-sm text-gray-600">
                    {subject.enrolledStudents} students • {subject.difficulty} • {subject.estimatedHours}h
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-teal-600">
                  {subject.rating.toFixed(1)} ⭐
                </span>
                <motion.button
                  className="p-2 text-gray-400 hover:text-teal-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <Edit size={16} />
                </motion.button>
                <motion.button
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-charcoal">Platform Analytics</h2>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-charcoal mb-6">User Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Bar dataKey="users" fill="#006D77" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sessions" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-charcoal mb-6">Subject Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={subjectPopularityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="students"
              >
                {subjectPopularityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderSystem = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-charcoal">System Health</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Server className="text-teal-600" size={32} />
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <h3 className="text-2xl font-bold text-charcoal mb-2">
            {adminStats?.systemHealth.uptime}%
          </h3>
          <p className="text-gray-600">Uptime</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Activity className="text-coral-600" size={32} />
            <span className="text-sm text-gray-500">Real-time</span>
          </div>
          <h3 className="text-2xl font-bold text-charcoal mb-2">
            {adminStats?.systemHealth.memoryUsage}%
          </h3>
          <p className="text-gray-600">Memory Usage</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Shield className="text-mustard-600" size={32} />
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <h3 className="text-2xl font-bold text-charcoal mb-2">
            {adminStats?.systemHealth.activeConnections}
          </h3>
          <p className="text-gray-600">Active Connections</p>
        </div>
      </div>
    </div>
  );

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
            <span className="text-teal-600">Admin</span> Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Manage your learning platform
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div 
          className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'bg-teal-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon size={20} className="mr-2" />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'content' && renderContent()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'system' && renderSystem()}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;