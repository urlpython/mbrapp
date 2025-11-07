import { useState } from 'react';
import { motion } from 'motion/react';
import { UserData } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowRight, X, Plus, Sparkles } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: UserData) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<'splash' | 'name' | 'salary' | 'expenses'>('splash');
  const [name, setName] = useState('');
  const [salary, setSalary] = useState('');
  const [fixedExpenses, setFixedExpenses] = useState<Array<{ name: string; amount: string }>>([
    { name: '', amount: '' }
  ]);

  const addFixedExpense = () => {
    setFixedExpenses([...fixedExpenses, { name: '', amount: '' }]);
  };

  const removeFixedExpense = (index: number) => {
    setFixedExpenses(fixedExpenses.filter((_, i) => i !== index));
  };

  const updateFixedExpense = (index: number, field: 'name' | 'amount', value: string) => {
    const updated = [...fixedExpenses];
    updated[index][field] = value;
    setFixedExpenses(updated);
  };

  const handleComplete = () => {
    const validExpenses = fixedExpenses.filter(exp => exp.name && exp.amount);
    
    onComplete({
      name,
      salary: parseFloat(salary.replace(',', '.')),
      fixedExpenses: validExpenses.map(exp => ({
        name: exp.name,
        amount: parseFloat(exp.amount.replace(',', '.'))
      }))
    });
  };

  const canProceedName = name.trim().length > 0;
  const canProceedSalary = salary && parseFloat(salary.replace(',', '.')) > 0;
  const canComplete = fixedExpenses.some(exp => exp.name && exp.amount);

  // Splash Screen
  if (step === 'splash') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-white dark:bg-black transition-colors">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md"
        >
          {/* Card with perspective */}
          <div className="relative mb-16" style={{ perspective: '1000px' }}>
            <motion.div
              initial={{ rotateX: 20, y: 50, opacity: 0 }}
              animate={{ rotateX: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
              className="relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Card Shadow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl blur-3xl" />
              
              {/* Main Card */}
              <div className="relative bg-gradient-to-br from-[#7c3aed] via-[#a855f7] to-[#d946ef] rounded-3xl p-8 aspect-[1.6/1] flex flex-col justify-between">
                {/* Card Top */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-purple-200/80 text-sm mb-1">MeuBolso</p>
                    <p className="text-white">Rápido</p>
                  </div>
                  <Sparkles className="w-8 h-8 text-white/90" />
                </div>

                {/* Card Number (stylized) */}
                <div className="flex gap-3 text-white/90">
                  <span>••••</span>
                  <span>••••</span>
                  <span>••••</span>
                  <span>••••</span>
                </div>

                {/* Card Bottom */}
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-purple-200/70 text-xs mb-1">Controle Total</p>
                    <p className="text-white text-sm">Do Seu Bolso</p>
                  </div>
                  <div className="w-12 h-8 rounded bg-white/20 backdrop-blur-sm" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Text Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-gray-900 dark:text-white mb-3">Simplifique Sua Vida Financeira</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Descubra quanto você pode gastar hoje sem ferrar seu mês. Rápido, visual e sem complicação.
            </p>
          </motion.div>

          {/* Get Started Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              onClick={() => setStep('name')}
              className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl"
            >
              Começar
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Form Steps
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white dark:bg-black transition-colors">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-md"
      >
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {['name', 'salary', 'expenses'].map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                (step === 'name' && i === 0) || 
                (step === 'salary' && i <= 1) || 
                (step === 'expenses' && i <= 2)
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                  : 'bg-gray-200 dark:bg-gray-800'
              }`}
            />
          ))}
        </div>

        {/* Step: Name */}
        {step === 'name' && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-gray-900 dark:text-white mb-2">Como podemos te chamar?</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Seu nome ou apelido</p>
            </div>
            
            <div>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome"
                className="bg-gray-100 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white h-14 rounded-2xl placeholder:text-gray-400 dark:placeholder:text-gray-600"
                autoFocus
              />
            </div>

            <Button
              onClick={() => setStep('salary')}
              disabled={!canProceedName}
              className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl disabled:opacity-50"
            >
              Continuar
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}

        {/* Step: Salary */}
        {step === 'salary' && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-white mb-2">Qual é o seu salário?</h2>
              <p className="text-gray-400 text-sm">Seu salário ou renda mensal</p>
            </div>
            
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
              <Input
                type="number"
                step="0.01"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="0,00"
                className="bg-gray-900/50 border-gray-800 text-white h-14 rounded-2xl pl-12 placeholder:text-gray-600"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep('name')}
                variant="outline"
                className="flex-1 h-14 border-gray-800 text-white hover:bg-gray-900 rounded-2xl"
              >
                Voltar
              </Button>
              <Button
                onClick={() => setStep('expenses')}
                disabled={!canProceedSalary}
                className="flex-1 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl disabled:opacity-50"
              >
                Continuar
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step: Expenses */}
        {step === 'expenses' && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-white mb-2">Suas contas fixas</h2>
              <p className="text-gray-400 text-sm">Aluguel, internet, streaming, etc.</p>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {fixedExpenses.map((expense, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="text"
                    value={expense.name}
                    onChange={(e) => updateFixedExpense(index, 'name', e.target.value)}
                    placeholder="Nome da conta"
                    className="bg-gray-900/50 border-gray-800 text-white h-12 rounded-xl flex-1 placeholder:text-gray-600"
                  />
                  <div className="relative w-28">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">R$</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={expense.amount}
                      onChange={(e) => updateFixedExpense(index, 'amount', e.target.value)}
                      placeholder="0"
                      className="bg-gray-900/50 border-gray-800 text-white h-12 rounded-xl pl-9 placeholder:text-gray-600"
                    />
                  </div>
                  {fixedExpenses.length > 1 && (
                    <Button
                      onClick={() => removeFixedExpense(index)}
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-red-400 hover:bg-gray-900 rounded-xl"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={addFixedExpense}
              variant="outline"
              className="w-full h-12 border-gray-800 text-purple-400 hover:bg-gray-900 rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar outra conta
            </Button>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep('salary')}
                variant="outline"
                className="flex-1 h-14 border-gray-800 text-white hover:bg-gray-900 rounded-2xl"
              >
                Voltar
              </Button>
              <Button
                onClick={handleComplete}
                disabled={!canComplete}
                className="flex-1 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl disabled:opacity-50"
              >
                Finalizar
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
