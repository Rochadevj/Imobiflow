export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      favorites: {
        Row: {
          created_at: string | null
          id: string
          property_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          property_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          property_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_users: {
        Row: {
          created_at: string
          id: string
          role: string
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          accent_color: string
          city: string | null
          created_at: string
          creci: string | null
          custom_domain: string | null
          id: string
          is_active: boolean
          is_demo: boolean
          logo_url: string | null
          name: string
          phone: string | null
          primary_color: string
          secondary_color: string
          site_title: string | null
          slug: string
          state: string | null
          subdomain: string | null
          support_email: string | null
          tagline: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          accent_color?: string
          city?: string | null
          created_at?: string
          creci?: string | null
          custom_domain?: string | null
          id?: string
          is_active?: boolean
          is_demo?: boolean
          logo_url?: string | null
          name: string
          phone?: string | null
          primary_color?: string
          secondary_color?: string
          site_title?: string | null
          slug: string
          state?: string | null
          subdomain?: string | null
          support_email?: string | null
          tagline?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          accent_color?: string
          city?: string | null
          created_at?: string
          creci?: string | null
          custom_domain?: string | null
          id?: string
          is_active?: boolean
          is_demo?: boolean
          logo_url?: string | null
          name?: string
          phone?: string | null
          primary_color?: string
          secondary_color?: string
          site_title?: string | null
          slug?: string
          state?: string | null
          subdomain?: string | null
          support_email?: string | null
          tagline?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          area: number | null
          area_privativa: number | null
          bathrooms: number | null
          bedrooms: number | null
          city: string
          codigo: string | null
          condominio: number | null
          created_at: string | null
          description: string
          featured: boolean | null
          featured_imperdiveis: boolean
          featured_locacao: boolean
          featured_venda: boolean
          features: string[] | null
          id: string
          is_launch: boolean | null
          iptu: number | null
          location: string
          parking_spaces: number | null
          price: number
          property_type: string
          street_number: string | null
          state: string | null
          status: string | null
          title: string
          tenant_id: string
          transaction_type: string | null
          updated_at: string | null
          user_id: string | null
          video_url: string | null
          zipcode: string | null
        }
        Insert: {
          area?: number | null
          area_privativa?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          city: string
          codigo?: string | null
          condominio?: number | null
          created_at?: string | null
          description: string
          featured?: boolean | null
          featured_imperdiveis?: boolean
          featured_locacao?: boolean
          featured_venda?: boolean
          features?: string[] | null
          id?: string
          is_launch?: boolean | null
          iptu?: number | null
          location: string
          parking_spaces?: number | null
          price: number
          property_type: string
          street_number?: string | null
          state?: string | null
          status?: string | null
          title: string
          tenant_id?: string
          transaction_type?: string | null
          updated_at?: string | null
          user_id?: string | null
          video_url?: string | null
          zipcode?: string | null
        }
        Update: {
          area?: number | null
          area_privativa?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string
          codigo?: string | null
          condominio?: number | null
          created_at?: string | null
          description?: string
          featured?: boolean | null
          featured_imperdiveis?: boolean
          featured_locacao?: boolean
          featured_venda?: boolean
          features?: string[] | null
          id?: string
          is_launch?: boolean | null
          iptu?: number | null
          location?: string
          parking_spaces?: number | null
          price?: number
          property_type?: string
          street_number?: string | null
          state?: string | null
          status?: string | null
          title?: string
          tenant_id?: string
          transaction_type?: string | null
          updated_at?: string | null
          user_id?: string | null
          video_url?: string | null
          zipcode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      property_images: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          is_primary: boolean | null
          property_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          is_primary?: boolean | null
          property_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_views: {
        Row: {
          created_at: string | null
          id: string
          ip_address: string
          property_id: string
          session_id: string | null
          tenant_id: string
          user_agent: string | null
          viewed_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address: string
          property_id: string
          session_id?: string | null
          tenant_id?: string
          user_agent?: string | null
          viewed_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: string
          property_id?: string
          session_id?: string | null
          tenant_id?: string
          user_agent?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_views_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_views_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      anonymize_ip: { Args: { ip_text: string }; Returns: string }
      cleanup_old_property_views: { Args: never; Returns: number }
      create_tenant_for_current_user: {
        Args: {
          p_name: string
          p_phone?: string
          p_slug?: string
          p_support_email?: string
          p_whatsapp?: string
        }
        Returns: string
      }
      generate_property_code: { Args: never; Returns: string }
      get_current_tenant_id: { Args: never; Returns: string }
      record_property_view: {
        Args: {
          p_ip_address: string
          p_property_id: string
          p_session_id?: string
          p_user_agent?: string
        }
        Returns: boolean
      }
      get_most_viewed_properties: {
        Args: { p_end_date?: string; p_limit?: number; p_start_date?: string }
        Returns: {
          property_id: string
          unique_views: number
        }[]
      }
      get_property_view_count: {
        Args: { p_property_id: string }
        Returns: number
      }
      slugify_text: { Args: { input: string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
