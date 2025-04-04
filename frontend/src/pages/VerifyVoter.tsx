import React, { useState } from 'react';
import { Search, UserCheck, UserX, Fingerprint, AlertCircle, CreditCard, ScanLine } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface VoterDetails {
  name: string;
  voter_id: string;
  status: 'pending' | 'verified' | 'rejected';
  address?: string;
  age?: number;
  polling_station?: string;
}

type VerificationMethod = 'id' | 'fingerprint';

const VerifyVoter = () => {
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>('id');
  const [voterId, setVoterId] = useState('');
  const [voterDetails, setVoterDetails] = useState<VoterDetails | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fingerPrintStatus, setFingerPrintStatus] = useState<'waiting' | 'scanning' | 'matched' | 'not_matched' | null>(null);
  const { role } = useAuth();

  const handleSearch = async () => {
    if (!voterId.trim()) {
      setError('Please enter a voter ID');
      return;
    }

    setLoading(true);
    setError('');
    setFingerPrintStatus(null);

    try {
      const response = await fetch(`http://localhost:5006/verify/${voterId}`);
      
      if (!response.ok) {
        throw new Error(response.status === 404 ? 'Voter not found' : 'Failed to fetch voter details');
      }

      const data = await response.json();
      setVoterDetails(data);
      setFingerPrintStatus('waiting');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setVoterDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFingerprintOnlyVerification = async () => {
    setLoading(true);
    setError('');
    setFingerPrintStatus('scanning');
    setVoterDetails(null);

    try {
      // Simulate API call to verify fingerprint and get voter details
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, randomly succeed or fail
      const success = Math.random() > 0.3;
      
      if (success) {
        // Mock data - in real implementation, this would come from the API
        const mockVoterData = {
          name: "John Doe",
          voter_id: "VOT" + Math.floor(Math.random() * 1000),
          status: "pending",
          age: 35,
          polling_station: "Station A"
        } as VoterDetails;
        
        setVoterDetails(mockVoterData);
        setFingerPrintStatus('matched');
      } else {
        setFingerPrintStatus('not_matched');
        throw new Error('Fingerprint not found in database');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setVoterDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const simulateFingerPrintScan = async () => {
    setFingerPrintStatus('scanning');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setFingerPrintStatus(Math.random() > 0.3 ? 'matched' : 'not_matched');
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 bg-blue-600">
            <h2 className="text-xl font-semibold text-white">Voter Verification</h2>
            <p className="text-blue-100 text-sm mt-1">
              Verify voter eligibility using ID or fingerprint
            </p>
          </div>

          {/* Verification Method Tabs */}
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setVerificationMethod('id')}
                className={`flex items-center gap-2 px-6 py-3 font-medium text-sm ${
                  verificationMethod === 'id'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <CreditCard size={18} />
                Verify by ID
              </button>
              <button
                onClick={() => setVerificationMethod('fingerprint')}
                className={`flex items-center gap-2 px-6 py-3 font-medium text-sm ${
                  verificationMethod === 'fingerprint'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ScanLine size={18} />
                Verify by Fingerprint
              </button>
            </div>
          </div>

          {/* Search/Scan Section */}
          <div className="p-6 border-b">
            {verificationMethod === 'id' ? (
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Enter Voter ID"
                    value={voterId}
                    onChange={(e) => setVoterId(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2"
                >
                  <Search size={20} />
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={handleFingerprintOnlyVerification}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2 mx-auto"
                >
                  <Fingerprint size={20} />
                  {loading ? 'Scanning...' : 'Start Fingerprint Scan'}
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle size={20} />
                {error}
              </div>
            )}
          </div>

          {/* Voter Details Section */}
          {voterDetails && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Voter Information</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Name</span>
                      <span className="font-medium text-gray-900">{voterDetails.name}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Voter ID</span>
                      <span className="font-medium text-gray-900">{voterDetails.voter_id}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Age</span>
                      <span className="font-medium text-gray-900">{voterDetails.age || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Polling Station</span>
                      <span className="font-medium text-gray-900">{voterDetails.polling_station || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Status</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(voterDetails.status)}`}>
                        {voterDetails.status.charAt(0).toUpperCase() + voterDetails.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {verificationMethod === 'id' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Additional Verification</h3>
                    
                    <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">Fingerprint Verification</span>
                        {fingerPrintStatus === 'matched' && (
                          <span className="flex items-center gap-1 text-green-600">
                            <UserCheck size={20} />
                            Matched
                          </span>
                        )}
                        {fingerPrintStatus === 'not_matched' && (
                          <span className="flex items-center gap-1 text-red-600">
                            <UserX size={20} />
                            Not Matched
                          </span>
                        )}
                      </div>

                      {role === 'officer' && voterDetails.status === 'pending' && (
                        <button
                          onClick={simulateFingerPrintScan}
                          disabled={fingerPrintStatus === 'scanning'}
                          className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <Fingerprint size={20} />
                          {fingerPrintStatus === 'scanning' ? 'Scanning...' : 'Start Fingerprint Scan'}
                        </button>
                      )}

                      {fingerPrintStatus === 'matched' && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg text-green-700 text-sm">
                          Fingerprint verified successfully. Voter is eligible to cast their vote.
                        </div>
                      )}

                      {fingerPrintStatus === 'not_matched' && (
                        <div className="mt-4 p-4 bg-red-50 rounded-lg text-red-700 text-sm">
                          Fingerprint verification failed. Please verify the voter's identity through alternative means.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyVoter;