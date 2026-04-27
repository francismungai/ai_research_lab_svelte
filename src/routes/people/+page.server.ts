import { supabase } from '$lib/supabase';
import { base } from '$app/paths';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => {
  const { data: rawPeople, error } = await supabase
    .from('people')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching people:', error.message);
  }

  // Map DB columns (snake_case) to the shape the UI expects (camelCase)
  const people = (rawPeople ?? []).map(p => ({
    name: p.name,
    role: p.role ?? '',
    img: p.photo_url ? `${base}${p.photo_url}` : null,
    scholar: p.scholar_url ?? null,
    dblp: p.dblp_url ?? null,
    website: p.website_url ?? null,
    category: p.category ?? '',
    degree: p.degree ?? null,
    gradYear: p.grad_year ?? null
  }));

  return { people };
};

