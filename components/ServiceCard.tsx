import React from 'react';
import { AmoreService } from '../types';
import { Check, Trash2 } from 'lucide-react';

interface ServiceCardProps {
  service: AmoreService;
  onToggle: (id: string) => void;
  onUpdate: (id: string, field: keyof AmoreService, value: string | number | boolean) => void;
  onDelete: (id: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onToggle, onUpdate, onDelete }) => {
  return (
    <div 
      className={`
        border rounded-lg p-4 transition-all duration-200 relative group
        ${service.isSelected 
          ? 'border-amore-500 bg-amore-50 shadow-sm ring-1 ring-amore-200' 
          : 'border-gray-200 bg-white hover:border-amore-200'}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(service.id)}
          className={`
            flex-shrink-0 w-6 h-6 rounded border flex items-center justify-center transition-colors mt-1
            ${service.isSelected 
              ? 'bg-amore-500 border-amore-500 text-white' 
              : 'bg-white border-gray-300 text-transparent hover:border-amore-400'}
          `}
        >
          <Check size={16} strokeWidth={3} />
        </button>

        {/* Content */}
        <div className="flex-grow space-y-2">
          <div className="flex justify-between items-start gap-2">
            <input
              type="text"
              value={service.name}
              onChange={(e) => onUpdate(service.id, 'name', e.target.value)}
              className={`
                w-full font-serif font-semibold text-lg bg-transparent border-b border-transparent 
                focus:border-amore-300 focus:outline-none transition-colors
                ${service.isSelected ? 'text-gray-900' : 'text-gray-600'}
              `}
              placeholder="Service Name"
            />
            {/* Delete Button - Visible on hover or if empty/new */}
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevent toggling when deleting
                onDelete(service.id);
              }}
              className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1 -mr-2 -mt-2 no-print"
              title="Remove Service"
            >
              <Trash2 size={16} />
            </button>
          </div>
          
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">¥</span>
            {/* Fixed: Use currentPrice instead of price to align with the AmoreService interface */}
            <input
              type="number"
              value={service.currentPrice}
              onChange={(e) => onUpdate(service.id, 'currentPrice', Number(e.target.value))}
              className={`
                w-full pl-6 pr-3 py-1.5 rounded text-sm bg-white border
                focus:ring-2 focus:ring-amore-200 focus:border-amore-400 outline-none
                ${service.isSelected ? 'border-amore-200 text-gray-900' : 'border-gray-200 text-gray-500'}
              `}
            />
          </div>
        </div>
      </div>
    </div>
  );
};