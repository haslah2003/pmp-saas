import { NextResponse } from 'next/server';
import { diagnosticIdentity } from '@/lib/diagnostic/server-session';
import { loadIndividualReport } from '@/lib/diagnostic/report.server';

export async function GET() {
  const { candidateId, sessionId } = await diagnosticIdentity();
  if (!sessionId) return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  const report = await loadIndividualReport(sessionId, candidateId);
  return report ? NextResponse.json(report) : NextResponse.json({ error: 'Report is not ready' }, { status: 404 });
}
