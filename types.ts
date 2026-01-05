
export enum Category {
  Hortifruti = 'Hortifruti',
  Acougue = 'Açougue',
  Padaria = 'Padaria',
  Laticinios = 'Laticínios',
  Limpeza = 'Limpeza',
  Bebidas = 'Bebidas',
  Outros = 'Outros'
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: Category;
  bought: boolean;
}

export interface PurchaseHistoryEntry {
  id: string;
  date: string; // ISO String
  total: number;
  items: ShoppingItem[];
}

export interface ProductHistory {
  [productName: string]: {
    lastPrice: number;
    category: Category;
  }
}

export type AppTab = 'shopping' | 'expenses';
