import { useState } from 'react';
import { UserData, Expense } from '../App';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { Plus, Bell, ChevronDown, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Download, Filter, FileText } from 'lucide-react';
import { MonthlyChart } from './MonthlyChart';
import { ComparativeChart } from './ComparativeChart';
import { ExpensesList } from './ExpensesList';
import { SettingsModal } from './SettingsModal';
import { EditProfileModal } from './EditProfileModal';
import { EditFixedExpensesModal } from './EditFixedExpensesModal';
import { GoalsSection, Goal } from './GoalsSection';
import { InsightsCard } from './InsightsCard';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useTheme } from '../contexts/ThemeContext';
import { generateFinancialReport } from '../lib/pdfGenerator';
import { toast } from 'sonner@2.0.3';

interface DashboardProps {
  userData: UserData;
  expenses: Expense[];
  goals: Goal[];
  onAddExpense: () => void;
  onDeleteExpense: (id: string) => void;
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
  onUpdateGoal: (id: string, amount: number) => void;
  onDeleteGoal: (id: string) => void;
  onUpdateProfile: (data: Partial<UserData> & { profileImage?: string }) => void;
  onUpdateFixedExpenses: (expenses: Array<{ name: string; amount: number }>) => void;
  onReset: () => void;
}

export function Dashboard({ userData, expenses, goals, onAddExpense, onDeleteExpense, onAddGoal, onUpdateGoal, onDeleteGoal, onUpdateProfile, onUpdateFixedExpenses, onReset }: DashboardProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditFixedExpenses, setShowEditFixedExpenses] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'statistics' | 'goals'>('home');
  const [periodFilter, setPeriodFilter] = useState<'month' | 'quarter' | 'year'>('month');
  const { theme } = useTheme();

  // Calculate financial data
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const currentDay = now.getDate();
  const daysRemaining = daysInMonth - currentDay + 1;

  // Get period dates
  const getPeriodDates = () => {
    const end = new Date();
    const start = new Date();
    let label = '';
    
    if (periodFilter === 'month') {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      label = `${start.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`;
    } else if (periodFilter === 'quarter') {
      const quarterStart = Math.floor(currentMonth / 3) * 3;
      start.setMonth(quarterStart, 1);
      start.setHours(0, 0, 0, 0);
      label = `${start.toLocaleDateString('pt-BR', { month: 'short' })} - ${end.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}`;
    } else {
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      label = `Ano ${currentYear}`;
    }
    
    return { start, end, label };
  };

  const periodDates = getPeriodDates();

  // Filter expenses based on period
  const getFilteredExpenses = () => {
    return expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate >= periodDates.start && expDate <= periodDates.end;
    });
  };

  const filteredExpenses = getFilteredExpenses();

  // Filter expenses for current month
  const currentMonthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
  });

  const totalFixedExpenses = userData.fixedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalVariableExpenses = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalSpent = totalFixedExpenses + totalVariableExpenses;
  const remaining = userData.salary - totalSpent;
  const dailyAllowance = remaining / daysRemaining;
  const budgetProgress = (totalSpent / userData.salary) * 100;

  // Get greeting
  const getGreeting = () => {
    const hour = now.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Categories summary - use filtered expenses for statistics tab
  const categorySummary = (activeTab === 'statistics' ? filteredExpenses : currentMonthExpenses).reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categorySummary)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  // Calculate totals for filtered period (used in statistics)
  const filteredTotalVariable = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const filteredTotalSpent = totalFixedExpenses + filteredTotalVariable;
  const filteredRemaining = userData.salary - filteredTotalSpent;
  const filteredBudgetProgress = (filteredTotalSpent / userData.salary) * 100;

  // Export PDF Report
  const handleExportPDF = async () => {
    try {
      toast.loading('Gerando relatório PDF...');
      
      await generateFinancialReport({
        userData,
        expenses: activeTab === 'statistics' ? filteredExpenses : currentMonthExpenses,
        goals,
        period: periodDates,
      });
      
      toast.success('Relatório gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar relatório. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black pb-24 transition-colors">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setShowEditProfile(true)}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Avatar className="w-12 h-12 border-2 border-purple-600/30">
              {userData.profileImage ? (
                <AvatarImage src={userData.profileImage} alt={userData.name} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                  {userData.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="text-left">
              <p className="text-gray-500 dark:text-gray-400 text-sm">{getGreeting()}</p>
              <p className="text-gray-900 dark:text-white">{userData.name}</p>
            </div>
          </button>
          <Button
            onClick={() => setShowSettings(true)}
            variant="ghost"
            size="icon"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-xl"
          >
            <Bell className="w-5 h-5" />
          </Button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 py-2 px-4 rounded-xl transition-colors ${
              activeTab === 'home'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-gray-100 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Início
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`flex-1 py-2 px-4 rounded-xl transition-colors ${
              activeTab === 'statistics'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-gray-100 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Estatísticas
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`flex-1 py-2 px-4 rounded-xl transition-colors ${
              activeTab === 'goals'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-gray-100 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Metas
          </button>
        </div>

        {activeTab === 'home' && (
          <>
            {/* Balance Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6"
            >
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Seu Saldo Disponível</p>
              <div className="bg-gray-100 dark:bg-gray-900/30 backdrop-blur-sm rounded-3xl p-6 mb-4 border border-gray-300 dark:border-gray-800">
                <h1 className="text-gray-900 dark:text-white mb-1" translate="no">
                  R$ {remaining > 0 ? remaining.toFixed(2) : '0,00'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm" translate="no">
                  {daysRemaining} {daysRemaining === 1 ? 'dia restante' : 'dias restantes'} no mês
                </p>
              </div>

              {/* Card with Gradient */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#7c3aed] via-[#a855f7] to-[#d946ef] p-6 aspect-[1.8/1] flex flex-col justify-between shadow-xl shadow-purple-500/20">
                {/* Card Top */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-purple-200/80 text-sm mb-2">Pode gastar hoje</p>
                    <h2 className="text-white" translate="no">
                      R$ {dailyAllowance > 0 ? dailyAllowance.toFixed(2) : '0,00'}
                    </h2>
                  </div>
                  <div className="w-10 h-8 rounded bg-white/20 backdrop-blur-sm" />
                </div>

                {/* Card Number (stylized) */}
                <div className="flex gap-2 text-white/60 text-sm" translate="no">
                  <span>••••</span>
                  <span>••••</span>
                  <span>••••</span>
                  <span>{currentDay.toString().padStart(4, '•')}</span>
                </div>

                {/* Card Bottom */}
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-purple-200/70 text-xs mb-1">Status</p>
                    <p className="text-white text-sm">
                      {budgetProgress < 50 ? 'Excelente' : budgetProgress < 75 ? 'No controle' : budgetProgress < 90 ? 'Atenção' : 'Cuidado'}
                    </p>
                  </div>
                  <p className="text-white/80 text-sm" translate="no">{budgetProgress.toFixed(0)}% gasto</p>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={onAddExpense}
                className="flex-1 bg-gray-100 dark:bg-gray-900/50 hover:bg-gray-200 dark:hover:bg-gray-900 text-gray-900 dark:text-white py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors border border-gray-300 dark:border-gray-800"
              >
                <ArrowDownLeft className="w-5 h-5 text-red-500" />
                <span>Registrar</span>
              </button>
              <button
                onClick={handleExportPDF}
                className="flex-1 bg-gray-100 dark:bg-gray-900/50 hover:bg-gray-200 dark:hover:bg-gray-900 text-gray-900 dark:text-white py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors border border-gray-300 dark:border-gray-800"
              >
                <FileText className="w-5 h-5 text-blue-500" />
                <span>Relatório</span>
              </button>
              <button
                onClick={onAddExpense}
                className="w-14 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl flex items-center justify-center transition-colors shadow-lg shadow-purple-500/30"
              >
                <Plus className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Insights */}
            <div className="mb-6">
              <InsightsCard
                salary={userData.salary}
                totalSpent={totalSpent}
                expenses={currentMonthExpenses}
                daysRemaining={daysRemaining}
              />
            </div>

            {/* Transactions */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 dark:text-white">Transações</h3>
                <button className="text-purple-600 dark:text-purple-400 text-sm hover:underline">Ver todas</button>
              </div>
              <ExpensesList
                expenses={currentMonthExpenses.slice(0, 10)}
                onDeleteExpense={onDeleteExpense}
              />
            </div>
          </>
        )}

        {activeTab === 'statistics' && (
          <>
            {/* Statistics Tab */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Period Filter */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900 dark:text-white">Estatísticas</h2>
                <Select value={periodFilter} onValueChange={(value: any) => setPeriodFilter(value)}>
                  <SelectTrigger className="w-[140px] bg-gray-100 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <SelectItem value="month">Este mês</SelectItem>
                    <SelectItem value="quarter">Trimestre</SelectItem>
                    <SelectItem value="year">Este ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gray-100 dark:bg-gray-900/30 rounded-2xl p-4 border border-gray-300 dark:border-gray-800">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-400 text-sm">Gastos</p>
                  </div>
                  <p className="text-gray-900 dark:text-white" translate="no">R$ {filteredTotalSpent.toFixed(2)}</p>
                  <p className="text-gray-600 dark:text-gray-500 text-xs mt-1" translate="no">{filteredBudgetProgress.toFixed(0)}% do salário</p>
                </div>

                <div className="bg-gray-100 dark:bg-gray-900/30 rounded-2xl p-4 border border-gray-300 dark:border-gray-800">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-400 text-sm">Disponível</p>
                  </div>
                  <p className="text-gray-900 dark:text-white" translate="no">R$ {filteredRemaining > 0 ? filteredRemaining.toFixed(2) : '0,00'}</p>
                  <p className="text-gray-600 dark:text-gray-500 text-xs mt-1" translate="no">{(100 - filteredBudgetProgress).toFixed(0)}% restante</p>
                </div>
              </div>

              {/* Period info */}
              <div className="bg-purple-100 dark:bg-purple-900/10 border border-purple-300 dark:border-purple-800/30 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-purple-700 dark:text-purple-400" />
                  <p className="text-purple-900 dark:text-purple-300 text-sm">
                    Exibindo dados de <span className="font-medium">{periodDates.label}</span>
                  </p>
                </div>
                <p className="text-purple-800 dark:text-purple-400 text-xs mt-1" translate="no">
                  {filteredExpenses.length} transações neste período
                </p>
              </div>

              {/* Monthly Chart */}
              <div className="bg-gray-100 dark:bg-gray-900/30 backdrop-blur-sm rounded-3xl p-6 mb-6 border border-gray-300 dark:border-gray-800">
                <h3 className="text-gray-900 dark:text-white mb-4">Evolução no Período</h3>
                <MonthlyChart
                  salary={userData.salary}
                  expenses={filteredExpenses}
                  periodStart={periodDates.start}
                  periodEnd={periodDates.end}
                  periodFilter={periodFilter}
                />
              </div>

              {/* Comparative Chart */}
              <div className="bg-gray-50 dark:bg-gray-900/30 backdrop-blur-sm rounded-3xl p-6 mb-6 border border-gray-200 dark:border-gray-800">
                <h3 className="text-gray-900 dark:text-white mb-4">Comparativo de Períodos</h3>
                <ComparativeChart 
                  expenses={expenses} 
                  salary={userData.salary}
                  periodFilter={periodFilter}
                />
              </div>

              {/* Export Report Button */}
              <div className="mb-6">
                <Button
                  onClick={handleExportPDF}
                  className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Exportar Relatório Completo em PDF
                </Button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-900 dark:text-white">Categorias</h3>
                  <button className="text-purple-400 text-sm">Ver todas</button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {topCategories.length > 0 ? (
                    topCategories.map(([category, amount]) => {
                      const percentage = (amount / filteredTotalVariable) * 100;
                      return (
                        <div
                          key={category}
                          className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-800"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl flex items-center justify-center">
                              <span className="text-xl">{getCategoryIcon(category)}</span>
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{category}</p>
                          <p className="text-gray-900 dark:text-white mb-2">R$ {amount.toFixed(2)}</p>
                          <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <p className="text-gray-500 text-xs mt-1">{percentage.toFixed(0)}% do total</p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-2 text-center py-8 text-gray-500">
                      Nenhuma categoria neste período
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}

        {activeTab === 'goals' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GoalsSection
              goals={goals}
              onAddGoal={onAddGoal}
              onUpdateGoal={onUpdateGoal}
              onDeleteGoal={onDeleteGoal}
            />
          </motion.div>
        )}
      </div>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        userData={userData}
        onEditProfile={() => {
          setShowSettings(false);
          setShowEditProfile(true);
        }}
        onEditFixedExpenses={() => {
          setShowSettings(false);
          setShowEditFixedExpenses(true);
        }}
        onReset={onReset}
      />

      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        userData={userData}
        onSave={onUpdateProfile}
      />

      <EditFixedExpensesModal
        isOpen={showEditFixedExpenses}
        onClose={() => setShowEditFixedExpenses(false)}
        expenses={userData.fixedExpenses}
        onSave={onUpdateFixedExpenses}
      />
    </div>
  );
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'Compras': '🛍️',
    'Alimentação': '🍔',
    'Transporte': '🚗',
    'Casa': '🏠',
    'Lazer': '🎮',
    'Saúde': '💊',
    'Outro': '💰',
  };
  return icons[category] || '💰';
}
