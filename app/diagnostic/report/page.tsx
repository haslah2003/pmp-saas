import type { Metadata } from 'next';
import ReportClient from './ReportClient';

export const metadata: Metadata = { title: 'Your PMP Readiness Report | PMPeco' };
export default function ReportPage() { return <ReportClient />; }
