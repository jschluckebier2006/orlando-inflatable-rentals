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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          actor_email: string | null
          after: Json
          before: Json
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          metadata: Json
          summary: string
        }
        Insert: {
          action: string
          actor_email?: string | null
          after?: Json
          before?: Json
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          metadata?: Json
          summary: string
        }
        Update: {
          action?: string
          actor_email?: string | null
          after?: Json
          before?: Json
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          metadata?: Json
          summary?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          damage_waiver_rate: number
          default_deposit: number
          id: number
          online_checkout_fee_rate: number
          tax_rate: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          damage_waiver_rate?: number
          default_deposit?: number
          id?: number
          online_checkout_fee_rate?: number
          tax_rate?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          damage_waiver_rate?: number
          default_deposit?: number
          id?: number
          online_checkout_fee_rate?: number
          tax_rate?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      booking_activity: {
        Row: {
          actor_email: string | null
          booking_id: string | null
          created_at: string
          customer_id: string | null
          id: string
          kind: string
          message: string
          metadata: Json
        }
        Insert: {
          actor_email?: string | null
          booking_id?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          kind: string
          message: string
          metadata?: Json
        }
        Update: {
          actor_email?: string | null
          booking_id?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          kind?: string
          message?: string
          metadata?: Json
        }
        Relationships: [
          {
            foreignKeyName: "booking_activity_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_activity_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_items: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          product_id: string
          product_name: string
          product_price: number
          unit_price: number | null
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          product_id: string
          product_name: string
          product_price: number
          unit_price?: number | null
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          product_id?: string
          product_name?: string
          product_price?: number
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_items_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_payments: {
        Row: {
          amount: number
          booking_id: string
          created_at: string
          id: string
          method: string
          notes: string | null
          recorded_by: string | null
          reference: string | null
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string
          id?: string
          method: string
          notes?: string | null
          recorded_by?: string | null
          reference?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string
          id?: string
          method?: string
          notes?: string | null
          recorded_by?: string | null
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          amount_paid: number
          balance_due: number | null
          checkout_fee_amount: number
          created_at: string
          customer_email: string
          customer_id: string | null
          customer_name: string
          customer_phone: string
          damage_waiver_amount: number
          damage_waiver_selected: boolean
          delivery_fee: number
          delivery_zone_city: string | null
          deposit_amount: number
          duration_type: string
          event_address_line: string
          event_city: string
          event_date: string
          event_end_date: string
          event_end_time: string | null
          event_start_time: string | null
          event_type: string | null
          event_zip: string
          id: string
          notes: string | null
          payment_method_choice: string | null
          payment_status: string
          price_multiplier: number
          product_id: string | null
          product_name: string | null
          product_price: number | null
          status: Database["public"]["Enums"]["booking_status"]
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          stripe_payment_method_id: string | null
          stripe_session_id: string | null
          subtotal: number | null
          tax_amount: number
          tax_rate: number
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          amount_paid?: number
          balance_due?: number | null
          checkout_fee_amount?: number
          created_at?: string
          customer_email: string
          customer_id?: string | null
          customer_name: string
          customer_phone: string
          damage_waiver_amount?: number
          damage_waiver_selected?: boolean
          delivery_fee?: number
          delivery_zone_city?: string | null
          deposit_amount?: number
          duration_type?: string
          event_address_line: string
          event_city: string
          event_date: string
          event_end_date?: string
          event_end_time?: string | null
          event_start_time?: string | null
          event_type?: string | null
          event_zip: string
          id?: string
          notes?: string | null
          payment_method_choice?: string | null
          payment_status?: string
          price_multiplier?: number
          product_id?: string | null
          product_name?: string | null
          product_price?: number | null
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_payment_method_id?: string | null
          stripe_session_id?: string | null
          subtotal?: number | null
          tax_amount?: number
          tax_rate?: number
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          balance_due?: number | null
          checkout_fee_amount?: number
          created_at?: string
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string
          damage_waiver_amount?: number
          damage_waiver_selected?: boolean
          delivery_fee?: number
          delivery_zone_city?: string | null
          deposit_amount?: number
          duration_type?: string
          event_address_line?: string
          event_city?: string
          event_date?: string
          event_end_date?: string
          event_end_time?: string | null
          event_start_time?: string | null
          event_type?: string | null
          event_zip?: string
          id?: string
          notes?: string | null
          payment_method_choice?: string | null
          payment_status?: string
          price_multiplier?: number
          product_id?: string | null
          product_name?: string | null
          product_price?: number | null
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_payment_method_id?: string | null
          stripe_session_id?: string | null
          subtotal?: number | null
          tax_amount?: number
          tax_rate?: number
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address_line: string | null
          city: string | null
          created_at: string
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
          zip: string | null
        }
        Insert: {
          address_line?: string | null
          city?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          zip?: string | null
        }
        Update: {
          address_line?: string | null
          city?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          zip?: string | null
        }
        Relationships: []
      }
      delivery_zones: {
        Row: {
          city: string
          fee: number
          status: string
          updated_at: string
          zip: string
        }
        Insert: {
          city: string
          fee?: number
          status?: string
          updated_at?: string
          zip: string
        }
        Update: {
          city?: string
          fee?: number
          status?: string
          updated_at?: string
          zip?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          idempotency_key: string
          recipient_email: string
          related_booking_id: string | null
          related_session_id: string | null
          resend_message_id: string | null
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          idempotency_key: string
          recipient_email: string
          related_booking_id?: string | null
          related_session_id?: string | null
          resend_message_id?: string | null
          status?: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          idempotency_key?: string
          recipient_email?: string
          related_booking_id?: string | null
          related_session_id?: string | null
          resend_message_id?: string | null
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_template_versions: {
        Row: {
          body_html: string
          created_at: string
          id: string
          saved_by: string | null
          subject: string
          template_key: string
        }
        Insert: {
          body_html: string
          created_at?: string
          id?: string
          saved_by?: string | null
          subject: string
          template_key: string
        }
        Update: {
          body_html?: string
          created_at?: string
          id?: string
          saved_by?: string | null
          subject?: string
          template_key?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body_html: string
          description: string | null
          enabled: boolean
          key: string
          label: string
          subject: string
          updated_at: string
          updated_by: string | null
          use_custom: boolean
        }
        Insert: {
          body_html: string
          description?: string | null
          enabled?: boolean
          key: string
          label: string
          subject: string
          updated_at?: string
          updated_by?: string | null
          use_custom?: boolean
        }
        Update: {
          body_html?: string
          description?: string | null
          enabled?: boolean
          key?: string
          label?: string
          subject?: string
          updated_at?: string
          updated_by?: string | null
          use_custom?: boolean
        }
        Relationships: []
      }
      inventory_blackouts: {
        Row: {
          created_at: string
          end_date: string
          id: string
          item_id: string
          reason: string | null
          start_date: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          item_id: string
          reason?: string | null
          start_date: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          item_id?: string
          reason?: string | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_blackouts_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_images: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean
          item_id: string
          sort_order: number
          storage_path: string | null
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean
          item_id: string
          sort_order?: number
          storage_path?: string | null
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean
          item_id?: string
          sort_order?: number
          storage_path?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_images_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          active: boolean
          age_range: string | null
          base_price: number
          capacity: string | null
          category: string
          created_at: string
          description: string | null
          dimensions: string | null
          features: string[] | null
          id: string
          legacy_image: string | null
          name: string
          primary_image_url: string | null
          slug: string
          sort_order: number
          stock_count: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          age_range?: string | null
          base_price?: number
          capacity?: string | null
          category: string
          created_at?: string
          description?: string | null
          dimensions?: string | null
          features?: string[] | null
          id: string
          legacy_image?: string | null
          name: string
          primary_image_url?: string | null
          slug: string
          sort_order?: number
          stock_count?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          age_range?: string | null
          base_price?: number
          capacity?: string | null
          category?: string
          created_at?: string
          description?: string | null
          dimensions?: string | null
          features?: string[] | null
          id?: string
          legacy_image?: string | null
          name?: string
          primary_image_url?: string | null
          slug?: string
          sort_order?: number
          stock_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      inventory_maintenance: {
        Row: {
          created_at: string
          id: string
          item_id: string
          kind: string
          notes: string | null
          performed_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          kind?: string
          notes?: string | null
          performed_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          kind?: string
          notes?: string | null
          performed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_maintenance_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      pending_bookings: {
        Row: {
          amount_charged: number
          amount_total: number
          created_at: string
          deposit_amount: number
          id: string
          payload: Json
          stripe_session_id: string
        }
        Insert: {
          amount_charged: number
          amount_total: number
          created_at?: string
          deposit_amount: number
          id?: string
          payload: Json
          stripe_session_id: string
        }
        Update: {
          amount_charged?: number
          amount_total?: number
          created_at?: string
          deposit_amount?: number
          id?: string
          payload?: Json
          stripe_session_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_booked_dates: {
        Args: { _product_id: string }
        Returns: {
          event_date: string
        }[]
      }
      get_booked_dates_for_products: {
        Args: { _product_ids: string[] }
        Returns: {
          event_date: string
          product_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "staff" | "user"
      booking_status:
        | "awaiting_payment"
        | "pending"
        | "confirmed"
        | "cancelled"
        | "completed"
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
    Enums: {
      app_role: ["admin", "staff", "user"],
      booking_status: [
        "awaiting_payment",
        "pending",
        "confirmed",
        "cancelled",
        "completed",
      ],
    },
  },
} as const
