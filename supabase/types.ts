export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      "dice-logs": {
        Row: {
          roomId: string;
          dice: Json;
          userId: number;
          createdAt: string | null;
          intent: string;
          id: number;
        };
        Insert: {
          roomId: string;
          dice: Json;
          userId: number;
          createdAt?: string | null;
          intent?: string;
          id?: number;
        };
        Update: {
          roomId?: string;
          dice?: Json;
          userId?: number;
          createdAt?: string | null;
          intent?: string;
          id?: number;
        };
      };
      "discord-users": {
        Row: {
          discordId: string;
          username: string;
          discriminator: string;
          avatar: string | null;
          createdAt: string | null;
          id: number;
        };
        Insert: {
          discordId: string;
          username: string;
          discriminator: string;
          avatar?: string | null;
          createdAt?: string | null;
          id?: number;
        };
        Update: {
          discordId?: string;
          username?: string;
          discriminator?: string;
          avatar?: string | null;
          createdAt?: string | null;
          id?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

