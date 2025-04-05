import { Check, X, Clock, LucideIcon } from 'lucide-react';

interface Activity {
  id: number;
  type: 'verified' | 'pending' | 'rejected'; // Explicitly define the possible values for 'type'
  voter: string;
  time: string;
}

const activities: Activity[] = [
  {
    id: 1,
    type: 'verified',
    voter: 'John Wick',
    time: '2 minutes ago',
  },
  {
    id: 2,
    type: 'pending',
    voter: 'Will Smith',
    time: '5 minutes ago',
  },
  {
    id: 3,
    type: 'rejected',
    voter: 'Mike Tyson',
    time: '10 minutes ago',
  },
  // Add more activities as needed
];

interface TypeConfig {
  verified: { icon: LucideIcon; className: string };
  pending: { icon: LucideIcon; className: string };
  rejected: { icon: LucideIcon; className: string };
}

const typeConfig: TypeConfig = {
  verified: { icon: Check, className: 'bg-green-100 text-green-600' },
  pending: { icon: Clock, className: 'bg-yellow-100 text-yellow-600' },
  rejected: { icon: X, className: 'bg-red-100 text-red-600' },
};

function ActivityFeed() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const Icon = typeConfig[activity.type].icon;
        return (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`p-2 rounded-full ${typeConfig[activity.type].className}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm">
                <span className="font-medium">{activity.voter}</span>
                {' '}verification {activity.type}
              </p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ActivityFeed;