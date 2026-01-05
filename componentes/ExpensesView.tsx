
import React, { useState } from 'react';
import { PurchaseHistoryEntry, ShoppingItem } from '../types';
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

  // Get unique months from history
  // Fix: Explicitly type months as string[] to prevent 'unknown' inference error when using m.split() below.
  const months: string[] = Array.from(new Set(history.map(h => {
    const d = new Date(h.date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  })));

  // If current month is not in history, add it to options
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
          className="flex items-center gap-2 text-indigo-600 font-bold mb-4 active:scale-95"
        >
          <Icons.ArrowLeft />
          Voltar para Histórico
        </button>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-black mb-1 dark:text-white">Detalhes da Compra</h2>
          <p className="text-sm text-gray-500 mb-6">
            Realizada em {new Date(viewingPurchase.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>

          <div className="space-y-4">
            {viewingPurchase.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-gray-50 dark:border-gray-700 pb-2">
                <div>
                  <p className="font-bold dark:text-white">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.quantity} un. x R$ {item.price.toFixed(2)}</p>
                </div>
                <p className="font-bold text-indigo-600 dark:text-indigo-400">R$ {(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t-4 border-double border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <span className="text-sm font-bold uppercase text-gray-400">Total Pago</span>
            <span className="text-2xl font-black dark:text-white">R$ {viewingPurchase.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-black dark:text-white">Meus Gastos</h2>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-white dark:bg-gray-800 border-none rounded-xl px-3 py-2 text-sm font-bold shadow-sm outline-none dark:text-white"
        >
          {months.map(m => {
            const [year, month] = m.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1);
            return (
              <option key={m} value={m}>
                {date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </option>
            );
          })}
        </select>
      </div>

      <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-xl">
        <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Acumulado do Mês</p>
        <p className="text-4xl font-black">R$ {monthTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
      </div>

      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <p className="text-center py-12 text-gray-400 font-medium italic">Nenhuma compra finalizada neste mês.</p>
        ) : (
          filteredHistory.map((purchase) => (
            <button
              key={purchase.id}
              onClick={() => setViewingPurchase(purchase)}
              className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm active:scale-[0.98] transition-all"
            >
              <div className="text-left">
                <p className="font-bold dark:text-white">
                  {new Date(purchase.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                </p>
                <p className="text-[10px] text-gray-500 font-bold uppercase">{purchase.items.length} itens</p>
              </div>
              <p className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                R$ {purchase.total.toFixed(2)}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
