BEGIN;

CREATE TABLE IF NOT EXISTS public.whatsapp_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  property_code TEXT,
  property_title TEXT,
  contact_channel TEXT NOT NULL DEFAULT 'whatsapp',
  source TEXT NOT NULL,
  source_path TEXT,
  page_url TEXT,
  referrer TEXT,
  visitor_session_id TEXT,
  message TEXT,
  assigned_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_user_email TEXT,
  assigned_role TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  next_follow_up_at TIMESTAMPTZ,
  last_follow_up_at TIMESTAMPTZ,
  last_clicked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT whatsapp_leads_source_check CHECK (char_length(trim(source)) > 0),
  CONSTRAINT whatsapp_leads_status_check CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'archived'))
);

CREATE TABLE IF NOT EXISTS public.whatsapp_lead_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.whatsapp_leads(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  description TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT whatsapp_lead_events_type_check CHECK (
    event_type IN ('created', 'reengaged', 'assigned', 'follow_up_scheduled', 'status_changed', 'follow_up_completed')
  )
);

CREATE TABLE IF NOT EXISTS public.whatsapp_follow_up_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.whatsapp_leads(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  assigned_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_user_email TEXT,
  title TEXT NOT NULL,
  task_type TEXT NOT NULL DEFAULT 'whatsapp_follow_up',
  status TEXT NOT NULL DEFAULT 'pending',
  due_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT whatsapp_follow_up_tasks_status_check CHECK (status IN ('pending', 'completed', 'cancelled'))
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_leads_tenant_created_at
  ON public.whatsapp_leads(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_leads_assigned_status
  ON public.whatsapp_leads(assigned_user_id, status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_leads_property_id
  ON public.whatsapp_leads(property_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_follow_up_tasks_tenant_status_due
  ON public.whatsapp_follow_up_tasks(tenant_id, status, due_at);
CREATE INDEX IF NOT EXISTS idx_whatsapp_lead_events_lead_created_at
  ON public.whatsapp_lead_events(lead_id, created_at DESC);

ALTER TABLE public.whatsapp_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_follow_up_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant members can view whatsapp leads" ON public.whatsapp_leads;
DROP POLICY IF EXISTS "Tenant members can update whatsapp leads" ON public.whatsapp_leads;
DROP POLICY IF EXISTS "Tenant members can view whatsapp lead events" ON public.whatsapp_lead_events;
DROP POLICY IF EXISTS "Tenant members can view whatsapp follow up tasks" ON public.whatsapp_follow_up_tasks;
DROP POLICY IF EXISTS "Tenant members can update whatsapp follow up tasks" ON public.whatsapp_follow_up_tasks;

CREATE POLICY "Tenant members can view whatsapp leads"
ON public.whatsapp_leads
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.tenant_users tu
    WHERE tu.tenant_id = whatsapp_leads.tenant_id
      AND tu.user_id = auth.uid()
  )
);

CREATE POLICY "Tenant members can update whatsapp leads"
ON public.whatsapp_leads
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.tenant_users tu
    WHERE tu.tenant_id = whatsapp_leads.tenant_id
      AND tu.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.tenant_users tu
    WHERE tu.tenant_id = whatsapp_leads.tenant_id
      AND tu.user_id = auth.uid()
  )
);

CREATE POLICY "Tenant members can view whatsapp lead events"
ON public.whatsapp_lead_events
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.tenant_users tu
    WHERE tu.tenant_id = whatsapp_lead_events.tenant_id
      AND tu.user_id = auth.uid()
  )
);

CREATE POLICY "Tenant members can view whatsapp follow up tasks"
ON public.whatsapp_follow_up_tasks
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.tenant_users tu
    WHERE tu.tenant_id = whatsapp_follow_up_tasks.tenant_id
      AND tu.user_id = auth.uid()
  )
);

