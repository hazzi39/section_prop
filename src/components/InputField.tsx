import React from 'react';
import { InfoIcon } from 'lucide-react';

interface InputFieldProps {
  label: string;
  symbol: string;
  value: string;
  onChange: (value: string) => void;
  tooltip: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  symbol,
  value,
  onChange,
  tooltip,
}) => {
  return (
    <div className="relative group">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        <span className="italic mr-2">{symbol}</span>
        {label}
        <InfoIcon className="inline-block ml-1 w-4 h-4 text-gray-400" />
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
          step="any"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          mm
        </span>
      </div>
      <div className="absolute invisible group-hover:visible bg-black text-white p-2 rounded text-sm -top-8 left-0 z-10 whitespace-nowrap">
        {tooltip}
      </div>
    </div>
  );
};
