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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      cbt_sessions: {
        Row: {
          alternative_thoughts: string | null
          behaviors: string | null
          created_at: string
          date: string
          emotions: string | null
          id: string
          module_type: string
          notes: string | null
          outcome: string | null
          situation: string | null
          thoughts: string | null
          user_id: string
        }
        Insert: {
          alternative_thoughts?: string | null
          behaviors?: string | null
          created_at?: string
          date?: string
          emotions?: string | null
          id?: string
          module_type: string
          notes?: string | null
          outcome?: string | null
          situation?: string | null
          thoughts?: string | null
          user_id: string
        }
        Update: {
          alternative_thoughts?: string | null
          behaviors?: string | null
          created_at?: string
          date?: string
          emotions?: string | null
          id?: string
          module_type?: string
          notes?: string | null
          outcome?: string | null
          situation?: string | null
          thoughts?: string | null
          user_id?: string
        }
        Relationships: []
      }
      crisis_plans: {
        Row: {
          coping_strategies: string[] | null
          created_at: string
          emergency_contacts: Json | null
          id: string
          professional_contacts: Json | null
          reasons_to_live: string[] | null
          safe_environment: string | null
          support_contacts: Json | null
          updated_at: string
          user_id: string
          warning_signs: string[] | null
        }
        Insert: {
          coping_strategies?: string[] | null
          created_at?: string
          emergency_contacts?: Json | null
          id?: string
          professional_contacts?: Json | null
          reasons_to_live?: string[] | null
          safe_environment?: string | null
          support_contacts?: Json | null
          updated_at?: string
          user_id: string
          warning_signs?: string[] | null
        }
        Update: {
          coping_strategies?: string[] | null
          created_at?: string
          emergency_contacts?: Json | null
          id?: string
          professional_contacts?: Json | null
          reasons_to_live?: string[] | null
          safe_environment?: string | null
          support_contacts?: Json | null
          updated_at?: string
          user_id?: string
          warning_signs?: string[] | null
        }
        Relationships: []
      }
      exposure_goals: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          difficulty_level: number | null
          goal: string
          id: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: number | null
          goal: string
          id?: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: number | null
          goal?: string
          id?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      exposure_sessions: {
        Row: {
          anxiety_after: number
          anxiety_before: number
          created_at: string
          date: string
          duration: number | null
          goal_id: string | null
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          anxiety_after: number
          anxiety_before: number
          created_at?: string
          date?: string
          duration?: number | null
          goal_id?: string | null
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          anxiety_after?: number
          anxiety_before?: number
          created_at?: string
          date?: string
          duration?: number | null
          goal_id?: string | null
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exposure_sessions_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "exposure_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_milestones: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string
          goal_id: string
          id: string
          title: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          goal_id: string
          id?: string
          title: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string
          goal_id?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_milestones_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          category: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          progress: number | null
          status: string
          target_date: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          progress?: number | null
          status?: string
          target_date?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          progress?: number | null
          status?: string
          target_date?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      gratitude_entries: {
        Row: {
          category: string | null
          content: string
          created_at: string
          date: string
          id: string
          prompt_id: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          date?: string
          id?: string
          prompt_id?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          date?: string
          id?: string
          prompt_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gratitude_entries_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "gratitude_prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      gratitude_prompts: {
        Row: {
          category: string
          created_at: string
          difficulty: string
          id: string
          is_active: boolean
          prompt: string
          provider_id: string | null
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          difficulty?: string
          id?: string
          is_active?: boolean
          prompt: string
          provider_id?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          difficulty?: string
          id?: string
          is_active?: boolean
          prompt?: string
          provider_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gratitude_prompts_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_logs: {
        Row: {
          completed: boolean
          created_at: string
          date: string
          habit_name: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          date?: string
          habit_name: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          date?: string
          habit_name?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          audio_url: string | null
          content: string
          created_at: string
          duration: number | null
          id: string
          is_voice_entry: boolean | null
          mood: string | null
          prompt_id: string | null
          tags: string[] | null
          title: string
          transcript: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          audio_url?: string | null
          content: string
          created_at?: string
          duration?: number | null
          id?: string
          is_voice_entry?: boolean | null
          mood?: string | null
          prompt_id?: string | null
          tags?: string[] | null
          title: string
          transcript?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          audio_url?: string | null
          content?: string
          created_at?: string
          duration?: number | null
          id?: string
          is_voice_entry?: boolean | null
          mood?: string | null
          prompt_id?: string | null
          tags?: string[] | null
          title?: string
          transcript?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "journal_prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_prompts: {
        Row: {
          category: string
          created_at: string
          difficulty: string
          id: string
          is_active: boolean
          prompt: string
          provider_id: string | null
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          difficulty?: string
          id?: string
          is_active?: boolean
          prompt: string
          provider_id?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          difficulty?: string
          id?: string
          is_active?: boolean
          prompt?: string
          provider_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_prompts_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mindfulness_exercises: {
        Row: {
          category: string
          created_at: string
          duration: number
          id: string
          is_active: boolean
          prompt: string
          provider_id: string | null
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          duration?: number
          id?: string
          is_active?: boolean
          prompt: string
          provider_id?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          duration?: number
          id?: string
          is_active?: boolean
          prompt?: string
          provider_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mindfulness_exercises_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mindfulness_sessions: {
        Row: {
          completed_at: string
          date: string
          duration: number
          exercise_id: string | null
          id: string
          notes: string | null
          quality: string | null
          session_type: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          date?: string
          duration: number
          exercise_id?: string | null
          id?: string
          notes?: string | null
          quality?: string | null
          session_type: string
          user_id: string
        }
        Update: {
          completed_at?: string
          date?: string
          duration?: number
          exercise_id?: string | null
          id?: string
          notes?: string | null
          quality?: string | null
          session_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mindfulness_sessions_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "mindfulness_exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_entries: {
        Row: {
          created_at: string
          date: string
          exercise: boolean | null
          factors: string[] | null
          id: string
          intensity: number
          location: string | null
          mood: string
          note: string | null
          sleep_hours: number | null
          user_id: string
          weather_condition: string | null
          weather_humidity: number | null
          weather_location: string | null
          weather_temperature: number | null
        }
        Insert: {
          created_at?: string
          date?: string
          exercise?: boolean | null
          factors?: string[] | null
          id?: string
          intensity: number
          location?: string | null
          mood: string
          note?: string | null
          sleep_hours?: number | null
          user_id: string
          weather_condition?: string | null
          weather_humidity?: number | null
          weather_location?: string | null
          weather_temperature?: number | null
        }
        Update: {
          created_at?: string
          date?: string
          exercise?: boolean | null
          factors?: string[] | null
          id?: string
          intensity?: number
          location?: string | null
          mood?: string
          note?: string | null
          sleep_hours?: number | null
          user_id?: string
          weather_condition?: string | null
          weather_humidity?: number | null
          weather_location?: string | null
          weather_temperature?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          message: string
          patient_id: string | null
          priority: string
          provider_id: string
          read_at: string | null
          scheduled_at: string | null
          sent_at: string | null
          status: string
          title: string
          type: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          message: string
          patient_id?: string | null
          priority?: string
          provider_id: string
          read_at?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          title: string
          type?: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          message?: string
          patient_id?: string | null
          priority?: string
          provider_id?: string
          read_at?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      patient_invitations: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          patient_email: string
          patient_id: string | null
          patient_name: string
          provider_id: string
          status: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          patient_email: string
          patient_id?: string | null
          patient_name: string
          provider_id: string
          status?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          patient_email?: string
          patient_id?: string | null
          patient_name?: string
          provider_id?: string
          status?: string
          token?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_invitations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_invitations_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_provider_relationships: {
        Row: {
          created_at: string
          id: string
          patient_id: string
          provider_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          patient_id: string
          provider_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          patient_id?: string
          provider_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      progress_photos: {
        Row: {
          caption: string | null
          category: string | null
          created_at: string
          date: string
          id: string
          photo_url: string
          updated_at: string
          user_id: string
        }
        Insert: {
          caption?: string | null
          category?: string | null
          created_at?: string
          date?: string
          id?: string
          photo_url: string
          updated_at?: string
          user_id: string
        }
        Update: {
          caption?: string | null
          category?: string | null
          created_at?: string
          date?: string
          id?: string
          photo_url?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          provider_id: string | null
          question: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          provider_id?: string | null
          question: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          provider_id?: string | null
          question?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          author: string
          category: string
          created_at: string
          id: string
          is_active: boolean
          provider_id: string | null
          text: string
          updated_at: string
        }
        Insert: {
          author: string
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          provider_id?: string | null
          text: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          provider_id?: string | null
          text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reminders: {
        Row: {
          created_at: string
          frequency: string
          id: string
          is_active: boolean
          message: string
          provider_id: string | null
          time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          frequency?: string
          id?: string
          is_active?: boolean
          message: string
          provider_id?: string | null
          time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          frequency?: string
          id?: string
          is_active?: boolean
          message?: string
          provider_id?: string | null
          time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          created_at: string
          description: string
          file_type: string
          id: string
          is_active: boolean
          provider_id: string | null
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          description: string
          file_type?: string
          id?: string
          is_active?: boolean
          provider_id?: string | null
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string
          file_type?: string
          id?: string
          is_active?: boolean
          provider_id?: string | null
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "resources_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      toolkit_items: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          instructions: string | null
          is_active: boolean
          provider_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          id?: string
          instructions?: string | null
          is_active?: boolean
          provider_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          instructions?: string | null
          is_active?: boolean
          provider_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "toolkit_items_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_onboarding: {
        Row: {
          completed_at: string | null
          created_at: string
          current_step: string | null
          id: string
          onboarding_completed: boolean
          preferences: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_step?: string | null
          id?: string
          onboarding_completed?: boolean
          preferences?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_step?: string | null
          id?: string
          onboarding_completed?: boolean
          preferences?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_reminders: {
        Row: {
          created_at: string
          frequency: string
          id: string
          is_active: boolean
          message: string
          time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          frequency?: string
          id?: string
          is_active?: boolean
          message: string
          time?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          frequency?: string
          id?: string
          is_active?: boolean
          message?: string
          time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wellness_score_history: {
        Row: {
          breakdown: Json | null
          created_at: string
          date: string
          id: string
          score: number
          user_id: string
        }
        Insert: {
          breakdown?: Json | null
          created_at?: string
          date?: string
          id?: string
          score: number
          user_id: string
        }
        Update: {
          breakdown?: Json | null
          created_at?: string
          date?: string
          id?: string
          score?: number
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_patients_provider: {
        Args: { _patient_id: string; _provider_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "provider" | "patient" | "guest"
      user_role: "patient" | "provider" | "guest"
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
      app_role: ["admin", "provider", "patient", "guest"],
      user_role: ["patient", "provider", "guest"],
    },
  },
} as const
