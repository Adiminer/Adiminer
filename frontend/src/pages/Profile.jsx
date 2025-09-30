import React, { useState, useEffect } from 'react';
import { User, Crown, Calendar, Target, BookOpen, Award, Settings, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getHistory } from '../services/api';

const Profile = () => {
  const { history, setHistory } = useApp();
  const [stats, setStats] = useState({
    totalProblems: 0,
    averageConfidence: 0,
    thisWeekProblems: 0,
    streak: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getHistory();
      if (response.success) {
        const historyData = response.data;
        setHistory(historyData);
        
        // Calculate stats
        const totalProblems = historyData.length;
        const averageConfidence = totalProblems > 0 
          ? Math.round(historyData.reduce((sum, item) => sum + item.confidence, 0) / totalProblems)
          : 0;
        
        // Calculate this week's problems
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const thisWeekProblems = historyData.filter(
          item => new Date(item.createdAt) > oneWeekAgo
        ).length;

        setStats({
          totalProblems,
          averageConfidence,
          thisWeekProblems,
          streak: Math.min(thisWeekProblems, 7) // Simple streak calculation
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const subscriptionPlans = [
    {
      name: 'Free',
      current: true,
      price: '$0',
      features: [
        '10 problems per day',
        'Basic step-by-step solutions',
        'Text input only',
        'Basic history tracking'
      ]
    },
    {
      name: 'Pro',
      current: false,
      price: '$9.99/month',
      features: [
        'Unlimited problems',
        'Advanced AI explanations',
        'Image upload support',
        'Detailed analytics',
        'Priority support',
        'Export solutions'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account and track your progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="card text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Study Companion User</h2>
              <p className="text-gray-600 mb-4">Free Plan</p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Joined September 2024</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-600">Total Problems</span>
                  </div>
                  <span className="font-semibold">{stats.totalProblems}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600">Avg. Confidence</span>
                  </div>
                  <span className="font-semibold">{stats.averageConfidence}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-600">This Week</span>
                  </div>
                  <span className="font-semibold">{stats.thisWeekProblems}</span>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-2 text-left p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <Settings className="h-4 w-4 text-gray-500" />
                  <span>Account Settings</span>
                </button>
                <button className="w-full flex items-center space-x-2 text-left p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <Bell className="h-4 w-4 text-gray-500" />
                  <span>Notifications</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Subscription Plans */}
          <div className="lg:col-span-2">
            <div className="card">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Subscription Plans</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subscriptionPlans.map((plan, index) => (
                  <div
                    key={index}
                    className={`relative border-2 rounded-lg p-6 ${
                      plan.current
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } transition-colors`}
                  >
                    {plan.current && (
                      <div className="absolute -top-3 left-4">
                        <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Current Plan
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 mb-4">
                      {plan.name === 'Pro' && <Crown className="h-5 w-5 text-yellow-500" />}
                      <h4 className="text-xl font-semibold text-gray-900">{plan.name}</h4>
                    </div>
                    
                    <div className="mb-6">
                      <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                      {plan.price !== '$0' && <span className="text-gray-600">/month</span>}
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        plan.current
                          ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                          : 'bg-primary-600 hover:bg-primary-700 text-white'
                      }`}
                      disabled={plan.current}
                    >
                      {plan.current ? 'Current Plan' : 'Upgrade to Pro'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Pro Benefits */}
              <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Why upgrade to Pro?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>• Solve unlimited problems daily</div>
                  <div>• Upload images of handwritten problems</div>
                  <div>• Get more detailed explanations</div>
                  <div>• Access advanced study analytics</div>
                  <div>• Export solutions as PDF</div>
                  <div>• Priority customer support</div>
                </div>
              </div>
            </div>

            {/* Usage Statistics */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage This Month</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Daily Problems Used</span>
                    <span className="text-gray-900">3 / 10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  You have <span className="font-semibold text-gray-900">7 problems</span> remaining today.
                  Upgrade to Pro for unlimited access.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;