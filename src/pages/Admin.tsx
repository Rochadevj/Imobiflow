import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useTenant, type Tenant } from "@/context/TenantContext";
import {
  getTenantBrandName,
  getTenantCreci,
  getTenantLocationLabel,
  getTenantSupportEmail,
  getTenantWhatsApp,
} from "@/lib/tenantBrand";
import { resolvedDemoTenantSlug } from "@/lib/demoTenant";
import Footer from "@/components/Footer";
import MostViewedProperties from "@/components/MostViewedProperties";
import Navbar from "@/components/Navbar";
import PropertyEditForm from "@/components/PropertyEditForm";
import PropertyForm from "@/components/PropertyForm";
import PropertyList from "@/components/PropertyList";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Building2,
  CheckCircle2,
  Clock3,
  DollarSign,
  Eye,
  FileText,
  Globe,
  Home,
  Link2,
  List,
  MessageCircle,
  Plus,
  Rocket,
  Settings,
  ShieldAlert,
  TrendingUp,
  Trash2,
  Users2,
  Zap,
} from "lucide-react";

type DashboardStats = {
  total: number;
  available: number;
  sold: number;
  rented: number;
  totalValue: number;
};

type AdminProperty = {
  id: string;
  title: string;
  city: string;
  location: string;
  status: string | null;
  price: number;
  created_at: string | null;
  updated_at: string | null;
};

type NegotiationChecklistItem = {
  id: string;
  label: string;
  completed: boolean;
};

type NegotiationHistoryItem = {
  id: string;
  label: string;
  createdAt: string;
};

type NegotiationRecord = {
  checklist: NegotiationChecklistItem[];
  history: NegotiationHistoryItem[];
};

const negotiationChecklistTemplate: Array<Omit<NegotiationChecklistItem, "completed">> = [
  { id: "owner-docs", label: "Documentos do proprietário conferidos" },
  { id: "property-docs", label: "Matrícula e certidões do imóvel validadas" },
  { id: "proposal", label: "Proposta formal registrada" },
  { id: "legal-review", label: "Minuta revisada pelo jurídico" },
  { id: "signature", label: "Assinatura do contrato confirmada" },
];

const negotiationQuickActions = [
  "Documentação solicitada ao cliente",
  "Proposta enviada para análise",
  "Contrato encaminhado para assinatura",
  "Pagamento confirmado e operação concluída",
];

const createNegotiationChecklist = (): NegotiationChecklistItem[] =>
  negotiationChecklistTemplate.map((item) => ({
    ...item,
    completed: false,
  }));

const formatPropertyStatus = (status: string | null) => {
  if (status === "available") return "Disponível";
  if (status === "sold") return "Vendido";
  if (status === "rented") return "Alugado";
  if (status === "launch") return "Lançamento";
  return "Em análise";
};

const moduleCards = [
  {
    icon: Building2,
    title: "Gestão de estoque",
    text: "Unidades, fotos e status comercial em um painel único.",
  },
  {
    icon: Users2,
    title: "Equipe sincronizada",
    text: "Carteira, metas e produtividade dos corretores.",
  },
  {
    icon: FileText,
    title: "Documentos e contratos",
    text: "Checklist jurídico e histórico completo da negociação.",
  },
  {
    icon: TrendingUp,
    title: "Inteligência comercial",
    text: "Funil, previsão de receita e oportunidades por etapa.",
  },
];

const implementationSteps = [
  {
    step: "01",
    title: "Diagnóstico rápido",
    text: "Mapeamento da operação comercial e definição do setup inicial.",
  },
  {
    step: "02",
    title: "Implantação guiada",
    text: "Importação do estoque e ativação das automações principais.",
  },
  {
    step: "03",
    title: "Crescimento contínuo",
    text: "Acompanhamento de KPIs e evolução da estratégia comercial.",
  },
];

const integrationCards = [
  {
    icon: Globe,
    title: "Portais de anúncio",
    text: "Distribuição de imóveis por feed para canais externos.",
    status: "Conectável",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp comercial",
    text: "Atendimento direto e atualização de status por lead.",
    status: "Ativo",
  },
  {
    icon: Link2,
    title: "Webhooks e n8n",
    text: "Automação de fluxos com CRM, e-mail e planilhas.",
    status: "Pronto",
  },
  {
    icon: Rocket,
    title: "Campanhas de mídia",
    text: "Leitura de origem para medir ROI por canal.",
    status: "Em expansão",
  },
];

const automationRoutines = [
  "Follow-up automático após novo lead",
  "Lembrete de visita e proposta para corretor",
  "Alerta de documentação pendente",
  "Atualização de status para equipe comercial",
];

const landingChecklist = [
  "Painel ao vivo com visão executiva",
  "CRM com funil e etapas rastreáveis",
  "Módulos de estoque, equipe e contratos",
  "Automações comerciais em execução",
  "Integrações e canais de publicação",
  "Camada de confiança e compliance",
];

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const normalizeDomainInput = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "");

const isValidCustomDomain = (value: string) => /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(value);

const isConfirmedUser = (user: User | null) => Boolean(user?.email_confirmed_at);
const configuredDeleteAccountFunctionName = import.meta.env.VITE_DELETE_ACCOUNT_FUNCTION_NAME?.trim();
const deleteAccountFunctionNames = Array.from(
  new Set([configuredDeleteAccountFunctionName, "delete-account", "quick-action"].filter(Boolean)),
);
const getNegotiationStorageKey = (userId: string) => `imobiflow:negotiation:${userId}`;

