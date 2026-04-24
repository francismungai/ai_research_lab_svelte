import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { facultyData } from '../src/lib/data/faculty.js';
import { studentsData } from '../src/lib/data/students.js';
import { alumniData } from '../src/lib/data/alumni.js';
import { staffData } from '../src/lib/data/staff.js';
import { collaboratorsData } from '../src/lib/data/collaborators.js';
import { PUBLICATIONS, BOOKS } from '../src/lib/data/publications.js';
import { PUBLICATIONS_BY_YEAR } from '../src/lib/data/publicationsByYear.js';

// Load .env file
dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
// Use service role key if available to bypass RLS, otherwise fallback to anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Starting DB seed...");
  
  // 1. Seed People
  const allPeople = [
    ...facultyData.map(p => ({ ...p, category: 'faculty' })),
    ...studentsData.map(p => ({ ...p, category: 'student' })),
    ...staffData.map(p => ({ ...p, category: 'staff' })),
    ...alumniData.map(p => ({ ...p, category: 'alumni' })),
    ...collaboratorsData.map(p => ({ ...p, category: 'collaborator' }))
  ];

  // Dedup people by name + role to avoid exact duplicates (like we did in the Svelte UI)
  const seenNames = new Set();
  const uniquePeople = allPeople.filter(p => {
    const key = `${p.name}-${p.role}`;
    if (seenNames.has(key)) return false;
    seenNames.add(key);
    return true;
  });

  const peopleToInsert = uniquePeople.map((p: any) => ({
    category: p.category,
    name: p.name,
    role: p.role || null,
    photo_url: p.photo || p.img || null,
    scholar_url: p.scholarUrl || p.scholar || null,
    dblp_url: p.dblpUrl || p.dblp || null,
    website_url: p.websiteUrl || p.url || null,
    degree: p.degree || null,
    grad_year: p.year || null,
    member_key: p.memberKey || null
  }));

  console.log(`Inserting ${peopleToInsert.length} people...`);
  const { error: peopleError } = await supabase.from('people').insert(peopleToInsert);
  if (peopleError) console.error("Error inserting people:", peopleError.message);
  else console.log("Successfully inserted people!");

  // 2. Seed Publications
  const flatSamples = PUBLICATIONS_BY_YEAR.flatMap(section => section.publications);
  
  const publicationsToInsert = [
    ...PUBLICATIONS.map(p => ({
      title: p.title,
      authors: p.authors,
      description: p.description || null,
      venue: p.venue || null,
      pub_year: p.year || null,
      paper_url: p.paperUrl || null,
      code_url: p.codeUrl || null,
      is_sample: false
    })),
    ...flatSamples.map(p => ({
      title: p.title,
      authors: p.authors,
      description: null,
      venue: p.venue || null,
      pub_year: p.year || null,
      paper_url: p.linkUrl || null,
      code_url: null,
      is_sample: true
    }))
  ];

  console.log(`Inserting ${publicationsToInsert.length} publications...`);
  const { error: pubError } = await supabase.from('publications').insert(publicationsToInsert);
  if (pubError) console.error("Error inserting publications:", pubError.message);
  else console.log("Successfully inserted publications!");

  // 3. Seed Books
  const booksToInsert = BOOKS.map(b => ({
    title: b.title,
    authors: b.authors,
    description: b.description || null,
    publisher: b.publisher || null,
    pub_year: b.year || null,
    isbn: b.isbn || null,
    amazon_url: b.amazonUrl || null,
    publisher_url: b.publisherUrl || null,
    image_url: b.imageUrl || null
  }));

  console.log(`Inserting ${booksToInsert.length} books...`);
  const { error: booksError } = await supabase.from('books').insert(booksToInsert);
  if (booksError) console.error("Error inserting books:", booksError.message);
  else console.log("Successfully inserted books!");

  console.log("Seeding complete!");
}

seed().catch(console.error);
