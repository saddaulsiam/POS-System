import React from "react";

interface SimpleBarChartProps {
  data: Array<{ label: string; value: number }>;
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="w-20 text-sm text-gray-600 truncate">{item.label}</div>
          <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
            <div
              className="bg-blue-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
          <div className="w-16 text-sm font-medium text-right">{item.value.toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
};
