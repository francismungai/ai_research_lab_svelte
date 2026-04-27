import { supabase } from '$lib/supabase';
import { base } from '$app/paths';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => {
  // Fetch research papers (is_sample = false)
  const { data: researchPapers, error: papersError } = await supabase
    .from('publications')
    .select('*')
    .eq('is_sample', false)
    .order('pub_year', { ascending: false });

  if (papersError) {
    console.error('Error fetching research papers:', papersError.message);
  }

  // Fetch sample publications (is_sample = true)
  const { data: samplePubs, error: samplesError } = await supabase
    .from('publications')
    .select('*')
    .eq('is_sample', true)
    .order('pub_year', { ascending: false });

  if (samplesError) {
    console.error('Error fetching sample publications:', samplesError.message);
  }

  // Fetch books
  const { data: books, error: booksError } = await supabase
    .from('books')
    .select('*')
    .order('pub_year', { ascending: false });

  if (booksError) {
    console.error('Error fetching books:', booksError.message);
  }

  // Group sample publications by year to reconstruct year-sections
  const yearMap = new Map<string, typeof samplePubs>();
  for (const pub of samplePubs ?? []) {
    const year = pub.pub_year ?? 'Unknown';
    if (!yearMap.has(year)) {
      yearMap.set(year, []);
    }
    yearMap.get(year)!.push(pub);
  }

  const yearSections = Array.from(yearMap.entries())
    .sort((a, b) => b[0].localeCompare(a[0])) // descending by year
    .map(([year, publications]) => ({
      year,
      summary: `${publications.length} journal article${publications.length !== 1 ? 's' : ''}`,
      publications: publications.map(p => ({
        authors: p.authors ?? '',
        title: p.title,
        venue: p.venue ?? '',
        year: p.pub_year ?? '',
        linkUrl: p.paper_url ?? '',
        linkLabel: p.paper_url?.includes('arxiv') ? 'arXiv' : 'DOI'
      }))
    }));

  // Map research papers to the shape the UI expects
  const publications = (researchPapers ?? []).map(p => ({
    title: p.title,
    authors: p.authors ?? '',
    description: p.description ?? '',
    venue: p.venue ?? '',
    year: p.pub_year ?? '',
    paperUrl: p.paper_url ?? '',
    codeUrl: p.code_url ?? ''
  }));

  // Map books to the shape the UI expects
  const mappedBooks = (books ?? []).map(b => ({
    title: b.title,
    authors: b.authors ?? '',
    description: b.description ?? '',
    publisher: b.publisher ?? '',
    year: b.pub_year ?? '',
    isbn: b.isbn ?? '',
    amazonUrl: b.amazon_url ?? '',
    publisherUrl: b.publisher_url ?? '',
    imageUrl: b.image_url ? `${base}${b.image_url}` : ''
  }));

  return {
    publications,
    books: mappedBooks,
    yearSections,
    sampleCount: samplePubs?.length ?? 0
  };
};
