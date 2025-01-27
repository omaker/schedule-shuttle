export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      shipping_schedules: {
        Row: {
          act_lr: string | null
          ai_cv: number | null
          ai_tonnage: number | null
          arrival: string | null
          ash_ar: number | null
          bc_cv: number | null
          bc_iup: string | null
          bc_tonnage: number | null
          blu_tarif: number | null
          company: string | null
          complete: number | null
          contract_period: string | null
          country: string | null
          created_at: string | null
          cv_acceptable: number | null
          cv_acceptable_tonnage: number | null
          cv_ar: number | null
          cv_rejection_tonnage: number | null
          cv_typical: number | null
          cv_typical_tonnage: number | null
          direct_ais: string | null
          dy: number | null
          eta: number | null
          excel_id: string
          expected_blended_cv: number | null
          fin_month: number | null
          fixed_index_linked: string | null
          hba_2: number | null
          hpb_cap: number | null
          hpb_market: number | null
          id: string
          incoterm: string | null
          incremental_revenue: number | null
          laycan_part: string | null
          laycan_period: number | null
          laycan_start: number | null
          laycan_status: string | null
          laycan_stop: number | null
          laydays: number | null
          laytime_start: number | null
          laytime_stop: number | null
          lcsa_status: string | null
          loading_status: string | null
          month: number | null
          net_blu_expense_income: number | null
          pit: string | null
          plan_qty: number | null
          price_adj_load_port: number | null
          price_adj_load_port_cv: number | null
          price_code: string | null
          price_code_non_capped: string | null
          price_fob_vessel: number | null
          price_fob_vessel_adj_cv: number | null
          price_non_capped: number | null
          price_non_capped_adj_lp_cv_acc: number | null
          pricing_period: string | null
          product: string | null
          product_marketing: string | null
          pungutan_blu: number | null
          region: string | null
          revenue: number | null
          revenue_adj_load_port_cv: number | null
          revenue_adj_loadport: number | null
          revenue_capped: number | null
          revenue_fob_vessel_cv: number | null
          revenue_non_capped: number | null
          revenue_non_capped_adj_lp_cv_acc: number | null
          sales_status: string | null
          settled_floating: string | null
          ship_code: string | null
          ship_code_omdb: string | null
          terminal: string | null
          tm: number | null
          total_qty: number | null
          ts_adb: number | null
          updated_at: string | null
          vessel: string | null
          year: number | null
        }
        Insert: {
          act_lr?: string | null
          ai_cv?: number | null
          ai_tonnage?: number | null
          arrival?: string | null
          ash_ar?: number | null
          bc_cv?: number | null
          bc_iup?: string | null
          bc_tonnage?: number | null
          blu_tarif?: number | null
          company?: string | null
          complete?: number | null
          contract_period?: string | null
          country?: string | null
          created_at?: string | null
          cv_acceptable?: number | null
          cv_acceptable_tonnage?: number | null
          cv_ar?: number | null
          cv_rejection_tonnage?: number | null
          cv_typical?: number | null
          cv_typical_tonnage?: number | null
          direct_ais?: string | null
          dy?: number | null
          eta?: number | null
          excel_id: string
          expected_blended_cv?: number | null
          fin_month?: number | null
          fixed_index_linked?: string | null
          hba_2?: number | null
          hpb_cap?: number | null
          hpb_market?: number | null
          id?: string
          incoterm?: string | null
          incremental_revenue?: number | null
          laycan_part?: string | null
          laycan_period?: number | null
          laycan_start?: number | null
          laycan_status?: string | null
          laycan_stop?: number | null
          laydays?: number | null
          laytime_start?: number | null
          laytime_stop?: number | null
          lcsa_status?: string | null
          loading_status?: string | null
          month?: number | null
          net_blu_expense_income?: number | null
          pit?: string | null
          plan_qty?: number | null
          price_adj_load_port?: number | null
          price_adj_load_port_cv?: number | null
          price_code?: string | null
          price_code_non_capped?: string | null
          price_fob_vessel?: number | null
          price_fob_vessel_adj_cv?: number | null
          price_non_capped?: number | null
          price_non_capped_adj_lp_cv_acc?: number | null
          pricing_period?: string | null
          product?: string | null
          product_marketing?: string | null
          pungutan_blu?: number | null
          region?: string | null
          revenue?: number | null
          revenue_adj_load_port_cv?: number | null
          revenue_adj_loadport?: number | null
          revenue_capped?: number | null
          revenue_fob_vessel_cv?: number | null
          revenue_non_capped?: number | null
          revenue_non_capped_adj_lp_cv_acc?: number | null
          sales_status?: string | null
          settled_floating?: string | null
          ship_code?: string | null
          ship_code_omdb?: string | null
          terminal?: string | null
          tm?: number | null
          total_qty?: number | null
          ts_adb?: number | null
          updated_at?: string | null
          vessel?: string | null
          year?: number | null
        }
        Update: {
          act_lr?: string | null
          ai_cv?: number | null
          ai_tonnage?: number | null
          arrival?: string | null
          ash_ar?: number | null
          bc_cv?: number | null
          bc_iup?: string | null
          bc_tonnage?: number | null
          blu_tarif?: number | null
          company?: string | null
          complete?: number | null
          contract_period?: string | null
          country?: string | null
          created_at?: string | null
          cv_acceptable?: number | null
          cv_acceptable_tonnage?: number | null
          cv_ar?: number | null
          cv_rejection_tonnage?: number | null
          cv_typical?: number | null
          cv_typical_tonnage?: number | null
          direct_ais?: string | null
          dy?: number | null
          eta?: number | null
          excel_id?: string
          expected_blended_cv?: number | null
          fin_month?: number | null
          fixed_index_linked?: string | null
          hba_2?: number | null
          hpb_cap?: number | null
          hpb_market?: number | null
          id?: string
          incoterm?: string | null
          incremental_revenue?: number | null
          laycan_part?: string | null
          laycan_period?: number | null
          laycan_start?: number | null
          laycan_status?: string | null
          laycan_stop?: number | null
          laydays?: number | null
          laytime_start?: number | null
          laytime_stop?: number | null
          lcsa_status?: string | null
          loading_status?: string | null
          month?: number | null
          net_blu_expense_income?: number | null
          pit?: string | null
          plan_qty?: number | null
          price_adj_load_port?: number | null
          price_adj_load_port_cv?: number | null
          price_code?: string | null
          price_code_non_capped?: string | null
          price_fob_vessel?: number | null
          price_fob_vessel_adj_cv?: number | null
          price_non_capped?: number | null
          price_non_capped_adj_lp_cv_acc?: number | null
          pricing_period?: string | null
          product?: string | null
          product_marketing?: string | null
          pungutan_blu?: number | null
          region?: string | null
          revenue?: number | null
          revenue_adj_load_port_cv?: number | null
          revenue_adj_loadport?: number | null
          revenue_capped?: number | null
          revenue_fob_vessel_cv?: number | null
          revenue_non_capped?: number | null
          revenue_non_capped_adj_lp_cv_acc?: number | null
          sales_status?: string | null
          settled_floating?: string | null
          ship_code?: string | null
          ship_code_omdb?: string | null
          terminal?: string | null
          tm?: number | null
          total_qty?: number | null
          ts_adb?: number | null
          updated_at?: string | null
          vessel?: string | null
          year?: number | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
