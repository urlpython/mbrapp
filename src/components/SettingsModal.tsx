import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { UserData } from '../App';
import { User, Trash2, AlertTriangle, Settings, Moon, Sun, Edit, Receipt } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData;
  onEditProfile: () => void;
  onEditFixedExpenses: () => void;
  onReset: () => void;
}

export function SettingsModal({ isOpen, onClose, userData, onEditProfile, onEditFixedExpenses, onReset }: SettingsModalProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleReset = () => {
    onReset();
    onClose();
    setShowConfirm(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-[#0a0a0a] border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurações
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Gerencie suas informações e preferências
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Theme Toggle */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-purple-400" />
                ) : (
                  <Sun className="w-5 h-5 text-orange-400" />
                )}
                <div>
                  <Label className="text-gray-900 dark:text-white">Modo {theme === 'dark' ? 'Escuro' : 'Claro'}</Label>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    {theme === 'dark' ? 'Interface escura ativada' : 'Interface clara ativada'}
                  </p>
                </div>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </div>

          {/* User Profile */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-16 h-16 border-2 border-purple-600/30">
                {userData.profileImage ? (
                  <AvatarImage src={userData.profileImage} alt={userData.name} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-xl">
                    {userData.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white">{userData.name}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Usuário ativo</p>
              </div>
              <Button
                onClick={onEditProfile}
                size="sm"
                variant="ghost"
                className="text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Salário mensal</span>
                <span className="text-gray-900 dark:text-white" translate="no">R$ {userData.salary.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Contas fixas</span>
                <span className="text-gray-900 dark:text-white" translate="no">{userData.fixedExpenses.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Total fixo</span>
                <span className="text-gray-900 dark:text-white" translate="no">
                  R$ {userData.fixedExpenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Fixed Expenses List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-600 dark:text-gray-400 text-sm">Suas contas fixas:</p>
              <Button
                onClick={onEditFixedExpenses}
                size="sm"
                variant="ghost"
                className="text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 h-7"
              >
                <Receipt className="w-3 h-3 mr-1" />
                Editar
              </Button>
            </div>
            <div className="space-y-2">
              {userData.fixedExpenses.map((expense, index) => (
                <div key={index} className="bg-gray-100 dark:bg-gray-900/30 rounded-xl p-3 flex items-center justify-between border border-gray-200 dark:border-gray-800">
                  <span className="text-gray-900 dark:text-white text-sm">{expense.name}</span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm" translate="no">R$ {expense.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reset Section */}
          {!showConfirm ? (
            <Button
              onClick={() => setShowConfirm(true)}
              variant="outline"
              className="w-full h-12 border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-2xl"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Resetar todos os dados
            </Button>
          ) : (
            <Alert className="bg-red-500/10 border-red-500/30 rounded-2xl">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300 text-sm">
                Tem certeza? Isso vai apagar tudo: seus dados, gastos e configurações. Não dá pra desfazer.
              </AlertDescription>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => setShowConfirm(false)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleReset}
                  size="sm"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                >
                  Sim, resetar
                </Button>
              </div>
            </Alert>
          )}

          {/* About */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-gray-500 text-xs text-center">
              MeuBolsoRápido v1.0 - MVP
            </p>
            <p className="text-gray-600 text-xs text-center mt-1">
              Clareza financeira instantânea, sem complicação.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
