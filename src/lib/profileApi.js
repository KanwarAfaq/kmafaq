import { supabase } from './supabase';

export async function getProfileSettings() {
  const { data, error } = await supabase
    .from('profile_settings')
    .select('*')
    .order('id', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertProfileSettings(payload) {
  const clean = {
    ...payload,
    papers_count: Number(payload.papers_count || 0),
    projects_count: Number(payload.projects_count || 0),
    datasets_count: Number(payload.datasets_count || 0),
    repos_count: Number(payload.repos_count || 0),
    updated_at: new Date().toISOString(),
  };

  if (clean.id) {
    const { data, error } = await supabase
      .from('profile_settings')
      .update(clean)
      .eq('id', clean.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from('profile_settings')
    .insert([clean])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getProfileTimeline() {
  const { data, error } = await supabase
    .from('profile_timeline')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createTimelineItem(payload) {
  const { data, error } = await supabase
    .from('profile_timeline')
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTimelineItem(id, payload) {
  const { data, error } = await supabase
    .from('profile_timeline')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTimelineItem(id) {
  const { error } = await supabase
    .from('profile_timeline')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}
