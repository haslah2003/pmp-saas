require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const args = process.argv.slice(2);
const isCommit = args.includes('--commit');
const isDryRun = !isCommit;

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

function buildSeeds(resources) {
  const pmbok8 = findResource(resources, ['pmbok 8', 'pmbok8', 'eighth', 'eighthed']);
  const pmbok7 = findResource(resources, ['pmbok 7', 'pmbok7', 'seventh']);

  const seeds = [];

  if (pmbok8) {
    seeds.push(
      {
        resource: pmbok8,
        framework: 'pmbok8',
        source_title: pmbok8.title || 'PMBOK 8th Edition',
        language: 'both',
        chunk_title: 'PMBOK 8 six principles verified canonical list',
        topic_tags: ['canonical-text', 'pmbok8', 'principles', 'arabic-search', 'مبادئ'],
        priority: 12,
        chunk_text:
          'PMBOK 8 has six project management principles. The six principles are: 1) Adopt a Holistic View; 2) Focus on Value; 3) Embed Quality Into Processes and Deliverables; 4) Be an Accountable Leader; 5) Integrate Sustainability Within All Project Areas; 6) Build an Empowered Culture. Arabic search terms: مبادئ PMBOK 8، المبادئ الستة، التركيز على القيمة، الجودة، القيادة المسؤولة، الاستدامة، الثقافة التمكينية.',
      },
      {
        resource: pmbok8,
        framework: 'pmbok8',
        source_title: pmbok8.title || 'PMBOK 8th Edition',
        language: 'both',
        chunk_title: 'PMBOK 8 five focus areas verified canonical list',
        topic_tags: ['canonical-text', 'pmbok8', 'focus areas', 'arabic-search', 'مجالات التركيز'],
        priority: 12,
        chunk_text:
          'PMBOK 8 has five Project Management Focus Areas. The five Focus Areas are: 1) Initiating; 2) Planning; 3) Executing; 4) Monitoring and Controlling; 5) Closing. These are Focus Areas, not ECO exam domains and not PMBOK 7 performance domains. Arabic search terms: مجالات التركيز، البدء، التخطيط، التنفيذ، المراقبة والتحكم، الإغلاق.',
      },
      {
        resource: pmbok8,
        framework: 'pmbok8',
        source_title: pmbok8.title || 'PMBOK 8th Edition',
        language: 'both',
        chunk_title: 'PMBOK 8 seven performance domains verified canonical list',
        topic_tags: ['canonical-text', 'pmbok8', 'performance domains', 'arabic-search', 'مجالات الأداء'],
        priority: 12,
        chunk_text:
          'PMBOK 8 has seven Performance Domains. The seven PMBOK 8 Performance Domains are: 1) Governance; 2) Scope; 3) Schedule; 4) Finance; 5) Stakeholders; 6) Resources; 7) Risk. These are not the same as the PMBOK 7 performance domains. Arabic search terms: مجالات الأداء، الحوكمة، النطاق، الجدولة، المالية، أصحاب المصلحة، الموارد، المخاطر.',
      },
      {
        resource: pmbok8,
        framework: 'pmbok8',
        source_title: pmbok8.title || 'PMBOK 8th Edition',
        language: 'both',
        chunk_title: 'PMBOK 8 structure boundary and legacy leakage guardrail',
        topic_tags: ['canonical-text', 'pmbok8', 'guardrail', 'comparison', 'legacy leakage'],
        priority: 11,
        chunk_text:
          'For the PMBOK 8 route, do not present PMBOK 7’s 12 principles as PMBOK 8 principles, and do not present PMBOK 7’s eight performance domains as PMBOK 8 performance domains. PMBOK 8 is structured around six principles, five Focus Areas, seven Performance Domains, and 40 nonprescriptive processes. If a learner asks for PMBOK 8 only, answer using PMBOK 8 only unless comparison is explicitly requested.',
      },
      {
        resource: pmbok8,
        framework: 'pmbok8',
        source_title: pmbok8.title || 'PMBOK 8th Edition',
        language: 'both',
        chunk_title: 'PMBOK 8 ECO mapping boundary',
        topic_tags: ['canonical-text', 'pmbok8', 'eco2026', 'mapping', 'domain distinction'],
        priority: 13,
        chunk_text:
          'PMBOK Guide domains and ECO exam-content domains are related but not one-to-one equivalents. ECO 2026 uses People, Process, and Business Environment as exam-content domains. PMBOK 8 uses Governance, Scope, Schedule, Finance, Stakeholders, Resources, and Risk as Performance Domains. Do not say that ECO People equals only one PMBOK 8 domain; it maps across stakeholder, resources, leadership, empowered culture, communication, conflict management, collaboration, coaching, team performance, and knowledge transfer topics.',
      }
    );
  }

  if (pmbok7) {
    seeds.push(
      {
        resource: pmbok7,
        framework: 'pmbok7',
        source_title: pmbok7.title || 'PMBOK 7th Edition',
        language: 'both',
        chunk_title: 'PMBOK 7 performance domains verified canonical list',
        topic_tags: ['canonical-text', 'pmbok7', 'performance domains', 'arabic-search', 'مجالات الأداء'],
        priority: 12,
        chunk_text:
          'PMBOK 7 has eight performance domains. The PMBOK 7 performance domains are: 1) Stakeholders; 2) Team; 3) Development Approach and Life Cycle; 4) Planning; 5) Project Work; 6) Delivery; 7) Measurement; 8) Uncertainty. These domains must not be presented as PMBOK 8 performance domains. Arabic search terms: مجالات الأداء، أصحاب المصلحة، الفريق، نهج التطوير ودورة الحياة، التخطيط، عمل المشروع، التسليم، القياس، عدم اليقين.',
      },
      {
        resource: pmbok7,
        framework: 'pmbok7',
        source_title: pmbok7.title || 'PMBOK 7th Edition',
        language: 'both',
        chunk_title: 'PMBOK 7 structure boundary and PMBOK 8 transition guardrail',
        topic_tags: ['canonical-text', 'pmbok7', 'guardrail', 'comparison', 'transition'],
        priority: 13,
        chunk_text:
          'For the PMBOK 7 route, use PMBOK 7’s 12 principles and eight performance domains, and use ECO 2021 weights when discussing the current PMBOK 7 baseline route. Do not introduce PMBOK 8/ECO 2026 unless the learner explicitly asks for comparison, transition guidance, or the PMBOK 8 route.',
      }
    );
  }

  seeds.push({
    resource: pmbok8 || pmbok7,
    framework: 'both',
    source_title: 'PMBOK and ECO domain distinction',
    language: 'both',
    chunk_title: 'PMBOK guide domains versus ECO exam domains distinction',
    topic_tags: ['canonical-text', 'both', 'eco', 'pmbok', 'domain distinction', 'guardrail'],
    priority: 14,
    chunk_text:
      'PMBOK Guide structure domains and ECO exam-content domains must be kept distinct. ECO domains define the distribution of PMP exam content. PMBOK Guide domains describe the knowledge/performance structure used in the guide. They are related but not one-to-one equivalents. This distinction is critical in PMBOK 7, PMBOK 8, and Bridge Mode answers.',
  });

  return seeds.filter((seed) => seed.resource);
}

