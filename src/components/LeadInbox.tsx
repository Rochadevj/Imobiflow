import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Clock3, Loader2, MessageCircle, RefreshCw, UserRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type WhatsAppLead = Tables<"whatsapp_leads">;
type WhatsAppFollowUpTask = Tables<"whatsapp_follow_up_tasks">;

const leadStatusLabels: Record<WhatsAppLead["status"], string> = {
  new: "Novo",
  contacted: "Contatado",
  qualified: "Qualificado",
  closed: "Fechado",
  archived: "Arquivado",
};

const sourceLabels: Record<string, string> = {
  floating_button: "Botão flutuante",
  property_detail_mobile_cta: "CTA mobile do imóvel",
  property_detail_sidebar: "Sidebar do imóvel",
  property_realtor_card: "Card do corretor",
  footer_contact: "Rodapé",
  about_hero: "Hero institucional",
  landing_contact: "Landing",
  property_submit_help: "Ajuda no anúncio",
};

const statusBadgeClassName = (status: WhatsAppLead["status"]) => {
  if (status === "new") return "border-sky-200 bg-sky-50 text-sky-700";
  if (status === "contacted") return "border-amber-200 bg-amber-50 text-amber-700";
  if (status === "qualified") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "closed") return "border-violet-200 bg-violet-50 text-violet-700";
  return "border-slate-200 bg-slate-50 text-slate-600";
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "Nao agendado";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
};

interface LeadInboxProps {
  tenantId: string;
  readOnly?: boolean;
}

