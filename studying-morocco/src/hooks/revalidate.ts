import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/**
 * Pages are statically cached (ISR). Any content change purges the cache of the
 * whole public site so editors see their changes on the next visit. Content
 * changes are infrequent, so a site-wide purge keeps this simple and correct.
 */
const purge = async (context: Record<string, unknown>) => {
  if (context?.disableRevalidate || process.env.PAYLOAD_SEEDING === 'true') return
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/', 'layout')
  } catch {
    // Not running inside Next.js (e.g. CLI scripts) — nothing to purge.
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = async ({ doc, req }) => {
  await purge(req.context)
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await purge(req.context)
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = async ({ doc, req }) => {
  await purge(req.context)
  return doc
}

export const revalidateHooks = {
  afterChange: [revalidateAfterChange],
  afterDelete: [revalidateAfterDelete],
}
