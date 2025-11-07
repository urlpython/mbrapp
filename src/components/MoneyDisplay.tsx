interface MoneyDisplayProps {
  value: number;
  className?: string;
  prefix?: string;
}

export function MoneyDisplay({ value, className, prefix = 'R$' }: MoneyDisplayProps) {
  return (
    <span className={className} translate="no">
      {prefix} {value.toFixed(2).replace('.', ',')}
    </span>
  );
}
