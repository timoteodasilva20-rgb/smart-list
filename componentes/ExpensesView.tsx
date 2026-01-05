
import React, { useState } from 'react';
import { PurchaseHistoryEntry } from '../types';
import { Icons } from '../constantes';

interface ExpensesViewProps {
  history: PurchaseHistoryEntry[];
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({ history }) => {
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [viewingPurchase, setViewingPurchase] = useState<PurchaseHistoryEntry | null>(null);

  const months: string[] = Array.from(new Set(history.map(h => {
    const d = new Date(h.date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  })));

  const currentMonthStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  if (!months.includes(currentMonthStr)) months.push(currentMonthStr);
  months.sort().reverse();

  const filteredHistory = history.filter(h => {
    const d = new Date(h.date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === selectedMonth;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const monthTotal = filteredHistory.reduce((acc, h) => acc + h.total, 0);

  if (viewingPurchase) {
    return (
      <div className="animate-in slide-in-from-right duration-300">
        <button 
          onClick={() => setViewingPurchase(null)}
          className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-6 active:scale-95"
        >
          <Icons.ArrowLeft />
          Voltar para Histórico
        </button>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-black mb-1 dark:text-white">Detalhes da Compra</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
            {new Date(viewingPurchase.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>

          <div className="space-y-4 max-h-[50vh] overflow-y-auto no-scrollbar pr-1">
            {viewingPurchase.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-gray-50 dark:border-gray-700/50 pb-3">
                <div className="min-w-0 flex-1 mr-4">
                  <p className="font-bold dark:text-white truncate">{item.name}</p>
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                    {item.quantity} un. × R$ {item.price.toFixed(2)}
                  </p>
                </div>
                <p className="font-black text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t-4 border-double border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <span className="text-xs font-black uppercase text-gray-400 tracking-tighter">Total Pago</span>
            <span className="text-2xl font-black dark:text-white">R$ {viewingPurchase.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-black dark:text-white tracking-tight">Meus Gastos</h2>
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="appearance-none bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl px-4 py-2 pr-10 text-xs font-black uppercase tracking-widest shadow-sm outline-none dark:text-white focus:border-indigo-500"
          >
            {months.map(m => {
              const [year, month] = m.split('-');
              const date = new Date(parseInt(year), parseInt(month) - 1);
              return (
                <option key={m} value={m}>
                  {date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '')}
                </option>
              );
            })}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-600">
             <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
      </div>

      <div className="bg-indigo-600 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Icons.History />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Acumulado do Mês</p>
        <p className="text-4xl font-black tracking-tighter">R$ {monthTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
      </div>

      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-20 opacity-30 flex flex-col items-center">
            <Icons.History />
            <p className="mt-4 font-bold text-sm">Nenhuma compra registrada.</p>
          </div>
        ) : (
          filteredHistory.map((purchase) => (
            <button
              key={purchase.id}
              onClick={() => setViewingPurchase(purchase)}
              className="w-full flex items-center justify-between p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm active:scale-[0.98] transition-all"
            >
              <div className="text-left">
                <p className="font-black dark:text-white">
                  {new Date(purchase.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                  {purchase.items.length} itens comprados
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                  R$ {purchase.total.toFixed(2)}
                </p>
                <div className="text-gray-300">
                  <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 9L5 5L1 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
