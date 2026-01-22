/**
 * This file will be auto-generated after creating your Supabase project.
 *
 * To generate types, run:
 * supabase gen types typescript --project-id [your-project-ref] --schema public > src/lib/supabase/database.types.ts
 *
 * For now, this placeholder provides basic type structure.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          id: string
          name: string
          nim: string
          email: string
          phone: string | null
          photo: string | null
          batch: string
          status: string
          division: string | null
          position: string | null
          joined_at: string
          graduated_at: string | null
          bio: string | null
          interests: string[] | null
          achievements: string[] | null
          social_media: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          nim: string
          email: string
          phone?: string | null
          photo?: string | null
          batch: string
          status: string
          division?: string | null
          position?: string | null
          joined_at: string
          graduated_at?: string | null
          bio?: string | null
          interests?: string[] | null
          achievements?: string[] | null
          social_media?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          nim?: string
          email?: string
          phone?: string | null
          photo?: string | null
          batch?: string
          status?: string
          division?: string | null
          position?: string | null
          joined_at?: string
          graduated_at?: string | null
          bio?: string | null
          interests?: string[] | null
          achievements?: string[] | null
          social_media?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string
          content: string
          category: string
          author: Json
          author_id: string
          status: 'draft' | 'pending' | 'published' | 'archived'
          cover_image: string
          published_at: string
          updated_at: string | null
          tags: string[]
          featured: boolean
          views: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt: string
          content: string
          category: string
          author: Json
          author_id: string
          status?: 'draft' | 'pending' | 'published' | 'archived'
          cover_image: string
          published_at: string
          updated_at?: string | null
          tags?: string[]
          featured?: boolean
          views?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string
          content?: string
          category?: string
          author?: Json
          author_id?: string
          status?: 'draft' | 'pending' | 'published' | 'archived'
          cover_image?: string
          published_at?: string
          updated_at?: string | null
          tags?: string[]
          featured?: boolean
          views?: number
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          content: string
          category: string
          status: string
          start_date: string
          end_date: string
          location: Json
          cover_image: string
          images: string[] | null
          organizer: Json
          creator_id: string
          registration_url: string | null
          registration_deadline: string | null
          max_participants: number | null
          current_participants: number
          tags: string[]
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          content: string
          category: string
          status: string
          start_date: string
          end_date: string
          location: Json
          cover_image: string
          images?: string[] | null
          organizer: Json
          creator_id: string
          registration_url?: string | null
          registration_deadline?: string | null
          max_participants?: number | null
          current_participants?: number
          tags?: string[]
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          content?: string
          category?: string
          status?: string
          start_date?: string
          end_date?: string
          location?: Json
          cover_image?: string
          images?: string[] | null
          organizer?: Json
          creator_id?: string
          registration_url?: string | null
          registration_deadline?: string | null
          max_participants?: number | null
          current_participants?: number
          tags?: string[]
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      leadership: {
        Row: {
          id: string
          name: string
          position: string
          division: string | null
          photo: string
          email: string | null
          phone: string | null
          nim: string | null
          batch: string | null
          bio: string | null
          social_media: Json | null
          period_start: string
          period_end: string
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          position: string
          division?: string | null
          photo: string
          email?: string | null
          phone?: string | null
          nim?: string | null
          batch?: string | null
          bio?: string | null
          social_media?: Json | null
          period_start: string
          period_end: string
          order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          position?: string
          division?: string | null
          photo?: string
          email?: string | null
          phone?: string | null
          nim?: string | null
          batch?: string | null
          bio?: string | null
          social_media?: Json | null
          period_start?: string
          period_end?: string
          order?: number
          created_at?: string
          updated_at?: string
        }
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
  }
}
