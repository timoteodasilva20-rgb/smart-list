
import React from 'react';
import { AppTab } from '../types';
import { Icons } from '../constantes';

interface MenuProps {
  activeTab: AppTab;
  onChangeTab: (tab: AppTab) => void;
}

export const Menu: React.FC<MenuProps> = ({ activeTab, onChangeTab }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-8 py-2 pb-6 flex justify-around z-50">
      <button
        onClick={() => onChangeTab('shopping')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          activeTab === 'shopping' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'
        }`}
      >
        <Icons.Cart />
        <span className="text-[10px] font-bold uppercase tracking-tighter">Mercado</span>
      </button>

      <button
        onClick={() => onChangeTab('expenses')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          activeTab === 'expenses' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'
        }`}
      >
        <Icons.History />
        <span className="text-[10px] font-bold uppercase tracking-tighter">Gastos</span>
      </button>
    </div>
  );
};
