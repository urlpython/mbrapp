import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface FixedExpense {
  name: string;
  amount: number;
}

interface EditFixedExpensesModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: FixedExpense[];
  onSave: (expenses: FixedExpense[]) => void;
}

export function EditFixedExpensesModal({ isOpen, onClose, expenses, onSave }: EditFixedExpensesModalProps) {
  const [editingExpenses, setEditingExpenses] = useState<FixedExpense[]>([...expenses]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newExpense, setNewExpense] = useState({ name: '', amount: '' });

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (index: number, name: string, amount: string) => {
    const amountNum = parseFloat(amount);
    if (!name.trim() || isNaN(amountNum) || amountNum <= 0) {
      toast.error('Preencha nome e valor válidos');
      return;
    }

    const updated = [...editingExpenses];
    updated[index] = { name: name.trim(), amount: amountNum };
    setEditingExpenses(updated);
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    const updated = editingExpenses.filter((_, i) => i !== index);
    setEditingExpenses(updated);
    toast.success('Despesa removida');
  };

  const handleAddNew = () => {
    const amountNum = parseFloat(newExpense.amount);
    if (!newExpense.name.trim() || isNaN(amountNum) || amountNum <= 0) {
      toast.error('Preencha nome e valor válidos');
      return;
    }

    setEditingExpenses([...editingExpenses, { 
      name: newExpense.name.trim(), 
      amount: amountNum 
    }]);
    setNewExpense({ name: '', amount: '' });
    toast.success('Despesa adicionada');
  };

  const handleSaveAll = () => {
    if (editingExpenses.length === 0) {
      toast.error('Adicione pelo menos uma despesa fixa');
      return;
    }

    onSave(editingExpenses);
    toast.success('Despesas fixas atualizadas!');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white max-w-md rounded-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">Editar Contas Fixas</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Gerencie suas despesas recorrentes mensais
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Existing Expenses */}
          <div className="space-y-2">
            {editingExpenses.map((expense, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-900/30 rounded-2xl p-4 border border-gray-200 dark:border-gray-800"
              >
                {editingIndex === index ? (
                  <div className="space-y-3">
                    <Input
                      type="text"
                      defaultValue={expense.name}
                      placeholder="Nome da despesa"
                      className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                      id={`name-${index}`}
                    />
                    <Input
                      type="number"
                      step="0.01"
                      defaultValue={expense.amount}
                      placeholder="Valor"
                      className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                      id={`amount-${index}`}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          const nameInput = document.getElementById(`name-${index}`) as HTMLInputElement;
                          const amountInput = document.getElementById(`amount-${index}`) as HTMLInputElement;
                          handleSaveEdit(index, nameInput.value, amountInput.value);
                        }}
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        Salvar
                      </Button>
                      <Button
                        onClick={() => setEditingIndex(null)}
                        size="sm"
                        variant="outline"
                        className="flex-1 border-gray-300 dark:border-gray-700"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white">{expense.name}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm" translate="no">
                        R$ {expense.amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => handleEdit(index)}
                        size="sm"
                        variant="ghost"
                        className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add New Expense */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-3">
            <Label className="text-gray-900 dark:text-white">Adicionar Nova Despesa</Label>
            <Input
              type="text"
              value={newExpense.name}
              onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
              placeholder="Nome (ex: Aluguel)"
              className="bg-gray-100 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
            />
            <Input
              type="number"
              step="0.01"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              placeholder="Valor (R$)"
              className="bg-gray-100 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
            />
            <Button
              onClick={handleAddNew}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-2xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-2xl"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveAll}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl"
            >
              Salvar Tudo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
