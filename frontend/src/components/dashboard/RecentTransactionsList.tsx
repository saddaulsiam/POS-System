import React from "react";

interface Transaction {
  id: number;
  total: number;
  createdAt: string;
  customerName?: string;
  itemCount: number;
}

interface RecentTransactionsListProps {
  transactions: Transaction[];
}

export const RecentTransactionsList: React.FC<RecentTransactionsListProps> = ({ transactions }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🔄 Recent Transactions</h3>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">#{transaction.id}</p>
              <p className="text-sm text-gray-600">
                {transaction.customerName || "Walk-in Customer"} • {transaction.itemCount} items
              </p>
              <p className="text-xs text-gray-500">{new Date(transaction.createdAt).toLocaleTimeString()}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-600">${transaction.total.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
