require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const os = require('os');
const path = require('path');
const PDFParser = require('pdf2json');
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

const args = process.argv.slice(2);
const isCommit = args.includes('--commit');
const isDryRun = !isCommit;

function readArg(name, fallback = null) {
  const index = args.indexOf(name);
  if (index === -1 || index + 1 >= args.length) return fallback;
  return args[index + 1];
}

const match = readArg('--match', '').toLowerCase();
const maxResources = Number(readArg('--max-resources', '0')) || 0;
const maxPages = Number(readArg('--max-pages', '0')) || 0;
const chunkSize = Number(readArg('--chunk-size', '1800')) || 1800;
const overlap = Number(readArg('--overlap', '220')) || 220;
const bucket = readArg('--bucket', 'resources');

function normalizeWhitespace(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function inferLanguage(resource) {
  const combined = `${resource.title || ''} ${resource.description || ''} ${resource.file_path || ''}`.toLowerCase();
  if (combined.includes('arabic') || combined.includes('_ar') || combined.includes('-ar') || combined.includes('عربي')) return 'ar';
  if (combined.includes('fre') || combined.includes('french') || combined.includes('français') || combined.includes('francais')) return 'fr';
  if (combined.includes('eng') || combined.includes('english')) return 'en';
  return 'en';
}

function inferFramework(resource) {
  const explicit = String(resource.framework || '').trim();
  if (explicit) return explicit;

  const combined = `${resource.title || ''} ${resource.description || ''} ${resource.file_path || ''}`.toLowerCase();
  if (combined.includes('2026') || combined.includes('pmbok 8') || combined.includes('pmbok8') || combined.includes('eighthed')) return 'pmbok8';
  if (combined.includes('2021') || combined.includes('pmbok 7') || combined.includes('pmbok7') || combined.includes('seventh')) return 'pmbok7';
  if (combined.includes('rita')) return 'both';
  return 'both';
}

function inferTopicTags(resource) {
  const combined = `${resource.title || ''} ${resource.description || ''} ${resource.file_path || ''}`.toLowerCase();
  const tags = ['pdf-extracted'];

  if (combined.includes('pmbok')) tags.push('pmbok');
  if (combined.includes('pmbok 8') || combined.includes('pmbok8') || combined.includes('eighthed')) tags.push('pmbok8');
  if (combined.includes('pmbok 7') || combined.includes('pmbok7') || combined.includes('seventh')) tags.push('pmbok7');
  if (combined.includes('eco') || combined.includes('examination content outline') || combined.includes('content outline')) tags.push('eco');
  if (combined.includes('2026') || combined.includes('new-pmp')) tags.push('eco2026');
  if (combined.includes('2021')) tags.push('eco2021');
  if (combined.includes('rita')) tags.push('rita');
  if (combined.includes('arabic')) tags.push('arabic');
  if (combined.includes('fre') || combined.includes('french')) tags.push('french');
  if (combined.includes('eng') || combined.includes('english')) tags.push('english');

  return Array.from(new Set(tags));
}

function decodePdfText(value) {
  const raw = String(value || '');
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function pageTextFromPdfJson(pdfData) {
  const pages = Array.isArray(pdfData?.Pages) ? pdfData.Pages : [];

  return pages.map((page, pageIndex) => {
    const textItems = Array.isArray(page.Texts) ? page.Texts : [];
    const lines = [];

    for (const item of textItems) {
      const runs = Array.isArray(item.R) ? item.R : [];
      const text = normalizeWhitespace(runs.map((run) => decodePdfText(run.T)).join(''));
      if (text) {
        lines.push({
          x: Number(item.x || 0),
          y: Number(item.y || 0),
          text,
        });
      }
    }

    lines.sort((a, b) => (a.y - b.y) || (a.x - b.x));

    return {
      pageNumber: pageIndex + 1,
      text: normalizeWhitespace(lines.map((line) => line.text).join(' ')),
    };
  });
}

function chunkTextByPage(page, options) {
  const text = normalizeWhitespace(page.text);
  if (!text) return [];

  if (text.length <= options.chunkSize) {
    return [{ pageNumber: page.pageNumber, chunkIndex: 1, text }];
  }

  const chunks = [];
  let start = 0;
  let chunkIndex = 1;

  while (start < text.length) {
    let end = Math.min(start + options.chunkSize, text.length);

    if (end < text.length) {
      const lastSentence = Math.max(
        text.lastIndexOf('. ', end),
        text.lastIndexOf('؟ ', end),
        text.lastIndexOf('? ', end),
        text.lastIndexOf('; ', end),
        text.lastIndexOf('؛ ', end)
      );
      const lastSpace = text.lastIndexOf(' ', end);
      const boundary = lastSentence > start + 400 ? lastSentence + 1 : lastSpace;
      if (boundary > start + 400) end = boundary;
    }

    const chunk = normalizeWhitespace(text.slice(start, end));
    if (chunk.length >= 80) {
      chunks.push({ pageNumber: page.pageNumber, chunkIndex, text: chunk });
      chunkIndex += 1;
    }

    if (end >= text.length) break;
    start = Math.max(0, end - options.overlap);
  }

  return chunks;
}

function parsePdfFile(filePath) {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser(null, 1);

    parser.on('pdfParser_dataError', (error) => {
      reject(error?.parserError || error);
    });

    parser.on('pdfParser_dataReady', (pdfData) => {
      resolve(pdfData);
    });

    parser.loadPDF(filePath);
  });
}

