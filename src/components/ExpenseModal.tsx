import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Expense } from '../App';
import { ShoppingBag, Coffee, Car, Home, Smartphone, Heart, DollarSign } from 'lucide-react';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

const categories = [
  { name: 'Compras', icon: ShoppingBag, gradient: 'from-purple-600 to-purple-500' },
  { name: 'Alimentação', icon: Coffee, gradient: 'from-orange-600 to-orange-500' },
  { name: 'Transporte', icon: Car, gradient: 'from-blue-600 to-blue-500' },
  { name: 'Casa', icon: Home, gradient: 'from-green-600 to-green-500' },
  { name: 'Lazer', icon: Smartphone, gradient: 'from-pink-600 to-pink-500' },
  { name: 'Saúde', icon: Heart, gradient: 'from-red-600 to-red-500' },
  { name: 'Outro', icon: DollarSign, gradient: 'from-gray-600 to-gray-500' },
];

export function ExpenseModal({ isOpen, onClose, onAddExpense }: ExpenseModalProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Outro');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount.replace(',', '.')) <= 0) return;

    onAddExpense({
      description: description || category,
      amount: parseFloat(amount.replace(',', '.')),
      date: new Date().toISOString(),
      category,
    });

    // Reset form
    setDescription('');
    setAmount('');
    setCategory('Outro');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">Registrar Gasto</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Adicione um novo gasto ao seu controle mensal
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount - Large and prominent */}
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Valor</p>
            <div className="relative">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-2xl">R$</span>
              <Input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="bg-transparent border-0 border-b border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white text-3xl h-16 rounded-none pl-14 placeholder:text-gray-300 dark:placeholder:text-gray-800 focus-visible:ring-0 focus-visible:border-purple-600"
                autoFocus
              />
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Categoria</p>
            <div className="grid grid-cols-4 gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
                      isSelected
                        ? `bg-gradient-to-br ${cat.gradient}`
                        : 'bg-gray-100 dark:bg-gray-900/50 hover:bg-gray-200 dark:hover:bg-gray-900 border border-gray-200 dark:border-gray-800'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                    <span className={`text-xs ${isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description (optional) */}
          <div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
              Descrição <span className="text-gray-400 dark:text-gray-600">(opcional)</span>
            </p>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Almoço, Uber..."
              className="bg-gray-100 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white h-12 rounded-2xl placeholder:text-gray-400 dark:placeholder:text-gray-600"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 h-12 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-2xl"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!amount || parseFloat(amount.replace(',', '.')) <= 0}
              className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl disabled:opacity-50"
            >
              Registrar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
