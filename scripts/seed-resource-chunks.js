require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!url || !key) {
  console.error('Missing Supabase URL or service role key.');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

function findResource(resources, terms) {
  return resources.find((resource) => {
    const combined = `${resource.title || ''} ${resource.description || ''} ${resource.file_path || ''}`.toLowerCase();
    return terms.some((term) => combined.includes(term.toLowerCase()));
  });
}

(async () => {
  const { data: resources, error } = await supabase
    .from('resource_library')
    .select('id,title,description,framework,tier,type,file_path,is_active')
    .eq('is_active', true);

  if (error) {
    console.error('Could not read resource_library:', error.message);
    process.exit(1);
  }

  const pmbok8 = findResource(resources || [], ['pmbok 8', 'pmbok8', 'eighth', 'eighthed']);
  const eco2026 = findResource(resources || [], ['eco 2026', 'content outline 2026', 'new-pmp']);
  const pmbok7 = findResource(resources || [], ['pmbok 7', 'pmbok7', 'seventh']);
  const eco2021 = findResource(resources || [], ['eco 2021', 'content outline 2021']);
  const rita = findResource(resources || [], ['rita']);

  const seeds = [
    {
      resource: pmbok8,
      framework: 'pmbok8',
      source_title: pmbok8?.title || 'PMBOK 8th Edition',
      language: 'both',
      chunk_title: 'PMBOK 8 canonical structure',
      topic_tags: ['pmbok8', 'principles', 'focus areas', 'performance domains', 'processes'],
      priority: 10,
      chunk_text:
        'PMBOK 8 is organized around six project management principles, five Project Management Focus Areas, seven Performance Domains, and 40 nonprescriptive processes. The six PMBOK 8 principles are: Adopt a Holistic View; Focus on Value; Embed Quality Into Processes and Deliverables; Be an Accountable Leader; Integrate Sustainability Within All Project Areas; Build an Empowered Culture. The five Focus Areas are: Initiating, Planning, Executing, Monitoring and Controlling, and Closing. The seven PMBOK 8 Performance Domains are: Governance, Scope, Schedule, Finance, Stakeholders, Resources, and Risk.',
    },
    {
      resource: eco2026,
      framework: 'pmbok8',
      source_title: eco2026?.title || 'ECO 2026',
      language: 'both',
      chunk_title: 'ECO 2026 domain weights and exam structure',
      topic_tags: ['eco2026', 'people', 'process', 'business environment', 'weights', 'exam structure'],
      priority: 10,
      chunk_text:
        'PMP ECO 2026 uses three exam domains with the following weights: People 33%, Process 41%, and Business Environment 26%. The PMP 2026 exam has 180 total questions, including 170 scored and 10 pretest/unscored questions. The exam time is 240 minutes. Approximately 40% of items represent predictive approaches and 60% represent adaptive/agile and hybrid approaches.',
    },
    {
      resource: pmbok7,
      framework: 'pmbok7',
      source_title: pmbok7?.title || 'PMBOK 7th Edition',
      language: 'both',
      chunk_title: 'PMBOK 7 canonical structure',
      topic_tags: ['pmbok7', 'principles', 'performance domains'],
      priority: 10,
      chunk_text:
        'PMBOK 7 uses 12 project management principles and 8 performance domains. The PMBOK 7 performance domains are: Stakeholders, Team, Development Approach and Life Cycle, Planning, Project Work, Delivery, Measurement, and Uncertainty. These PMBOK 7 performance domains must not be presented as PMBOK 8 performance domains.',
    },
    {
      resource: eco2021,
      framework: 'pmbok7',
      source_title: eco2021?.title || 'ECO 2021',
      language: 'both',
      chunk_title: 'ECO 2021 domain weights',
      topic_tags: ['eco2021', 'people', 'process', 'business environment', 'weights'],
      priority: 10,
      chunk_text:
        'PMP ECO 2021 uses three exam domains with the following weights: People 42%, Process 50%, and Business Environment 8%. This is the current PMBOK 7/ECO 2021 route weighting and must not be used for the PMBOK 8/ECO 2026 route.',
    },
    {
      resource: pmbok8,
      framework: 'both',
      source_title: 'PMBOK 7 to PMBOK 8 transition map',
      language: 'both',
      chunk_title: 'PMBOK 7 vs PMBOK 8 structural comparison',
      topic_tags: ['bridge', 'comparison', 'transition', 'pmbok7', 'pmbok8'],
      priority: 15,
      chunk_text:
        'PMBOK 7 and PMBOK 8 are related but structurally different. PMBOK 7 has 12 principles and 8 performance domains. PMBOK 8 has 6 principles, 5 Focus Areas, 7 Performance Domains, and 40 nonprescriptive processes. ECO domains are exam-content domains, while PMBOK Guide domains are knowledge/performance structure domains; they are related but not one-to-one equivalents.',
    },
    {
      resource: eco2026,
      framework: 'both',
      source_title: 'ECO 2021 to ECO 2026 transition map',
      language: 'both',
      chunk_title: 'ECO 2021 vs ECO 2026 weight comparison',
      topic_tags: ['bridge', 'eco2021', 'eco2026', 'weights', 'comparison'],
      priority: 15,
      chunk_text:
        'ECO 2021 weights are People 42%, Process 50%, and Business Environment 8%. ECO 2026 weights are People 33%, Process 41%, and Business Environment 26%. Bridge Mode should explain this as a transition comparison, not as a separate official exam structure.',
    },
    {
      resource: rita,
      framework: 'both',
      source_title: rita?.title || 'Rita Mulcahy PMP Exam Prep',
      language: 'both',
      chunk_title: 'Rita-style PMP answer discipline',
      topic_tags: ['rita', 'exam strategy', 'pmp mindset', 'proactive project manager'],
      priority: 25,
      chunk_text:
        'Rita-style PMP exam reasoning emphasizes a proactive project manager mindset: analyze before acting, communicate and collaborate before escalating, follow appropriate processes, tailor the approach to the project context, and avoid jumping to extreme actions unless justified by the scenario.',
    },
  ].filter((seed) => seed.resource);

  if (!seeds.length) {
    console.error('No matching active resources found for seeding.');
    process.exit(1);
  }

  for (const seed of seeds) {
    const payload = {
      resource_id: seed.resource.id,
      framework: seed.framework,
      source_title: seed.source_title,
      source_type: seed.resource.type || 'pdf',
      language: seed.language,
      chunk_title: seed.chunk_title,
      chunk_text: seed.chunk_text,
      topic_tags: seed.topic_tags,
      priority: seed.priority,
      is_active: true,
    };

    const { error: upsertError } = await supabase
      .from('resource_chunks')
      .upsert(payload, {
        onConflict: 'resource_id,chunk_title,language',
      });

    if (upsertError) {
      console.error(`Failed to seed chunk "${seed.chunk_title}":`, upsertError.message);
      process.exit(1);
    }

    console.log(`Seeded: ${seed.chunk_title}`);
  }

  const { count, error: countError } = await supabase
    .from('resource_chunks')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Could not count resource_chunks:', countError.message);
    process.exit(1);
  }

  console.log(`Total resource_chunks: ${count}`);
})();