const LeadInbox = ({ tenantId, readOnly = false }: LeadInboxProps) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [leads, setLeads] = useState<WhatsAppLead[]>([]);
  const [followUpTasks, setFollowUpTasks] = useState<WhatsAppFollowUpTask[]>([]);

  const loadInbox = useCallback(async (withSpinner = true) => {
    if (withSpinner) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const [{ data: leadData, error: leadError }, { data: taskData, error: taskError }] = await Promise.all([
        supabase
          .from("whatsapp_leads")
          .select("*")
          .eq("tenant_id", tenantId)
          .order("created_at", { ascending: false })
          .limit(20),
        supabase
          .from("whatsapp_follow_up_tasks")
          .select("*")
          .eq("tenant_id", tenantId)
          .order("status", { ascending: true })
          .order("due_at", { ascending: true })
          .limit(20),
      ]);

      if (leadError) throw leadError;
      if (taskError) throw taskError;

      setLeads(leadData || []);
      setFollowUpTasks(taskData || []);
    } catch (error) {
      console.error("Erro ao carregar leads do WhatsApp:", error);
      toast.error("Nao foi possivel carregar a caixa de leads.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [tenantId]);

  useEffect(() => {
    void loadInbox();
  }, [loadInbox]);

  const metrics = useMemo(() => {
    const pendingTasks = followUpTasks.filter((task) => task.status === "pending");
    const overdueTasks = pendingTasks.filter((task) => new Date(task.due_at).getTime() < Date.now());

    return {
      totalLeads: leads.length,
      newLeads: leads.filter((lead) => lead.status === "new").length,
      contactedLeads: leads.filter((lead) => lead.status === "contacted" || lead.status === "qualified").length,
      pendingTasks: pendingTasks.length,
      overdueTasks: overdueTasks.length,
    };
  }, [followUpTasks, leads]);

  const handleLeadStatusChange = async (leadId: string, status: WhatsAppLead["status"]) => {
    setUpdatingLeadId(leadId);

    try {
      const { error } = await supabase
        .from("whatsapp_leads")
        .update({ status })
        .eq("id", leadId);

      if (error) throw error;

      setLeads((current) =>
        current.map((lead) => (lead.id === leadId ? { ...lead, status } : lead)),
      );
      toast.success("Status do lead atualizado.");
    } catch (error) {
      console.error("Erro ao atualizar lead do WhatsApp:", error);
      toast.error("Nao foi possivel atualizar o status do lead.");
    } finally {
      setUpdatingLeadId(null);
    }
  };

  const handleCompleteFollowUp = async (taskId: string) => {
    setCompletingTaskId(taskId);

    try {
      const { error } = await supabase.rpc("complete_whatsapp_follow_up_task", {
        p_task_id: taskId,
        p_mark_contacted: true,
      });

      if (error) throw error;

      toast.success("Follow-up concluido.");
      await loadInbox(false);
    } catch (error) {
      console.error("Erro ao concluir follow-up do WhatsApp:", error);
      toast.error("Nao foi possivel concluir o follow-up.");
    } finally {
      setCompletingTaskId(null);
    }
  };

  if (loading) {
    return (
      <div className="section-shell p-8 text-center text-sm text-slate-600">
        <Loader2 className="mx-auto mb-3 h-5 w-5 animate-spin text-amber-600" />
        Carregando leads do WhatsApp...
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {readOnly ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          A demonstração mostra os leads capturados, mas não permite alterar status nem concluir follow-ups.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="surface-card border-slate-200/80">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-600">
              Leads registrados
              <MessageCircle className="h-4 w-4 text-emerald-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-slate-900">{metrics.totalLeads}</p>
          </CardContent>
        </Card>

        <Card className="surface-card border-slate-200/80">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-600">
              Novos
              <Clock3 className="h-4 w-4 text-sky-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-sky-600">{metrics.newLeads}</p>
          </CardContent>
        </Card>

        <Card className="surface-card border-slate-200/80">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-600">
              Em contato
              <UserRound className="h-4 w-4 text-amber-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-amber-600">{metrics.contactedLeads}</p>
          </CardContent>
        </Card>

        <Card className="surface-card border-slate-200/80">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-600">
              Follow-ups pendentes
              <CheckCircle2 className="h-4 w-4 text-rose-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-rose-600">{metrics.pendingTasks}</p>
            <p className="mt-1 text-xs text-slate-500">
              {metrics.overdueTasks} vencidos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="section-shell p-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-slate-900">Leads do WhatsApp</CardTitle>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-slate-300 bg-white text-slate-700"
              onClick={() => void loadInbox(false)}
              disabled={refreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          </CardHeader>
          <CardContent>
            {leads.length === 0 ? (
              <div className="surface-card-muted p-5 text-sm text-slate-600">
                Nenhum lead do WhatsApp foi registrado ainda. Quando um visitante clicar nos CTAs, o lead cai aqui automaticamente.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead>Responsavel</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Follow-up</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="min-w-[240px]">
                        <p className="font-medium text-slate-900">
                          {lead.property_title || "Contato institucional"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {lead.property_code ? `${lead.property_code} | ` : ""}
                          {formatDateTime(lead.created_at)}
                        </p>
                        {lead.message ? (
                          <p className="mt-2 line-clamp-2 text-xs text-slate-600">{lead.message}</p>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <Badge className="rounded-full border border-slate-200 bg-slate-50 text-slate-700">
                          {sourceLabels[lead.source] || lead.source}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium text-slate-900">
                          {lead.assigned_user_email || "Sem responsavel"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {lead.assigned_role || "Fila geral"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={lead.status}
                          onValueChange={(value) =>
                            void handleLeadStatusChange(lead.id, value as WhatsAppLead["status"])
                          }
                          disabled={readOnly || updatingLeadId === lead.id}
                        >
                          <SelectTrigger className={`h-10 min-w-[150px] rounded-xl border ${statusBadgeClassName(lead.status)}`}>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(leadStatusLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-slate-700">{formatDateTime(lead.next_follow_up_at)}</p>
                        {lead.last_follow_up_at ? (
                          <p className="mt-1 text-xs text-slate-500">
                            Ultimo contato: {formatDateTime(lead.last_follow_up_at)}
                          </p>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="section-shell p-1">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">Fila de follow-up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {followUpTasks.filter((task) => task.status === "pending").length === 0 ? (
              <div className="surface-card-muted p-5 text-sm text-slate-600">
                Nenhum follow-up pendente no momento.
              </div>
            ) : (
              followUpTasks
                .filter((task) => task.status === "pending")
                .map((task) => {
                  const isOverdue = new Date(task.due_at).getTime() < Date.now();

                  return (
                    <div key={task.id} className="surface-card-muted space-y-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {task.assigned_user_email || "Sem responsavel"}
                          </p>
                        </div>
                        <Badge
                          className={`rounded-full border ${isOverdue ? "border-rose-200 bg-rose-50 text-rose-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}
                        >
                          {isOverdue ? "Vencido" : "Agendado"}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">Prazo: {formatDateTime(task.due_at)}</p>
                      <Button
                        type="button"
                        className="h-10 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                        onClick={() => void handleCompleteFollowUp(task.id)}
                        disabled={readOnly || completingTaskId === task.id}
                      >
                        {completingTaskId === task.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Concluindo...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Marcar como concluido
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default LeadInbox;
