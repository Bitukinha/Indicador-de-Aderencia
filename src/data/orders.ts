export const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
] as const;

export type MesType = typeof MESES[number];

export interface DelayedOrder {
  cliente: string;
  produto: string;
  quantidade: string;
  dataPrevista: string;
  dataEntregue: string;
  diasAtraso: number;
  motivo: string;
  mes: MesType;
  ano: number;
}

export const delayedOrders: DelayedOrder[] = [
  { cliente: "Vidara", produto: "Nutrigel-Pro", quantidade: "14.000", dataPrevista: "13/jan", dataEntregue: "14/jan", diasAtraso: 1, motivo: "Problemas na extrusora", mes: "Janeiro", ano: 2026 },
  { cliente: "Tectron", produto: "Nutrigel-Pro", quantidade: "14.000", dataPrevista: "13/jan", dataEntregue: "15/jan", diasAtraso: 2, motivo: "Problemas na extrusora", mes: "Janeiro", ano: 2026 },
  { cliente: "Suinobras", produto: "Nutrigel-Pro", quantidade: "14.000", dataPrevista: "14/jan", dataEntregue: "15/jan", diasAtraso: 1, motivo: "Problemas na extrusora", mes: "Janeiro", ano: 2026 },
  { cliente: "Vilomix", produto: "Nutrigel-Pro", quantidade: "14.000", dataPrevista: "27/jan", dataEntregue: "28/jan", diasAtraso: 1, motivo: "Problemas na extrusora", mes: "Janeiro", ano: 2026 },
  { cliente: "Heleng", produto: "Fubá Vitaminado", quantidade: "46.000", dataPrevista: "13/jan", dataEntregue: "14/jan", diasAtraso: 1, motivo: "Milho Sujo/Falta de Milho", mes: "Janeiro", ano: 2026 },
  { cliente: "Master", produto: "Pré Cozido", quantidade: "2.000.000", dataPrevista: "10/jan", dataEntregue: "22/jan", diasAtraso: 12, motivo: "Processo/alta demanda vale/falta de milho", mes: "Janeiro", ano: 2026 },
  { cliente: "Nuttria", produto: "Nutrigel-Pro", quantidade: "16.800", dataPrevista: "09/fev", dataEntregue: "10/fev", diasAtraso: 1, motivo: "Problema nos moinhos", mes: "Fevereiro", ano: 2026 },
  { cliente: "BRF", produto: "Nutrigel-Pro", quantidade: "32.000", dataPrevista: "09/fev", dataEntregue: "13/fev", diasAtraso: 4, motivo: "Necessidade de expurgar carg do estoque e tirar nova", mes: "Fevereiro", ano: 2026 },
  { cliente: "Furquim", produto: "D48", quantidade: "32.000", dataPrevista: "09/fev", dataEntregue: "10/fev", diasAtraso: 1, motivo: "Problema nos moinhos", mes: "Fevereiro", ano: 2026 },
  { cliente: "Vidara", produto: "Nutrigel-Pro", quantidade: "14.000", dataPrevista: "23/fev", dataEntregue: "24/fev", diasAtraso: 1, motivo: "Falta de Milho", mes: "Fevereiro", ano: 2026 },
  { cliente: "Furquim", produto: "D48", quantidade: "32.000", dataPrevista: "24/fev", dataEntregue: "25/fev", diasAtraso: 1, motivo: "Falta de Milho", mes: "Fevereiro", ano: 2026 },
  { cliente: "Mais Doce", produto: "Canjiquinha Fina", quantidade: "24.000", dataPrevista: "16/fev", dataEntregue: "", diasAtraso: 8, motivo: "Milho Sujo/Falta de Milho", mes: "Fevereiro", ano: 2026 },
  { cliente: "Heleng Haiti", produto: "Farinha Média", quantidade: "46.000", dataPrevista: "18/fev", dataEntregue: "", diasAtraso: 6, motivo: "Milho Sujo/Falta de Milho", mes: "Fevereiro", ano: 2026 },
];

export function getDelayDistribution(orders: DelayedOrder[]) {
  const ranges = { "1 dia": 0, "2-3 dias": 0, "4-7 dias": 0, "8+ dias": 0 };
  orders.forEach(o => {
    if (o.diasAtraso === 1) ranges["1 dia"]++;
    else if (o.diasAtraso <= 3) ranges["2-3 dias"]++;
    else if (o.diasAtraso <= 7) ranges["4-7 dias"]++;
    else ranges["8+ dias"]++;
  });
  return Object.entries(ranges).map(([name, value]) => ({ name, value }));
}

export function getReasonDistribution(orders: DelayedOrder[]) {
  const reasons: Record<string, number> = {};
  orders.forEach(o => {
    const key = o.motivo.length > 30 ? o.motivo.substring(0, 30) + "..." : o.motivo;
    reasons[key] = (reasons[key] || 0) + 1;
  });
  return Object.entries(reasons).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}
