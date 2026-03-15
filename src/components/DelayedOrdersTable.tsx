import { DelayedOrder } from "@/data/orders";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  orders: DelayedOrder[];
  globalIndices: number[];
  onEdit: (order: DelayedOrder, globalIndex: number) => void;
  onDelete: (globalIndex: number) => void;
  isAuthenticated: boolean;
  title?: string;
}

export function DelayedOrdersTable({ orders, globalIndices, onEdit, onDelete, isAuthenticated, title }: Props) {
  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden">
      <div className="p-5 border-b">
        <h3 className="font-semibold text-card-foreground">{title ?? "Pedidos"}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="text-left p-3 font-medium text-muted-foreground">Cliente</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Produto</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Qtd</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Prevista</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Entregue</th>
              <th className="text-center p-3 font-medium text-muted-foreground">Dias Atraso</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Motivo</th>
              {isAuthenticated && <th className="text-center p-3 font-medium text-muted-foreground">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={isAuthenticated ? 8 : 7} className="p-6 text-center text-muted-foreground">Nenhum pedido encontrado</td>
              </tr>
            )}
            {orders.map((o, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                <td className="p-3 text-card-foreground font-medium">{o.cliente}</td>
                <td className="p-3 text-card-foreground">{o.produto}</td>
                <td className="p-3 text-right text-card-foreground">{o.quantidade}</td>
                <td className="p-3 text-card-foreground">{o.dataPrevista}</td>
                <td className="p-3 text-card-foreground">{o.dataEntregue || "—"}</td>
                <td className="p-3 text-center">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                    o.diasAtraso <= 1 ? "bg-accent/15 text-accent" :
                    o.diasAtraso <= 3 ? "bg-warning/15 text-warning" :
                    "bg-destructive/15 text-destructive"
                  }`}>
                    {o.diasAtraso}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground text-xs">{o.motivo}</td>
                {isAuthenticated && (
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(o, globalIndices[i])} title="Editar">
                        <Pencil size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(globalIndices[i])} title="Excluir">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
