import { useState } from "react";
import axios from "axios";

function App() {
  const [voterId, setVoterId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setResult(null);
    try {
      const { data } = await axios.get(`http://localhost:5000/verify/${voterId}`);
      setResult(data);
    } catch (err) {
      setError("Voter not found or server error.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Voter Verification</h1>
      
      <div className="flex items-center w-full max-w-md space-x-3">
        <input
          type="text"
          className="flex-1 p-3 text-black rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Enter Voter ID"
          value={voterId}
          onChange={(e) => setVoterId(e.target.value)}
        />
        <button 
          onClick={handleSearch} 
          className="p-3 px-6 bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300">
          Search
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {result && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-md w-full max-w-md text-center">
          <p className="text-lg"><strong>Name:</strong> {result.name || "N/A"}</p>
          <p className="text-lg"><strong>Age:</strong> {result.age !== undefined ? result.age : "N/A"}</p>
        </div>
      )}
    </div>
  );
}

export default App;
