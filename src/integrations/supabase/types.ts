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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      api_keys: {
        Row: {
          active: boolean | null
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          key: string | null
          key_hash: string
          last_used_at: string | null
          name: string
          partner_id: string | null
          rate_limit_per_minute: number
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key?: string | null
          key_hash: string
          last_used_at?: string | null
          name: string
          partner_id?: string | null
          rate_limit_per_minute?: number
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key?: string | null
          key_hash?: string
          last_used_at?: string | null
          name?: string
          partner_id?: string | null
          rate_limit_per_minute?: number
          user_id?: string | null
        }
        Relationships: []
      }
      api_usage: {
        Row: {
          api_key_id: string
          endpoint: string
          id: string
          ip_address: string | null
          response_time_ms: number | null
          status_code: number | null
          timestamp: string
        }
        Insert: {
          api_key_id: string
          endpoint: string
          id?: string
          ip_address?: string | null
          response_time_ms?: number | null
          status_code?: number | null
          timestamp?: string
        }
        Update: {
          api_key_id?: string
          endpoint?: string
          id?: string
          ip_address?: string | null
          response_time_ms?: number | null
          status_code?: number | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      developer_profiles: {
        Row: {
          api_usage_plan: string | null
          business_type: string | null
          company_name: string | null
          country: string | null
          created_at: string | null
          first_name: string | null
          id: string
          job_title: string | null
          last_name: string | null
          monthly_request_limit: number | null
          partner_id: string
          phone: string | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          api_usage_plan?: string | null
          business_type?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          job_title?: string | null
          last_name?: string | null
          monthly_request_limit?: number | null
          partner_id: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          api_usage_plan?: string | null
          business_type?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          job_title?: string | null
          last_name?: string | null
          monthly_request_limit?: number | null
          partner_id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      risk_scores: {
        Row: {
          band: string
          confidence: number | null
          last_updated: string | null
          metadata: Json | null
          score: number
          updated_at: string
          wallet: string
        }
        Insert: {
          band?: string
          confidence?: number | null
          last_updated?: string | null
          metadata?: Json | null
          score?: number
          updated_at?: string
          wallet: string
        }
        Update: {
          band?: string
          confidence?: number | null
          last_updated?: string | null
          metadata?: Json | null
          score?: number
          updated_at?: string
          wallet?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_api_rate_limit: {
        Args: { api_key_hash: string; endpoint: string }
        Returns: boolean
      }
      generate_api_key: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_partner_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      hash_api_key: {
        Args: { api_key: string }
        Returns: string
      }
      log_api_usage: {
        Args: {
          api_key_hash: string
          endpoint_path: string
          ip_addr: string
          response_time_ms: number
          status_code: number
        }
        Returns: undefined
      }
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
