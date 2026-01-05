
import React from 'react';
import { ShoppingItem } from '../types';

interface ResumoProps {
  items: ShoppingItem[];
  onFinalize: () => void;
}

export const Resumo: React.FC<ResumoProps> = ({ items, onFinalize }) => {
  const boughtItems = items.filter(i => i.bought);
  const totalBought = boughtItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  const hasItemsToFinalize = boughtItems.length > 0;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40">
      <div className="bg-indigo-600 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Total Comprado</p>
          <p className="text-2xl font-black">
            R$ {totalBought.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <button
          onClick={onFinalize}
          disabled={!hasItemsToFinalize}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${
            hasItemsToFinalize 
              ? 'bg-white text-indigo-600 shadow-lg' 
              : 'bg-indigo-500 text-indigo-300 opacity-50 cursor-not-allowed'
          }`}
        >
          Finalizar Compra
        </button>
      </div>
    </div>
  );
};
