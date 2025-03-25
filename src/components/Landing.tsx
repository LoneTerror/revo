import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle, 
  FileCheck, 
  Settings, 
  Search,
  Bell,
  UserCircle,
  ChevronDown,
  BarChart3,
  UserCheck,
  ShieldCheck,
  History
} from 'lucide-react';

function Landing() {
  const [searchQuery, setSearchQuery] = useState('');

  const cards = [
    {
      title: 'Voter Verification',
      description: 'Verify voter identity and eligibility',
      icon: <UserCheck className="w-6 h-6" />,
      stats: '2,456 verified',
      color: 'bg-blue-500'
    },
    {
      title: 'Identity Checks',
      description: 'Review and validate identification documents',
      icon: <ShieldCheck className="w-6 h-6" />,
      stats: '1,890 completed',
      color: 'bg-green-500'
    },
    {
      title: 'Verification History',
      description: 'Access past verification records',
      icon: <History className="w-6 h-6" />,
      stats: '5,678 records',
      color: 'bg-purple-500'
    },
    {
      title: 'Analytics',
      description: 'View verification statistics and trends',
      icon: <BarChart3 className="w-6 h-6" />,
      stats: 'Real-time data',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <FileCheck className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold">VoterVerify</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
              
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell className="w-6 h-6 text-gray-600" />
              </button>
              
              <div className="flex items-center space-x-2">
                <UserCircle className="w-8 h-8 text-gray-600" />
                <span className="text-sm font-medium">Admin</span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="w-12 h-12 text-blue-500" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Total Voters</h3>
                <p className="text-2xl font-bold">24,567</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Verified Today</h3>
                <p className="text-2xl font-bold">156</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Settings className="w-12 h-12 text-purple-500" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Pending</h3>
                <p className="text-2xl font-bold">89</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <FileCheck className="w-12 h-12 text-orange-500" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Success Rate</h3>
                <p className="text-2xl font-bold">98.5%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Access Cards */}
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className={`${card.color} p-4`}>
                <div className="text-white">{card.icon}</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-gray-600 mb-4">{card.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">{card.stats}</span>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                    Access
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Landing;