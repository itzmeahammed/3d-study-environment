import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Palette, Download, LogOut, Save } from 'lucide-react';
import { useStore } from '../../store/useStore';

const SettingsPanel: React.FC = () => {
  const { user, setCurrentView } = useStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    studyReminders: true,
    achievementAlerts: true,
    weeklyReports: false
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  const handleLogout = () => {
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-teal-50 py-8">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-charcoal mb-4">
            <span className="text-teal-600">Settings</span> & Preferences
          </h1>
          <p className="text-xl text-gray-600">
            Customize your learning experience
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                        activeTab === tab.id 
                          ? 'bg-teal-600 text-white shadow-lg' 
                          : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon size={20} className="mr-3" />
                      {tab.label}
                    </motion.button>
                  );
                })}
                
                <div className="border-t border-gray-200 pt-4 mt-6">
                  <motion.button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogOut size={20} className="mr-3" />
                    Logout
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <h2 className="text-2xl font-semibold text-charcoal mb-6">Profile Settings</h2>
                    
                    <div className="flex items-center space-x-6 mb-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-coral-500 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {user?.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-charcoal">{user?.name}</h3>
                        <p className="text-gray-600">{user?.email}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-sm font-medium text-mustard-600 bg-mustard-100 px-3 py-1 rounded-full">
                            Level {user?.level}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user?.name}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          defaultValue={user?.email}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>
                    </div>
                    
                    <motion.button
                      className="flex items-center px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Save className="mr-2" size={20} />
                      Save Changes
                    </motion.button>
                  </motion.div>
                )}

                {activeTab === 'notifications' && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-semibold text-charcoal mb-6">Notification Preferences</h2>
                    
                    <div className="space-y-4">
                      {Object.entries(notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <h3 className="font-medium text-charcoal capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {key === 'studyReminders' && 'Get reminded about upcoming study sessions'}
                              {key === 'achievementAlerts' && 'Celebrate when you unlock new achievements'}
                              {key === 'weeklyReports' && 'Receive weekly progress summaries'}
                            </p>
                          </div>
                          <motion.button
                            onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                              value ? 'bg-teal-600' : 'bg-gray-300'
                            }`}
                            whileTap={{ scale: 0.95 }}
                          >
                            <motion.div
                              className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                              animate={{ x: value ? 32 : 4 }}
                              transition={{ duration: 0.3 }}
                            />
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'appearance' && (
                  <motion.div
                    key="appearance"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-semibold text-charcoal mb-6">Appearance</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium text-charcoal mb-4">Color Theme</h3>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { name: 'Teal & Coral', primary: '#006D77', accent: '#FF6B6B' },
                            { name: 'Ocean Blue', primary: '#0077BE', accent: '#FF6B9D' },
                            { name: 'Forest Green', primary: '#228B22', accent: '#FFB347' }
                          ].map((theme, index) => (
                            <motion.div
                              key={index}
                              className="p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-teal-400 transition-colors duration-300"
                              whileHover={{ scale: 1.05 }}
                            >
                              <div className="flex space-x-2 mb-2">
                                <div 
                                  className="w-8 h-8 rounded-full"
                                  style={{ backgroundColor: theme.primary }}
                                ></div>
                                <div 
                                  className="w-8 h-8 rounded-full"
                                  style={{ backgroundColor: theme.accent }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-700">{theme.name}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-charcoal mb-4">3D Environment</h3>
                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input type="checkbox" defaultChecked className="mr-3 rounded text-teal-600" />
                            <span className="text-gray-700">Enable particle effects</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" defaultChecked className="mr-3 rounded text-teal-600" />
                            <span className="text-gray-700">Auto-rotate books</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-3 rounded text-teal-600" />
                            <span className="text-gray-700">Reduce motion (accessibility)</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;