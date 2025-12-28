
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { BioInfo, Project, Interest } from '../types';

const supabaseUrl = 'https://olqjgzqoutuhbooguhys.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9scWpnenFvdXR1aGJvb2d1aHlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NDc5NzYsImV4cCI6MjA4MjUyMzk3Nn0.yjqP8N9SFN1Cpq-HH4vYIVO-JXUKUu7Qdi4tnJcKqZg';
const supabase = createClient(supabaseUrl, supabaseKey);

export const supabaseService = {
  // Bio
  async getBio(): Promise<BioInfo | null> {
    const { data, error } = await supabase.from('portfolio_bio').select('*').limit(1).maybeSingle();
    if (error) {
      console.error("Error fetching bio:", error);
      return null;
    }
    return data as BioInfo;
  },
  async updateBio(bio: BioInfo) {
    // Busca o registro existente para manter o mesmo ID (UUID)
    const { data: existing } = await supabase.from('portfolio_bio').select('id').limit(1).maybeSingle();
    const payload = existing?.id ? { ...bio, id: existing.id } : bio;
    const { error } = await supabase.from('portfolio_bio').upsert(payload);
    return { error };
  },

  // Projetos
  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase.from('portfolio_projects').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return data as Project[];
  },
  async syncProjects(projects: Project[]) {
    // Upsert dos projetos (garantindo que IDs sejam compatíveis com UUID se necessário)
    const { error } = await supabase.from('portfolio_projects').upsert(projects);
    return { error };
  },

  // Interesses
  async getInterests(): Promise<Interest[]> {
    const { data, error } = await supabase.from('portfolio_interests').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return data as Interest[];
  },
  async syncInterests(interests: Interest[]) {
    const { error } = await supabase.from('portfolio_interests').upsert(interests);
    return { error };
  }
};
