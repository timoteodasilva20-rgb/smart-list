
import React, { useState, useEffect } from 'react';
import { ShoppingItem, Category, PurchaseHistoryEntry, ProductHistory, AppTab } from './types';
import { AddItemForm } from './componentes/AddItemForm';
import { ListDisplay } from './componentes/ListDisplay';
import { Resumo } from './componentes/Resumo';
import { Menu } from './componentes/Menu';
import { ExpensesView } from './componentes/ExpensesView';
import { Icons } from './constantes';

const App: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('sb_items');
    return saved ? JSON.parse(saved) : [];
  });
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistoryEntry[]>(() => {
    const saved = localStorage.getItem('sb_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [productHistory, setProductHistory] = useState<ProductHistory>(() => {
    const saved = localStorage.getItem('sb_product_history');
    return saved ? JSON.parse(saved) : {};
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('sb_theme') === 'dark';
  });
  const [activeTab, setActiveTab] = useState<AppTab>('shopping');

  useEffect(() => {
    localStorage.setItem('sb_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('sb_history', JSON.stringify(purchaseHistory));
  }, [purchaseHistory]);

  useEffect(() => {
    localStorage.setItem('sb_product_history', JSON.stringify(productHistory));
  }, [productHistory]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('sb_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleAddItem = (name: string, quantity: number, category: Category, price: number) => {
    const newItem: ShoppingItem = {
      id: crypto.randomUUID(),
      name,
      quantity,
      category,
      price: price || 0,
      bought: false
    };
    setItems(prev => [newItem, ...prev]);
  };

  const handleToggleBought = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newStatus = !item.bought;
        return { ...item, bought: newStatus };
      }
      return item;
    }));
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdatePrice = (id: string, price: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        setProductHistory(h => ({
          ...h,
          [item.name]: { lastPrice: price, category: item.category }
        }));
        return { ...item, price };
      }
      return item;
    }));
  };

  const handleFinalizePurchase = () => {
    const boughtItems = items.filter(i => i.bought);
    if (boughtItems.length === 0) return;

    const total = boughtItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    
    const newEntry: PurchaseHistoryEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      total,
      items: boughtItems
    };

    setPurchaseHistory(prev => [newEntry, ...prev]);
    setItems(prev => prev.filter(i => !i.bought));
    setActiveTab('expenses');
  };

  return (
    <div className="min-h-screen pb-48 dark:bg-gray-900 transition-colors duration-200">
      <header className="sticky top-0 z-30 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-md px-4 py-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Icons.Logo />
          <div>
            <h1 className="text-xl font-black tracking-tight dark:text-white leading-tight">SmartBuy</h1>
            <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest leading-none">Lista Inteligente</p>
          </div>
        </div>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2.5 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 active:scale-90 transition-transform"
        >
          {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
        </button>
      </header>

      <main className="px-4 py-6 max-w-md mx-auto">
        {activeTab === 'shopping' ? (
          <>
            <AddItemForm onAdd={handleAddItem} productHistory={productHistory} />
            <ListDisplay 
              items={items} 
              onToggle={handleToggleBought} 
              onDelete={handleDeleteItem}
              onUpdatePrice={handleUpdatePrice}
            />
            <Resumo items={items} onFinalize={handleFinalizePurchase} />
          </>
        ) : (
          <ExpensesView history={purchaseHistory} />
        )}
      </main>

      <Menu activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
};

export default App;
