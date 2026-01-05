
import React from 'react';
import { ShoppingItem, Category } from '../types';
import { Icons, CATEGORIES } from '../constantes';

interface ListDisplayProps {
  items: ShoppingItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdatePrice: (id: string, price: number) => void;
}

export const ListDisplay: React.FC<ListDisplayProps> = ({ items, onToggle, onDelete, onUpdatePrice }) => {
  const grouped = CATEGORIES.reduce((acc, cat) => {
    const catItems = items.filter(i => i.category === cat);
    if (catItems.length > 0) acc[cat] = catItems;
    return acc;
  }, {} as Record<Category, ShoppingItem[]>);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 opacity-40">
        <Icons.Cart />
        <p className="mt-4 font-medium text-center">Sua lista está vazia.<br/>Que tal começar agora?</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, catItems]) => (
        <div key={category} className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 ml-1">
            {category}
          </h3>
          <div className="space-y-2">
            {catItems.map((item) => (
              <div 
                key={item.id}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                  item.bought 
                    ? 'bg-gray-50 dark:bg-gray-800/50 border-transparent' 
                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm'
                }`}
              >
                <button
                  onClick={() => onToggle(item.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    item.bought 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {item.bought && <Icons.Check />}
                </button>

                <div className="flex-1 min-w-0" onClick={() => !item.bought && onToggle(item.id)}>
                  <p className={`font-semibold truncate dark:text-white ${item.bought ? 'line-through text-gray-400' : ''}`}>
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {item.quantity} un.
                  </p>
                </div>

                {item.bought ? (
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 bg-white dark:bg-gray-700 rounded-lg px-2 py-1 shadow-inner border border-gray-100 dark:border-gray-600">
                      <span className="text-[10px] font-bold text-gray-400">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={item.price || ''}
                        onChange={(e) => onUpdatePrice(item.id, parseFloat(e.target.value) || 0)}
                        placeholder="0,00"
                        className="w-16 bg-transparent text-sm font-bold text-indigo-600 dark:text-indigo-400 outline-none text-right"
                        autoFocus={item.price === 0}
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 mt-0.5">Preço unitário</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-gray-300 hover:text-red-500 active:scale-90 transition-all"
                  >
                    <Icons.Trash />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
