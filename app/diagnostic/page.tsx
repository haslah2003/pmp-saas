import type { Metadata } from 'next';
import DiagnosticClient from './DiagnosticClient';

export const metadata: Metadata = { title: 'PMP Readiness Diagnostic | PMPeco' };

export default function DiagnosticPage() {
  return <DiagnosticClient />;
}
