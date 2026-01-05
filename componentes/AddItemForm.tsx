
import React, { useState, useEffect } from 'react';
import { Category, ProductHistory } from '../types';
import { CATEGORIES, Icons } from '../constantes';

interface AddItemFormProps {
  onAdd: (name: string, quantity: number, category: Category, price: number) => void;
  productHistory: ProductHistory;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({ onAdd, productHistory }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState<Category>(Category.Outros);
  const [price, setPrice] = useState(0);

  // Smart suggestion logic
  useEffect(() => {
    const normalizedName = name.trim().toLowerCase();
    const match = Object.keys(productHistory).find(k => k.toLowerCase() === normalizedName);
    if (match) {
      setCategory(productHistory[match].category);
      setPrice(productHistory[match].lastPrice);
    }
  }, [name, productHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), quantity, category, price);
    setName('');
    setQuantity(1);
    setCategory(Category.Outros);
    setPrice(0);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="O que vamos comprar?"
          className="w-full text-lg font-medium bg-transparent border-b-2 border-gray-100 dark:border-gray-700 focus:border-indigo-500 outline-none py-2 dark:text-white"
          autoFocus
        />
        
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                category === cat 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 mt-1">
          <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-xl px-3 py-2">
            <button 
              type="button" 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center text-indigo-600 font-bold"
            >-</button>
            <span className="w-10 text-center font-bold dark:text-white">{quantity}</span>
            <button 
              type="button" 
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-indigo-600 font-bold"
            >+</button>
          </div>

          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white rounded-xl py-3 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Icons.Plus />
            Adicionar
          </button>
        </div>
      </div>
    </form>
  );
};
