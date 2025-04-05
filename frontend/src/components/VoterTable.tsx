import { Check, X, Clock } from 'lucide-react';

const mockData = [
  { id: 1, name: 'John Wick', voterId: 'VOT001', status: 'verified', timestamp: '2024-03-10 14:30' },
  { id: 2, name: 'Will Smith', voterId: 'VOT002', status: 'pending', timestamp: '2024-03-10 14:35' },
  { id: 3, name: 'Mike Tyson', voterId: 'VOT003', status: 'rejected', timestamp: '2024-03-10 14:40' },
  // Add more mock data as needed
];

const statusConfig = {
  verified: { icon: Check, className: 'text-green-600 bg-green-50' },
  pending: { icon: Clock, className: 'text-yellow-600 bg-yellow-50' },
  rejected: { icon: X, className: 'text-red-600 bg-red-50' },
};

function VoterTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Voter Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Voter ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Timestamp
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {mockData.map((voter) => {
            const StatusIcon = statusConfig[voter.status as keyof typeof statusConfig].icon;
            return (
              <tr key={voter.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{voter.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{voter.voterId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[voter.status as keyof typeof statusConfig].className}`}>
                    <StatusIcon className="w-4 h-4 mr-1" />
                    {voter.status.charAt(0).toUpperCase() + voter.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {voter.timestamp}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                    View Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default VoterTable;