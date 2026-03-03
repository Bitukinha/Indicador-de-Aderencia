import { useState, useMemo, useEffect } from "react";
import { MonthDashboard } from "@/components/MonthDashboard";
import { ComparisonChart } from "@/components/ComparisonChart";
import { Filters } from "@/components/Filters";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Download, Plus, PlusCircle, X, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { exportToPdf } from "@/utils/exportPdf";
import { delayedOrders as initialOrders, type DelayedOrder, MESES, type MesType } from "@/data/orders";
import { supabase } from "@/integrations/supabase/client";
import { OrderFormDialog } from "@/components/OrderFormDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import nutrimilhoLogo from "@/assets/nutrimilho-logo.png";

const Index = () => {
  const { user, signOut } = useAuth();
  const isAuthenticated = !!user;

  const [exporting, setExporting] = useState(false);
  const [orders, setOrders] = useState<DelayedOrder[]>(initialOrders);
  const [activeMeses, setActiveMeses] = useState<MesType[]>(["Janeiro", "Fevereiro"]);
  const [selectedAno, setSelectedAno] = useState<number>(2026);
  const [noPrazo, setNoPrazo] = useState<Record<string, number>>({ Janeiro: 44, Fevereiro: 28 });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<{ order: DelayedOrder; index: number } | null>(null);
  const [addMonthOpen, setAddMonthOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [filterProduto, setFilterProduto] = useState("");
  const [filterMotivo, setFilterMotivo] = useState("");

  const anos = useMemo(() => [...new Set(orders.map(o => o.ano))].sort(), [orders]);
  const availableMeses = MESES.filter((m) => !activeMeses.includes(m));

  // Filtered orders
  const filteredOrders = useMemo(() => {
    let result = orders.filter(o => o.ano === selectedAno);
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(o => o.cliente.toLowerCase().includes(s) || o.produto.toLowerCase().includes(s));
    }
    if (filterProduto) result = result.filter(o => o.produto === filterProduto);
    if (filterMotivo) result = result.filter(o => o.motivo === filterMotivo);
    return result;
  }, [orders, selectedAno, search, filterProduto, filterMotivo]);

  const produtos = useMemo(() => [...new Set(orders.map(o => o.produto))].sort(), [orders]);
  const motivos = useMemo(() => [...new Set(orders.map(o => o.motivo))].sort(), [orders]);

  const handleExport = async () => {
    setExporting(true);
    try { await exportToPdf(); } finally { setExporting(false); }
  };

  const handleAdd = (order: DelayedOrder) => {
    setOrders((prev) => [...prev, order]);
    if (!activeMeses.includes(order.mes)) {
      setActiveMeses((prev) => [...prev, order.mes].sort((a, b) => MESES.indexOf(a) - MESES.indexOf(b)));
      setNoPrazo((prev) => ({ ...prev, [order.mes]: prev[order.mes] ?? 0 }));
    }
  };

  useEffect(() => {
    // If Supabase is configured, try to fetch orders from the `delayed_orders` table
    if (import.meta.env.VITE_SUPABASE_URL) {
      (async () => {
        try {
          const { data, error } = await supabase.from("delayed_orders").select("*");
          if (!error && data) {
            // map rows to DelayedOrder shape if necessary
            const rows = data.map((r: any) => ({
              cliente: r.cliente,
              produto: r.produto,
              quantidade: r.quantidade,
              dataPrevista: r.dataPrevista,
              dataEntregue: r.dataEntregue,
              diasAtraso: Number(r.diasAtraso) || 0,
              motivo: r.motivo || "",
              mes: r.mes as MesType,
              ano: Number(r.ano) || 2026,
            } as DelayedOrder));
            setOrders(rows);
          }
        } catch (e) {
          // ignore and keep initial data
        }
      })();
    }
  }, []);

  const handleEdit = (order: DelayedOrder) => {
    if (editingOrder === null) return;
    setOrders((prev) => prev.map((o, i) => (i === editingOrder.index ? order : o)));
    setEditingOrder(null);
  };

  const handleDelete = (index: number) => {
    setOrders((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNoPrazoChange = (mes: MesType, value: number) => {
    setNoPrazo((prev) => ({ ...prev, [mes]: value }));
  };

  const openEdit = (order: DelayedOrder, globalIndex: number) => {
    setEditingOrder({ order, index: globalIndex });
  };

  const addMonth = (mes: MesType) => {
    setActiveMeses((prev) => [...prev, mes].sort((a, b) => MESES.indexOf(a) - MESES.indexOf(b)));
    setNoPrazo((prev) => ({ ...prev, [mes]: prev[mes] ?? 0 }));
    setAddMonthOpen(false);
  };

  const removeMonth = (mes: MesType) => {
    if (activeMeses.length <= 1) return;
    setActiveMeses((prev) => prev.filter((m) => m !== mes));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={nutrimilhoLogo} alt="Nutrimilho" className="h-10 object-contain" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Indicador de Aderência</h1>
                <p className="text-sm text-muted-foreground">Acompanhamento de entregas</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {/* Year selector */}
              <select
                value={selectedAno}
                onChange={(e) => setSelectedAno(Number(e.target.value))}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {anos.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              {isAuthenticated && (
                <Button onClick={() => setDialogOpen(true)} className="gap-2" size="sm">
                  <Plus size={16} /> Novo Pedido
                </Button>
              )}
              <Button variant="outline" onClick={handleExport} disabled={exporting} className="gap-2" size="sm">
                <Download size={16} />
                {exporting ? "Gerando..." : "PDF"}
              </Button>
              {isAuthenticated ? (
                <Button onClick={signOut} size="sm">Sair</Button>
              ) : (
                <Link to="/login">
                  <Button size="sm">Entrar</Button>
                </Link>
              )}
            </div>
          </div>

          {/* Filters */}
          <Filters
            search={search} onSearchChange={setSearch}
            filterProduto={filterProduto} onFilterProdutoChange={setFilterProduto}
            filterMotivo={filterMotivo} onFilterMotivoChange={setFilterMotivo}
            produtos={produtos} motivos={motivos}
          />

          {/* Month tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {activeMeses.map((mes) => (
              <Badge key={mes} variant="secondary" className="text-sm px-3 py-1.5 gap-1.5">
                {mes}
                {activeMeses.length > 1 && (
                  <button onClick={() => removeMonth(mes)} className="ml-1 hover:text-destructive transition-colors">
                    <X size={12} />
                  </button>
                )}
              </Badge>
            ))}
            {availableMeses.length > 0 && (
              <div className="relative">
                <Button variant="ghost" size="sm" onClick={() => setAddMonthOpen(!addMonthOpen)} className="gap-1 text-muted-foreground">
                  <PlusCircle size={14} /> Adicionar mês
                </Button>
                {addMonthOpen && (
                  <div className="absolute top-full left-0 mt-1 z-50 bg-popover border rounded-md shadow-md p-1 min-w-[140px] max-h-60 overflow-y-auto">
                    {availableMeses.map((mes) => (
                      <button
                        key={mes}
                        onClick={() => addMonth(mes)}
                        className="w-full text-left px-3 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        {mes}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Comparison charts */}
          {activeMeses.length >= 2 && (
            <div data-pdf-section="comparativo">
              <h2 className="text-lg font-bold text-foreground mb-3">Comparativo</h2>
              <ComparisonChart orders={filteredOrders} noPrazo={noPrazo} activeMeses={activeMeses} anos={anos} />
            </div>
          )}

          {/* Month dashboards */}
          {activeMeses.map((mes) => (
            <div key={mes} data-pdf-section={mes.toLowerCase()}>
              <MonthDashboard
                mes={mes}
                orders={filteredOrders}
                noPrazo={noPrazo[mes] ?? 0}
                onNoPrazoChange={(v) => handleNoPrazoChange(mes, v)}
                onEdit={openEdit}
                onDelete={handleDelete}
                isAuthenticated={isAuthenticated}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        © 2026 Nutrimilho - Indicador de Aderência (Novaes Tech) | Todos os direitos reservados
      </footer>

      {/* Dialogs */}
      {isAuthenticated && (
        <>
          <OrderFormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={handleAdd} />
          <OrderFormDialog open={editingOrder !== null} onClose={() => setEditingOrder(null)} onSave={handleEdit} order={editingOrder?.order} />
        </>
      )}
    </div>
  );
};

export default Index;
