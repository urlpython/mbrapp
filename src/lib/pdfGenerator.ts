import jsPDF from 'jspdf';
import { UserData, Expense } from '../App';
import { Goal } from '../components/GoalsSection';

interface PDFReportData {
  userData: UserData;
  expenses: Expense[];
  goals: Goal[];
  period: {
    start: Date;
    end: Date;
    label: string;
  };
}

export async function generateFinancialReport(data: PDFReportData): Promise<void> {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let currentY = 20;

  // Helper functions
  const addText = (text: string, x: number, y: number, size: number = 10, style: 'normal' | 'bold' = 'normal') => {
    pdf.setFontSize(size);
    pdf.setFont('helvetica', style);
    pdf.text(text, x, y);
  };

  const addLine = (y: number) => {
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, y, pageWidth - 20, y);
  };

  const checkPageBreak = (neededSpace: number) => {
    if (currentY + neededSpace > pageHeight - 20) {
      pdf.addPage();
      currentY = 20;
      return true;
    }
    return false;
  };

  // Calculate financial data
  const totalFixedExpenses = data.userData.fixedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalVariableExpenses = data.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalSpent = totalFixedExpenses + totalVariableExpenses;
  const remaining = data.userData.salary - totalSpent;
  const budgetProgress = (totalSpent / data.userData.salary) * 100;

  // Category analysis
  const categorySummary = data.expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categorySummary)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Daily average
  const daysInPeriod = Math.ceil((data.period.end.getTime() - data.period.start.getTime()) / (1000 * 60 * 60 * 24));
  const dailyAverage = totalVariableExpenses / Math.max(1, daysInPeriod);

  // ==================== HEADER ====================
  // Purple gradient background (simulated)
  pdf.setFillColor(124, 58, 237);
  pdf.rect(0, 0, pageWidth, 40, 'F');

  pdf.setTextColor(255, 255, 255);
  addText('MeuBolsoRápido', 20, 18, 24, 'bold');
  addText('Relatório Financeiro Completo', 20, 28, 12);

  pdf.setTextColor(0, 0, 0);
  currentY = 50;

  // ==================== USER INFO ====================
  addText('Informações do Usuário', 20, currentY, 14, 'bold');
  currentY += 8;
  addLine(currentY);
  currentY += 8;

  addText(`Nome: ${data.userData.name}`, 20, currentY, 11);
  currentY += 6;
  addText(`Salário Mensal: R$ ${data.userData.salary.toFixed(2)}`, 20, currentY, 11);
  currentY += 6;
  addText(`Período: ${data.period.label}`, 20, currentY, 11);
  currentY += 6;
  addText(`Data do Relatório: ${new Date().toLocaleDateString('pt-BR')}`, 20, currentY, 11);
  currentY += 12;

  // ==================== SUMMARY ====================
  checkPageBreak(60);
  addText('Resumo Financeiro', 20, currentY, 14, 'bold');
  currentY += 8;
  addLine(currentY);
  currentY += 10;

  // Summary boxes
  const boxWidth = (pageWidth - 50) / 2;
  
  // Total Spent Box
  pdf.setFillColor(254, 226, 226);
  pdf.roundedRect(20, currentY, boxWidth, 25, 3, 3, 'F');
  pdf.setTextColor(220, 38, 38);
  addText('Total Gasto', 25, currentY + 8, 10, 'bold');
  pdf.setTextColor(0, 0, 0);
  addText(`R$ ${totalSpent.toFixed(2)}`, 25, currentY + 18, 14, 'bold');

  // Remaining Box
  pdf.setFillColor(220, 252, 231);
  pdf.roundedRect(30 + boxWidth, currentY, boxWidth, 25, 3, 3, 'F');
  pdf.setTextColor(22, 163, 74);
  addText('Disponível', 35 + boxWidth, currentY + 8, 10, 'bold');
  pdf.setTextColor(0, 0, 0);
  addText(`R$ ${remaining > 0 ? remaining.toFixed(2) : '0.00'}`, 35 + boxWidth, currentY + 18, 14, 'bold');

  currentY += 35;

  // Progress bar
  addText('Utilização do Orçamento:', 20, currentY, 11, 'bold');
  currentY += 8;
  
  // Progress bar background
  pdf.setFillColor(229, 231, 235);
  pdf.roundedRect(20, currentY, pageWidth - 40, 8, 2, 2, 'F');
  
  // Progress bar fill
  const progressWidth = ((pageWidth - 40) * Math.min(budgetProgress, 100)) / 100;
  const progressColor = budgetProgress < 50 ? [34, 197, 94] : budgetProgress < 75 ? [234, 179, 8] : [239, 68, 68];
  pdf.setFillColor(...progressColor);
  pdf.roundedRect(20, currentY, progressWidth, 8, 2, 2, 'F');
  
  pdf.setTextColor(0, 0, 0);
  addText(`${budgetProgress.toFixed(1)}%`, pageWidth - 40, currentY + 6, 10, 'bold');
  currentY += 18;

  // Status
  const status = budgetProgress < 50 ? 'Excelente controle!' : 
                 budgetProgress < 75 ? 'No caminho certo' : 
                 budgetProgress < 90 ? 'Atenção necessária' : 'Orçamento crítico';
  addText(`Status: ${status}`, 20, currentY, 11);
  currentY += 15;

  // ==================== EXPENSES BREAKDOWN ====================
  checkPageBreak(60);
  addText('Detalhamento de Gastos', 20, currentY, 14, 'bold');
  currentY += 8;
  addLine(currentY);
  currentY += 10;

  // Fixed expenses
  addText('Contas Fixas:', 20, currentY, 12, 'bold');
  currentY += 8;
  
  data.userData.fixedExpenses.forEach((expense) => {
    checkPageBreak(7);
    addText(`• ${expense.name}`, 25, currentY, 10);
    addText(`R$ ${expense.amount.toFixed(2)}`, pageWidth - 60, currentY, 10);
    currentY += 6;
  });
  
  currentY += 2;
  addText(`Subtotal Fixo: R$ ${totalFixedExpenses.toFixed(2)}`, 25, currentY, 11, 'bold');
  currentY += 12;

  // Variable expenses
  addText('Gastos Variáveis:', 20, currentY, 12, 'bold');
  currentY += 8;
  addText(`Total: R$ ${totalVariableExpenses.toFixed(2)}`, 25, currentY, 10);
  currentY += 6;
  addText(`Média diária: R$ ${dailyAverage.toFixed(2)}`, 25, currentY, 10);
  currentY += 6;
  addText(`Número de transações: ${data.expenses.length}`, 25, currentY, 10);
  currentY += 12;

  // ==================== CATEGORIES ====================
  checkPageBreak(80);
  addText('Análise por Categoria', 20, currentY, 14, 'bold');
  currentY += 8;
  addLine(currentY);
  currentY += 10;

  if (topCategories.length > 0) {
    topCategories.forEach(([category, amount], index) => {
      checkPageBreak(20);
      const percentage = (amount / totalVariableExpenses) * 100;
      
      addText(`${index + 1}. ${category}`, 20, currentY, 11, 'bold');
      addText(`R$ ${amount.toFixed(2)} (${percentage.toFixed(1)}%)`, pageWidth - 80, currentY, 11);
      currentY += 6;
      
      // Category bar
      pdf.setFillColor(229, 231, 235);
      pdf.roundedRect(25, currentY, pageWidth - 50, 5, 1, 1, 'F');
      
      const categoryBarWidth = ((pageWidth - 50) * percentage) / 100;
      pdf.setFillColor(168, 85, 247);
      pdf.roundedRect(25, currentY, categoryBarWidth, 5, 1, 1, 'F');
      
      currentY += 10;
    });
  } else {
    addText('Nenhuma categoria registrada neste período', 25, currentY, 10);
    currentY += 10;
  }

  currentY += 5;

  // ==================== GOALS ====================
  if (data.goals.length > 0) {
    checkPageBreak(60);
    addText('Metas Financeiras', 20, currentY, 14, 'bold');
    currentY += 8;
    addLine(currentY);
    currentY += 10;

    data.goals.forEach((goal) => {
      checkPageBreak(25);
      const progress = (goal.currentAmount / goal.targetAmount) * 100;
      const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      
      addText(goal.name, 20, currentY, 11, 'bold');
      currentY += 6;
      addText(`Progresso: R$ ${goal.currentAmount.toFixed(2)} de R$ ${goal.targetAmount.toFixed(2)}`, 25, currentY, 9);
      currentY += 5;
      addText(`Prazo: ${daysLeft > 0 ? `${daysLeft} dias restantes` : 'Vencido'}`, 25, currentY, 9);
      currentY += 6;
      
      // Progress bar
      pdf.setFillColor(229, 231, 235);
      pdf.roundedRect(25, currentY, pageWidth - 50, 5, 1, 1, 'F');
      
      const goalBarWidth = ((pageWidth - 50) * Math.min(progress, 100)) / 100;
      pdf.setFillColor(168, 85, 247);
      pdf.roundedRect(25, currentY, goalBarWidth, 5, 1, 1, 'F');
      
      addText(`${progress.toFixed(0)}%`, pageWidth - 40, currentY + 4, 9);
      currentY += 12;
    });
  }

  // ==================== INSIGHTS ====================
  checkPageBreak(80);
  addText('Insights e Recomendações', 20, currentY, 14, 'bold');
  currentY += 8;
  addLine(currentY);
  currentY += 10;

  const insights = [];

  if (budgetProgress < 50) {
    insights.push('✓ Parabéns! Você está com excelente controle financeiro.');
  } else if (budgetProgress > 90) {
    insights.push('⚠ Atenção: Você ultrapassou 90% do orçamento mensal.');
  }

  if (topCategories.length > 0) {
    const topCategory = topCategories[0];
    if ((topCategory[1] / data.userData.salary) > 0.3) {
      insights.push(`⚠ A categoria "${topCategory[0]}" representa ${((topCategory[1] / data.userData.salary) * 100).toFixed(0)}% do seu salário.`);
      insights.push('  → Considere buscar alternativas mais econômicas nesta categoria.');
    }
  }

  if (dailyAverage > 0) {
    const projectedMonthly = dailyAverage * 30;
    if (projectedMonthly < data.userData.salary * 0.8) {
      insights.push(`✓ No ritmo atual, você deve economizar R$ ${(data.userData.salary - projectedMonthly).toFixed(2)} este mês.`);
    }
  }

  if (remaining > data.userData.salary * 0.3) {
    insights.push('✓ Você ainda tem uma boa margem de segurança no orçamento.');
    insights.push('  → Considere destinar parte para uma reserva de emergência ou metas.');
  }

  if (data.goals.length === 0) {
    insights.push('💡 Dica: Defina metas financeiras para ter objetivos claros.');
  }

  insights.forEach((insight) => {
    checkPageBreak(8);
    pdf.setFont('helvetica', 'normal');
    const lines = pdf.splitTextToSize(insight, pageWidth - 50);
    lines.forEach((line: string) => {
      addText(line, 25, currentY, 10);
      currentY += 6;
    });
  });

  currentY += 10;

  // ==================== TRANSACTIONS ====================
  if (data.expenses.length > 0) {
    pdf.addPage();
    currentY = 20;
    
    addText('Histórico de Transações', 20, currentY, 14, 'bold');
    currentY += 8;
    addLine(currentY);
    currentY += 10;

    // Sort by date
    const sortedExpenses = [...data.expenses].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    sortedExpenses.forEach((expense, index) => {
      checkPageBreak(12);
      
      const date = new Date(expense.date).toLocaleDateString('pt-BR');
      addText(date, 20, currentY, 9);
      addText(expense.description, 50, currentY, 9);
      addText(expense.category, 120, currentY, 9);
      addText(`R$ ${expense.amount.toFixed(2)}`, pageWidth - 50, currentY, 9, 'bold');
      
      currentY += 8;
    });
  }

  // ==================== FOOTER ====================
  const totalPages = (pdf as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      `Página ${i} de ${totalPages} - Gerado por MeuBolsoRápido em ${new Date().toLocaleDateString('pt-BR')}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Save PDF
  const fileName = `MBR_Relatorio_${data.userData.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
}
