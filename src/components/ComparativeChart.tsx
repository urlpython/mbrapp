import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Expense } from '../App';

interface ComparativeChartProps {
  expenses: Expense[];
  salary: number;
  periodFilter: 'month' | 'quarter' | 'year';
}

export function ComparativeChart({ expenses, salary, periodFilter }: ComparativeChartProps) {
  // Generate comparison data based on period
  const generateData = () => {
    if (periodFilter === 'month') {
      // Compare last 6 months
      const data = [];
      const now = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = monthDate.toLocaleDateString('pt-BR', { month: 'short' });
        const month = monthDate.getMonth();
        const year = monthDate.getFullYear();
        
        const monthExpenses = expenses
          .filter(exp => {
            const expDate = new Date(exp.date);
            return expDate.getMonth() === month && expDate.getFullYear() === year;
          })
          .reduce((sum, exp) => sum + exp.amount, 0);

        data.push({
          period: monthName.charAt(0).toUpperCase() + monthName.slice(1),
          gastos: monthExpenses,
          meta: salary,
        });
      }
      
      return data;
    } else if (periodFilter === 'quarter') {
      // Compare last 4 quarters
      const data = [];
      const now = new Date();
      
      for (let i = 3; i >= 0; i--) {
        const quarterMonthStart = now.getMonth() - (i * 3);
        const startDate = new Date(now.getFullYear(), quarterMonthStart, 1);
        const endDate = new Date(now.getFullYear(), quarterMonthStart + 3, 0);
        
        // Adjust year if needed
        if (startDate.getMonth() > now.getMonth()) {
          startDate.setFullYear(startDate.getFullYear() - 1);
          endDate.setFullYear(endDate.getFullYear() - 1);
        }
        
        const quarterExpenses = expenses
          .filter(exp => {
            const expDate = new Date(exp.date);
            return expDate >= startDate && expDate <= endDate;
          })
          .reduce((sum, exp) => sum + exp.amount, 0);

        const quarterName = `Q${4 - i}/${startDate.getFullYear().toString().slice(-2)}`;
        
        data.push({
          period: quarterName,
          gastos: quarterExpenses,
          meta: salary * 3,
        });
      }
      
      return data;
    } else {
      // Compare last 3 years
      const data = [];
      const now = new Date();
      const currentYear = now.getFullYear();
      
      for (let i = 2; i >= 0; i--) {
        const year = currentYear - i;
        
        const yearExpenses = expenses
          .filter(exp => {
            const expDate = new Date(exp.date);
            return expDate.getFullYear() === year;
          })
          .reduce((sum, exp) => sum + exp.amount, 0);

        data.push({
          period: year.toString(),
          gastos: yearExpenses,
          meta: salary * 12,
        });
      }
      
      return data;
    }
  };

  const data = generateData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 shadow-xl">
          <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">{payload[0].payload.period}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-purple-500" />
              <span className="text-gray-900 dark:text-white text-sm">Gastos: R$ {payload[0].value.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-gray-400" />
              <span className="text-gray-900 dark:text-white text-sm">Meta: R$ {payload[1].value.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500">
              {payload[0].value <= payload[1].value ? (
                <span className="text-green-600 dark:text-green-400">✓ Dentro do orçamento</span>
              ) : (
                <span className="text-red-600 dark:text-red-400">⚠ Acima do orçamento</span>
              )}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0 || data.every(d => d.gastos === 0)) {
    return (
      <div className="h-[200px] flex items-center justify-center text-gray-500">
        <p className="text-sm">Dados insuficientes para comparação</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-800" vertical={false} />
        <XAxis
          dataKey="period"
          stroke="#9ca3af"
          tick={{ fill: '#6b7280', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#9ca3af"
          tick={{ fill: '#6b7280', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => {
            if (value >= 1000) {
              return `${(value / 1000).toFixed(1)}k`;
            }
            return value;
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="gastos" fill="#a855f7" radius={[8, 8, 0, 0]} />
        <Bar dataKey="meta" fill="#9ca3af" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
