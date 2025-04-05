import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, AlertCircle, Clock, Search, Fingerprint, Usb, CheckCircle, XCircle, UserPlus } from 'lucide-react';

interface VoterVerification {
  id: string;
  voterId: string;
  voterName: string;
  timestamp: string;
  status: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
}

interface ScannerStatus {
  connected: boolean;
  message: string;
}

interface NewVoterForm {
  voterId: string;
  voterName: string;
}

const OfficerPanel = () => {
  const [activeSession, setActiveSession] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannerStatus, setScannerStatus] = useState<ScannerStatus>({ connected: false, message: 'Not connected' });
  const [scanningStatus, setScanningStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [showNewVoterForm, setShowNewVoterForm] = useState(false);
  const [newVoter, setNewVoter] = useState<NewVoterForm>({ voterId: '', voterName: '' });
  const [currentVoter, setCurrentVoter] = useState<VoterVerification | null>(null);

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

  // Simulate scanner connection check
  const checkScannerConnection = async () => {
    setScannerStatus({ connected: false, message: 'Checking connection...' });
    
    // Simulate connection check delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate 80% success rate
    const isConnected = Math.random() < 0.8;
    
    setScannerStatus({
      connected: isConnected,
      message: isConnected ? 'R307S Scanner connected and ready' : 'Scanner not found. Please check connection.'
    });
    
    return isConnected;
  };

  const handleStartSession = async () => {
    const isConnected = await checkScannerConnection();
    if (isConnected) {
      setActiveSession(true);
      setShowNewVoterForm(true);
    } else {
      setError('Unable to start session. Scanner not connected.');
    }
  };

  const handleEndSession = () => {
    setActiveSession(false);
    setScannerStatus({ connected: false, message: 'Not connected' });
    setScanningStatus('idle');
    setScanProgress(0);
    setShowNewVoterForm(false);
    setCurrentVoter(null);
  };

  const simulateFingerPrintScan = async () => {
    setScanningStatus('scanning');
    setScanProgress(0);
    
    // Simulate scanning progress with Arduino-like feedback
    const steps = [
      { progress: 20, message: 'Initializing scanner...' },
      { progress: 40, message: 'Capturing fingerprint...' },
      { progress: 60, message: 'Processing image...' },
      { progress: 80, message: 'Matching fingerprint...' },
      { progress: 100, message: 'Verification complete' }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setScanProgress(step.progress);
    }
    
    // Simulate scan result (80% success rate)
    const success = Math.random() < 0.8;
    setScanningStatus(success ? 'success' : 'error');
    
    return success;
  };

  const handleAddNewVoter = () => {
    if (!newVoter.voterId || !newVoter.voterName) {
      setError('Please fill in all fields');
      return;
    }

    const voter: VoterVerification = {
      id: Math.random().toString(36).substr(2, 9),
      voterId: newVoter.voterId,
      voterName: newVoter.voterName,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    setRecentVerifications(prev => [voter, ...prev]);
    setCurrentVoter(voter);
    setShowNewVoterForm(false);
    setNewVoter({ voterId: '', voterName: '' });
    setError(null);
  };

  const handleVerifyVoter = async (voterId: string) => {
    setLoading(true);
    try {
      const scanSuccess = await simulateFingerPrintScan();
      
      if (scanSuccess) {
        // Simulate backend verification
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setRecentVerifications(prev => prev.map(v => 
          v.voterId === voterId 
            ? { ...v, status: 'verified', verifiedBy: 'Current Officer', timestamp: new Date().toISOString() }
            : v
        ));
        setError(null);
        setCurrentVoter(null);
        setShowNewVoterForm(true);
      } else {
        throw new Error('Fingerprint verification failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify voter');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectVoter = async (voterId: string) => {
    setLoading(true);
    try {
      setRecentVerifications(prev => prev.map(v => 
        v.voterId === voterId 
          ? { ...v, status: 'rejected', verifiedBy: 'Current Officer', timestamp: new Date().toISOString() }
          : v
      ));
      setError(null);
      setCurrentVoter(null);
      setShowNewVoterForm(true);
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
                <div className="mt-1">
                  <div className={`flex items-center gap-2 text-sm ${scannerStatus.connected ? 'text-green-600' : 'text-gray-500'}`}>
                    {scannerStatus.connected ? (
                      <>
                        <CheckCircle size={16} />
                        <span>{scannerStatus.message}</span>
                      </>
                    ) : (
                      <>
                        <Usb size={16} />
                        <span>{scannerStatus.message}</span>
                      </>
                    )}
                  </div>
                </div>
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

        {/* Active Session Content */}
        {activeSession && (
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="p-6">
              {/* New Voter Form */}
              {showNewVoterForm && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">New Voter</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="voterId" className="block text-sm font-medium text-gray-700">
                        Voter ID
                      </label>
                      <input
                        type="text"
                        id="voterId"
                        value={newVoter.voterId}
                        onChange={(e) => setNewVoter(prev => ({ ...prev, voterId: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="voterName" className="block text-sm font-medium text-gray-700">
                        Voter Name
                      </label>
                      <input
                        type="text"
                        id="voterName"
                        value={newVoter.voterName}
                        onChange={(e) => setNewVoter(prev => ({ ...prev, voterName: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleAddNewVoter}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <UserPlus size={20} />
                    Add Voter
                  </button>
                </div>
              )}

              {/* Current Voter Verification */}
              {currentVoter && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Current Voter</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Voter ID:</span>
                        <p className="font-medium">{currentVoter.voterId}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Name:</span>
                        <p className="font-medium">{currentVoter.voterName}</p>
                      </div>
                    </div>
                    
                    {/* Fingerprint Scanner Status */}
                    {scanningStatus !== 'idle' && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {scanningStatus === 'scanning' ? 'Scanning Fingerprint...' : 
                             scanningStatus === 'success' ? 'Scan Successful' : 'Scan Failed'}
                          </span>
                          <span className="text-sm text-gray-500">{scanProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              scanningStatus === 'success' ? 'bg-green-500' :
                              scanningStatus === 'error' ? 'bg-red-500' :
                              'bg-blue-500'
                            }`}
                            style={{ width: `${scanProgress}%` }}
                          />
                        </div>
                        {scanningStatus === 'success' && (
                          <p className="mt-2 text-sm text-green-600">Fingerprint matched successfully</p>
                        )}
                        {scanningStatus === 'error' && (
                          <p className="mt-2 text-sm text-red-600">Fingerprint verification failed</p>
                        )}
                      </div>
                    )}

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleVerifyVoter(currentVoter.voterId)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        disabled={loading || !scannerStatus.connected}
                      >
                        <Fingerprint size={20} />
                        Start Verification
                      </button>
                      <button
                        onClick={() => handleRejectVoter(currentVoter.voterId)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        disabled={loading}
                      >
                        <XCircle size={20} />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              )}

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
                    Verified By
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {verification.verifiedBy || '-'}
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