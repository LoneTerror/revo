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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-6">
      {/* Header */}
      <h1 className="text-5xl font-bold mb-8 text-center text-blue-400">
        🗳️ Voter Verification System
      </h1>

      {/* Search Box */}
      <div className="flex items-center w-full max-w-xl space-x-3 mb-6">
        <input
          type="text"
          className="flex-1 p-3 text-black rounded-lg shadow-md border-2 border-blue-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter Voter ID..."
          value={voterId}
          onChange={(e) => setVoterId(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="p-3 px-6 bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 hover:scale-105 transform transition duration-300"
        >
          🔍 Search
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4 text-lg">{error}</p>}

      {/* Results Table */}
      {result && (
        <div className="mt-6 p-6 bg-gray-800 rounded-lg shadow-lg w-full max-w-3xl">
          <table className="w-full border-collapse border border-gray-700 text-white rounded-md">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border border-gray-600 px-5 py-3 text-lg">Voter ID</th>
                <th className="border border-gray-600 px-5 py-3 text-lg">Name</th>
                <th className="border border-gray-600 px-5 py-3 text-lg">Age</th>
                <th className="border border-gray-600 px-5 py-3 text-lg">Status</th>
                <th className="border border-gray-600 px-5 py-3 text-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center hover:bg-gray-700 transition duration-200">
                <td className="border border-gray-600 px-4 py-3">{result.voterId || "N/A"}</td>
                <td className="border border-gray-600 px-4 py-3">{result.name || "N/A"}</td>
                <td className="border border-gray-600 px-4 py-3">{result.age !== undefined ? result.age : "N/A"}</td>
                <td className="border border-gray-600 px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-md text-white font-bold ${
                      result.status === "Approved"
                        ? "bg-green-500"
                        : result.status === "Rejected"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {result.status || "Pending"}
                  </span>
                </td>
                <td className="border border-gray-600 px-4 py-3 flex justify-center space-x-4">
                  <button className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 hover:scale-105 transform transition duration-300">
                    ✅ Approve
                  </button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 hover:scale-105 transform transition duration-300">
                    ❌ Reject
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
