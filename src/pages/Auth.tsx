import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import {
  Building2,
  CheckCircle2,
  Clock3,
  Lock,
  MailCheck,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import TurnstileWidget from "@/components/TurnstileWidget";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MIN_SIGNUP_FILL_MS,
  OTP_ALLOWED_LENGTHS,
  OTP_MAX_LENGTH,
  RESEND_COOLDOWN_MS,
  formatAuthError,
  formatDuration,
  getPasswordRuleResults,
  getSignupRateLimit,
  getStrongPasswordError,
  isAllowedOtpLength,
  normalizeOtp,
  registerSignupAttempt,
  resetSignupAttempts,
} from "@/lib/authSecurity";

const emailSchema = z.string().email({ message: "E-mail inválido" });
const loginPasswordSchema = z.string().min(1, { message: "Informe sua senha" });

const benefits = [
  "Painel simples para anunciar e organizar seus imóveis",
  "Acompanhamento de atendimentos e cadastros em um só lugar",
  "Acesso protegido com confirmação por e-mail",
];

type AuthTab = "login" | "signup";
type SignupStep = "form" | "verify";

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() ?? "";
const captchaEnabled = Boolean(turnstileSiteKey);

const Auth = () => {
  const navigate = useNavigate();
  const signupRedirectUrl = typeof window !== "undefined" ? `${window.location.origin}/auth` : "";
  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(Date.now());

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupOtp, setSignupOtp] = useState("");
  const [signupStep, setSignupStep] = useState<SignupStep>("form");
  const [signupStartedAt, setSignupStartedAt] = useState(Date.now());
  const [signupSentAt, setSignupSentAt] = useState<number | null>(null);
  const [honeypot, setHoneypot] = useState("");

  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaNonce, setCaptchaNonce] = useState(0);

  const passwordRuleResults = getPasswordRuleResults(signupPassword);
  const resendRemainingMs = signupSentAt ? Math.max(0, signupSentAt + RESEND_COOLDOWN_MS - now) : 0;

  useEffect(() => {
    const syncSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      if (!session.user.email_confirmed_at) {
        await supabase.auth.signOut();
        return;
      }

      navigate("/admin");
    };

    void syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (!session) return;

      if (!session.user.email_confirmed_at) {
        await supabase.auth.signOut();
        return;
      }

      navigate("/admin");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (signupStep !== "verify" || resendRemainingMs <= 0) return;

    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [signupStep, resendRemainingMs]);

  useEffect(() => {
    if (activeTab === "signup" && signupStep === "form") {
      setSignupStartedAt(Date.now());
    }
  }, [activeTab, signupStep]);

  const resetCaptcha = () => {
    setCaptchaToken("");
    setCaptchaNonce((current) => current + 1);
  };

  const resetSignupFlow = (email = signupEmail) => {
    setSignupEmail(email);
    setSignupPassword("");
    setSignupConfirmPassword("");
    setSignupOtp("");
    setSignupStep("form");
    setSignupStartedAt(Date.now());
    setSignupSentAt(null);
    setHoneypot("");
    resetCaptcha();
  };

  const validateLoginInputs = () => {
    try {
      emailSchema.parse(loginEmail.trim());
      loginPasswordSchema.parse(loginPassword);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
      return false;
    }
  };

  const validateSignupInputs = () => {
    try {
      emailSchema.parse(signupEmail.trim());
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
      return false;
    }

    if (honeypot.trim()) {
      toast.error("Não foi possível validar o cadastro.");
      return false;
    }

    if (Date.now() - signupStartedAt < MIN_SIGNUP_FILL_MS) {
      toast.error("Preencha o cadastro com calma e tente novamente em alguns segundos.");
      return false;
    }

    if (signupPassword !== signupConfirmPassword) {
      toast.error("As senhas precisam ser iguais.");
      return false;
    }

    const passwordError = getStrongPasswordError(signupPassword, signupEmail);
    if (passwordError) {
      toast.error(passwordError);
      return false;
    }

    const rateLimit = getSignupRateLimit();
    if (rateLimit.blocked) {
      toast.error(`Muitas tentativas de cadastro. Aguarde ${formatDuration(rateLimit.retryAfterMs)}.`);
      return false;
    }

    if (captchaEnabled && !captchaToken) {
      toast.error("Conclua a verificação anti-bot antes de continuar.");
      return false;
    }

    return true;
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    if (!validateLoginInputs()) return;

    setLoading(true);

    const normalizedEmail = loginEmail.trim();
    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: loginPassword,
    });

    if (error) {
      if (/email not confirmed/i.test(error.message)) {
        setActiveTab("signup");
        setSignupEmail(normalizedEmail);
        setSignupStep("verify");
        setSignupOtp("");
        setSignupSentAt(null);
      }

      toast.error(formatAuthError(error.message));
    } else {
      toast.success("Login realizado com sucesso.");
      navigate("/admin");
    }

    setLoading(false);
  };

  const handleSignup = async (event: FormEvent) => {
    event.preventDefault();
    if (!validateSignupInputs()) return;

    setLoading(true);
    registerSignupAttempt();

    const normalizedEmail = signupEmail.trim();
    const currentCaptchaToken = captchaToken || undefined;
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: signupPassword,
      options: {
        emailRedirectTo: signupRedirectUrl,
        captchaToken: currentCaptchaToken,
      },
    });

    resetCaptcha();

    if (error) {
      toast.error(formatAuthError(error.message));
      setLoading(false);
      return;
    }

    if (data.session) {
      await supabase.auth.signOut();
      toast.error("Ative a confirmação de e-mail no Supabase para exigir o código antes de liberar o acesso.");
      setLoading(false);
      return;
    }

    setSignupEmail(normalizedEmail);
    setSignupPassword("");
    setSignupConfirmPassword("");
    setSignupOtp("");
    setSignupStep("verify");
    setSignupSentAt(Date.now());
    setNow(Date.now());

    toast.success("Código enviado para o seu e-mail. Digite-o para concluir o cadastro.");
    setLoading(false);
  };

  const handleVerifySignup = async (event: FormEvent) => {
    event.preventDefault();

    const token = normalizeOtp(signupOtp);
    if (!isAllowedOtpLength(token)) {
      toast.error(`Informe o código completo enviado para o e-mail (${OTP_ALLOWED_LENGTHS.join(" ou ")} dígitos).`);
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email: signupEmail.trim(),
      token,
      type: "signup",
    });

    if (error) {
      toast.error(formatAuthError(error.message));
    } else {
      resetSignupAttempts();
      toast.success("E-mail confirmado com sucesso.");
      navigate("/admin");
    }

    setLoading(false);
  };

  const handleResendCode = async () => {
    if (resendRemainingMs > 0) return;

    const rateLimit = getSignupRateLimit();
    if (rateLimit.blocked) {
      toast.error(`Muitas tentativas de cadastro. Aguarde ${formatDuration(rateLimit.retryAfterMs)}.`);
      return;
    }

    if (captchaEnabled && !captchaToken) {
      toast.error("Conclua a verificação anti-bot para reenviar o código.");
      return;
    }

    setLoading(true);
    registerSignupAttempt();

    const currentCaptchaToken = captchaToken || undefined;
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: signupEmail.trim(),
      options: {
        emailRedirectTo: signupRedirectUrl,
        captchaToken: currentCaptchaToken,
      },
    });

    resetCaptcha();

    if (error) {
      toast.error(formatAuthError(error.message));
    } else {
      setSignupSentAt(Date.now());
      setNow(Date.now());
      toast.success("Enviamos um novo código para o seu e-mail.");
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
          <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl">
            Acesse o painel da <span className="text-amber-300">Imobiflow</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/80 md:text-base">
            Tudo em um só painel para você cadastrar, acompanhar e gerenciar seus imóveis com praticidade.
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
                Acesso protegido
              </p>
              <p className="mt-2 text-sm text-white/85">
                Seu e-mail é confirmado antes de liberar o uso da conta.
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/65">
                <Lock className="h-3.5 w-3.5 text-amber-300" />
                Cadastro monitorado
              </p>
              <p className="mt-2 text-sm text-white/85">
                Validações automáticas ajudam a manter o ambiente confiável.
              </p>
            </div>
          </div>
        </section>

        <Card className="border border-white/20 bg-slate-900/78 text-white shadow-[0_24px_44px_rgba(2,6,23,0.42)] backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Bem-vindo</CardTitle>
            <CardDescription className="text-white/75">
              Entre com sua conta ou crie um novo acesso com validação por código no e-mail.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AuthTab)} className="w-full">
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
                      value={loginEmail}
                      onChange={(event) => setLoginEmail(event.target.value)}
                      autoComplete="email"
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
                      value={loginPassword}
                      onChange={(event) => setLoginPassword(event.target.value)}
                      autoComplete="current-password"
                      required
                      className="h-12 rounded-xl border-white/15 bg-slate-950/55 text-white placeholder:text-white/50 focus-visible:ring-amber-300"
                    />
                  </div>
                  <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/70">
                    Contas novas só recebem acesso ao painel depois da confirmação do e-mail.
                  </p>
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
                {signupStep === "form" ? (
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-white/85">
                        E-mail
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={signupEmail}
                        onChange={(event) => setSignupEmail(event.target.value)}
                        autoComplete="email"
                        required
                        className="h-12 rounded-xl border-white/15 bg-slate-950/55 text-white placeholder:text-white/50 focus-visible:ring-amber-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-white/85">
                        Senha forte
                      </Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Crie uma senha forte"
                        value={signupPassword}
                        onChange={(event) => setSignupPassword(event.target.value)}
                        autoComplete="new-password"
                        required
                        className="h-12 rounded-xl border-white/15 bg-slate-950/55 text-white placeholder:text-white/50 focus-visible:ring-amber-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password-confirm" className="text-white/85">
                        Confirmar senha
                      </Label>
                      <Input
                        id="signup-password-confirm"
                        type="password"
                        placeholder="Repita a senha"
                        value={signupConfirmPassword}
                        onChange={(event) => setSignupConfirmPassword(event.target.value)}
                        autoComplete="new-password"
                        required
                        className="h-12 rounded-xl border-white/15 bg-slate-950/55 text-white placeholder:text-white/50 focus-visible:ring-amber-300"
                      />
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm font-medium text-white">Requisitos da senha</p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {passwordRuleResults.map((rule) => (
                          <p
                            key={rule.id}
                            className={`flex items-center gap-2 text-xs ${
                              rule.passed ? "text-emerald-300" : "text-white/60"
                            }`}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {rule.label}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="absolute left-[-5000px] top-auto h-px w-px overflow-hidden opacity-0">
                      <Label htmlFor="signup-company">Empresa</Label>
                      <Input
                        id="signup-company"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(event) => setHoneypot(event.target.value)}
                      />
                    </div>

                    {captchaEnabled ? (
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="mb-3 text-sm font-medium text-white">Verificação anti-bot</p>
                        <TurnstileWidget
                          key={captchaNonce}
                          siteKey={turnstileSiteKey}
                          onVerify={setCaptchaToken}
                          onExpire={() => setCaptchaToken("")}
                          onError={() => setCaptchaToken("")}
                        />
                      </div>
                    ) : null}

                    <Button
                      type="submit"
                      className="h-12 w-full rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 font-semibold text-slate-900 hover:from-amber-300 hover:via-orange-400 hover:to-amber-400"
                      disabled={loading}
                    >
                      {loading ? "Enviando código..." : "Criar conta e enviar código"}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifySignup} className="space-y-5">
                    <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                      <p className="inline-flex items-center gap-2 text-sm font-medium text-emerald-100">
                        <MailCheck className="h-4 w-4" />
                        Confirmação de e-mail
                      </p>
                      <p className="mt-2 text-sm text-white/78">
                        {signupSentAt
                          ? "Enviamos um código de confirmação para "
                          : "Digite o código enviado para "}
                        <span className="font-semibold">{signupEmail}</span>
                        {!signupSentAt ? " ou solicite um novo envio abaixo." : "."}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-otp" className="text-white/85">
                        Código de confirmação
                      </Label>
                      <InputOTP
                        id="signup-otp"
                        maxLength={OTP_MAX_LENGTH}
                        value={signupOtp}
                        onChange={(value) => setSignupOtp(normalizeOtp(value))}
                        containerClassName="justify-center"
                      >
                        <InputOTPGroup>
                          {Array.from({ length: OTP_MAX_LENGTH }).map((_, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className="h-12 w-12 border-white/15 bg-slate-950/55 text-base text-white"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    {captchaEnabled ? (
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="mb-3 text-sm font-medium text-white">Verificação anti-bot para reenviar código</p>
                        <TurnstileWidget
                          key={captchaNonce}
                          siteKey={turnstileSiteKey}
                          onVerify={setCaptchaToken}
                          onExpire={() => setCaptchaToken("")}
                          onError={() => setCaptchaToken("")}
                        />
                      </div>
                    ) : null}

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/70">
                      <p className="inline-flex items-center gap-2">
                        <Clock3 className="h-3.5 w-3.5 text-amber-300" />
                        O código expira e pode precisar de reenvio se ficar muito tempo sem uso.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="h-12 w-full rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 font-semibold text-slate-900 hover:from-amber-300 hover:via-orange-400 hover:to-amber-400"
                      disabled={loading}
                    >
                      {loading ? "Validando código..." : "Validar código e entrar"}
                    </Button>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 flex-1 rounded-xl border-white/15 bg-transparent text-white hover:bg-white/10 hover:text-white"
                        onClick={handleResendCode}
                        disabled={loading || resendRemainingMs > 0}
                      >
                        <RefreshCw className="h-4 w-4" />
                        {resendRemainingMs > 0
                          ? `Reenviar em ${formatDuration(resendRemainingMs)}`
                          : "Reenviar código"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-11 flex-1 rounded-xl text-white/75 hover:bg-white/10 hover:text-white"
                        onClick={() => resetSignupFlow(signupEmail)}
                        disabled={loading}
                      >
                        Alterar e-mail
                      </Button>
                    </div>
                  </form>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
