import React, { useState, useEffect } from 'react';
import { QuoteItem, QuoteCategory } from '../types';
import { Trash2, Plus, Users, Hash } from 'lucide-react';

interface QuoteTableProps {
  items: QuoteItem[];
  setItems: React.Dispatch<React.SetStateAction<QuoteItem[]>>;
  guestCount: number;
}

const TableNumberInput = ({ 
  value, 
  onCommit, 
  className,
  isCurrency = false
}: { 
  value: number, 
  onCommit: (val: number) => void, 
  className?: string,
  isCurrency?: boolean
}) => {
  const [localValue, setLocalValue] = useState(value.toString());

  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleBlur = () => {
    let parsed = parseFloat(localValue);
    if (isNaN(parsed)) parsed = 0;
    onCommit(parsed);
    setLocalValue(parsed.toString());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <input
      type="text"
      inputMode={isCurrency ? "numeric" : "decimal"}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`${className} print:font-mono print:text-gray-900 print:font-semibold`}
    />
  );
};

export const QuoteTable: React.FC<QuoteTableProps> = ({ items, setItems, guestCount }) => {

  const handleUpdate = (id: string, field: keyof QuoteItem, value: string | number | boolean) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      
      const updatedItem = { ...item, [field]: value };
      
      if (field === 'isPerGuest' && value === true) {
        updatedItem.quantity = guestCount;
      }
      return updatedItem;
    }));
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleAddRow = (category: string) => {
    const newItem: QuoteItem = {
      id: crypto.randomUUID(),
      category,
      name: 'New Item',
      description: '',
      unitPrice: 0,
      quantity: 1,
      isPerGuest: false
    };
    setItems(prev => [...prev, newItem]);
  };

  const groupedItems = Object.values(QuoteCategory).reduce((acc, category) => {
    acc[category] = items.filter(i => i.category === category);
    return acc;
  }, {} as Record<string, QuoteItem[]>);

  const getCategoryTotal = (catItems: QuoteItem[]) => {
    return catItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedItems).map(([category, catItems]) => {
        if (catItems.length === 0) return null;

        return (
          <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden break-inside-avoid print:border-gray-200">
            <div className="bg-gray-50 px-4 sm:px-6 py-3 border-b border-gray-100 flex justify-between items-center print:bg-gray-100 print:border-gray-300">
              <h3 className="font-serif text-base sm:text-lg text-gray-800 font-semibold print:text-black">{category}</h3>
              <span className="font-mono text-gray-600 font-medium print:text-black print:font-bold">
                ¥{getCategoryTotal(catItems).toLocaleString()}
              </span>
            </div>
            
            {/* Responsive Container */}
            <div className="md:hidden">
              {/* Mobile Card View */}
              <div className="space-y-4 p-4">
                {catItems.map(item => (
                  <div key={item.id} className="bg-white border border-gray-100 rounded-lg p-4 space-y-4 relative group">
                     <button 
                        onClick={() => handleDelete(item.id)}
                        className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 no-print"
                      >
                        <Trash2 size={16} />
                      </button>

                    <div>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleUpdate(item.id, 'name', e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-gray-900 font-semibold placeholder-gray-300 print:text-black"
                        placeholder="Item Name"
                      />
                      <textarea
                        value={item.description || ''}
                        onChange={(e) => handleUpdate(item.id, 'description', e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-xs text-gray-500 placeholder-gray-300 mt-1 resize-none overflow-hidden print:text-gray-600"
                        placeholder="Add details..."
                        rows={1}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = target.scrollHeight + 'px';
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                      <div className="space-y-2">
                          <label className="text-xs text-gray-500 font-medium">Unit Price</label>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400">¥</span>
                            <TableNumberInput
                              value={item.unitPrice}
                              onCommit={(val) => handleUpdate(item.id, 'unitPrice', val)}
                              className="w-full text-left bg-gray-50 border border-gray-200 rounded p-1 focus:border-amore-300 focus:outline-none"
                              isCurrency
                            />
                          </div>
                      </div>
                      <div className="space-y-2">
                          <label className="text-xs text-gray-500 font-medium">Qty</label>
                          <TableNumberInput
                            value={item.quantity}
                            onCommit={(val) => handleUpdate(item.id, 'quantity', val)}
                            className="w-full text-left bg-gray-50 border border-gray-200 rounded p-1 focus:border-amore-300 focus:outline-none"
                          />
                      </div>
                       <div className="space-y-2">
                          <label className="text-xs text-gray-500 font-medium">Type</label>
                           <button
                              onClick={() => handleUpdate(item.id, 'isPerGuest', !item.isPerGuest)}
                              className={`w-full inline-flex justify-center items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors print:border-0 print:bg-transparent print:p-0 ${item.isPerGuest 
                                ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                                : 'bg-gray-100 text-gray-600 border border-gray-200'}`}
                            >
                              {item.isPerGuest ? <Users size={12}/> : <Hash size={12}/>}
                              {item.isPerGuest ? 'Guest' : 'Fixed'}
                            </button>
                      </div>
                      <div className="space-y-2">
                          <label className="text-xs text-gray-500 font-medium">Total</label>
                          <p className="font-semibold text-gray-800 p-1">¥{(item.unitPrice * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white text-gray-500 border-b border-gray-100 print:border-gray-300">
                  <tr>
                    <th className="px-6 py-3 font-medium w-5/12 print:text-gray-900">Item Details</th>
                    <th className="px-6 py-3 font-medium w-2/12 text-right print:text-gray-900">Unit Price</th>
                    <th className="px-6 py-3 font-medium w-1/12 text-center print:text-gray-900">Type</th>
                    <th className="px-6 py-3 font-medium w-2/12 text-center print:text-gray-900">Qty</th>
                    <th className="px-6 py-3 font-medium w-2/12 text-right print:text-gray-900">Total</th>
                    <th className="px-4 py-3 w-10 no-print"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 print:divide-gray-200">
                  {catItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 group transition-colors print:hover:bg-transparent">
                      <td className="px-6 py-3 align-top">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleUpdate(item.id, 'name', e.target.value)}
                          className="w-full bg-transparent border-none focus:ring-0 p-0 text-gray-900 font-semibold placeholder-gray-300 print:text-black print:placeholder-transparent"
                          placeholder="Item Name"
                        />
                        <textarea
                          value={item.description || ''}
                          onChange={(e) => handleUpdate(item.id, 'description', e.target.value)}
                          className="w-full bg-transparent border-none focus:ring-0 p-0 text-xs text-gray-500 placeholder-gray-300 mt-1 resize-none overflow-hidden print:text-gray-600 print:placeholder-transparent"
                          placeholder="Add details (e.g. 300 cuts, course name)..."
                          rows={1}
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                          }}
                        />
                      </td>
                      <td className="px-6 py-3 text-right align-top">
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-gray-400 print:hidden">¥</span>
                          <TableNumberInput
                            value={item.unitPrice}
                            onCommit={(val) => handleUpdate(item.id, 'unitPrice', val)}
                            className="w-24 text-right bg-transparent border-b border-transparent focus:border-amore-300 focus:outline-none p-0"
                            isCurrency
                          />
                        </div>
                      </td>
                      <td className="px-6 py-3 text-center align-top">
                        <button
                          onClick={() => handleUpdate(item.id, 'isPerGuest', !item.isPerGuest)}
                          className={`
                            inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors print:border-0 print:bg-transparent print:p-0
                            ${item.isPerGuest 
                              ? 'bg-blue-50 text-blue-700 border border-blue-100 print:text-gray-800' 
                              : 'bg-gray-50 text-gray-600 border border-gray-200 print:text-gray-800'}
                          `}
                        >
                          {item.isPerGuest ? <Users size={12} className="print:hidden"/> : <Hash size={12} className="print:hidden"/>}
                          {item.isPerGuest ? 'Guest' : 'Fixed'}
                        </button>
                      </td>
                      <td className="px-6 py-3 text-center align-top">
                        <TableNumberInput
                          value={item.quantity}
                          onCommit={(val) => handleUpdate(item.id, 'quantity', val)}
                          className={`
                            w-16 text-center bg-transparent border rounded p-1 print:border-none print:p-0
                            ${item.isPerGuest ? 'text-blue-600 font-semibold print:text-black' : 'text-gray-600 print:text-black'}
                            focus:border-amore-300 focus:outline-none
                          `}
                        />
                      </td>
                      <td className="px-6 py-3 text-right font-medium text-gray-900 align-top print:text-black print:font-bold">
                        ¥{(item.unitPrice * item.quantity).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center no-print align-top">
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
             <div className="px-4 sm:px-6 py-2 no-print border-t border-gray-100">
               <button 
                onClick={() => handleAddRow(category)}
                className="flex items-center gap-2 text-xs font-medium text-amore-500 hover:text-amore-700 transition-colors py-1"
               >
                 <Plus size={14} />
                 Add Item to {category}
               </button>
            </div>
          </div>
        );
      })}

      <div className="no-print mt-8 flex justify-center">
        <button 
          onClick={() => {
            const newItem: QuoteItem = {
              id: crypto.randomUUID(),
              category: QuoteCategory.OTHER,
              name: 'Additional Service',
              description: '',
              unitPrice: 0,
              quantity: 1,
              isPerGuest: false
            };
            setItems(prev => [...prev, newItem]);
          }}
          className="text-sm bg-white border border-dashed border-gray-300 text-gray-500 px-4 py-2 rounded-lg hover:border-amore-400 hover:text-amore-500 transition-colors"
        >
          + Add New Category Item
        </button>
      </div>
    </div>
  );
};