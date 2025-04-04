import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  color: string;
}

function StatsCard({ title, value, icon, trend, color }: StatsCardProps) {
  return (
    <div className={`${color} p-6 rounded-xl`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
        </div>
        <div>{icon}</div>
      </div>
      <p className="text-sm mt-4">
        <span className={`font-medium ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </span>
        {' '}vs last week
      </p>
    </div>
  );
}

export default StatsCard;