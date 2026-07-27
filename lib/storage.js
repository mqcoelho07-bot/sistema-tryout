import { supabase } from './supabase';

export async function getTryouts() {
  const { data, error } = await supabase
    .from('tryouts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Erro ao buscar tryouts:', error);
    return [];
  }
  return data;
}

export async function getTryoutById(id) {
  const { data, error } = await supabase
    .from('tryouts')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    console.error('Erro ao buscar tryout:', error);
    return null;
  }
  return data;
}

export async function createTryout(tryout) {
  const newTryout = {
    ...tryout,
    id: Date.now().toString(),
    tentativas: tryout.tentativas || []
  };
  const { data, error } = await supabase
    .from('tryouts')
    .insert([newTryout])
    .select()
    .single();
  if (error) {
    console.error('Erro ao criar tryout:', error);
    return null;
  }
  return data;
}

export async function updateTryout(id, updates) {
  const { data, error } = await supabase
    .from('tryouts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) {
    console.error('Erro ao atualizar tryout:', error);
    return null;
  }
  return data;
}

export async function deleteTryout(id) {
  const { error } = await supabase
    .from('tryouts')
    .delete()
    .eq('id', id);
  if (error) {
    console.error('Erro ao excluir tryout:', error);
  }
}
