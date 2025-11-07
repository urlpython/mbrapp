import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Target, Plus, Trash2, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

interface GoalsSectionProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
  onUpdateGoal: (id: string, amount: number) => void;
  onDeleteGoal: (id: string) => void;
}

export function GoalsSection({ goals, onAddGoal, onUpdateGoal, onDeleteGoal }: GoalsSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [showAddAmount, setShowAddAmount] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
  });
  const [addAmount, setAddAmount] = useState('');

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.name && newGoal.targetAmount && newGoal.deadline) {
      onAddGoal({
        name: newGoal.name,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: 0,
        deadline: newGoal.deadline,
      });
      setNewGoal({ name: '', targetAmount: '', deadline: '' });
      setShowModal(false);
    }
  };

  const handleAddAmount = (goalId: string, currentAmount: number) => {
    if (addAmount && parseFloat(addAmount) > 0) {
      onUpdateGoal(goalId, currentAmount + parseFloat(addAmount));
      setAddAmount('');
      setShowAddAmount(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-gray-900 dark:text-white">Metas</h3>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          variant="ghost"
          size="sm"
          className="text-purple-600 dark:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-900"
        >
          <Plus className="w-4 h-4 mr-1" />
          Nova meta
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className="bg-gray-100 dark:bg-gray-900/30 rounded-2xl p-8 text-center border border-gray-300 dark:border-gray-800">
          <Target className="w-12 h-12 text-gray-400 dark:text-gray-700 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-500 mb-1">Nenhuma meta criada</p>
          <p className="text-gray-500 dark:text-gray-600 text-sm">Defina objetivos financeiros</p>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal, index) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const daysLeft = Math.ceil(
              (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-100 dark:bg-gray-900/30 rounded-2xl p-4 border border-gray-300 dark:border-gray-800"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white mb-1">{goal.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span translate="no">
                        {daysLeft > 0 ? `${daysLeft} dias restantes` : 'Prazo vencido'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      onClick={() => setShowAddAmount(goal.id)}
                      variant="ghost"
                      size="sm"
                      className="text-green-600 dark:text-green-400 hover:bg-gray-200 dark:hover:bg-gray-800"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => onDeleteGoal(goal.id)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {showAddAmount === goal.id && (
                  <div className="mb-3 flex gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                      placeholder="Valor a adicionar"
                      className="bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white h-9 text-sm"
                    />
                    <Button
                      onClick={() => handleAddAmount(goal.id, goal.currentAmount)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      OK
                    </Button>
                  </div>
                )}

                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400" translate="no">
                      R$ {goal.currentAmount.toFixed(2)} de R$ {goal.targetAmount.toFixed(2)}
                    </span>
                    <span className="text-purple-600 dark:text-purple-400" translate="no">{progress.toFixed(0)}%</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Criar Nova Meta</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Defina um objetivo financeiro para alcançar
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddGoal} className="space-y-4">
            <div>
              <Label className="text-gray-900 dark:text-gray-300">Nome da meta</Label>
              <Input
                type="text"
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                placeholder="Ex: Comprar notebook"
                className="bg-gray-100 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white mt-2 rounded-2xl"
                required
              />
            </div>

            <div>
              <Label className="text-gray-900 dark:text-gray-300">Valor alvo (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                placeholder="0.00"
                className="bg-gray-100 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white mt-2 rounded-2xl"
                required
              />
            </div>

            <div>
              <Label className="text-gray-900 dark:text-gray-300">Prazo</Label>
              <Input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                className="bg-gray-100 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white mt-2 rounded-2xl"
                required
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                onClick={() => setShowModal(false)}
                variant="outline"
                className="flex-1 border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-2xl"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl"
              >
                Criar Meta
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
