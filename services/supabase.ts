
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { BioInfo, Project, Interest, Post } from '../types';

const supabaseUrl = 'https://olqjgzqoutuhbooguhys.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9scWpnenFvdXR1aGJvb2d1aHlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NDc5NzYsImV4cCI6MjA4MjUyMzk3Nn0.yjqP8N9SFN1Cpq-HH4vYIVO-JXUKUu7Qdi4tnJcKqZg';
const supabase = createClient(supabaseUrl, supabaseKey);

export const supabaseService = {
  // Bio / Perfil
  async getBio(): Promise<BioInfo | null> {
    try {
      const { data, error } = await supabase.from('portfolio_bio').select('*').limit(1).maybeSingle();
      if (error) throw error;
      return data as BioInfo;
    } catch (error) {
      console.warn("Supabase/Network error fetching bio (using local fallback):", error);
      return null;
    }
  },
  
  async updateBio(bio: BioInfo) {
    try {
      const { data: existing } = await supabase.from('portfolio_bio').select('id').limit(1).maybeSingle();
      const payload = existing?.id ? { ...bio, id: existing.id } : bio;
      const { error } = await supabase.from('portfolio_bio').upsert(payload);
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error("Error updating bio:", error);
      return { error };
    }
  },

  // Conteúdo Universal (Headless CMS Core)
  async getUniversalContents(type?: string): Promise<Post[]> {
    try {
      let query = supabase.from('contents').select('*').order('updated_at', { ascending: false });
      if (type) query = query.eq('type', type);
      
      const { data, error } = await query;
      if (error) throw error;
      
      return data.map(item => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        type: item.type,
        status: item.status,
        blocks: item.content_json?.blocks || [],
        seo_data: item.seo_data,
        updatedAt: item.updated_at
      }));
    } catch (error) {
      console.warn("Supabase/Network error fetching contents:", error);
      return [];
    }
  },

  async saveUniversalContent(post: Post) {
    try {
      const payload = {
        id: post.id || undefined,
        title: post.title,
        slug: post.slug,
        type: post.type,
        status: post.status,
        content_json: { blocks: post.blocks },
        seo_data: post.seo_data,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase.from('contents').upsert(payload).select().single();
      
      if (error) throw error;

      if (data) {
        // Versionamento automático - Snapshot do estado atual
        // Não bloqueia o retorno se falhar
        supabase.from('content_versions').insert({
          content_id: data.id,
          content_snapshot: { blocks: post.blocks },
          created_at: new Date().toISOString()
        }).then(({ error: vError }) => {
          if (vError) console.warn("Failed to create version snapshot", vError);
        });
      }
      
      return { data, error: null };
    } catch (error: any) {
      console.error("Error saving content:", error);
      return { data: null, error };
    }
  },

  // Upload de Imagem para Storage
  async uploadImage(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `cms/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio') 
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  },

  // Métodos Legados / Específicos (Sync manual para tabelas fixas)
  async getProjects(): Promise<Project[]> {
    try {
      const { data, error } = await supabase.from('portfolio_projects').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Project[];
    } catch (error) {
      console.warn("Supabase/Network error fetching projects (using local fallback):", error);
      return [];
    }
  },
  
  async syncProjects(projects: Project[]) {
    try {
      const { error } = await supabase.from('portfolio_projects').upsert(projects);
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error("Error syncing projects:", error);
      return { error };
    }
  },

  async getInterests(): Promise<Interest[]> {
    try {
      const { data, error } = await supabase.from('portfolio_interests').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Interest[];
    } catch (error) {
      console.warn("Supabase/Network error fetching interests (using local fallback):", error);
      return [];
    }
  },
  
  async syncInterests(interests: Interest[]) {
    try {
      const { error } = await supabase.from('portfolio_interests').upsert(interests);
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error("Error syncing interests:", error);
      return { error };
    }
  }
};