function isProtectedPdfError(error) {
  const message = String(error?.message || error?.parserError || error || '').toLowerCase();
  return (
    message.includes('passwordexception') ||
    message.includes('no password') ||
    message.includes('encrypted') ||
    message.includes('password')
  );
}

async function downloadResourcePdf(resource) {
  const storagePath = resource.file_path;
  const { data, error } = await supabase.storage.from(bucket).download(storagePath);

  if (error || !data) {
    throw new Error(`Could not download ${storagePath}: ${error?.message || 'no data returned'}`);
  }

  const arrayBuffer = await data.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const safeName = `${resource.id}-${path.basename(storagePath || 'resource.pdf')}`.replace(/[^a-zA-Z0-9._-]/g, '_');
  const tmpPath = path.join(os.tmpdir(), safeName);
  fs.writeFileSync(tmpPath, buffer);
  return tmpPath;
}

async function upsertJob(resource, status, meta = {}) {
  if (isDryRun) return null;

  const payload = {
    resource_id: resource.id,
    status,
    started_at: meta.started_at || new Date().toISOString(),
    completed_at: meta.completed_at || null,
    error_message: meta.error_message || null,
    chunks_created: meta.chunks_created || 0,
    metadata: meta.metadata || {},
  };

  const { data, error } = await supabase
    .from('resource_ingestion_jobs')
    .insert(payload)
    .select('id')
    .single();

  if (error) {
    console.warn(`Could not write ingestion job for ${resource.title}: ${error.message}`);
    return null;
  }

  return data;
}

async function upsertChunks(resource, chunks) {
  if (isDryRun || !chunks.length) return;

  const framework = inferFramework(resource);
  const language = inferLanguage(resource);
  const tags = inferTopicTags(resource);
  const sourceTitle = resource.title || path.basename(resource.file_path || 'PDF Resource');
  const sourceType = resource.type || 'pdf';

  const rows = chunks.map((chunk) => ({
    resource_id: resource.id,
    framework,
    source_title: sourceTitle,
    source_type: sourceType,
    language,
    chunk_title: `PDF p${chunk.pageNumber} chunk ${chunk.chunkIndex}`,
    chunk_text: chunk.text,
    topic_tags: tags,
    priority: 40,
    is_active: true,
  }));

  const batchSize = 100;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabase
      .from('resource_chunks')
      .upsert(batch, {
        onConflict: 'resource_id,chunk_title,language',
      });

    if (error) {
      throw new Error(`Could not upsert chunks for ${sourceTitle}: ${error.message}`);
    }
  }
}