const Admin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { tenant, refreshTenant } = useTenant();
  const demoMode = searchParams.get("demo") === "1";
  const demoTenantSlug = searchParams.get("tenant")?.trim().toLowerCase() || resolvedDemoTenantSlug;
  const [user, setUser] = useState<User | null>(null);
  const [demoTenant, setDemoTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [tenantSyncing, setTenantSyncing] = useState(false);
  const [tenantProvisionIssue, setTenantProvisionIssue] = useState<string | null>(null);
  const autoProvisionAttemptRef = useRef(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardView, setDashboardView] = useState("resumo");
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [deleteAccountConfirmation, setDeleteAccountConfirmation] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [negotiationStore, setNegotiationStore] = useState<Record<string, NegotiationRecord>>({});
  const [historyInput, setHistoryInput] = useState("");
  const [tenantForm, setTenantForm] = useState({
    name: "",
    slug: "",
    customDomain: "",
    supportEmail: "",
    phone: "",
    whatsapp: "",
    creci: "",
    city: "",
    state: "",
  });
  const [savingTenant, setSavingTenant] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    available: 0,
    sold: 0,
    rented: 0,
    totalValue: 0,
  });
  const activeTenant = demoMode ? demoTenant : tenant;
  const isReadOnlyDemo = demoMode;

  useEffect(() => {
    if (demoMode) {
      setUser(null);
      setLoading(true);

      const loadDemoTenant = async () => {
        try {
          let query = supabase
            .from("tenants")
            .select("*")
            .eq("is_active", true)
            .limit(1);

          query = demoTenantSlug ? query.eq("slug", demoTenantSlug) : query.eq("is_demo", true);

          const { data, error } = await query.maybeSingle();

          if (error) throw error;

          setDemoTenant(data ?? null);
          if (!data) {
            toast.error("Nenhuma operação demo foi encontrada para o painel.");
          }
        } catch (error) {
          console.error("Erro ao carregar tenant demo:", error);
          toast.error("Não foi possível carregar o painel demo.");
          setDemoTenant(null);
        } finally {
          setLoading(false);
        }
      };

      void loadDemoTenant();
      return;
    }

    setDemoTenant(null);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session || !isConfirmedUser(session.user)) {
        if (session && !isConfirmedUser(session.user)) {
          void supabase.auth.signOut();
        }
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session || !isConfirmedUser(session.user)) {
        if (session && !isConfirmedUser(session.user)) {
          void supabase.auth.signOut();
        }
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [demoMode, demoTenantSlug, navigate]);

  useEffect(() => {
    if (!activeTenant) {
      setTenantForm((current) => ({
        ...current,
        supportEmail: user?.email || current.supportEmail,
      }));
      return;
    }

    setTenantForm({
      name: activeTenant.name || "",
      slug: activeTenant.slug || "",
      customDomain: activeTenant.custom_domain || "",
      supportEmail: activeTenant.support_email || user?.email || "",
      phone: activeTenant.phone || "",
      whatsapp: activeTenant.whatsapp || "",
      creci: activeTenant.creci || "",
      city: activeTenant.city || "",
      state: activeTenant.state || "",
    });
  }, [activeTenant, user?.email]);

  useEffect(() => {
    if (demoMode) {
      return;
    }

    if (!user?.id) {
      autoProvisionAttemptRef.current = false;
      return;
    }

    if (tenant?.id) {
      autoProvisionAttemptRef.current = true;
      setTenantProvisionIssue(null);
      return;
    }

    const ensureTenant = async () => {
      if (!user || tenant || tenantSyncing || autoProvisionAttemptRef.current) {
        if (user && tenant) {
          setLoading(false);
        }
        return;
      }

      const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
      const companyName = typeof metadata.company_name === "string" ? metadata.company_name.trim() : "";
      const companySlug = typeof metadata.company_slug === "string" ? metadata.company_slug.trim() : "";
      const companyWhatsApp =
        typeof metadata.company_whatsapp === "string" ? metadata.company_whatsapp.trim() : "";

      if (!companyName) {
        setLoading(false);
        return;
      }

      autoProvisionAttemptRef.current = true;

      try {
        setTenantSyncing(true);
        const { error } = await supabase.rpc("create_tenant_for_current_user", {
          p_name: companyName,
          p_slug: companySlug || undefined,
          p_support_email: user?.email || undefined,
          p_phone: companyWhatsApp || undefined,
          p_whatsapp: companyWhatsApp || undefined,
        });

        if (error) throw error;

        setTenantProvisionIssue(null);
        await refreshTenant();
      } catch (error) {
        const rpcError = error as { code: string; message: string };

        if (rpcError.code === "PGRST202") {
          setTenantProvisionIssue("A base multiempresa ainda não foi aplicada no Supabase. Execute a migration 20260307102000_add_multitenant_foundation.sql.");
        } else {
          setTenantProvisionIssue("Não foi possível concluir a configuração automática da imobiliária.");
          console.error("Erro ao provisionar a imobiliária:", error);
        }
      } finally {
        setTenantSyncing(false);
        setLoading(false);
      }
    };

    void ensureTenant();
  }, [demoMode, refreshTenant, tenant, tenantSyncing, user]);

  useEffect(() => {
    if (demoMode) {
      setNegotiationStore({});
      return;
    }

    if (!user?.id) {
      setNegotiationStore({});
      return;
    }

    try {
      const rawData = localStorage.getItem(getNegotiationStorageKey(user.id));
      if (!rawData) {
        setNegotiationStore({});
        return;
      }

      setNegotiationStore(JSON.parse(rawData) as Record<string, NegotiationRecord>);
    } catch (error) {
      console.error("Erro ao carregar documentos e contratos:", error);
      setNegotiationStore({});
    }
  }, [demoMode, user?.id]);

  useEffect(() => {
    if (!properties.length) {
      setSelectedPropertyId("");
      return;
    }

    if (!selectedPropertyId || !properties.some((property) => property.id === selectedPropertyId)) {
      setSelectedPropertyId(properties[0].id);
    }
  }, [properties, selectedPropertyId]);

  const fetchStats = async (tenantId: string) => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("id, title, city, location, status, price, created_at, updated_at")
        .eq("tenant_id", tenantId);

      if (error) throw error;

      const total = data?.length || 0;
      const available = data?.filter((property) => property.status === "available").length || 0;
      const sold = data?.filter((property) => property.status === "sold").length || 0;
      const rented = data?.filter((property) => property.status === "rented").length || 0;
      const totalValue = data?.reduce((sum, property) => sum + (property.price || 0), 0) || 0;

      setProperties(
        ([...(data || [])] as AdminProperty[]).sort((left, right) => {
          const leftDate = new Date(left.updated_at || left.created_at || 0).getTime();
          const rightDate = new Date(right.updated_at || right.created_at || 0).getTime();
          return rightDate - leftDate;
        }),
      );
      setStats({ total, available, sold, rented, totalValue });
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  };

  useEffect(() => {
    if (!activeTenant?.id) {
      return;
    }

    void fetchStats(activeTenant.id);
    setLoading(false);
  }, [activeTenant?.id, refreshKey]);

  useEffect(() => {
    if (!isReadOnlyDemo) {
      return;
    }

    if (!["dashboard", "list", "add", "legal", "settings"].includes(activeTab)) {
      setActiveTab("dashboard");
    }
  }, [activeTab, isReadOnlyDemo]);

  const selectedProperty = useMemo(
    () => properties.find((property) => property.id === selectedPropertyId) ?? null,
    [properties, selectedPropertyId],
  );

  const selectedNegotiation = useMemo<NegotiationRecord>(() => {
    if (!selectedPropertyId) {
      return {
        checklist: createNegotiationChecklist(),
        history: [],
      };
    }

    const existingRecord = negotiationStore[selectedPropertyId];

    if (!existingRecord) {
      return {
        checklist: createNegotiationChecklist(),
        history: [],
      };
    }

    return {
      checklist: negotiationChecklistTemplate.map((templateItem) => ({
        ...templateItem,
        completed:
          existingRecord.checklist.find((item) => item.id === templateItem.id)?.completed ?? false,
      })),
      history: existingRecord.history || [],
    };
  }, [negotiationStore, selectedPropertyId]);

  const persistNegotiation = (nextState: Record<string, NegotiationRecord>) => {
    setNegotiationStore(nextState);

    if (!user?.id) return;

    localStorage.setItem(getNegotiationStorageKey(user.id), JSON.stringify(nextState));
  };

  const toggleChecklistItem = (itemId: string) => {
    if (isReadOnlyDemo) return;
    if (!selectedPropertyId) return;

    const updatedChecklist = selectedNegotiation.checklist.map((item) =>
      item.id === itemId
        ? {
            ...item,
            completed: !item.completed,
          }
        : item,
    );

    persistNegotiation({
      ...negotiationStore,
      [selectedPropertyId]: {
        checklist: updatedChecklist,
        history: selectedNegotiation.history,
      },
    });
  };

  const addNegotiationHistory = (label: string) => {
    if (isReadOnlyDemo) return;
    if (!selectedPropertyId) return;

    const sanitizedLabel = label.trim();
    if (!sanitizedLabel) return;

    persistNegotiation({
      ...negotiationStore,
      [selectedPropertyId]: {
        checklist: selectedNegotiation.checklist,
        history: [
          {
            id: `${Date.now()}-${Math.round(Math.random() * 1000)}`,
            label: sanitizedLabel,
            createdAt: new Date().toISOString(),
          },
          ...selectedNegotiation.history,
        ].slice(0, 20),
      },
    });

    setHistoryInput("");
  };

  const completedChecklistItems = selectedNegotiation.checklist.filter((item) => item.completed).length;
  const checklistProgress = selectedNegotiation.checklist.length
    ? Math.round((completedChecklistItems / selectedNegotiation.checklist.length) * 100)
    : 0;

  const legalWorkspace = (
    <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <Card className="section-shell p-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
            <FileText className="h-5 w-5 text-amber-600" />
            Documentos e contratos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {properties.length === 0 ? (
            <div className="surface-card-muted p-4 text-sm text-slate-600">
              Cadastre um imóvel para iniciar o checklist jurídico da negociação.
            </div>
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Imóvel da negociação</p>
                  <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
                    <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                      <SelectValue placeholder="Selecione um imóvel" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="surface-card-muted flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Status comercial</p>
                    <p className="mt-1 truncate text-sm font-medium text-slate-900">
                      {selectedProperty ? `${selectedProperty.location}, ${selectedProperty.city}` : "Nenhum imóvel selecionado"}
                    </p>
                  </div>
                  <Badge className="rounded-full border border-slate-200 bg-white text-slate-700">
                    {formatPropertyStatus(selectedProperty?.status ?? null)}
                  </Badge>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold text-slate-900">Checklist jurídico</span>
                  <span className="text-slate-500">
                    {completedChecklistItems}/{selectedNegotiation.checklist.length} concluídos
                  </span>
                </div>
                <Progress value={checklistProgress} className="mt-3 h-2 bg-slate-100" />
                <div className="mt-4 space-y-3">
                  {selectedNegotiation.checklist.map((item) => (
                    <label
                      key={item.id}
                      htmlFor={`negotiation-${item.id}`}
                      className={`surface-card-muted flex items-center gap-3 p-3 ${isReadOnlyDemo ? "cursor-default" : "cursor-pointer"}`}
                    >
                      <Checkbox
                        id={`negotiation-${item.id}`}
                        checked={item.completed}
                        onCheckedChange={() => {
                          if (!isReadOnlyDemo) {
                            toggleChecklistItem(item.id);
                          }
                        }}
                        disabled={isReadOnlyDemo}
                      />
                      <span className={`text-sm ${item.completed ? "text-slate-900" : "text-slate-600"}`}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="section-shell p-1">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">Histórico da negociação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {negotiationQuickActions.map((action) => (
              <Button
                key={action}
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full border-slate-200 bg-white text-slate-700"
                onClick={() => addNegotiationHistory(action)}
                disabled={!selectedPropertyId || isReadOnlyDemo}
              >
                {action}
              </Button>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={historyInput}
              onChange={(event) => setHistoryInput(event.target.value)}
              placeholder="Registrar observação manual"
              className="h-11 rounded-xl border-slate-200 bg-white"
              disabled={!selectedPropertyId || isReadOnlyDemo}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addNegotiationHistory(historyInput);
                }
              }}
            />
            <Button
              type="button"
              className="h-11 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
              onClick={() => addNegotiationHistory(historyInput)}
              disabled={!selectedPropertyId || isReadOnlyDemo}
            >
              Salvar
            </Button>
          </div>

          <div className="space-y-3">
            {selectedNegotiation.history.length === 0 ? (
              <div className="surface-card-muted p-4 text-sm text-slate-600">
                Nenhum evento registrado para este imóvel ainda.
              </div>
            ) : (
              selectedNegotiation.history.map((item) => (
                <div key={item.id} className="surface-card-muted p-4">
                  <p className="text-sm font-medium text-slate-900">{item.label}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(new Date(item.createdAt))}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );

  const insights = useMemo(() => {
    const closedDeals = stats.sold + stats.rented;
    const newLeads = Math.max(18, stats.available * 4 + closedDeals * 2);
    const visits = Math.max(8, Math.round(newLeads * 0.42));
    const proposals = Math.max(3, Math.round(visits * 0.46));
    const closings = Math.max(1, closedDeals || Math.round(proposals * 0.35));
    const pipeline = Math.min(92, Math.max(28, Math.round((closings / Math.max(1, proposals)) * 100)));
    const responseMinutes = Math.max(6, 18 - Math.min(10, Math.floor(stats.available / 2)));
    const projectedRevenue = Math.round(stats.totalValue * (1 + pipeline / 220));
    const automationScore = Math.min(
      96,
      52 + Math.round((stats.available / Math.max(1, stats.total || 1)) * 28) + Math.min(12, closedDeals * 2)
    );
    const conversionRate = Math.min(89, Math.max(18, Math.round((closings / Math.max(1, newLeads)) * 100)));
    const averageTicket = Math.round(stats.totalValue / Math.max(1, stats.total));
    const inventoryHealth = Math.min(98, Math.max(45, Math.round((stats.available / Math.max(1, stats.total)) * 100 + 34)));
    const siteScore = Math.min(97, Math.max(62, 58 + Math.round((stats.total / Math.max(1, stats.total + 5)) * 32)));

    const brokers = [
      { name: "Fernanda Lima", deals: Math.max(4, Math.round(closings * 0.4) + 2) },
      { name: "Rafael Costa", deals: Math.max(3, Math.round(closings * 0.34) + 1) },
      { name: "Juliana Alves", deals: Math.max(2, Math.round(closings * 0.26) + 1) },
    ];

    const bestBroker = brokers.sort((left, right) => right.deals - left.deals)[0];

    return {
      newLeads,
      visits,
      proposals,
      closings,
      pipeline,
      responseMinutes,
      projectedRevenue,
      automationScore,
      conversionRate,
      averageTicket,
      inventoryHealth,
      siteScore,
      bestBroker,
    };
  }, [stats]);

  const handlePropertyAdded = () => {
    setRefreshKey((previous) => previous + 1);
    if (activeTenant?.id) {
      void fetchStats(activeTenant.id);
    }
    setActiveTab("list");
  };

  const handlePropertyUpdated = () => {
    setRefreshKey((previous) => previous + 1);
    if (activeTenant?.id) {
      void fetchStats(activeTenant.id);
    }
    setEditingPropertyId(null);
    setActiveTab("list");
  };

  const handleEdit = (propertyId: string) => {
    setEditingPropertyId(propertyId);
    setActiveTab("edit");
  };

  const normalizedUserEmail = user?.email?.trim().toLowerCase() || "";
  const canDeleteAccount =
    normalizedUserEmail.length > 0 &&
    deleteAccountConfirmation.trim().toLowerCase() === normalizedUserEmail;
  const brandName = getTenantBrandName(activeTenant);
  const creciLabel = getTenantCreci(activeTenant);
  const supportEmail = getTenantSupportEmail(activeTenant);
  const whatsappNumber = getTenantWhatsApp(activeTenant);
  const locationLabel = getTenantLocationLabel(activeTenant);
  const normalizedCustomDomain = normalizeDomainInput(tenantForm.customDomain);
  const draftTenantSlug = tenantForm.slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
  const publicTenantSlug = activeTenant?.slug || draftTenantSlug || "";
  const buildPublicPreviewPath = (path: string) => {
    if (!publicTenantSlug) {
      return path;
    }

    const [pathname, search = ""] = path.split("?");
    const params = new URLSearchParams(search);
    params.set("tenant", publicTenantSlug);
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };
  const localPreviewPath = buildPublicPreviewPath("/imobiliaria");
  const localPreviewUrl =
    typeof window !== "undefined" ? `${window.location.origin}${localPreviewPath}` : localPreviewPath;
  const productionDomain = activeTenant?.custom_domain || normalizedCustomDomain;
  const productionSiteUrl = productionDomain ? `https://${productionDomain}` : "Domínio próprio não configurado";
  const summaryBrandName = activeTenant ? brandName : tenantForm.name.trim() || "Pendente de configuração";
  const summaryCreci = activeTenant ? creciLabel : tenantForm.creci.trim() || "Não informado";
  const summaryContact = activeTenant
    ? whatsappNumber || "Não informado"
    : tenantForm.whatsapp.trim() || tenantForm.phone.trim() || "Não informado";
  const summaryBase = activeTenant
    ? locationLabel
    : [tenantForm.city.trim(), tenantForm.state.trim()].filter(Boolean).join(", ") || "Base não informada";
  const summaryDomain = productionDomain || "Não configurado";

  const handleProvisionTenant = async () => {
    if (isReadOnlyDemo) {
      toast.error("O painel demo é somente leitura.");
      return;
    }

    if (!user) {
      toast.error("Sua sessão expirou. Entre novamente.");
      return;
    }

    if (tenantForm.name.trim().length < 2) {
      toast.error("Informe o nome da imobiliária.");
      return;
    }

    if (normalizedCustomDomain && !isValidCustomDomain(normalizedCustomDomain)) {
      toast.error("Informe um domínio válido, como empresa.com.br.");
      return;
    }

    setSavingTenant(true);

    try {
      let currentTenantId = activeTenant?.id ?? null;

      const { data: createdTenantId, error } = activeTenant
        ? await supabase
            .from("tenants")
            .update({
              name: tenantForm.name.trim(),
              slug: tenantForm.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-+|-+$)/g, ""),
              site_title: tenantForm.name.trim(),
              custom_domain: normalizedCustomDomain || null,
              support_email: tenantForm.supportEmail.trim() || null,
              phone: tenantForm.phone.trim() || null,
              whatsapp: tenantForm.whatsapp.trim() || null,
              creci: tenantForm.creci.trim() || null,
              city: tenantForm.city.trim() || null,
              state: tenantForm.state.trim() || null,
            })
            .eq("id", activeTenant.id)
        : await supabase.rpc("create_tenant_for_current_user", {
            p_name: tenantForm.name.trim(),
            p_slug: tenantForm.slug.trim() || undefined,
            p_support_email: tenantForm.supportEmail.trim() || user?.email || undefined,
            p_phone: tenantForm.phone.trim() || undefined,
            p_whatsapp: tenantForm.whatsapp.trim() || undefined,
          });

      if (error) throw error;

      if (!activeTenant && createdTenantId) {
        currentTenantId = createdTenantId as string;
      }

      if (currentTenantId && !activeTenant) {
        const { error: domainError } = await supabase
          .from("tenants")
          .update({
            custom_domain: normalizedCustomDomain || null,
          })
          .eq("id", currentTenantId);

        if (domainError) throw domainError;
      }

      await refreshTenant();

      if (!activeTenant && user?.user_metadata) {
        await supabase.auth.updateUser({
          data: {
            ...user.user_metadata,
            company_name: tenantForm.name.trim(),
            company_slug: tenantForm.slug.trim(),
            company_whatsapp: tenantForm.whatsapp.trim(),
          },
        });
      }

      toast.success(
        activeTenant ? "Dados da imobiliária atualizados com sucesso." : "Imobiliária configurada com sucesso.",
      );
    } catch (error) {
      const rpcError = error as { code?: string; message?: string };

      if (rpcError.code === "PGRST202") {
        setTenantProvisionIssue("A base multiempresa ainda não foi aplicada no Supabase. Execute a migration 20260307102000_add_multitenant_foundation.sql.");
        toast.error("A migration multiempresa ainda não foi aplicada no Supabase.");
      } else {
        console.error("Erro ao salvar imobiliária:", error);
        toast.error(
          rpcError.message
            ? `Não foi possível salvar os dados da imobiliária: ${rpcError.message}`
            : "Não foi possível salvar os dados da imobiliária.",
        );
      }
    } finally {
      setSavingTenant(false);
    }
  };

  const tenantWorkspace = (
    <Card className="section-shell p-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
          <Building2 className="h-5 w-5 text-amber-600" />
          Identidade da imobiliária
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {tenantProvisionIssue ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            {tenantProvisionIssue}
          </div>
        ) : null}
        {isReadOnlyDemo ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            A identidade da imobiliária fica disponível para consulta na demonstração, mas não pode ser alterada.
          </div>
        ) : null}
        <fieldset disabled={isReadOnlyDemo || savingTenant} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-900" htmlFor="tenant-name">
              Nome da imobiliária
            </label>
            <Input
              id="tenant-name"
              value={tenantForm.name}
              onChange={(event) => setTenantForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Ex: Horizonte Imóveis"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900" htmlFor="tenant-slug">
              Identificador interno do site
            </label>
            <Input
              id="tenant-slug"
              value={tenantForm.slug}
              onChange={(event) => setTenantForm((current) => ({ ...current, slug: event.target.value }))}
              placeholder="Ex: horizonte-imoveis"
            />
            <p className="text-xs text-slate-500">
              Usado para prévia local e roteamento técnico. O endereço público final deve usar um domínio próprio.
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900" htmlFor="tenant-custom-domain">
              Domínio próprio
            </label>
            <Input
              id="tenant-custom-domain"
              value={tenantForm.customDomain}
              onChange={(event) => setTenantForm((current) => ({ ...current, customDomain: event.target.value }))}
              placeholder="Ex: imobiliaria-exemplo.com.br"
            />
            <p className="text-xs text-slate-500">
              Informe apenas o domínio. Sem `https://`, sem barra final e sem subdomínio da Imobiflow.
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900" htmlFor="tenant-support-email">
              E-mail comercial
            </label>
            <Input
              id="tenant-support-email"
              type="email"
              value={tenantForm.supportEmail}
              onChange={(event) => setTenantForm((current) => ({ ...current, supportEmail: event.target.value }))}
              placeholder="contato@empresa.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900" htmlFor="tenant-phone">
              Telefone
            </label>
            <Input
              id="tenant-phone"
              value={tenantForm.phone}
              onChange={(event) => setTenantForm((current) => ({ ...current, phone: event.target.value }))}
              placeholder="(51) 99999-9999"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900" htmlFor="tenant-whatsapp">
              WhatsApp
            </label>
            <Input
              id="tenant-whatsapp"
              value={tenantForm.whatsapp}
              onChange={(event) => setTenantForm((current) => ({ ...current, whatsapp: event.target.value }))}
              placeholder="(51) 99999-9999"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900" htmlFor="tenant-creci">
              CRECI
            </label>
            <Input
              id="tenant-creci"
              value={tenantForm.creci}
              onChange={(event) => setTenantForm((current) => ({ ...current, creci: event.target.value }))}
              placeholder="CRECI 12345-XX"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900" htmlFor="tenant-city">
              Cidade
            </label>
            <Input
              id="tenant-city"
              value={tenantForm.city}
              onChange={(event) => setTenantForm((current) => ({ ...current, city: event.target.value }))}
              placeholder="Canoas"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900" htmlFor="tenant-state">
              UF
            </label>
            <Input
              id="tenant-state"
              value={tenantForm.state}
              onChange={(event) => setTenantForm((current) => ({ ...current, state: event.target.value }))}
              placeholder="RS"
              maxLength={2}
            />
          </div>
        </fieldset>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="surface-card-muted p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Domínio de produção</p>
            <p className="mt-2 break-all text-sm font-medium text-slate-900">{productionSiteUrl}</p>
            <p className="mt-2 text-sm text-slate-600">
              Cada imobiliária deve usar um domínio próprio exclusivo. A URL abaixo serve apenas como prévia local enquanto o DNS ainda não aponta para produção.
            </p>
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Prévia local da vitrine</p>
              <p className="mt-2 break-all text-sm font-medium text-slate-900">{localPreviewUrl}</p>
            </div>
          </div>
          <div className="surface-card-muted p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Resumo atual</p>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <p>
                <span className="font-semibold text-slate-900">Marca:</span> {summaryBrandName}
              </p>
              <p>
                <span className="font-semibold text-slate-900">CRECI:</span> {summaryCreci}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Contato:</span> {summaryContact}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Base:</span> {summaryBase}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Domínio:</span> {summaryDomain}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            onClick={() => void handleProvisionTenant()}
            disabled={savingTenant || isReadOnlyDemo}
            className="rounded-xl bg-slate-900 text-white hover:bg-slate-800"
          >
            {savingTenant ? "Salvando..." : activeTenant ? "Salvar identidade" : "Configurar imobiliária"}
          </Button>
          <Button type="button" variant="outline" className="rounded-xl border-slate-300 bg-white text-slate-700" asChild>
            <a href={localPreviewUrl} target="_blank" rel="noreferrer">
              Abrir prévia local
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const handleDeleteAccount = async () => {
    if (isReadOnlyDemo) {
      toast.error("A conta demo não pode ser alterada.");
      return;
    }

    if (!user?.email) {
      toast.error("Não foi possível validar a conta atual.");
      return;
    }

    if (!canDeleteAccount) {
      toast.error("Digite seu e-mail exatamente como confirmação.");
      return;
    }

    setDeletingAccount(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session.access_token) {
      toast.error("Sua sessão expirou. Entre novamente antes de excluir a conta.");
      setDeletingAccount(false);
      return;
    }

    let functionErrorMessage = "";
    let deleted = false;

    for (const functionName of deleteAccountFunctionNames) {
      const { error } = await supabase.functions.invoke(functionName, {
        body: {},
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!error) {
        deleted = true;
        break;
      }

      functionErrorMessage =
        (typeof error.message === "string" ? error.message.trim() : "") || functionErrorMessage;
    }

    if (!deleted) {
      toast.error(
        functionErrorMessage
          ? `Não foi possível excluir a conta: ${functionErrorMessage}`
          : "Não foi possível excluir a conta agora. Verifique se a Edge Function foi publicada.",
      );
      setDeletingAccount(false);
      return;
    }

    await supabase.auth.signOut();
    setDeletingAccount(false);
    setDeleteAccountOpen(false);
    setDeleteAccountConfirmation("");
    toast.success("Conta excluída com sucesso.");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!activeTenant) {
    return (
      <div className="page-shell">
        <Navbar />

        <main className="container mx-auto flex-1 px-4 py-8 md:py-10">
          <div className="hero-surface p-6 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-white/70">
                  {isReadOnlyDemo ? "Painel demo" : "Configuração inicial"}
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
                  {isReadOnlyDemo ? "Demo indisponível no momento" : "Ative a sua imobiliária"}
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-white/80 md:text-base">
                  {isReadOnlyDemo
                    ? "A operação de demonstração ainda não foi configurada no banco. Ajuste o tenant demo para liberar o acesso público."
                    : "Antes de usar o painel, defina a marca, o identificador do site e os canais de contato da operação."}
                </p>
              </div>
              <Badge className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-white">
                Usuário: {isReadOnlyDemo ? "demo público" : user?.email || "sem e-mail"}
              </Badge>
            </div>
          </div>

          {!isReadOnlyDemo ? <div className="mt-8">{tenantWorkspace}</div> : null}
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Navbar />

      <main className="container mx-auto flex-1 px-4 py-8 md:py-10">
        <div className="hero-surface p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-white/70">Painel administrativo</p>
              <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Dashboard {brandName}</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/80 md:text-base">
                Gestão comercial em tempo real com foco na execução do time e no catálogo público da sua imobiliária.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-white">
                Usuário: {isReadOnlyDemo ? "demo público" : user?.email || supportEmail}
              </Badge>
              <Badge className="rounded-full border border-amber-300/40 bg-amber-400 text-slate-900">
                {activeTenant.is_demo ? "Demo" : activeTenant.slug}
              </Badge>
            </div>
          </div>
        </div>

        {isReadOnlyDemo ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Você está no painel de demonstração em modo somente leitura. É possível navegar e visualizar a estrutura,
            mas sem cadastrar, editar, excluir ou alterar a conta.
          </div>
        ) : null}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8 w-full">
          <TabsList className="h-auto w-full max-w-5xl flex-wrap justify-start gap-2 rounded-2xl border border-slate-200 bg-white/80 p-2">
            <TabsTrigger value="dashboard" className="rounded-xl px-4 py-2">
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="list" className="rounded-xl px-4 py-2">
              <List className="mr-2 h-4 w-4" />
              {isReadOnlyDemo ? "Imóveis da demo" : "Meus imóveis"}
            </TabsTrigger>
            <TabsTrigger value="add" className="rounded-xl px-4 py-2">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </TabsTrigger>
            <TabsTrigger value="legal" className="rounded-xl px-4 py-2">
              <FileText className="mr-2 h-4 w-4" />
              Jurídico
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-xl px-4 py-2">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </TabsTrigger>
            {!isReadOnlyDemo && editingPropertyId ? (
              <TabsTrigger value="edit" className="rounded-xl px-4 py-2">
                <Plus className="mr-2 h-4 w-4" />
                Editar
              </TabsTrigger>
            ) : null}
          </TabsList>

          <TabsContent value="dashboard" className="mt-6 space-y-6">
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Card className="surface-card border-slate-200/80">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-600">
                    Total de imóveis
                    <Home className="h-4 w-4 text-slate-400" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold text-slate-900">{stats.total}</p>
                </CardContent>
              </Card>

              <Card className="surface-card border-slate-200/80">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-600">
                    Disponíveis
                    <Eye className="h-4 w-4 text-emerald-600" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold text-emerald-600">{stats.available}</p>
                </CardContent>
              </Card>

              <Card className="surface-card border-slate-200/80">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-600">
                    Vendidos
                    <DollarSign className="h-4 w-4 text-rose-600" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold text-rose-600">{stats.sold}</p>
                </CardContent>
              </Card>

              <Card className="surface-card border-slate-200/80">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-600">
                    Alugados
                    <DollarSign className="h-4 w-4 text-sky-600" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold text-sky-600">{stats.rented}</p>
                </CardContent>
              </Card>
            </section>

            <Tabs value={dashboardView} onValueChange={setDashboardView}>
              <TabsList className="h-auto w-full flex-wrap justify-start gap-2 rounded-2xl border border-slate-200 bg-white/80 p-2">
                <TabsTrigger value="resumo" className="rounded-xl px-4 py-2">
                  Resumo
                </TabsTrigger>
                <TabsTrigger value="operacao" className="rounded-xl px-4 py-2">
                  Operação
                </TabsTrigger>
                <TabsTrigger value="automacoes" className="rounded-xl px-4 py-2">
                  Automações
                </TabsTrigger>
              </TabsList>

              <TabsContent value="resumo" className="mt-5 space-y-4">
                <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                  <Card className="section-shell p-1">
                    <CardHeader>
                      <CardTitle className="text-xl text-slate-900">Painel ao vivo</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:grid-cols-2">
                      <div className="surface-card-muted p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Novos leads</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">{insights.newLeads}</p>
                      </div>
                      <div className="surface-card-muted p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Visitas agendadas</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">{insights.visits}</p>
                      </div>
                      <div className="surface-card-muted p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Tempo de resposta</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">{insights.responseMinutes} min</p>
                      </div>
                      <div className="surface-card-muted p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Pipeline</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">{insights.pipeline}%</p>
                        <div className="mt-2 h-2 rounded-full bg-slate-100">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                            style={{ width: `${insights.pipeline}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="section-shell p-1">
                    <CardHeader>
                      <CardTitle className="text-xl text-slate-900">Resumo comercial</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="surface-card-muted p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Melhor corretor</p>
                        <p className="mt-1 text-lg font-semibold text-slate-900">{insights.bestBroker.name}</p>
                        <p className="text-xs text-emerald-600">{insights.bestBroker.deals} contratos no período</p>
                      </div>
                      <div className="surface-card-muted p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Receita projetada</p>
                        <p className="mt-1 text-lg font-semibold text-slate-900">{formatCurrency(insights.projectedRevenue)}</p>
                      </div>
                      <div className="surface-card-muted p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Conversão</p>
                        <p className="mt-1 text-lg font-semibold text-slate-900">{insights.conversionRate}%</p>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {isReadOnlyDemo ? (
                  <Card className="section-shell p-1">
                    <CardHeader>
                      <CardTitle className="text-xl text-slate-900">Exploração da demo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600">
                      <p>
                        Nesta demonstração você pode navegar pelo dashboard e abrir os imóveis cadastrados para entender
                        como a plataforma funciona na prática.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Button asChild className="rounded-xl bg-slate-900 text-white hover:bg-slate-800">
                          <a href={buildPublicPreviewPath("/imobiliaria")}>Ver site público</a>
                        </Button>
                        <Button asChild variant="outline" className="rounded-xl border-slate-300 bg-white text-slate-700">
                          <a href={buildPublicPreviewPath("/sobre")}>Ver página institucional</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <MostViewedProperties />
                )}
              </TabsContent>

              <TabsContent value="operacao" className="mt-5 space-y-4">
                <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <Card className="section-shell p-1">
                    <CardHeader>
                      <CardTitle className="text-xl text-slate-900">Visão executiva</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="surface-card-muted p-4">
                          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Ticket médio</p>
                          <p className="mt-1 text-lg font-semibold text-slate-900">{formatCurrency(insights.averageTicket)}</p>
                        </div>
                        <div className="surface-card-muted p-4">
                          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Valor em carteira</p>
                          <p className="mt-1 text-lg font-semibold text-slate-900">{formatCurrency(stats.totalValue)}</p>
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center justify-between text-sm text-slate-700">
                          <span>Saúde do estoque</span>
                          <span className="font-semibold">{insights.inventoryHealth}%</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-slate-100">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-sky-400"
                            style={{ width: `${insights.inventoryHealth}%` }}
                          />
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center justify-between text-sm text-slate-700">
                          <span>Score do site comercial</span>
                          <span className="font-semibold">{insights.siteScore}%</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-slate-100">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                            style={{ width: `${insights.siteScore}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="section-shell p-1">
                    <CardHeader>
                      <CardTitle className="text-xl text-slate-900">Módulos ativos</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:grid-cols-2">
                      {moduleCards.map((item) => (
                        <div key={item.title} className="surface-card-muted p-4">
                          <item.icon className="h-5 w-5 text-amber-600" />
                          <p className="mt-2 text-sm font-semibold text-slate-900">{item.title}</p>
                          <p className="mt-1 text-xs text-slate-600">{item.text}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </section>

                <Card className="section-shell p-1">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-900">Fluxo de implantação</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3 md:grid-cols-3">
                    {implementationSteps.map((item) => (
                      <div key={item.step} className="surface-card-muted p-4">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-700">
                          {item.step}
                        </span>
                        <p className="mt-2 text-sm font-semibold text-slate-900">{item.title}</p>
                        <p className="mt-1 text-xs text-slate-600">{item.text}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="automacoes" className="mt-5 space-y-4">
                <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                  <Card className="section-shell p-1">
                    <CardHeader>
                      <CardTitle className="text-xl text-slate-900">Automações em execução</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-slate-700">Pontuação de automação</span>
                          <span className="font-semibold text-emerald-600">{insights.automationScore}%</span>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-slate-100">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-sky-400"
                            style={{ width: `${insights.automationScore}%` }}
                          />
                        </div>
                      </div>

                      {automationRoutines.map((routine) => (
                        <div key={routine} className="surface-card-muted flex items-start gap-2 p-3 text-sm text-slate-700">
                          <Zap className="mt-0.5 h-4 w-4 text-amber-600" />
                          <span>{routine}</span>
                        </div>
                      ))}

                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">SLA comercial</p>
                        <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <Clock3 className="h-4 w-4 text-amber-600" />
                          Respostas em até {insights.responseMinutes} minutos
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="section-shell p-1">
                    <CardHeader>
                      <CardTitle className="text-xl text-slate-900">Cobertura da landing</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {landingChecklist.map((item) => (
                        <div key={item} className="surface-card-muted flex items-start gap-2 p-3 text-sm text-slate-700">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                          <span>{item}</span>
                        </div>
                      ))}

                      <div className="rounded-xl border border-slate-200 bg-white p-3">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Integrações</p>
                        <div className="mt-3 space-y-2">
                          {integrationCards.map((item) => (
                            <div key={item.title} className="surface-card-muted flex items-center justify-between gap-2 p-2">
                              <span className="inline-flex items-center gap-2 text-sm text-slate-700">
                                <item.icon className="h-4 w-4 text-amber-600" />
                                {item.title}
                              </span>
                              <Badge className="rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
                                {item.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="legal" className="mt-6">
            <div className="space-y-4">
              <div className="surface-card-muted flex flex-col gap-2 rounded-3xl border border-slate-200 p-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Aba jurídica</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">Documentos, checklist e histórico</h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-600">
                    Centralize a conferência documental e acompanhe cada etapa da negociação com mais clareza.
                  </p>
                </div>
                <Badge className="rounded-full border border-amber-200 bg-amber-50 text-amber-700">
                  {properties.length} imóveis disponíveis para acompanhamento
                </Badge>
              </div>

              {isReadOnlyDemo ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  Na demonstração, esta área fica visível para navegação e consulta, mas o checklist e o histórico não podem ser alterados.
                </div>
              ) : null}

              {legalWorkspace}
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <div className="section-shell p-6">
              <PropertyList
                key={refreshKey}
                tenantId={activeTenant.id}
                onEdit={isReadOnlyDemo ? undefined : handleEdit}
                readOnly={isReadOnlyDemo}
              />
            </div>
          </TabsContent>

          <TabsContent value="add" className="mt-6">
            <PropertyForm tenantId={activeTenant.id} onSuccess={handlePropertyAdded} readOnly={isReadOnlyDemo} />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <section className="space-y-4">
              {isReadOnlyDemo ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  Nesta demonstração, as configurações ficam visíveis para consulta, mas a conta demo não pode ser alterada.
                </div>
              ) : null}

              {tenantWorkspace}

              <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                <Card className="section-shell p-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
                      <Settings className="h-5 w-5 text-amber-600" />
                      Configurações da conta
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="surface-card-muted p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Conta atual</p>
                      <p className="mt-2 text-base font-semibold text-slate-900">{user?.email || "Sem e-mail"}</p>
                      <p className="mt-2 text-sm text-slate-600">
                        Se você excluir a conta, o acesso e os dados vinculados a ela serão removidos do sistema.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="section-shell border-rose-200 p-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl text-rose-700">
                      <ShieldAlert className="h-5 w-5" />
                      Zona de risco
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                      <p className="text-sm font-semibold text-rose-800">Excluir conta permanentemente</p>
                      <p className="mt-2 text-sm text-rose-700">
                        Isso remove sua conta permanentemente, encerra o acesso ao painel e apaga os dados associados.
                      </p>
                    </div>

                    <AlertDialog
                      open={deleteAccountOpen}
                      onOpenChange={(open) => {
                        setDeleteAccountOpen(open);
                        if (!open) {
                          setDeleteAccountConfirmation("");
                        }
                      }}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="destructive"
                          className="h-11 rounded-xl bg-rose-600 text-white hover:bg-rose-700"
                          disabled={isReadOnlyDemo}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir minha conta
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir conta permanentemente</AlertDialogTitle>
                          <AlertDialogDescription>
                            Essa ação não pode ser desfeita. Para confirmar, digite seu e-mail abaixo exatamente como ele aparece na conta.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <div className="space-y-2">
                          <p className="text-sm font-medium text-slate-900">E-mail da conta</p>
                          <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                            {user?.email || "Sem e-mail"}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="delete-account-confirmation" className="text-sm font-medium text-slate-900">
                            Confirmação
                          </label>
                          <Input
                            id="delete-account-confirmation"
                            type="email"
                            placeholder="Digite seu e-mail para confirmar"
                            value={deleteAccountConfirmation}
                            onChange={(event) => setDeleteAccountConfirmation(event.target.value)}
                            autoComplete="email"
                            disabled={isReadOnlyDemo}
                          />
                        </div>

                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={deletingAccount}>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500"
                            onClick={(event) => {
                              event.preventDefault();
                              void handleDeleteAccount();
                            }}
                            disabled={isReadOnlyDemo || !canDeleteAccount || deletingAccount}
                          >
                            {deletingAccount ? "Excluindo..." : "Excluir definitivamente"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
              </div>
            </section>
          </TabsContent>

          {!isReadOnlyDemo && editingPropertyId ? (
            <TabsContent value="edit" className="mt-6">
              <PropertyEditForm
                propertyId={editingPropertyId}
                onSuccess={handlePropertyUpdated}
                onCancel={() => {
                  setEditingPropertyId(null);
                  setActiveTab("list");
                }}
              />
            </TabsContent>
          ) : null}
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;




