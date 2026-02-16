import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { Building2, CheckCircle2, Lock, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const emailSchema = z.string().email({ message: "E-mail inválido" });
const passwordSchema = z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" });

const benefits = [
  "Gerenciamento completo de imóveis",
  "Fluxo de atendimento e cadastro",
  "Demo pronta para apresentação comercial",
];

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/admin");
    });
  }, [navigate]);

  const validateInputs = () => {
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
      return false;
    }
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Login realizado com sucesso.");
      navigate("/admin");
    }
    setLoading(false);
  };

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Conta criada com sucesso. Você já pode fazer login.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#0f172a_0%,#111827_52%,#1e293b_100%)] px-4 py-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <section className="rounded-[28px] border border-white/15 bg-white/8 p-7 text-white backdrop-blur md:p-9">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-slate-900 shadow-[0_12px_26px_rgba(251,146,60,0.35)]">
            <Building2 className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight">
            Acesse o painel da <span className="text-amber-300">Imobiflow</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/80 md:text-base">
            Ambiente administrativo para cadastro de imóveis, organização de estoque e demonstração
            profissional do seu produto imobiliário.
          </p>

          <div className="mt-7 space-y-3">
            {benefits.map((item) => (
              <p key={item} className="flex items-start gap-2 text-sm text-white/88">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-amber-300" />
                {item}
              </p>
            ))}
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/65">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-300" />
                Segurança
              </p>
              <p className="mt-2 text-sm text-white/85">Autenticação via Supabase com controle de sessão.</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/65">
                <Lock className="h-3.5 w-3.5 text-amber-300" />
                Demo pronta
              </p>
              <p className="mt-2 text-sm text-white/85">Acesse e gerencie o conteúdo para demonstrações.</p>
            </div>
          </div>
        </section>

        <Card className="border border-white/20 bg-slate-900/78 text-white shadow-[0_24px_44px_rgba(2,6,23,0.42)] backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Bem-vindo</CardTitle>
            <CardDescription className="text-white/75">
              Entre com sua conta ou crie um novo acesso para a área administrativa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid h-12 w-full grid-cols-2 rounded-xl border border-white/15 bg-slate-800/70 p-1">
                <TabsTrigger
                  value="login"
                  className="rounded-lg text-sm font-semibold text-white/75 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                >
                  Entrar
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-lg text-sm font-semibold text-white/75 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                >
                  Cadastrar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-5">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-white/85">
                      E-mail
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      className="h-12 rounded-xl border-white/15 bg-slate-950/55 text-white placeholder:text-white/50 focus-visible:ring-amber-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-white/85">
                      Senha
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="********"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      className="h-12 rounded-xl border-white/15 bg-slate-950/55 text-white placeholder:text-white/50 focus-visible:ring-amber-300"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="h-12 w-full rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 font-semibold text-slate-900 hover:from-amber-300 hover:via-orange-400 hover:to-amber-400"
                    disabled={loading}
                  >
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-5">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white/85">
                      E-mail
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      className="h-12 rounded-xl border-white/15 bg-slate-950/55 text-white placeholder:text-white/50 focus-visible:ring-amber-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white/85">
                      Senha
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="********"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      className="h-12 rounded-xl border-white/15 bg-slate-950/55 text-white placeholder:text-white/50 focus-visible:ring-amber-300"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="h-12 w-full rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 font-semibold text-slate-900 hover:from-amber-300 hover:via-orange-400 hover:to-amber-400"
                    disabled={loading}
                  >
                    {loading ? "Criando conta..." : "Criar conta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
