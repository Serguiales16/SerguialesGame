// This file is auto-generated based on your Supabase schema
// You can regenerate it using: npx supabase gen types typescript --project-id your-project-ref > types/supabase.ts

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
            profiles: {
                Row: {
                    id: string
                    username: string
                    created_at: string
                }
                Insert: {
                    id: string
                    username: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    username?: string
                    created_at?: string
                }
            }
            games: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    platform: string
                    status: string
                    completion_percentage: number
                    cover_url: string | null
                    sessions: Json
                    last_played: string | null
                    notes: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    platform: string
                    status: string
                    completion_percentage?: number
                    cover_url?: string | null
                    sessions?: Json
                    last_played?: string | null
                    notes?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    platform?: string
                    status?: string
                    completion_percentage?: number
                    cover_url?: string | null
                    sessions?: Json
                    last_played?: string | null
                    notes?: string
                    created_at?: string
                }
            }
            ideas: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string
                    tags: string[]
                    priority: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    description?: string
                    tags?: string[]
                    priority?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    description?: string
                    tags?: string[]
                    priority?: string
                    created_at?: string
                }
            }
            apps: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    description: string
                    url: string | null
                    tech_stack: string[]
                    status: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    description?: string
                    url?: string | null
                    tech_stack?: string[]
                    status?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    description?: string
                    url?: string | null
                    tech_stack?: string[]
                    status?: string
                    created_at?: string
                }
            }
            learning_items: {
                Row: {
                    id: string
                    user_id: string
                    topic: string
                    category: string
                    status: string
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    topic: string
                    category: string
                    status?: string
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    topic?: string
                    category?: string
                    status?: string
                    notes?: string | null
                    created_at?: string
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
