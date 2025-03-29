import React from 'react';
import { Users, CheckCircle, XCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: 'Total Voters', value: '1,234', icon: Users, color: 'bg-blue-500' },
    { title: 'Verified', value: '856', icon: CheckCircle, color: 'bg-green-500' },
    { title: 'Rejected', value: '123', icon: XCircle, color: 'bg-red-500' },
    { title: 'Pending', value: '255', icon: Clock, color: 'bg-yellow-500' },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h2>
          <p className="mt-2 text-sm text-gray-700">
            Monitor and manage voter verification status in real-time
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.title} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 ${item.color} rounded-md p-3`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{item.title}</dt>
                      <dd className="text-lg font-semibold text-gray-900">{item.value}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Verifications</h2>
          <p className="mt-4 text-gray-500">Table will be implemented in the next phase</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;