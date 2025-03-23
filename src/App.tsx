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
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mt-10">Voter Verification</h1>
      <div className="mt-6 flex">
        <input
          type="text"
          className="p-2 text-black rounded"
          placeholder="Enter Voter ID"
          value={voterId}
          onChange={(e) => setVoterId(e.target.value)}
        />
        <button onClick={handleSearch} className="ml-2 p-2 bg-blue-500 rounded">Search</button>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {result && (
        <div className="mt-4 p-4 bg-gray-800 rounded">
          <p><strong>Name:</strong> {result.name}</p>
          <p><strong>Age:</strong> {result.age}</p>
        </div>
      )}
    </div>
  );
}

export default App;
