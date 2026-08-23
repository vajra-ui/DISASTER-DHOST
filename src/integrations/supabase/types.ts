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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      community_reports: {
        Row: {
          address: string | null
          category: string
          confirmations: number
          created_at: string
          description: string | null
          id: string
          lat: number
          lng: number
          photo_url: string | null
          status: string
          user_id: string
        }
        Insert: {
          address?: string | null
          category: string
          confirmations?: number
          created_at?: string
          description?: string | null
          id?: string
          lat: number
          lng: number
          photo_url?: string | null
          status?: string
          user_id: string
        }
        Update: {
          address?: string | null
          category?: string
          confirmations?: number
          created_at?: string
          description?: string | null
          id?: string
          lat?: number
          lng?: number
          photo_url?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      journey_shares: {
        Row: {
          contact_id: string
          created_at: string
          id: string
          journey_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          id?: string
          journey_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          id?: string
          journey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_shares_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "trusted_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_shares_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      journeys: {
        Row: {
          current_lat: number | null
          current_lng: number | null
          dest_address: string | null
          dest_lat: number
          dest_lng: number
          distance_meters: number | null
          duration_seconds: number | null
          ended_at: string | null
          eta: string | null
          id: string
          is_shared: boolean
          origin_address: string | null
          origin_lat: number
          origin_lng: number
          share_token: string | null
          started_at: string
          status: string
          travel_mode: string
          updated_at: string
          user_id: string
        }
        Insert: {
          current_lat?: number | null
          current_lng?: number | null
          dest_address?: string | null
          dest_lat: number
          dest_lng: number
          distance_meters?: number | null
          duration_seconds?: number | null
          ended_at?: string | null
          eta?: string | null
          id?: string
          is_shared?: boolean
          origin_address?: string | null
          origin_lat: number
          origin_lng: number
          share_token?: string | null
          started_at?: string
          status?: string
          travel_mode?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          current_lat?: number | null
          current_lng?: number | null
          dest_address?: string | null
          dest_lat?: number
          dest_lng?: number
          distance_meters?: number | null
          duration_seconds?: number | null
          ended_at?: string | null
          eta?: string | null
          id?: string
          is_shared?: boolean
          origin_address?: string | null
          origin_lat?: number
          origin_lng?: number
          share_token?: string | null
          started_at?: string
          status?: string
          travel_mode?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      recent_destinations: {
        Row: {
          address: string | null
          id: string
          label: string
          lat: number
          lng: number
          searched_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          id?: string
          label: string
          lat: number
          lng: number
          searched_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          id?: string
          label?: string
          lat?: number
          lng?: number
          searched_at?: string
          user_id?: string
        }
        Relationships: []
      }
      report_confirmations: {
        Row: {
          created_at: string
          id: string
          report_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          report_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          report_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_confirmations_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "community_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      trusted_contacts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          relationship: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          relationship?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          relationship?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          auto_share_journeys: boolean
          created_at: string
          deviation_alerts: boolean
          preferred_mode: string
          safety_check_minutes: number
          store_location_history: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_share_journeys?: boolean
          created_at?: string
          deviation_alerts?: boolean
          preferred_mode?: string
          safety_check_minutes?: number
          store_location_history?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_share_journeys?: boolean
          created_at?: string
          deviation_alerts?: boolean
          preferred_mode?: string
          safety_check_minutes?: number
          store_location_history?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
