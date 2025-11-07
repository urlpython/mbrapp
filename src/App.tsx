import { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { ExpenseModal } from './components/ExpenseModal';
import { ThemeProvider } from './contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { Goal } from './components/GoalsSection';
import { Toaster } from './components/ui/sonner';

export interface UserData {
  name: string;
  salary: number;
  fixedExpenses: Array<{ name: string; amount: number }>;
  profileImage?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

function App() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedUserData = localStorage.getItem('mbr_user_data');
    const savedExpenses = localStorage.getItem('mbr_expenses');
    const savedGoals = localStorage.getItem('mbr_goals');
    
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
      setIsOnboarded(true);
    }
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  const handleOnboardingComplete = (data: UserData) => {
    setUserData(data);
    setIsOnboarded(true);
    localStorage.setItem('mbr_user_data', JSON.stringify(data));
  };

  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };
    
    const updatedExpenses = [newExpense, ...expenses];
    setExpenses(updatedExpenses);
    localStorage.setItem('mbr_expenses', JSON.stringify(updatedExpenses));
    setShowExpenseModal(false);
  };

  const handleDeleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(exp => exp.id !== id);
    setExpenses(updatedExpenses);
    localStorage.setItem('mbr_expenses', JSON.stringify(updatedExpenses));
  };

  const handleAddGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
    };
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    localStorage.setItem('mbr_goals', JSON.stringify(updatedGoals));
  };

  const handleUpdateGoal = (id: string, amount: number) => {
    const updatedGoals = goals.map(goal =>
      goal.id === id ? { ...goal, currentAmount: amount } : goal
    );
    setGoals(updatedGoals);
    localStorage.setItem('mbr_goals', JSON.stringify(updatedGoals));
  };

  const handleDeleteGoal = (id: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== id);
    setGoals(updatedGoals);
    localStorage.setItem('mbr_goals', JSON.stringify(updatedGoals));
  };

  const handleUpdateProfile = (data: Partial<UserData> & { profileImage?: string }) => {
    if (!userData) return;
    
    const updatedUserData = {
      ...userData,
      ...data,
    };
    setUserData(updatedUserData);
    localStorage.setItem('mbr_user_data', JSON.stringify(updatedUserData));
  };

  const handleUpdateFixedExpenses = (fixedExpenses: Array<{ name: string; amount: number }>) => {
    if (!userData) return;
    
    const updatedUserData = {
      ...userData,
      fixedExpenses,
    };
    setUserData(updatedUserData);
    localStorage.setItem('mbr_user_data', JSON.stringify(updatedUserData));
  };

  const handleReset = () => {
    localStorage.removeItem('mbr_user_data');
    localStorage.removeItem('mbr_expenses');
    localStorage.removeItem('mbr_goals');
    setUserData(null);
    setExpenses([]);
    setGoals([]);
    setIsOnboarded(false);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-black transition-colors">
      <AnimatePresence mode="wait">
        {!isOnboarded ? (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Onboarding onComplete={handleOnboardingComplete} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Dashboard
              userData={userData!}
              expenses={expenses}
              goals={goals}
              onAddExpense={() => setShowExpenseModal(true)}
              onDeleteExpense={handleDeleteExpense}
              onAddGoal={handleAddGoal}
              onUpdateGoal={handleUpdateGoal}
              onDeleteGoal={handleDeleteGoal}
              onUpdateProfile={handleUpdateProfile}
              onUpdateFixedExpenses={handleUpdateFixedExpenses}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ExpenseModal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        onAddExpense={handleAddExpense}
      />
      
      <Toaster position="top-center" richColors />
      </div>
    </ThemeProvider>
  );
}

export default App;