async function readResources() {
  const { data, error } = await supabase
    .from('resource_library')
    .select('id,title,description,framework,tier,type,file_path,is_active')
    .eq('is_active', true)
    .not('file_path', 'is', null)
    .order('tier', { ascending: true })
    .order('title', { ascending: true });

  if (error) throw new Error(`Could not read resource_library: ${error.message}`);

  let resources = (data || []).filter((resource) => String(resource.file_path || '').toLowerCase().endsWith('.pdf'));

  if (match) {
    resources = resources.filter((resource) => {
      const combined = `${resource.title || ''} ${resource.description || ''} ${resource.file_path || ''}`.toLowerCase();
      return combined.includes(match);
    });
  }

  if (maxResources > 0) resources = resources.slice(0, maxResources);
  return resources;
}

(async () => {
  console.log(`Mode: ${isDryRun ? 'DRY RUN - no database writes' : 'COMMIT - upserting extracted PDF chunks'}`);
  console.log(`Bucket: ${bucket}`);
  console.log(`Match filter: ${match || '(none)'}`);
  console.log(`Max resources: ${maxResources || '(all matched)'}`);
  console.log(`Max pages per resource: ${maxPages || '(all pages)'}`);
  console.log(`Chunk size: ${chunkSize}; overlap: ${overlap}`);

  const resources = await readResources();

  if (!resources.length) {
    console.error('No active PDF resources matched the ingestion criteria.');
    process.exit(1);
  }

  let totalChunks = 0;

  for (const resource of resources) {
    const startedAt = new Date().toISOString();
    console.log(`\n===== RESOURCE: ${resource.title} =====`);
    console.log(`Framework: ${inferFramework(resource)} | Language: ${inferLanguage(resource)} | File: ${resource.file_path}`);

    let tmpPath = null;

    try {
      tmpPath = await downloadResourcePdf(resource);
      const pdfData = await parsePdfFile(tmpPath);
      let pages = pageTextFromPdfJson(pdfData).filter((page) => page.text.length > 0);
      if (maxPages > 0) pages = pages.slice(0, maxPages);

      const chunks = pages.flatMap((page) => chunkTextByPage(page, { chunkSize, overlap }));
      totalChunks += chunks.length;

      console.log(`Extracted pages with text: ${pages.length}`);
      console.log(`Prepared chunks: ${chunks.length}`);

      if (chunks[0]) {
        console.log('First chunk preview:');
        console.log(chunks[0].text.slice(0, 700));
      }

      await upsertChunks(resource, chunks);
      await upsertJob(resource, 'completed', {
        started_at: startedAt,
        completed_at: new Date().toISOString(),
        chunks_created: chunks.length,
        metadata: {
          mode: isDryRun ? 'dry-run' : 'commit',
          file_path: resource.file_path,
          pages_processed: pages.length,
          max_pages: maxPages || null,
          chunk_size: chunkSize,
          overlap,
        },
      });
    } catch (error) {
      const errorMessage = String(error?.message || error || '');
      const protectedPdf = isProtectedPdfError(error);

      if (protectedPdf) {
        console.warn(`Skipped protected/encrypted PDF resource ${resource.title}: ${errorMessage}`);
      } else {
        console.error(`Failed resource ${resource.title}:`, errorMessage);
        process.exitCode = 1;
      }

      await upsertJob(resource, protectedPdf ? 'skipped' : 'failed', {
        started_at: startedAt,
        completed_at: new Date().toISOString(),
        error_message: protectedPdf
          ? `Protected/encrypted PDF skipped: ${errorMessage}`
          : errorMessage,
        chunks_created: 0,
        metadata: {
          mode: isDryRun ? 'dry-run' : 'commit',
          file_path: resource.file_path,
          protected_pdf: protectedPdf,
        },
      });
    } finally {
      if (tmpPath && fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    }
  }

  console.log(`\nTotal prepared chunks: ${totalChunks}`);

  if (isDryRun) {
    console.log('Dry run complete. No rows were inserted or updated.');
  } else {
    const { count, error } = await supabase
      .from('resource_chunks')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.warn('Could not count resource_chunks after ingestion:', error.message);
    } else {
      console.log(`Total resource_chunks after ingestion: ${count}`);
    }
  }
})();
