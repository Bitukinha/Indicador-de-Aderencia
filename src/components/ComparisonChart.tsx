import { DelayedOrder, MESES, type MesType } from "@/data/orders";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Props {
  orders: DelayedOrder[];
  noPrazo: Record<string, number>;
  activeMeses: MesType[];
  anos: number[];
}

export function ComparisonChart({ orders, noPrazo, activeMeses, anos }: Props) {
  // Comparison by month
  const monthData = activeMeses.map((mes) => {
    const monthOrders = orders.filter((o) => o.mes === mes);
    const np = noPrazo[mes] ?? 0;
    const atrasados = monthOrders.length;
    const total = np + atrasados;
    const aderencia = total > 0 ? parseFloat(((np / total) * 100).toFixed(1)) : 0;
    return { mes, noPrazo: np, atrasados, aderencia };
  });

  // Comparison by year (if multiple years)
  const yearData = anos.map((ano) => {
    const yearOrders = orders.filter((o) => o.ano === ano);
    const atrasados = yearOrders.length;
    // Sum noPrazo for all active months in this year
    const np = activeMeses.reduce((sum, mes) => {
      const key = `${mes}-${ano}`;
      return sum + (noPrazo[key] ?? noPrazo[mes] ?? 0);
    }, 0);
    const total = np + atrasados;
    const aderencia = total > 0 ? parseFloat(((np / total) * 100).toFixed(1)) : 0;
    return { ano: String(ano), noPrazo: np, atrasados, aderencia };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Month comparison */}
      <div className="bg-card rounded-lg shadow-sm p-5">
        <h3 className="font-semibold text-card-foreground mb-3 text-sm">Comparativo por Mês</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="noPrazo" name="No Prazo" fill="hsl(120, 55%, 35%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="atrasados" name="Atrasados" fill="hsl(0, 70%, 55%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Year comparison */}
      {anos.length > 1 && (
        <div className="bg-card rounded-lg shadow-sm p-5">
          <h3 className="font-semibold text-card-foreground mb-3 text-sm">Comparativo por Ano</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={yearData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="ano" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="noPrazo" name="No Prazo" fill="hsl(120, 55%, 35%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="atrasados" name="Atrasados" fill="hsl(0, 70%, 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Aderência comparison */}
      <div className={`bg-card rounded-lg shadow-sm p-5 ${anos.length <= 1 ? '' : 'md:col-span-2'}`}>
        <h3 className="font-semibold text-card-foreground mb-3 text-sm">Aderência por Mês (%)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Tooltip formatter={(val: number) => `${val}%`} />
            <Bar dataKey="aderencia" name="Aderência %" fill="hsl(45, 90%, 50%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