async function main() {
  console.log(`Mode: ${isDryRun ? 'DRY RUN - no database writes' : 'COMMIT - upserting canonical PMBOK chunks'}`);

  const { data: resources, error } = await supabase
    .from('resource_library')
    .select('id,title,description,framework,tier,type,file_path,is_active')
    .eq('is_active', true);

  if (error) {
    console.error('Could not read resource_library:', error.message);
    process.exit(1);
  }

  const seeds = buildSeeds(resources || []);

  if (!seeds.length) {
    console.error('No active PMBOK resources found for canonical seeding.');
    process.exit(1);
  }

  console.log(`Prepared canonical chunks: ${seeds.length}`);

  for (const seed of seeds) {
    const payload = {
      resource_id: seed.resource.id,
      framework: seed.framework,
      source_title: seed.source_title,
      source_type: seed.resource.type || 'canonical_text',
      language: seed.language,
      chunk_title: seed.chunk_title,
      chunk_text: seed.chunk_text,
      topic_tags: seed.topic_tags,
      priority: seed.priority,
      is_active: true,
    };

    if (isDryRun) {
      console.log(`DRY RUN: ${payload.framework} | ${payload.source_title} | ${payload.chunk_title}`);
      console.log(`Preview: ${payload.chunk_text.slice(0, 260)}...\n`);
      continue;
    }

    const { error: upsertError } = await supabase
      .from('resource_chunks')
      .upsert(payload, {
        onConflict: 'resource_id,chunk_title,language',
      });

    if (upsertError) {
      console.error(`Failed to seed "${seed.chunk_title}":`, upsertError.message);
      process.exit(1);
    }

    console.log(`Seeded: ${seed.chunk_title}`);
  }

  if (!isDryRun) {
    const { data: rows, error: verifyError } = await supabase
      .from('resource_chunks')
      .select('framework,source_title,chunk_title,topic_tags,priority,is_active')
      .contains('topic_tags', ['canonical-text'])
      .order('framework', { ascending: true })
      .order('chunk_title', { ascending: true });

    if (verifyError) {
      console.error('Could not verify canonical-text chunks:', verifyError.message);
      process.exit(1);
    }

    console.table(rows || []);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
