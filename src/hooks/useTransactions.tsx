import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api } from "../services/api";

interface Transaction {
  id: number;
  title: string;
  type: string;
  amount: number;
  category: string;
  createdAt: string;
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

interface TransactionContextData {
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => Promise<void>;
}

interface TransactionsProviderProps {
  children: ReactNode;
}

const TransactionsContext = createContext<TransactionContextData>({} as TransactionContextData);

function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    async function getTransactions() {
      const response = await api.get('/transactions');
      
      setTransactions(response.data.transactions);
    }

    getTransactions();
  }, []);

  async function createTransaction(newTransaction: TransactionInput) {
    const response = await api.post('/transactions', {
      ...newTransaction,
      createdAt: new Date(),
    });

    const { transaction } = response.data;

    setTransactions([...transactions, transaction]);
  }

  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
}

function useTransactions() {
  const context = useContext(TransactionsContext);

  return context;
}

export { TransactionsProvider, useTransactions };