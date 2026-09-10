import { NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import fs from 'node:fs';
import path from 'node:path';
import { diagnosticIdentity } from '@/lib/diagnostic/server-session';
import { loadIndividualReport } from '@/lib/diagnostic/report.server';

function safeText(value: unknown) { return String(value || '').replace(/[^\x20-\x7E]/g, '-'); }
function shortText(value: unknown, limit = 24) { const text = safeText(value); return text.length > limit ? `${text.slice(0, limit - 3)}...` : text; }
function percent(value: number | null) { return value === null ? 'Not assessed' : `${Math.round(value * 100)}%`; }
function evidence(value: string) { return value === 'not_assessed' ? 'Not assessed' : value[0].toUpperCase() + value.slice(1); }

export async function GET() {
  const { candidateId, sessionId } = await diagnosticIdentity();
  if (!sessionId) return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  const data = await loadIndividualReport(sessionId, candidateId);
  if (!data) return NextResponse.json({ error: 'Report is not ready' }, { status: 404 });
  const { report } = data;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const margin = 48;
  const watermark = `PMPeco ${report.learner.reportId} - ${report.learner.assessedAt}`;
  const palette = { purple: [50, 15, 145] as const, blue: [36, 75, 171] as const, teal: [0, 174, 174] as const, ink: [40, 45, 68] as const, muted: [76, 87, 113] as const, canvas: [246, 245, 252] as const, green: [21, 128, 61] as const, amber: [217, 119, 6] as const, red: [220, 38, 38] as const };
  const scoreColor = (value: number): readonly [number, number, number] => value >= report.preparationTarget ? palette.green : value >= .6 ? palette.amber : palette.red;
  const logo = new Uint8Array(fs.readFileSync(path.join(process.cwd(), 'public/brand/pmpeco-white-logo.png')));
  const watermarkLogo = new Uint8Array(fs.readFileSync(path.join(process.cwd(), 'public/brand/pmpeco-watermark.png')));

  const gradient = (x: number, y: number, w: number, h: number) => {
    const steps = 96;
    for (let i = 0; i < steps; i += 1) {
      const t = i / (steps - 1);
      const color = t < .5
        ? palette.purple.map((start, channel) => Math.round(start + (palette.blue[channel] - start) * t * 2))
        : palette.blue.map((start, channel) => Math.round(start + (palette.teal[channel] - start) * (t - .5) * 2));
      doc.setFillColor(color[0], color[1], color[2]); doc.rect(x + w * i / steps, y, w / steps + 1, h, 'F');
    }
  };
  const header = (subtitle: string) => {
    doc.setFillColor(...palette.canvas); doc.rect(0, 0, width, height, 'F');
    gradient(0, 0, width, 112);
    doc.addImage(logo, 'PNG', margin - 2, 29, 54, 54);
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.text('PMPeco', 105, 40);
    doc.setFontSize(23); doc.text('PMP Readiness Diagnostic', 105, 72);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.text(subtitle, 105, 94);
    doc.addImage(watermarkLogo, 'PNG', width - 310, height - 310, 330, 330);
  };
  const footer = () => {
    doc.setTextColor(175, 181, 196); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5);
    doc.text(watermark, width / 2, height - 20, { align: 'center' });
    doc.text(`Page ${doc.getNumberOfPages()}`, width - margin, height - 20, { align: 'right' });
  };
  const title = (label: string, y: number) => { doc.setTextColor(...palette.purple); doc.setFont('helvetica', 'bold'); doc.setFontSize(15); doc.text(label, margin, y); };
  const bar = (label: string, value: number | null, y: number, suffix = '') => {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(...palette.ink); doc.text(label, margin, y);
    doc.setFillColor(225, 229, 240); doc.roundedRect(190, y - 8, 290, 9, 4, 4, 'F');
    if (value !== null) {
      const filled = 290 * value; doc.setFillColor(...scoreColor(value)); doc.roundedRect(190, y - 8, filled, 9, 4, 4, 'F');
      doc.setDrawColor(...palette.ink); doc.setLineWidth(.8); doc.line(190 + 290 * report.preparationTarget, y - 12, 190 + 290 * report.preparationTarget, y + 5);
    }
    doc.text(`${percent(value)}${suffix}`, 510, y);
  };
  const metricCard = (x: number, y: number, w: number, label: string, value: string, status: string) => {
    doc.setFillColor(255, 255, 255); doc.roundedRect(x, y, w, 72, 8, 8, 'F');
    doc.setTextColor(...palette.muted); doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.text(label.toUpperCase(), x + 12, y + 18);
    doc.setTextColor(...palette.purple); doc.setFontSize(17); doc.text(value, x + 12, y + 43);
    doc.setTextColor(...palette.muted); doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.text(status, x + 12, y + 60);
  };
  const donut = (cx: number, cy: number, radius: number, value: number, label: string) => {
    doc.setFillColor(225, 229, 240); doc.circle(cx, cy, radius, 'F');
    const segments = Math.max(1, Math.round(value * 72));
    for (let i = 0; i < segments; i += 1) {
      const a1 = -Math.PI / 2 + i * Math.PI * 2 / 72, a2 = -Math.PI / 2 + (i + 1.1) * Math.PI * 2 / 72;
      doc.setFillColor(...palette.teal);
      doc.triangle(cx, cy, cx + radius * Math.cos(a1), cy + radius * Math.sin(a1), cx + radius * Math.cos(a2), cy + radius * Math.sin(a2), 'F');
    }
    doc.setFillColor(255, 255, 255); doc.circle(cx, cy, radius * .68, 'F');
    doc.setTextColor(...palette.purple); doc.setFont('helvetica', 'bold'); doc.setFontSize(17); doc.text(percent(value), cx, cy + 3, { align: 'center' });
    doc.setTextColor(...palette.muted); doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.text(label, cx, cy + radius + 14, { align: 'center' });
  };
  const radar = (cx: number, cy: number, radius: number, rows: Array<{ label: string; proportion: number | null }>) => {
    const points = rows.map((_, index) => -Math.PI / 2 + index * Math.PI * 2 / rows.length);
    doc.setDrawColor(198, 204, 219); doc.setLineWidth(.7);
    [.33, .66, 1].forEach((scale) => { const polygon = points.map((angle) => [cx + radius * scale * Math.cos(angle), cy + radius * scale * Math.sin(angle)]); polygon.forEach((point, index) => { const next = polygon[(index + 1) % polygon.length]; doc.line(point[0], point[1], next[0], next[1]); }); });
    const values = rows.map((row, index) => [cx + radius * (row.proportion || 0) * Math.cos(points[index]), cy + radius * (row.proportion || 0) * Math.sin(points[index])]);
    doc.setDrawColor(...palette.teal); doc.setLineWidth(2); values.forEach((point, index) => { const next = values[(index + 1) % values.length]; doc.line(point[0], point[1], next[0], next[1]); });
    rows.forEach((row, index) => { const angle = points[index]; doc.setTextColor(...palette.ink); doc.setFontSize(8); doc.text(`${row.label} ${percent(row.proportion)}`, cx + (radius + 28) * Math.cos(angle), cy + (radius + 18) * Math.sin(angle), { align: Math.cos(angle) < -.2 ? 'right' : Math.cos(angle) > .2 ? 'left' : 'center' }); });
  };

  header('Individual readiness report');
  doc.setFillColor(255, 255, 255); doc.roundedRect(margin, 126, width - margin * 2, 48, 7, 7, 'F');
  doc.setTextColor(...palette.muted); doc.setFont('helvetica', 'bold'); doc.setFontSize(15);
  doc.text(shortText(report.learner.fullName.toUpperCase(), 34), margin + 12, 151);
  doc.setTextColor(...palette.muted); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.2);
  doc.text(`${report.learner.language}  |  ${shortText(report.learner.pathway, 58)}`, width - margin - 12, 143, { align: 'right' });
  doc.text(`${report.learner.reportId}  |  ${new Date(report.learner.assessedAt).toLocaleDateString('en-GB')}  |  Attempt ${report.learner.attempt}`, width - margin - 12, 160, { align: 'right' });
  title(report.band.label, 198);
  doc.setTextColor(...palette.muted); doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5);
  doc.text(doc.splitTextToSize(safeText(report.band.interpretation), width - margin * 2), margin, 220);
  donut(105, 296, 42, report.kpis.overallReadiness, 'Overall readiness');
  doc.setTextColor(...palette.muted); doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5);
  doc.text(doc.splitTextToSize(safeText(report.scoreExplanation), 105), 105, 366, { align: 'center' });
  const cardWidth = 128;
  metricCard(175, 260, cardWidth, 'Situational judgment', percent(report.kpis.situationalJudgment), evidence(report.kpis.evidence));
  metricCard(311, 260, cardWidth, 'Decision efficiency', percent(report.kpis.decisionEfficiency), evidence(report.kpis.evidence));
  metricCard(447, 260, 100, 'Confidence', report.kpis.uncertaintyLabel, evidence(report.kpis.evidence));
  title('ECO domain performance', 416);
  let y = 446;
  report.domains.forEach((domain) => { bar(domain.label, domain.total < 5 ? null : domain.proportion, y, domain.total < 5 ? `  (Indicative - ${domain.total} items)` : `  (${domain.correct}/${domain.total})`); y += 34; });
  title('Top learning priorities', 576); y = 606;
  report.priorityMatrix.forEach((row) => {
    doc.setFillColor(255, 255, 255); doc.roundedRect(margin, y - 15, width - margin * 2, 54, 7, 7, 'F');
    doc.setTextColor(...palette.purple); doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.text(`${row.rank}`, margin + 12, y + 5);
    doc.setTextColor(...palette.ink); doc.text(safeText(row.objective), margin + 32, y);
    doc.setTextColor(...palette.muted); doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.text(`${percent(row.observedMastery)} observed - ${evidence(row.evidence)}`, margin + 32, y + 13);
    doc.text(doc.splitTextToSize(safeText(row.action), 260), 280, y); y += 63;
  });
  footer();

  doc.addPage(); header('Capability profile');
  const profileBlock = (heading: string, rows: Array<{ label: string; proportion: number | null; correct: number; total: number; evidence: string }>, startY: number) => {
    title(heading, startY); let rowY = startY + 30;
    rows.forEach((row) => { bar(row.label, row.total < 5 ? null : row.proportion, rowY); doc.setTextColor(...palette.muted); doc.setFontSize(7); doc.text(row.total < 5 ? `More evidence needed - ${row.total} items` : `${row.correct}/${row.total} - ${evidence(row.evidence)}`, 485, rowY + 12); rowY += 47; });
    return rowY;
  };
  title('Delivery approach agility', 155); radar(width / 2, 245, 72, report.approachProfile);
  doc.setTextColor(...palette.muted); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.text(doc.splitTextToSize(safeText(report.metricDefinitions.deliveryApproach), width - margin * 2), margin, 345); y = 390;
  y = profileBlock('Cognitive depth', report.cognitiveProfile, y);
  profileBlock('Decision priority accuracy', report.decisionProfile, y + 5);
  footer();

  doc.addPage(); header('Learning priorities and timing');
  title('Timing quality', 155);
  metricCard(margin, 178, 150, 'Median response', `${report.timing.medianSeconds}s`, 'Target reference: 90s');
  metricCard(margin + 166, 178, 150, 'Rushed accuracy', report.timing.rushed >= 5 ? percent(report.timingQuality.rushedAccuracy) : 'More evidence', `${report.timing.rushed} items under 45s`);
  metricCard(margin + 332, 178, 150, 'Laboured accuracy', report.timing.laboured >= 5 ? percent(report.timingQuality.labouredAccuracy) : 'More evidence', `${report.timing.laboured} items over 135s`);
  title('Misconception patterns', 300); y = 330;
  report.weakestTasks.forEach((gap) => {
    doc.setFillColor(255, 250, 235); doc.roundedRect(margin, y - 14, width - margin * 2, 64, 7, 7, 'F');
    doc.setTextColor(116, 64, 20); doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.text(`${safeText(gap.ecoTask)} - ${percent(gap.mastery)} observed`, margin + 12, y + 2);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); const lines = doc.splitTextToSize(safeText(gap.misconceptions[0] || 'No misconception statement available.'), width - margin * 2 - 24); doc.text(lines, margin + 12, y + 18); y += 78;
  });
  title('Recommended readiness path', y + 12); y += 40;
  report.studySequence.forEach((step, index) => { const lines = doc.splitTextToSize(`${index + 1}. ${safeText(step.recommendation)}`, width - margin * 2); doc.setTextColor(...palette.ink); doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.text(lines, margin, y); y += lines.length * 11 + 10; });
  doc.setFillColor(...palette.purple); doc.roundedRect(margin, 728, width - margin * 2, 42, 8, 8, 'F'); doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.text('Start my personalized PMPeco readiness plan', width / 2, 754, { align: 'center' }); footer();

  doc.addPage(); header('Interpretation and response review');
  title('Report interpretation', 155);
  metricCard(margin, 178, 154, 'Current position', report.band.label, 'Readiness at this point in time');
  metricCard(margin + 166, 178, 154, 'Attempt', `${report.learner.attempt}`, report.progress.label);
  metricCard(margin + 332, 178, 154, 'First learning focus', shortText(report.priorityMatrix[0]?.objective || 'Targeted review'), 'Highest-impact observed gap');
  doc.setFillColor(255, 255, 255); doc.roundedRect(margin, 268, width - margin * 2, 52, 7, 7, 'F');
  doc.setTextColor(...palette.purple); doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.text('Report confidence', margin + 12, 288);
  doc.setTextColor(...palette.muted); doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.text(`${report.coverage.assessedItems} items and ${report.coverage.ecoTasks} ECO tasks sampled. Granular findings are labelled Measured or Indicative.`, margin + 12, 305);
  title('Misconceptions to correct', 365); y = 392;
  report.review.filter((item) => !item.correct).forEach((item, index) => {
    const text = `${index + 1}. ${safeText(item.misconception)} - Practise this skill in PMPeco.`;
    const lines = doc.splitTextToSize(text, width - margin * 2);
    if (y + lines.length * 10 > 735) { footer(); doc.addPage(); header('Response review - continued'); y = 150; }
    doc.setTextColor(...palette.red); doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.text(lines, margin, y); y += lines.length * 10 + 7;
  });
  if (y + 58 > 770) { footer(); doc.addPage(); header('Method and limitations'); y = 155; }
  title('About this report', y + 15); y += 36;
  doc.setTextColor(...palette.muted); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5);
  doc.text(doc.splitTextToSize(`${safeText(report.basis)} ${safeText(report.disclaimer)} Measured findings use 5 or more relevant items; Indicative findings use 1-4 relevant items.`, width - margin * 2), margin, y);
  footer();

  const bytes = doc.output('arraybuffer');
  return new NextResponse(bytes, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="pmpeco-readiness-report.pdf"', 'Cache-Control': 'private, no-store' } });
}