CREATE POLICY "Tenant members can update whatsapp follow up tasks"
ON public.whatsapp_follow_up_tasks
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.tenant_users tu
    WHERE tu.tenant_id = whatsapp_follow_up_tasks.tenant_id
      AND tu.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.tenant_users tu
    WHERE tu.tenant_id = whatsapp_follow_up_tasks.tenant_id
      AND tu.user_id = auth.uid()
  )
);

GRANT SELECT, UPDATE ON public.whatsapp_leads TO authenticated;
GRANT SELECT ON public.whatsapp_lead_events TO authenticated;
GRANT SELECT, UPDATE ON public.whatsapp_follow_up_tasks TO authenticated;

CREATE OR REPLACE FUNCTION public.resolve_whatsapp_lead_assignee(p_tenant_id UUID)
RETURNS TABLE (
  user_id UUID,
  user_email TEXT,
  user_role TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN QUERY
  SELECT
    tu.user_id,
    COALESCE(u.email, 'sem-email@imobiflow.local') AS user_email,
    tu.role
  FROM public.tenant_users tu
  LEFT JOIN auth.users u ON u.id = tu.user_id
  WHERE tu.tenant_id = p_tenant_id
  ORDER BY
    CASE tu.role
      WHEN 'broker' THEN 0
      WHEN 'manager' THEN 1
      ELSE 2
    END,
    (
      SELECT COUNT(*)
      FROM public.whatsapp_leads wl
      WHERE wl.tenant_id = p_tenant_id
        AND wl.assigned_user_id = tu.user_id
        AND wl.status NOT IN ('closed', 'archived')
    ),
    tu.created_at
  LIMIT 1;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_whatsapp_lead(
  p_source TEXT,
  p_tenant_slug TEXT DEFAULT NULL,
  p_property_id UUID DEFAULT NULL,
  p_source_path TEXT DEFAULT NULL,
  p_page_url TEXT DEFAULT NULL,
  p_referrer TEXT DEFAULT NULL,
  p_message TEXT DEFAULT NULL,
  p_visitor_session_id TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_tenant_id UUID;
  v_lead_id UUID;
  v_existing_lead_id UUID;
  v_assigned_user_id UUID;
  v_assigned_user_email TEXT;
  v_assigned_role TEXT;
  v_property_title TEXT;
  v_property_code TEXT;
  v_next_follow_up_at TIMESTAMPTZ := now() + INTERVAL '15 minutes';
BEGIN
  IF NULLIF(trim(COALESCE(p_source, '')), '') IS NULL THEN
    RAISE EXCEPTION 'Informe a origem do lead.';
  END IF;

  IF p_property_id IS NOT NULL THEN
    SELECT p.tenant_id, p.title, p.codigo
    INTO v_tenant_id, v_property_title, v_property_code
    FROM public.properties p
    WHERE p.id = p_property_id
    LIMIT 1;
  END IF;

  IF v_tenant_id IS NULL AND NULLIF(trim(COALESCE(p_tenant_slug, '')), '') IS NOT NULL THEN
    SELECT t.id, t.site_title
    INTO v_tenant_id, v_property_title
    FROM public.tenants t
    WHERE t.slug = lower(trim(p_tenant_slug))
      AND t.is_active = true
    LIMIT 1;
  END IF;

  IF v_tenant_id IS NULL THEN
    RETURN NULL;
  END IF;

  IF NULLIF(trim(COALESCE(p_visitor_session_id, '')), '') IS NOT NULL THEN
    SELECT wl.id
    INTO v_existing_lead_id
    FROM public.whatsapp_leads wl
    WHERE wl.tenant_id = v_tenant_id
      AND wl.source = trim(p_source)
      AND COALESCE(wl.property_id::TEXT, '') = COALESCE(p_property_id::TEXT, '')
      AND COALESCE(wl.visitor_session_id, '') = trim(p_visitor_session_id)
      AND wl.created_at >= now() - INTERVAL '30 minutes'
    ORDER BY wl.created_at DESC
    LIMIT 1;
  END IF;

  IF v_existing_lead_id IS NOT NULL THEN
    UPDATE public.whatsapp_leads wl
    SET
      source_path = COALESCE(NULLIF(trim(COALESCE(p_source_path, '')), ''), wl.source_path),
      page_url = COALESCE(NULLIF(trim(COALESCE(p_page_url, '')), ''), wl.page_url),
      referrer = COALESCE(NULLIF(trim(COALESCE(p_referrer, '')), ''), wl.referrer),
      message = COALESCE(NULLIF(trim(COALESCE(p_message, '')), ''), wl.message),
      last_clicked_at = now(),
      next_follow_up_at = COALESCE(wl.next_follow_up_at, v_next_follow_up_at),
      updated_at = now()
    WHERE wl.id = v_existing_lead_id;

    INSERT INTO public.whatsapp_lead_events (lead_id, tenant_id, event_type, description, metadata)
    VALUES (
      v_existing_lead_id,
      v_tenant_id,
      'reengaged',
      'Novo clique no WhatsApp registrado para um lead já existente.',
      jsonb_build_object('source', trim(p_source))
    );

    IF NOT EXISTS (
      SELECT 1
      FROM public.whatsapp_follow_up_tasks task
      WHERE task.lead_id = v_existing_lead_id
        AND task.status = 'pending'
    ) THEN
      SELECT wl.assigned_user_id, wl.assigned_user_email
      INTO v_assigned_user_id, v_assigned_user_email
      FROM public.whatsapp_leads wl
      WHERE wl.id = v_existing_lead_id;

      INSERT INTO public.whatsapp_follow_up_tasks (
        lead_id,
        tenant_id,
        assigned_user_id,
        assigned_user_email,
        title,
        due_at
      )
      VALUES (
        v_existing_lead_id,
        v_tenant_id,
        v_assigned_user_id,
        v_assigned_user_email,
        'Retornar lead do WhatsApp',
        v_next_follow_up_at
      );

      INSERT INTO public.whatsapp_lead_events (lead_id, tenant_id, event_type, description, metadata)
      VALUES (
        v_existing_lead_id,
        v_tenant_id,
        'follow_up_scheduled',
        'Follow-up automático reagendado após nova interação.',
        jsonb_build_object('due_at', v_next_follow_up_at)
      );
    END IF;

    RETURN v_existing_lead_id;
  END IF;

  SELECT assignee.user_id, assignee.user_email, assignee.user_role
  INTO v_assigned_user_id, v_assigned_user_email, v_assigned_role
  FROM public.resolve_whatsapp_lead_assignee(v_tenant_id) assignee;

  INSERT INTO public.whatsapp_leads (
    tenant_id,
    property_id,
    property_code,
    property_title,
    source,
    source_path,
    page_url,
    referrer,
    visitor_session_id,
    message,
    assigned_user_id,
    assigned_user_email,
    assigned_role,
    next_follow_up_at
  )
  VALUES (
    v_tenant_id,
    p_property_id,
    v_property_code,
    v_property_title,
    trim(p_source),
    NULLIF(trim(COALESCE(p_source_path, '')), ''),
    NULLIF(trim(COALESCE(p_page_url, '')), ''),
    NULLIF(trim(COALESCE(p_referrer, '')), ''),
    NULLIF(trim(COALESCE(p_visitor_session_id, '')), ''),
    NULLIF(trim(COALESCE(p_message, '')), ''),
    v_assigned_user_id,
    v_assigned_user_email,
    v_assigned_role,
    v_next_follow_up_at
  )
  RETURNING id INTO v_lead_id;

  INSERT INTO public.whatsapp_lead_events (lead_id, tenant_id, event_type, description, metadata)
  VALUES
    (
      v_lead_id,
      v_tenant_id,
      'created',
      'Lead criado automaticamente a partir de um clique no WhatsApp.',
      jsonb_build_object('source', trim(p_source))
    ),
    (
      v_lead_id,
      v_tenant_id,
      'assigned',
      'Lead atribuido automaticamente ao responsável disponível.',
      jsonb_build_object('assigned_user_id', v_assigned_user_id, 'assigned_user_email', v_assigned_user_email, 'assigned_role', v_assigned_role)
    ),
    (
      v_lead_id,
      v_tenant_id,
      'follow_up_scheduled',
      'Follow-up automático inicial agendado.',
      jsonb_build_object('due_at', v_next_follow_up_at)
    );

  INSERT INTO public.whatsapp_follow_up_tasks (
    lead_id,
    tenant_id,
    assigned_user_id,
    assigned_user_email,
    title,
    due_at
  )
  VALUES (
    v_lead_id,
    v_tenant_id,
    v_assigned_user_id,
    v_assigned_user_email,
    'Retornar lead do WhatsApp',
    v_next_follow_up_at
  );

  RETURN v_lead_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.complete_whatsapp_follow_up_task(
  p_task_id UUID,
  p_mark_contacted BOOLEAN DEFAULT true
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_task RECORD;
BEGIN
  SELECT *
  INTO v_task
  FROM public.whatsapp_follow_up_tasks task
  WHERE task.id = p_task_id
  LIMIT 1;

  IF v_task IS NULL THEN
    RETURN false;
  END IF;

  IF auth.uid() IS NULL OR NOT EXISTS (
    SELECT 1
    FROM public.tenant_users tu
    WHERE tu.tenant_id = v_task.tenant_id
      AND tu.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Usuário sem permissão para concluir este follow-up.';
  END IF;

  IF v_task.status <> 'pending' THEN
    RETURN true;
  END IF;

  UPDATE public.whatsapp_follow_up_tasks
  SET
    status = 'completed',
    completed_at = now(),
    updated_at = now()
  WHERE id = p_task_id;

  UPDATE public.whatsapp_leads
  SET
    status = CASE
      WHEN p_mark_contacted AND status = 'new' THEN 'contacted'
      ELSE status
    END,
    last_follow_up_at = now(),
    updated_at = now()
  WHERE id = v_task.lead_id;

  INSERT INTO public.whatsapp_lead_events (lead_id, tenant_id, event_type, description, metadata)
  VALUES (
    v_task.lead_id,
    v_task.tenant_id,
    'follow_up_completed',
    'Follow-up marcado como concluído no painel.',
    jsonb_build_object('task_id', p_task_id, 'mark_contacted', p_mark_contacted)
  );

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_whatsapp_lead_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.whatsapp_lead_events (lead_id, tenant_id, event_type, description, metadata)
    VALUES (
      NEW.id,
      NEW.tenant_id,
      'status_changed',
      'Status do lead atualizado no painel.',
      jsonb_build_object('previous_status', OLD.status, 'next_status', NEW.status)
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_set_whatsapp_leads_updated_at ON public.whatsapp_leads;
CREATE TRIGGER trigger_set_whatsapp_leads_updated_at
  BEFORE UPDATE ON public.whatsapp_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_log_whatsapp_lead_status_change ON public.whatsapp_leads;
CREATE TRIGGER trigger_log_whatsapp_lead_status_change
  AFTER UPDATE ON public.whatsapp_leads
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.log_whatsapp_lead_status_change();

DROP TRIGGER IF EXISTS trigger_set_whatsapp_follow_up_tasks_updated_at ON public.whatsapp_follow_up_tasks;
CREATE TRIGGER trigger_set_whatsapp_follow_up_tasks_updated_at
  BEFORE UPDATE ON public.whatsapp_follow_up_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

REVOKE ALL ON FUNCTION public.resolve_whatsapp_lead_assignee(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_whatsapp_lead(TEXT, TEXT, UUID, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.complete_whatsapp_follow_up_task(UUID, BOOLEAN) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.create_whatsapp_lead(TEXT, TEXT, UUID, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.complete_whatsapp_follow_up_task(UUID, BOOLEAN) TO authenticated;

COMMIT;
