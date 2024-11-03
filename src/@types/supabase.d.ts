export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      attachments: {
        Row: {
          as_image: boolean;
          created_at: string | null;
          has_error: boolean;
          id: string;
          image_height: number | null;
          image_width: number | null;
          last_modified: string;
          message_id: number;
          mime_type: string;
          name: string;
          upload_url: string | null;
        };
        Insert: {
          as_image?: boolean;
          created_at?: string | null;
          has_error?: boolean;
          id?: string;
          image_height?: number | null;
          image_width?: number | null;
          last_modified: string;
          message_id: number;
          mime_type: string;
          name: string;
          upload_url?: string | null;
        };
        Update: {
          as_image?: boolean;
          created_at?: string | null;
          has_error?: boolean;
          id?: string;
          image_height?: number | null;
          image_width?: number | null;
          last_modified?: string;
          message_id?: number;
          mime_type?: string;
          name?: string;
          upload_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "attachments_message_id_fkey";
            columns: ["message_id"];
            referencedRelation: "messages";
            referencedColumns: ["id"];
          }
        ];
      };
      channels: {
        Row: {
          auto_join: boolean;
          created_at: string | null;
          description: string | null;
          id: number;
          is_dm: boolean;
          members_can_edit: boolean;
          name: string | null;
          owner: string;
          password: string | null;
          privacy_level: number;
        };
        Insert: {
          auto_join?: boolean;
          created_at?: string | null;
          description?: string | null;
          id?: number;
          is_dm: boolean;
          members_can_edit?: boolean;
          name?: string | null;
          owner: string;
          password?: string | null;
          privacy_level: number;
        };
        Update: {
          auto_join?: boolean;
          created_at?: string | null;
          description?: string | null;
          id?: number;
          is_dm?: boolean;
          members_can_edit?: boolean;
          name?: string | null;
          owner?: string;
          password?: string | null;
          privacy_level?: number;
        };
        Relationships: [
          {
            foreignKeyName: "channels_owner_fkey";
            columns: ["owner"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      members: {
        Row: {
          accepted: boolean;
          actor: string | null;
          channel_id: number;
          invite_message: string | null;
          last_view: string;
          user_id: string;
        };
        Insert: {
          accepted: boolean;
          actor?: string | null;
          channel_id: number;
          invite_message?: string | null;
          last_view?: string;
          user_id: string;
        };
        Update: {
          accepted?: boolean;
          actor?: string | null;
          channel_id?: number;
          invite_message?: string | null;
          last_view?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "members_actor_fkey";
            columns: ["actor"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "members_channel_id_fkey";
            columns: ["channel_id"];
            referencedRelation: "channels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "members_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      messages: {
        Row: {
          channel_id: number;
          id: number;
          markdown: string;
          replying_to: number | null;
          rich: Json | null;
          sent_at: string;
          user_id: string | null;
        };
        Insert: {
          channel_id: number;
          id?: never;
          markdown: string;
          replying_to?: number | null;
          rich?: Json | null;
          sent_at?: string;
          user_id?: string | null;
        };
        Update: {
          channel_id?: number;
          id?: never;
          markdown?: string;
          replying_to?: number | null;
          rich?: Json | null;
          sent_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "messages_channel_id_fkey";
            columns: ["channel_id"];
            referencedRelation: "channels";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_replying_to_fkey";
            columns: ["replying_to"];
            referencedRelation: "messages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          admin: boolean;
          banner_url: string | null;
          bot_webhook: string | null;
          disabled: boolean;
          email: string | null;
          id: string;
          is_bot: boolean;
          name: string;
          nickname: string;
          profile_picture_url: string | null;
          verified: boolean;
        };
        Insert: {
          admin?: boolean;
          banner_url?: string | null;
          bot_webhook?: string | null;
          disabled?: boolean;
          email?: string | null;
          id: string;
          is_bot: boolean;
          name: string;
          nickname: string;
          profile_picture_url?: string | null;
          verified: boolean;
        };
        Update: {
          admin?: boolean;
          banner_url?: string | null;
          bot_webhook?: string | null;
          disabled?: boolean;
          email?: string | null;
          id?: string;
          is_bot?: boolean;
          name?: string;
          nickname?: string;
          profile_picture_url?: string | null;
          verified?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "users_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      joined_channels: {
        Row: {
          channel_id: number | null;
        };
        Insert: {
          channel_id?: number | null;
        };
        Update: {
          channel_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "members_channel_id_fkey";
            columns: ["channel_id"];
            referencedRelation: "channels";
            referencedColumns: ["id"];
          }
        ];
      };
      visible_channels: {
        Row: {
          channel_id: number | null;
        };
        Insert: {
          channel_id?: number | null;
        };
        Update: {
          channel_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "members_channel_id_fkey";
            columns: ["channel_id"];
            referencedRelation: "channels";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey";
            columns: ["owner"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey";
            columns: ["bucket_id"];
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: unknown;
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
