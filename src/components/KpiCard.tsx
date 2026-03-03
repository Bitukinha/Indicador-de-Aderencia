import { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}

const variantStyles = {
  default: "border-l-primary",
  success: "border-l-accent",
  warning: "border-l-warning",
  danger: "border-l-destructive",
};

export function KpiCard({ title, value, subtitle, icon, variant = "default" }: KpiCardProps) {
  return (
    <div className={`bg-card rounded-lg p-5 shadow-sm border-l-4 ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1 text-card-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
    </div>
  );
}
