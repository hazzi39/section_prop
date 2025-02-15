import React from 'react';
import { SectionType } from '../types';

interface SectionSelectorProps {
  value: SectionType;
  onChange: (value: SectionType) => void;
}

export const SectionSelector: React.FC<SectionSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Section Type
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SectionType)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="solidCircle">Solid Circle</option>
        <option value="circularHollow">Circular Hollow Section</option>
        <option value="solidSquare">Solid Square</option>
        <option value="squareHollow">SHS with Sharp Edges</option>
        <option value="solidRectangle">Solid Rectangle</option>
        <option value="rectangleHollow">RHS with Sharp Edges</option>
        <option value="iSection">I Section</option>
      </select>
    </div>
  );
};