import { Expense } from '../App';
import { Button } from './ui/button';
import { Trash2, ShoppingBag, Coffee, Car, Home, Smartphone, Heart, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';

interface ExpensesListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

const categoryIcons: Record<string, any> = {
  'Compras': ShoppingBag,
  'Alimentação': Coffee,
  'Transporte': Car,
  'Casa': Home,
  'Lazer': Smartphone,
  'Saúde': Heart,
  'Outro': DollarSign,
};

const categoryGradients: Record<string, string> = {
  'Compras': 'from-purple-600 to-purple-500',
  'Alimentação': 'from-orange-600 to-orange-500',
  'Transporte': 'from-blue-600 to-blue-500',
  'Casa': 'from-green-600 to-green-500',
  'Lazer': 'from-pink-600 to-pink-500',
  'Saúde': 'from-red-600 to-red-500',
  'Outro': 'from-gray-600 to-gray-500',
};

export function ExpensesList({ expenses, onDeleteExpense }: ExpensesListProps) {
  if (expenses.length === 0) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900/30 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-300 dark:border-gray-800">
        <p className="text-gray-600 dark:text-gray-500">Nenhuma transação ainda.</p>
        <p className="text-gray-500 dark:text-gray-600 text-sm mt-1">Registre seus gastos para começar</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {expenses.map((expense, index) => {
        const Icon = categoryIcons[expense.category] || DollarSign;
        const gradient = categoryGradients[expense.category] || 'from-gray-600 to-gray-500';
        const date = new Date(expense.date);
        const formattedDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

        return (
          <motion.div
            key={expense.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-gray-100 dark:bg-gray-900/30 backdrop-blur-sm rounded-2xl p-4 hover:bg-gray-200 dark:hover:bg-gray-900/50 transition-colors border border-gray-300 dark:border-gray-800"
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 dark:text-white truncate">{expense.description}</p>
                <p className="text-gray-600 dark:text-gray-500 text-sm" translate="no">{formattedDate}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-gray-900 dark:text-white" translate="no">-R$ {expense.amount.toFixed(2)}</p>
                  <p className="text-gray-600 dark:text-gray-500 text-xs">{expense.category}</p>
                </div>
                <Button
                  onClick={() => onDeleteExpense(expense.id)}
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-300 dark:hover:bg-gray-800 rounded-xl flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
