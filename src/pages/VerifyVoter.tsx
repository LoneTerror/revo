import React, { useState } from 'react';

// Define an interface for voter details
interface VoterDetails {
  name: string;
  voter_id: string;
  status: string;
}


// Define an interface for voter details
interface VoterDetails {
  name: string;
  voter_id: string;
  status: string;
}


const VerifyVoter = () => {
  const [voterId, setVoterId] = useState('');
  const [voterDetails, setVoterDetails] = useState<VoterDetails | null>(null);

  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/verify/${voterId}`);
      if (!response.ok) {
        throw new Error('Voter not found');
      }
      const data = await response.json();
      setVoterDetails(data);
      setError('');
    } catch (err: unknown) { // Specify the type of err
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }

      setError(err.message);
      setVoterDetails(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-900">Verify Voter</h2>
          <p className="mt-2 text-sm text-gray-700">Search for a voter by ID.</p>
        </div>

        <div className="mt-6">
          <input
            type="text"
            placeholder="Enter Voter ID"
            value={voterId}
            onChange={(e) => setVoterId(e.target.value)}
            className="border rounded p-2"
          />
          <button onClick={handleSearch} className="ml-2 bg-blue-500 text-white rounded p-2">
            Search
          </button>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {voterDetails && (
          <div className="mt-4 bg-white p-4 rounded shadow">
            <h3 className="font-bold">Voter Details:</h3>
            <p>Name: {voterDetails.name}</p>
            <p>ID: {voterDetails.voter_id}</p>
            <p>Status: {voterDetails.status}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default VerifyVoter;
