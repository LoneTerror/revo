import React, { useState } from 'react';
import { UserCheck, UserX, AlertCircle, Clock, Search, Fingerprint } from 'lucide-react';

interface VoterVerification {
  id: string;
  voterId: string;
  voterName: string;
  timestamp: string;
  status: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
}

const OfficerPanel = () => {
  const [activeSession, setActiveSession] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for recent verifications
  const [recentVerifications, setRecentVerifications] = useState<VoterVerification[]>([
    {
      id: '1',
      voterId: 'VOT001',
      voterName: 'John Doe',
      timestamp: new Date().toISOString(),
      status: 'verified',
      verifiedBy: 'Officer 1'
    },
    {
      id: '2',
      voterId: 'VOT002',
      voterName: 'Jane Smith',
      timestamp: new Date().toISOString(),
      status: 'pending'
    }
  ]);

  const handleStartSession = () => {
    setActiveSession(true);
    // In a real implementation, this would initialize the fingerprint scanner
  };

  const handleEndSession = () => {
    setActiveSession(false);
    // In a real implementation, this would clean up the fingerprint scanner session
  };

  const handleVerifyVoter = async (voterId: string, status: 'verified' | 'rejected') => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setRecentVerifications(prev => prev.map(v => 
        v.voterId === voterId 
          ? { ...v, status, verifiedBy: 'Current Officer', timestamp: new Date().toISOString() }
          : v
      ));
      
      setError(null);
    } catch (err) {
      setError('Failed to update voter status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    const icons = {
      verified: <UserCheck size={16} />,
      rejected: <UserX size={16} />,
      pending: <Clock size={16} />
    };

    return (
      <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${styles[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="px-4 sm:px-0 mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Polling Officer Panel</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage voter verification sessions and track recent verifications
          </p>
        </div>

        {/* Session Control */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Verification Session</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {activeSession 
                    ? 'Session is active. Ready to verify voters.' 
                    : 'Start a new verification session'}
                </p>
              </div>
              <button
                onClick={activeSession ? handleEndSession : handleStartSession}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeSession
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {activeSession ? 'End Session' : 'Start Session'}
              </button>
            </div>
          </div>
        </div>

        {/* Search and Verification Section */}
        {activeSession && (
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by Voter ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Search size={20} />
                  Search
                </button>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Fingerprint size={20} />
                  Scan Fingerprint
                </button>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 rounded-lg flex items-center gap-2 text-red-700">
                  <AlertCircle size={20} />
                  {error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Verifications */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Verifications</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Voter ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentVerifications.map((verification) => (
                  <tr key={verification.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {verification.voterId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {verification.voterName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(verification.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(verification.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {verification.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleVerifyVoter(verification.voterId, 'verified')}
                            className="text-green-600 hover:text-green-900"
                            disabled={loading}
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => handleVerifyVoter(verification.voterId, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                            disabled={loading}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerPanel;