import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Filter } from "lucide-react";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  filterProduto: string;
  onFilterProdutoChange: (v: string) => void;
  filterMotivo: string;
  onFilterMotivoChange: (v: string) => void;
  produtos: string[];
  motivos: string[];
}

export function Filters({
  search, onSearchChange,
  filterProduto, onFilterProdutoChange,
  filterMotivo, onFilterMotivoChange,
  produtos, motivos,
}: Props) {
  return (
    <div className="bg-card rounded-lg shadow-sm p-4 flex flex-wrap items-end gap-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Filter size={16} />
        <span className="text-sm font-medium">Filtros</span>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Buscar</Label>
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cliente, produto..."
            className="pl-8 h-9 w-48 text-sm"
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Produto</Label>
        <select
          value={filterProduto}
          onChange={(e) => onFilterProdutoChange(e.target.value)}
          className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Todos</option>
          {produtos.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Motivo</Label>
        <select
          value={filterMotivo}
          onChange={(e) => onFilterMotivoChange(e.target.value)}
          className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Todos</option>
          {motivos.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
    </div>
  );
}
