import { Lightbulb, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface InsightsCardProps {
  salary: number;
  totalSpent: number;
  expenses: Array<{ amount: number; category: string; date: string }>;
  daysRemaining: number;
}

export function InsightsCard({ salary, totalSpent, expenses, daysRemaining }: InsightsCardProps) {
  // Calculate insights
  const budgetUsed = (totalSpent / salary) * 100;
  const avgDailySpending = expenses.reduce((sum, exp) => sum + exp.amount, 0) / Math.max(1, 30 - daysRemaining);
  
  // Category analysis
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0];
  
  // Generate insights
  const insights = [];
  
  if (budgetUsed < 50 && daysRemaining > 10) {
    insights.push({
      icon: TrendingUp,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      title: 'Excelente controle!',
      description: `Você gastou apenas ${budgetUsed.toFixed(0)}% do seu orçamento. Continue assim!`,
    });
  } else if (budgetUsed > 80 && daysRemaining > 5) {
    insights.push({
      icon: AlertCircle,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      title: 'Atenção ao ritmo',
      description: `Você já usou ${budgetUsed.toFixed(0)}% do orçamento com ${daysRemaining} dias pela frente.`,
    });
  } else if (budgetUsed > 95) {
    insights.push({
      icon: TrendingDown,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      title: 'Orçamento quase esgotado',
      description: 'Considere reduzir gastos não essenciais este mês.',
    });
  }
  
  if (topCategory && categoryTotals[topCategory[0]] > salary * 0.3) {
    insights.push({
      icon: Lightbulb,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      title: 'Oportunidade de economia',
      description: `${topCategory[0]} representa ${((categoryTotals[topCategory[0]] / salary) * 100).toFixed(0)}% do seu salário. Considere otimizar esses gastos.`,
    });
  }
  
  if (avgDailySpending > 0) {
    const projectedSpending = avgDailySpending * 30;
    if (projectedSpending < salary * 0.8) {
      insights.push({
        icon: TrendingUp,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        title: 'Projeção positiva',
        description: `No ritmo atual, você deve economizar R$ ${(salary - projectedSpending).toFixed(2)} este mês.`,
      });
    }
  }

  if (insights.length === 0) {
    insights.push({
      icon: Lightbulb,
      color: 'text-gray-400',
      bg: 'bg-gray-500/10',
      title: 'Adicione mais gastos',
      description: 'Registre suas despesas para receber insights personalizados.',
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <h3 className="text-gray-900 dark:text-white">Insights</h3>
      </div>

      {insights.map((insight, index) => {
        const Icon = insight.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${insight.bg} rounded-2xl p-4 border border-gray-300 dark:border-gray-800/50`}
          >
            <div className="flex gap-3">
              <div className={`w-10 h-10 ${insight.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${insight.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white text-sm mb-1">{insight.title}</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed" translate="no">{insight.description}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
