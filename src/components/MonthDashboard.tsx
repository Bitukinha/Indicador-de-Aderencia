import type { DelayedOrder, MesType } from "@/data/orders";
import { KpiCard } from "@/components/KpiCard";
import { AdherenceGauge } from "@/components/AdherenceGauge";
import { DelayedOrdersTable } from "@/components/DelayedOrdersTable";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { Package, AlertTriangle, Clock, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const COLORS = ["#2f9e44", "#f59f00", "#2962a8", "#e03131"];

interface Props {
  mes: MesType;
  orders: DelayedOrder[];
  noPrazo: number;
  onNoPrazoChange: (value: number) => void;
  onEdit: (order: DelayedOrder, globalIndex: number) => void;
  onDelete: (globalIndex: number) => void;
  isAuthenticated: boolean;
}

export function MonthDashboard({ mes, orders: allOrders, noPrazo, onNoPrazoChange, onEdit, onDelete, isAuthenticated }: Props) {
  const monthOrders = allOrders.filter(o => o.mes === mes);
  const onTimeOrders = monthOrders.filter((o) => o.diasAtraso <= 0);
  const delayedOrders = monthOrders.filter((o) => o.diasAtraso > 0);

  const atrasados = delayedOrders.length;
  const total = noPrazo + atrasados;
  const aderencia = total > 0 ? (noPrazo / total) * 100 : 0;
  const mediaAtraso = delayedOrders.length > 0
    ? (delayedOrders.reduce((s, o) => s + o.diasAtraso, 0) / delayedOrders.length).toFixed(1)
    : "0";

  const maxAtraso = delayedOrders.length > 0 ? Math.max(...delayedOrders.map(o => o.diasAtraso)) : 0;
  const minAtraso = delayedOrders.length > 0 ? Math.min(...delayedOrders.map(o => o.diasAtraso)) : 0;

  const globalIndices = allOrders
    .map((o, i) => ({ order: o, index: i }))
    .filter(({ order }) => order.mes === mes);

  const onTimeGlobalIndices = globalIndices.filter(({ order }) => order.diasAtraso <= 0).map(({ index }) => index);
  const delayedGlobalIndices = globalIndices.filter(({ order }) => order.diasAtraso > 0).map(({ index }) => index);

  const delayRanges = { "No Prazo": 0, "1 dia": 0, "2-3 dias": 0, "4-7 dias": 0, "8+ dias": 0 };
  monthOrders.forEach(o => {
    if (o.diasAtraso <= 0) delayRanges["No Prazo"]++;
    else if (o.diasAtraso === 1) delayRanges["1 dia"]++;
    else if (o.diasAtraso <= 3) delayRanges["2-3 dias"]++;
    else if (o.diasAtraso <= 7) delayRanges["4-7 dias"]++;
    else delayRanges["8+ dias"]++;
  });
  const delayDist = Object.entries(delayRanges).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);

  const reasons: Record<string, number> = {};
  monthOrders.forEach(o => {
    const key = o.motivo.length > 35 ? o.motivo.substring(0, 35) + "..." : o.motivo;
    reasons[key] = (reasons[key] || 0) + 1;
  });
  const reasonDist = Object.entries(reasons).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">{mes}</h2>
        {isAuthenticated && (
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground whitespace-nowrap">Pedidos no prazo:</Label>
            <Input
              type="number"
              min={0}
              value={noPrazo}
              onChange={(e) => onNoPrazoChange(Number(e.target.value))}
              className="w-20 h-8 text-sm"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <KpiCard title="Total de Pedidos" value={total} icon={<Package size={22} />} />
        <KpiCard title="No Prazo" value={noPrazo} subtitle={`${aderencia.toFixed(1)}% aderência`} variant="success" icon={<TrendingUp size={22} />} />
        <KpiCard title="Atrasados" value={atrasados} subtitle={`${(100 - aderencia).toFixed(1)}% do total`} variant="danger" icon={<AlertTriangle size={22} />} />
        <KpiCard title="Média Atraso" value={`${mediaAtraso} dias`} variant="warning" icon={<Clock size={22} />} />
        <KpiCard title="Máximo Atraso" value={`${maxAtraso} dias`} variant="destructive" icon={<AlertTriangle size={22} />} />
        <KpiCard title="Mínimo Atraso" value={`${minAtraso} dias`} variant="default" icon={<Clock size={22} />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AdherenceGauge label={`Aderência ${mes}`} rate={aderencia} noPrazo={noPrazo} total={total} />

        <div className="bg-card rounded-lg shadow-sm p-5">
          <h3 className="font-semibold text-card-foreground mb-3 text-sm">Dias de Atraso</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={delayDist} cx="50%" cy="50%" outerRadius={65} innerRadius={35} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {delayDist.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg shadow-sm p-5">
          <h3 className="font-semibold text-card-foreground mb-3 text-sm">Motivos</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={reasonDist} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 9 }} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <DelayedOrdersTable
        title="Pedidos no Prazo"
        orders={onTimeOrders}
        globalIndices={onTimeGlobalIndices}
        onEdit={onEdit}
        onDelete={onDelete}
        isAuthenticated={isAuthenticated}
      />

      <DelayedOrdersTable
        title="Pedidos Atrasados"
        orders={delayedOrders}
        globalIndices={delayedGlobalIndices}
        onEdit={onEdit}
        onDelete={onDelete}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}
