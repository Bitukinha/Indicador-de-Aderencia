import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import nutrimilhoLogo from "@/assets/nutrimilho-logo.png";

export default function Login() {
  const { user, loading, signIn, isAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Carregando...</p></div>;
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error } = await signIn(email, password);
    if (error) setError("Email ou senha inválidos");
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3">
          <img src={nutrimilhoLogo} alt="Nutrimilho" className="h-12 object-contain" />
          <h1 className="text-xl font-bold text-foreground">Indicador de Aderência</h1>
          <p className="text-sm text-muted-foreground">Faça login para acessar o sistema</p>
          <p className="text-xs text-muted-foreground">Usuário admin: <code>jeannovaes040@gmail.com</code> / Senha: <code>Je@97038303</code></p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow-sm p-6 space-y-4 border">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required />
          </div>
          <div className="space-y-1.5">
            <Label>Senha</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full gap-2" disabled={submitting}>
            <LogIn size={16} /> {submitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <p className="text-xs text-center text-muted-foreground">
          © 2026 Nutrimilho - Indicador de Aderência (Novaes Tech) | Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
