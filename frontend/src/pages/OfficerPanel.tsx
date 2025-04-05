import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, AlertCircle, Clock, Fingerprint, Usb, CheckCircle, XCircle } from 'lucide-react';

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

const OfficerPanel = () => {
  const [activeSession, setActiveSession] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannerStatus, setScannerStatus] = useState<ScannerStatus>({ connected: false, message: 'Not connected' });
  const [scanningStatus, setScanningStatus] = useState<'idle' | 'scanning' | 'matching' | 'success' | 'error'>('idle');
  const [voterId, setVoterId] = useState('');
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
    }
  ]);

  // Simulate scanner connection check
  const checkScannerConnection = async () => {
    setScannerStatus({ connected: false, message: 'Checking R307S Scanner...' });
    
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
      setVoterId('');
      setCurrentVoter(null);
      setScanningStatus('idle');
    } else {
      setError('Unable to start session. Scanner not connected.');
    }
  };

  const handleEndSession = () => {
    setActiveSession(false);
    setScannerStatus({ connected: false, message: 'Not connected' });
    setScanningStatus('idle');
    setVoterId('');
    setCurrentVoter(null);
  };

  const mockFetchVoterDetails = async (id: string): Promise<VoterVerification | null> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock database check (70% success rate)
    if (Math.random() < 0.7) {
      return {
        id: Math.random().toString(36).substr(2, 9),
        voterId: id,
        voterName: `Voter ${id}`,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };
    }
    return null;
  };

  const simulateFingerPrintScan = async () => {
    if (!currentVoter) return false;
    
    setScanningStatus('scanning');
    
    // Step 1: Initialize scanner
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 2: Capture fingerprint
    setScanningStatus('scanning');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 3: Match with database
    setScanningStatus('matching');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Simulate match result (80% success rate)
    const success = Math.random() < 0.8;
    setScanningStatus(success ? 'success' : 'error');
    
    return success;
  };

  const handleVoterIdSubmit = async () => {
    if (!voterId.trim()) {
      setError('Please enter a Voter ID');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const voter = await mockFetchVoterDetails(voterId);
      if (voter) {
        setCurrentVoter(voter);
      } else {
        throw new Error('Voter not found in database');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch voter details');
      setCurrentVoter(null);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyVoter = async () => {
    if (!currentVoter) return;
    
    setLoading(true);
    try {
      const scanSuccess = await simulateFingerPrintScan();
      
      if (scanSuccess) {
        // Update verification status
        const updatedVoter = {
          ...currentVoter,
          status: 'verified' as const,
          verifiedBy: 'Current Officer',
          timestamp: new Date().toISOString()
        };
        
        setRecentVerifications(prev => [updatedVoter, ...prev]);
        setCurrentVoter(null);
        setVoterId('');
        setError(null);
      } else {
        throw new Error('Fingerprint verification failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify voter');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectVoter = async () => {
    if (!currentVoter) return;
    
    setLoading(true);
    try {
      const updatedVoter = {
        ...currentVoter,
        status: 'rejected' as const,
        verifiedBy: 'Current Officer',
        timestamp: new Date().toISOString()
      };
      
      setRecentVerifications(prev => [updatedVoter, ...prev]);
      setCurrentVoter(null);
      setVoterId('');
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
              {/* Voter ID Input */}
              {!currentVoter && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Enter Voter ID</h3>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={voterId}
                      onChange={(e) => setVoterId(e.target.value)}
                      placeholder="Enter Voter ID"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleVoterIdSubmit}
                      disabled={loading || !scannerStatus.connected}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      Verify ID
                    </button>
                  </div>
                </div>
              )}

              {/* Current Voter Verification */}
              {currentVoter && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Voter Verification</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 mb-4">
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
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {scanningStatus === 'scanning' ? 'Capturing Fingerprint...' :
                             scanningStatus === 'matching' ? 'Matching with Database...' :
                             scanningStatus === 'success' ? 'Verification Successful' :
                             'Verification Failed'}
                          </span>
                        </div>
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                {scanningStatus === 'scanning' ? 'Step 1/2' :
                                 scanningStatus === 'matching' ? 'Step 2/2' :
                                 'Complete'}
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                            <div
                              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                                scanningStatus === 'success' ? 'bg-green-500' :
                                scanningStatus === 'error' ? 'bg-red-500' :
                                'bg-blue-500'
                              }`}
                              style={{
                                width: scanningStatus === 'scanning' ? '50%' :
                                       scanningStatus === 'matching' ? '75%' :
                                       '100%'
                              }}
                            />
                          </div>
                        </div>
                        {scanningStatus === 'success' && (
                          <div className="text-sm text-green-600 mt-2">
                            ✓ Fingerprint matched with database record
                          </div>
                        )}
                        {scanningStatus === 'error' && (
                          <div className="text-sm text-red-600 mt-2">
                            ✗ No matching fingerprint found
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={handleVerifyVoter}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        disabled={loading || !scannerStatus.connected || scanningStatus !== 'idle'}
                      >
                        <Fingerprint size={20} />
                        Start Verification
                      </button>
                      <button
                        onClick={handleRejectVoter}
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