import { Expense } from '../App';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface MonthlyChartProps {
  salary: number;
  expenses: Expense[];
  periodStart: Date;
  periodEnd: Date;
  periodFilter: 'month' | 'quarter' | 'year';
}

export function MonthlyChart({ salary, expenses, periodStart, periodEnd, periodFilter }: MonthlyChartProps) {
  // Calculate number of days/periods
  const daysDiff = Math.ceil((periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24));
  
  // Generate data based on period filter
  const generateData = () => {
    if (periodFilter === 'month') {
      // Daily data for month
      const daysInPeriod = daysDiff + 1;
      return Array.from({ length: daysInPeriod }, (_, i) => {
        const date = new Date(periodStart);
        date.setDate(periodStart.getDate() + i);
        const day = date.getDate();

        // Calculate cumulative expenses up to this day
        const expensesUpToDay = expenses
          .filter(exp => {
            const expDate = new Date(exp.date);
            return expDate <= date;
          })
          .reduce((sum, exp) => sum + exp.amount, 0);

        return {
          label: day.toString(),
          spending: expensesUpToDay,
        };
      });
    } else if (periodFilter === 'quarter') {
      // Weekly data for quarter
      const weeks: any[] = [];
      let currentWeekStart = new Date(periodStart);
      let weekNumber = 1;

      while (currentWeekStart <= periodEnd) {
        const weekEnd = new Date(currentWeekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        const expensesInWeek = expenses
          .filter(exp => {
            const expDate = new Date(exp.date);
            return expDate >= currentWeekStart && expDate <= Math.min(weekEnd.getTime(), periodEnd.getTime());
          })
          .reduce((sum, exp) => sum + exp.amount, 0);

        // Cumulative
        const previousTotal = weeks.length > 0 ? weeks[weeks.length - 1].spending : 0;
        
        weeks.push({
          label: `S${weekNumber}`,
          spending: previousTotal + expensesInWeek,
        });

        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        weekNumber++;
      }

      return weeks;
    } else {
      // Monthly data for year
      const months: any[] = [];
      for (let m = 0; m < 12; m++) {
        const monthDate = new Date(periodStart.getFullYear(), m, 1);
        const monthName = monthDate.toLocaleDateString('pt-BR', { month: 'short' });
        
        const expensesInMonth = expenses
          .filter(exp => {
            const expDate = new Date(exp.date);
            return expDate.getMonth() === m && expDate.getFullYear() === periodStart.getFullYear();
          })
          .reduce((sum, exp) => sum + exp.amount, 0);

        // Cumulative
        const previousTotal = months.length > 0 ? months[months.length - 1].spending : 0;
        
        months.push({
          label: monthName.charAt(0).toUpperCase() + monthName.slice(1),
          spending: previousTotal + expensesInMonth,
        });
      }

      return months;
    }
  };

  const data = generateData();

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 shadow-xl">
          <p className="text-gray-600 dark:text-gray-400 text-xs mb-1">
            {periodFilter === 'month' ? `Dia ${payload[0].payload.label}` : payload[0].payload.label}
          </p>
          <p className="text-gray-900 dark:text-white">R$ {payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="h-[180px] flex items-center justify-center text-gray-500">
        <p className="text-sm">Nenhum dado para exibir neste período</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-800" vertical={false} />
        <XAxis
          dataKey="label"
          stroke="#9ca3af"
          tick={{ fill: '#6b7280', fontSize: 11 }}
          tickLine={false}
          interval={periodFilter === 'month' ? 5 : 0}
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
            return value.toFixed(0);
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="spending"
          stroke="#a855f7"
          strokeWidth={2}
          fill="url(#colorSpending)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
