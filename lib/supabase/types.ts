export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_name: string;
          body_html: string;
          category: string;
          cover_image_url: string | null;
          created_at: string;
          excerpt: string;
          id: string;
          is_published: boolean;
          published_at: string | null;
          read_time_minutes: number;
          slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          author_name?: string;
          body_html?: string;
          category?: string;
          cover_image_url?: string | null;
          created_at?: string;
          excerpt?: string;
          id?: string;
          is_published?: boolean;
          published_at?: string | null;
          read_time_minutes?: number;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          author_name?: string;
          body_html?: string;
          category?: string;
          cover_image_url?: string | null;
          created_at?: string;
          excerpt?: string;
          id?: string;
          is_published?: boolean;
          published_at?: string | null;
          read_time_minutes?: number;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      forms: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string;
          success_title: string;
          success_message: string;
          webhook_url: string | null;
          webhook_secret: string | null;
          webhook_meta: Json;
          notify_email: string | null;
          email_subject: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string;
          success_title?: string;
          success_message?: string;
          webhook_url?: string | null;
          webhook_secret?: string | null;
          webhook_meta?: Json;
          notify_email?: string | null;
          email_subject?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string;
          success_title?: string;
          success_message?: string;
          webhook_url?: string | null;
          webhook_secret?: string | null;
          webhook_meta?: Json;
          notify_email?: string | null;
          email_subject?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      form_questions: {
        Row: {
          id: string;
          form_id: string;
          sort_order: number;
          key: string;
          eyebrow: string;
          label: string;
          hint: string;
          type: "text" | "email" | "textarea" | "choice";
          placeholder: string;
          choices: Json;
          is_optional: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          form_id: string;
          sort_order?: number;
          key: string;
          eyebrow?: string;
          label: string;
          hint?: string;
          type?: "text" | "email" | "textarea" | "choice";
          placeholder?: string;
          choices?: Json;
          is_optional?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          form_id?: string;
          sort_order?: number;
          key?: string;
          eyebrow?: string;
          label?: string;
          hint?: string;
          type?: "text" | "email" | "textarea" | "choice";
          placeholder?: string;
          choices?: Json;
          is_optional?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      form_submissions: {
        Row: {
          id: string;
          form_id: string;
          payload: Json;
          webhook_status: "pending" | "sent" | "failed" | "skipped";
          webhook_status_code: number | null;
          webhook_response: string | null;
          webhook_attempted_at: string | null;
          email_status: "pending" | "sent" | "failed" | "skipped";
          email_response: string | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
          read_at: string | null;
        };
        Insert: {
          id?: string;
          form_id: string;
          payload?: Json;
          webhook_status?: "pending" | "sent" | "failed" | "skipped";
          webhook_status_code?: number | null;
          webhook_response?: string | null;
          webhook_attempted_at?: string | null;
          email_status?: "pending" | "sent" | "failed" | "skipped";
          email_response?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
          read_at?: string | null;
        };
        Update: {
          id?: string;
          form_id?: string;
          payload?: Json;
          webhook_status?: "pending" | "sent" | "failed" | "skipped";
          webhook_status_code?: number | null;
          webhook_response?: string | null;
          webhook_attempted_at?: string | null;
          email_status?: "pending" | "sent" | "failed" | "skipped";
          email_response?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
          read_at?: string | null;
        };
        Relationships: [];
      };
      faqs: {
        Row: {
          answer_html: string;
          created_at: string;
          id: string;
          is_visible: boolean;
          question: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          answer_html?: string;
          created_at?: string;
          id?: string;
          is_visible?: boolean;
          question: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          answer_html?: string;
          created_at?: string;
          id?: string;
          is_visible?: boolean;
          question?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      founding_spots: {
        Row: {
          claimed_spots: number;
          id: number;
          total_spots: number;
          updated_at: string;
        };
        Insert: {
          claimed_spots?: number;
          id?: number;
          total_spots?: number;
          updated_at?: string;
        };
        Update: {
          claimed_spots?: number;
          id?: number;
          total_spots?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      badge_events: {
        Row: {
          id: string;
          badge_id: string;
          kind: "powered" | "book";
          shape: "pill" | "card" | "stamp" | null;
          referer_host: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          badge_id: string;
          kind: "powered" | "book";
          shape?: "pill" | "card" | "stamp" | null;
          referer_host?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          badge_id?: string;
          kind?: "powered" | "book";
          shape?: "pill" | "card" | "stamp" | null;
          referer_host?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      support_tickets: {
        Row: {
          id: string;
          status: "new" | "in_progress" | "completed";
          category:
            | "technical"
            | "billing"
            | "feature_request"
            | "account"
            | "other";
          subject: string;
          description: string;
          account_id: string | null;
          account_email: string | null;
          account_name: string | null;
          account_metadata: Json;
          page_url: string | null;
          app_version: string | null;
          user_agent: string | null;
          browser: string | null;
          os: string | null;
          viewport: string | null;
          console_errors: Json;
          source: string;
          internal_notes: string;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          status?: "new" | "in_progress" | "completed";
          category?:
            | "technical"
            | "billing"
            | "feature_request"
            | "account"
            | "other";
          subject: string;
          description: string;
          account_id?: string | null;
          account_email?: string | null;
          account_name?: string | null;
          account_metadata?: Json;
          page_url?: string | null;
          app_version?: string | null;
          user_agent?: string | null;
          browser?: string | null;
          os?: string | null;
          viewport?: string | null;
          console_errors?: Json;
          source?: string;
          internal_notes?: string;
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          status?: "new" | "in_progress" | "completed";
          category?:
            | "technical"
            | "billing"
            | "feature_request"
            | "account"
            | "other";
          subject?: string;
          description?: string;
          account_id?: string | null;
          account_email?: string | null;
          account_name?: string | null;
          account_metadata?: Json;
          page_url?: string | null;
          app_version?: string | null;
          user_agent?: string | null;
          browser?: string | null;
          os?: string | null;
          viewport?: string | null;
          console_errors?: Json;
          source?: string;
          internal_notes?: string;
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
          resolved_at?: string | null;
        };
        Relationships: [];
      };
      support_notify_emails: {
        Row: {
          id: string;
          email: string;
          label: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          label?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          label?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      trust_logos: {
        Row: {
          created_at: string;
          id: string;
          is_visible: boolean;
          logo_url: string | null;
          name: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_visible?: boolean;
          logo_url?: string | null;
          name: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_visible?: boolean;
          logo_url?: string | null;
          name?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      story_timeline: {
        Row: {
          created_at: string;
          id: string;
          year: string;
          body: string;
          image_url: string | null;
          sort_order: number;
          is_visible: boolean;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          year: string;
          body: string;
          image_url?: string | null;
          sort_order?: number;
          is_visible?: boolean;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          year?: string;
          body?: string;
          image_url?: string | null;
          sort_order?: number;
          is_visible?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      help_centre_sections: {
        Row: {
          id: string;
          slug: string;
          num: number;
          title: string;
          tagline: string;
          intro: string | null;
          image_url: string | null;
          image_alt: string | null;
          is_published: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          num?: number;
          title: string;
          tagline?: string;
          intro?: string | null;
          image_url?: string | null;
          image_alt?: string | null;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          num?: number;
          title?: string;
          tagline?: string;
          intro?: string | null;
          image_url?: string | null;
          image_alt?: string | null;
          is_published?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      help_centre_subsections: {
        Row: {
          id: string;
          section_id: string;
          title: string;
          route: string | null;
          what_it_does: string | null;
          how_to_use: string[];
          items: Json;
          images: Json;
          sort_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          title: string;
          route?: string | null;
          what_it_does?: string | null;
          how_to_use?: string[];
          items?: Json;
          images?: Json;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_id?: string;
          title?: string;
          route?: string | null;
          what_it_does?: string | null;
          how_to_use?: string[];
          items?: Json;
          images?: Json;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "help_centre_subsections_section_id_fkey";
            columns: ["section_id"];
            isOneToOne: false;
            referencedRelation: "help_centre_sections";
            referencedColumns: ["id"];
          },
        ];
      };
      command_centre_state: {
        Row: {
          id: string;
          data: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          data?: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          data?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
export type Faq = Database["public"]["Tables"]["faqs"]["Row"];
export type TrustLogo = Database["public"]["Tables"]["trust_logos"]["Row"];
export type FoundingSpots = Database["public"]["Tables"]["founding_spots"]["Row"];
export type Form = Database["public"]["Tables"]["forms"]["Row"];
export type FormQuestion = Database["public"]["Tables"]["form_questions"]["Row"];
export type FormSubmission = Database["public"]["Tables"]["form_submissions"]["Row"];
export type QuestionType = FormQuestion["type"];
export type SupportTicket = Database["public"]["Tables"]["support_tickets"]["Row"];
export type SupportTicketStatus = SupportTicket["status"];
export type StoryTimelineEntry = Database["public"]["Tables"]["story_timeline"]["Row"];
export type SupportTicketCategory = SupportTicket["category"];
export type SupportNotifyEmail =
  Database["public"]["Tables"]["support_notify_emails"]["Row"];
export type HelpCentreSection = Database["public"]["Tables"]["help_centre_sections"]["Row"];
export type HelpCentreSubsection = Database["public"]["Tables"]["help_centre_subsections"]["Row"];
