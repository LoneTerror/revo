import { useState } from 'react';
import { UserCheck, UserX, AlertCircle, Clock, Fingerprint, Usb, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

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
  const [retryCount, setRetryCount] = useState(0);

  // Reset verification states
  const resetVerificationState = () => {
    setVoterId('');
    setCurrentVoter(null);
    setScanningStatus('idle');
    setError(null);
    setRetryCount(0);
  };

  // Simulate scanner connection check with decreasing failure probability
  const checkScannerConnection = async () => {
    setScannerStatus({ connected: false, message: 'Checking R307S Scanner...' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Increase success probability with each retry (80% base + 5% per retry, max 95%)
    const successProbability = Math.min(0.8 + (retryCount * 0.05), 0.95);
    const isConnected = Math.random() < successProbability;
    
    setScannerStatus({
      connected: isConnected,
      message: isConnected ? 'R307S Scanner connected and ready' : 'Scanner not found. Please check connection.'
    });
    return isConnected;
  };

  const handleStartSession = async () => {
    resetVerificationState();
    const isConnected = await checkScannerConnection();
    if (isConnected) {
      setActiveSession(true);
    } else {
      setError('Unable to start session. Scanner not connected.');
    }
  };

  const handleRetryConnection = async () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    const isConnected = await checkScannerConnection();
    if (isConnected) {
      setActiveSession(true);
    } else {
      setError('Unable to start session. Scanner not connected. Please try again.');
    }
  };

  const handleEndSession = () => {
    setActiveSession(false);
    setScannerStatus({ connected: false, message: 'Not connected' });
    resetVerificationState();
  };

  const mockFetchVoterDetails = async (id: string): Promise<VoterVerification | null> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
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
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setScanningStatus('matching');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Increase success probability with each retry (70% base + 10% per retry, max 90%)
    const successProbability = Math.min(0.7 + (retryCount * 0.1), 0.9);
    const success = Math.random() < successProbability;
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
    setScanningStatus('idle');
    setRetryCount(0);
    
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
        const updatedVoter = {
          ...currentVoter,
          status: 'verified' as const,
          verifiedBy: 'Current Officer',
          timestamp: new Date().toISOString()
        };
        
        setRecentVerifications(prev => [updatedVoter, ...prev]);
        resetVerificationState();
      } else {
        throw new Error('Fingerprint verification failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify voter');
    } finally {
      setLoading(false);
    }
  };

  const handleRetryFingerprint = async () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    setScanningStatus('idle');
    await handleVerifyVoter();
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
      resetVerificationState();
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
              <div className="flex gap-2">
                {!scannerStatus.connected && error && (
                  <button
                    onClick={handleRetryConnection}
                    className="px-4 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-2"
                  >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Retry Connection
                  </button>
                )}
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
                      {scanningStatus === 'error' ? (
                        <button
                          onClick={handleRetryFingerprint}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          disabled={loading}
                        >
                          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                          Retry Scan
                        </button>
                      ) : (
                        <button
                          onClick={handleVerifyVoter}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          disabled={loading || !scannerStatus.connected || scanningStatus !== 'idle'}
                        >
                          <Fingerprint size={20} />
                          Start Verification
                        </button>
                      )}
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