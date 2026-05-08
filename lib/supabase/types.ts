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
