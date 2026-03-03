interface AdherenceGaugeProps {
  label: string;
  rate: number;
  noPrazo: number;
  total: number;
}

export function AdherenceGauge({ label, rate, noPrazo, total }: AdherenceGaugeProps) {
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (rate / 100) * circumference;
  const color = rate >= 90 ? "hsl(var(--accent))" : rate >= 75 ? "hsl(var(--warning))" : "hsl(var(--destructive))";

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm flex flex-col items-center">
      <p className="text-sm font-semibold text-muted-foreground mb-4">{label}</p>
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
          <circle
            cx="60" cy="60" r="54" fill="none"
            stroke={color} strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-card-foreground">{rate.toFixed(1)}%</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-3">{noPrazo} de {total} no prazo</p>
    </div>
  );
}
