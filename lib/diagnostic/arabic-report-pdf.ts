import PDFDocument from 'pdfkit';
import path from 'node:path';
import { buildIndividualReport } from './report';
import { loadIndividualReport } from './report.server';

type Report = ReturnType<typeof buildIndividualReport> & {
  learner: NonNullable<Awaited<ReturnType<typeof loadIndividualReport>>>['report']['learner'];
};

const text = (value: unknown) => String(value ?? '');
const pct = (value: number | null) => value === null ? 'غير مقاس' : `${Math.round(value * 100)}%`;

// PDFKit/fontkit shape Arabic correctly but reverse embedded LTR runs when the
// paragraph direction is RTL. Reverse only those runs before shaping so the
// renderer's RTL pass restores PMBOK, ECO, PMI, IDs, and multi-digit numbers.
export function preparePdfkitRtlText(value: unknown) {
  const source = text(value);
  if (!/\p{Script=Arabic}/u.test(source)) return source;
  return source.replace(
    /[A-Za-z0-9\u0660-\u0669][A-Za-z0-9\u0660-\u0669._%+:/-]*/gu,
    (run) => Array.from(run).reverse().join(''),
  );
}

export async function generateArabicReadinessPdf(report: Report) {
  const chunks: Buffer[] = [];
  const doc = new PDFDocument({ size: 'A4', margin: 0, bufferPages: true, info: { Title: 'تقرير تشخيص الجاهزية لاختبار PMP', Author: 'PMPeco' } });
  doc.on('data', (chunk: Buffer) => chunks.push(chunk));
  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });

  const W = doc.page.width, H = doc.page.height, M = 48, CW = W - M * 2;
  const c = { purple: '#320f91', blue: '#244bab', teal: '#00aeae', ink: '#282d44', muted: '#4c5771', canvas: '#f6f5fc', green: '#15803d', amber: '#d97706', red: '#dc2626', track: '#e1e5f0' };
  doc.registerFont('Arabic', path.join(process.cwd(), 'public/fonts/NeoSansArabic-Regular.ttf'));
  doc.registerFont('ArabicBold', path.join(process.cwd(), 'public/fonts/NeoSansArabic-Bold.ttf'));
  const logo = path.join(process.cwd(), 'public/brand/pmpeco-white-logo.png');
  const watermark = path.join(process.cwd(), 'public/brand/pmpeco-watermark.png');
  let pageNumber = 1;

  const rtl = (value: unknown, x: number, y: number, width = CW, size = 9, color = c.ink, bold = false) => {
    doc.font(bold ? 'ArabicBold' : 'Arabic').fontSize(size).fillColor(color).text(preparePdfkitRtlText(value), x, y, { width, align: 'right', features: ['rtla'], lineGap: 2 });
  };
  const gradient = () => {
    const stops = [[50, 15, 145], [36, 75, 171], [0, 174, 174]];
    for (let i = 0; i < 96; i += 1) {
      const t = i / 95, left = t < .5 ? stops[0] : stops[1], right = t < .5 ? stops[1] : stops[2], p = t < .5 ? t * 2 : (t - .5) * 2;
      const rgb = left.map((start, channel) => Math.round(start + (right[channel] - start) * p));
      const hex = `#${rgb.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
      doc.rect(W * i / 96, 0, W / 96 + 1, 112).fill(hex);
    }
  };
  const header = (subtitle: string) => {
    doc.rect(0, 0, W, H).fill(c.canvas); gradient();
    doc.image(logo, M - 2, 29, { width: 54 });
    doc.font('ArabicBold').fontSize(11).fillColor('white').text('PMPeco', 105, 28, { width: W - 153, align: 'right' });
    rtl('تشخيص الجاهزية لاختبار PMP', 105, 47, W - 153, 22, 'white', true);
    rtl(subtitle, 105, 82, W - 153, 9, 'white');
    // The watermark asset already carries the approved low-opacity treatment.
    doc.image(watermark, W - 310, H - 310, { width: 330 });
  };
  const footer = () => {
    rtl(`المحاولة ${report.learner.attempt} | ${report.learner.reportId}`, M, H - 24, CW, 7, '#9ea4b4');
    doc.font('Arabic').fontSize(7).fillColor('#9ea4b4').text(`صفحة ${pageNumber}`, M, H - 24, { width: CW, align: 'left', features: ['rtla'] });
  };
  const newPage = (subtitle: string) => { footer(); doc.addPage(); pageNumber += 1; header(subtitle); };
  const title = (label: string, y: number) => { rtl(label, M, y, CW, 15, c.purple, true); return y + 28; };
  const para = (value: unknown, y: number, size = 8, color = c.muted) => {
    rtl(value, M, y, CW, size, color);
    return y + doc.heightOfString(text(value), { width: CW, lineGap: 2 }) + 9;
  };
  const tone = (value: number) => value >= report.preparationTarget ? c.green : value >= .6 ? c.amber : c.red;
  const bar = (label: string, value: number | null, total: number, y: number) => {
    const x = 92, w = 360, fy = y + 17;
    rtl(label, 337, y, 210, 9, c.ink, true);
    doc.font('Arabic').fontSize(8).fillColor(value === null ? c.amber : tone(value)).text(pct(value), M, y, { width: 60, align: 'left', features: ['rtla'] });
    doc.roundedRect(x, fy, w, 9, 4).fill(c.track);
    if (value === null) doc.roundedRect(x, fy, w, 9, 4).fill('#fffbeb').strokeColor(c.amber).lineWidth(1).stroke();
    else { const fill = Math.max(5, w * value); doc.roundedRect(x + w - fill, fy, fill, 9, 4).fill(tone(value)); }
    const marker = x + w * (1 - report.preparationTarget);
    doc.moveTo(marker, fy - 5).lineTo(marker, fy + 14).strokeColor(c.ink).lineWidth(.8).stroke();
    rtl(value === null ? `استرشادي - ${total} بنود` : `مقاس - ${total} بنود`, 337, y + 32, 210, 6.5, c.muted);
    return y + 49;
  };
  const card = (x: number, y: number, w: number, label: string, value: string, note: string, color = c.purple) => {
    doc.roundedRect(x, y, w, 74, 8).fill('white');
    rtl(label, x + 10, y + 11, w - 20, 6.8, c.muted, true);
    rtl(value, x + 10, y + 31, w - 20, value.length > 18 ? 9 : 16, color, true);
    rtl(note, x + 10, y + 54, w - 20, 6.2, c.muted);
  };

  header('تقرير الجاهزية الفردي');
  doc.roundedRect(M, 126, CW, 54, 8).fill('white');
  rtl(report.learner.fullName, M + 12, 136, CW - 24, 19, c.ink, true);
  rtl(`${report.learner.language} | ${report.learner.pathway} | ${report.learner.reportId} | المحاولة ${report.learner.attempt}`, M + 12, 163, CW - 24, 6.7, c.muted);
  let y = title(report.band.label, 198); y = para(report.band.interpretation, y, 8.5);
  doc.roundedRect(M, y, CW, 106, 8).fill('white');
  rtl('الجاهزية العامة', M + 14, y + 12, CW - 28, 7, c.muted, true);
  rtl(pct(report.kpis.overallReadiness), M + 14, y + 30, 78, 28, tone(report.kpis.overallReadiness), true);
  const ox = M + 104, ow = 350, oy = y + 43;
  doc.roundedRect(ox, oy, ow, 13, 6).fill(c.track);
  const of = ow * report.kpis.overallReadiness; doc.roundedRect(ox + ow - of, oy, of, 13, 6).fill(tone(report.kpis.overallReadiness));
  const om = ox + ow * (1 - report.preparationTarget); doc.moveTo(om, oy - 7).lineTo(om, oy + 20).strokeColor(c.ink).lineWidth(.8).stroke();
  rtl('المستهدف الإرشادي للاستعداد 75%', ox, y + 64, ow, 6.8, c.ink, true);
  rtl(report.scoreExplanation, M + 14, y + 84, CW - 28, 6.2, c.muted);
  y += 121;
  card(M, y, 154, 'الحكم الموقفي', pct(report.kpis.situationalJudgment), 'اختيار التصرف المناسب في المواقف.', report.kpis.situationalJudgment === null ? c.amber : tone(report.kpis.situationalJudgment));
  card(M + 166, y, 154, 'كفاءة القرار', pct(report.kpis.decisionEfficiency), 'الدقة بوتيرة زمنية قابلة للاستمرار.', report.kpis.decisionEfficiency === null ? c.amber : tone(report.kpis.decisionEfficiency));
  card(M + 332, y, 154, 'الثقة في القياس', report.kpis.uncertaintyLabel, 'قوة الأدلة وليست درجة.', c.blue);
  y = title('نقاط القوة', y + 94);
  report.strengths.slice(0, 3).forEach((row, index) => {
    const x = M + index * 166; doc.roundedRect(x, y, 154, 57, 7).fill('#ecfdf5');
    rtl(`${row.label} ${pct(row.proportion)}`, x + 10, y + 10, 134, 8.5, c.green, true);
    rtl(row.interpretation, x + 10, y + 32, 134, 6.1, c.muted);
  });
  y = title('الجاهزية حسب مجالات ECO', y + 78);
  report.domains.forEach((row) => { y = bar(row.label, row.total < 5 ? null : row.proportion, row.total, y); });

  newPage('ملف القدرات'); y = title('المرونة عبر مناهج التسليم', 142);
  report.approachProfile.forEach((row) => { y = bar(row.label, row.total < 5 ? null : row.proportion, row.total, y); });
  doc.roundedRect(M, y + 2, CW, 66, 8).fill('#fffbeb');
  rtl('كيفية قراءة هذا المؤشر', M + 12, y + 12, CW - 24, 9, c.amber, true);
  rtl(report.metricDefinitions.deliveryApproach, M + 12, y + 33, CW - 24, 7.2, c.ink);
  y = title('العمق المعرفي', y + 88);
  report.cognitiveProfile.forEach((row) => { y = bar(row.label, row.total < 5 ? null : row.proportion, row.total, y); });
  y = title('دقة أولوية القرار', y + 3);
  report.decisionProfile.forEach((row) => { y = bar(row.label, row.total < 5 ? null : row.proportion, row.total, y); });

  newPage('أولويات التعلم وإدارة الوقت'); y = title('أهم أولويات التعلم', 142);
  report.priorityMatrix.slice(0, 3).forEach((row, index) => {
    doc.roundedRect(M, y, CW, 56, 8).fill(index === 0 ? '#fef2f2' : '#fffbeb');
    rtl(`${row.rank}`, W - M - 32, y + 17, 20, 9, index === 0 ? c.red : c.amber, true);
    rtl(row.objective, W - M - 205, y + 12, 155, 8, c.ink, true);
    rtl(row.action, M + 12, y + 12, 278, 6.8, c.muted);
    y += 68;
  });
  y = title('جودة إدارة الوقت', y + 4);
  card(M, y, 154, 'وسيط زمن الإجابة', `${report.timing.medianSeconds} ثانية`, 'المرجع الإرشادي: 90 ثانية.', c.green);
  card(M + 166, y, 154, 'دقة الإجابات المتسرعة', report.timing.rushed >= 5 ? pct(report.timingQuality.rushedAccuracy) : 'مزيد من الأدلة', `${report.timing.rushed} بنود دون 45 ثانية.`, report.timing.rushed >= 5 && report.timingQuality.rushedAccuracy !== null ? tone(report.timingQuality.rushedAccuracy) : c.amber);
  card(M + 332, y, 154, 'دقة الإجابات المتأنية', report.timing.laboured >= 5 ? pct(report.timingQuality.labouredAccuracy) : 'مزيد من الأدلة', `${report.timing.laboured} بنود فوق 135 ثانية.`, report.timing.laboured >= 5 && report.timingQuality.labouredAccuracy !== null ? tone(report.timingQuality.labouredAccuracy) : c.amber);
  y = para(report.pacingNote, y + 88, 6.8);
  y = title('مسار الجاهزية الموصى به', y + 4);
  report.studySequence.slice(0, 4).forEach((step, index) => { y = para(`${index + 1}. ${step.recommendation}`, y, 7.6, c.ink); });
  doc.roundedRect(M, 735, CW, 40, 8).fill(c.purple); rtl('ابدأ خطة جاهزيتي الشخصية في المنصة', M + 12, 747, CW - 24, 10, 'white', true);

  newPage('تفسير التقرير ومراجعة الإجابات'); y = title('تفسير التقرير', 142);
  card(M, y, 154, 'المستوى الحالي', report.band.label, 'الجاهزية في وقت التقييم.', tone(report.kpis.overallReadiness));
  card(M + 166, y, 154, 'المحاولة', `${report.learner.attempt}`, report.progress.label, c.teal);
  card(M + 332, y, 154, 'أولوية التعلم الأولى', text(report.priorityMatrix[0]?.objective || 'مراجعة موجهة').slice(0, 28), 'الفجوة الأعلى أثراً.', c.purple);
  y = title('المفاهيم الخاطئة المطلوب تصحيحها', y + 101);
  report.review.filter((entry) => !entry.correct).slice(0, 3).forEach((item) => {
    doc.roundedRect(M, y, CW, 64, 8).fill('#fef2f2');
    rtl(item.misconception || 'راجع المهارة المرتبطة بهذا البند.', M + 12, y + 11, CW - 24, 7.6, c.red, true);
    rtl('تدرّب على هذه المهارة في المنصة', M + 12, y + 42, CW - 24, 6.8, c.blue, true);
    y += 76;
  });
  y = para('مفتاح الإجابة محمي عمداً. توضّح هذه الملاحظات نمط الاستدلال دون الكشف عن الخيار الصحيح.', y + 3, 6.8);
  y = title('حول هذا التقرير', y + 7);
  y = para(`${report.basis} ${report.disclaimer} تستند النتائج المقاسة إلى خمسة بنود ذات صلة أو أكثر؛ وتستند النتائج الاسترشادية إلى بند واحد حتى أربعة بنود.`, y, 6.8);
  doc.roundedRect(M, Math.min(746, Math.max(y + 8, 720)), CW, 32, 8).fill('#ecfdf5');
  rtl('في التقرير التالي: قارن هذا الخط المرجعي وتابع التحسن حسب القدرات.', M + 12, Math.min(755, Math.max(y + 17, 729)), CW - 24, 7.5, c.green, true);
  footer();

  doc.end();
  return done;
}
