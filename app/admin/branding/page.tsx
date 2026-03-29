'use client';

import React, { useState, useEffect } from 'react';
import { saveBranding } from './actions';
import { Card, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface BrandingConfig {
  site_name: string;
  logo_url: string;
  favicon_url: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  dark_mode_primary: string;
  font_heading: string;
  font_body: string;
}

const DEFAULT: BrandingConfig = {
  site_name: 'PMP Expert Tutor', logo_url: '', favicon_url: '',
  primary_color: '#0F172A', secondary_color: '#1E40AF', accent_color: '#F59E0B',
  dark_mode_primary: '#0F172A', font_heading: 'Plus Jakarta Sans', font_body: 'DM Sans',
};

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3">
      <input type="color" value={value} onChange={e => onChange(e.target.value)} className="w-10 h-10 rounded-xl border-2 border-gray-200 cursor-pointer" />
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-900">{label}</label>
        <input type="text" value={value} onChange={e => onChange(e.target.value)} className="block w-full text-xs text-gray-500 font-mono mt-0.5 px-2 py-1 rounded border border-gray-200 outline-none" />
      </div>
    </div>
  );
}

export default function BrandingPage() {
 
  const [config, setConfig] = useState<BrandingConfig>({ ...DEFAULT });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/branding').then(r => r.json()).then(data => {
      if (data && data.site_name) setConfig(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const update = (key: keyof BrandingConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/branding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
      else alert('Save failed: ' + (data.error || 'Unknown error'));
    } catch { alert('Network error'); }
    setSaving(false);
  };

  const handleReset = () => setConfig({ ...DEFAULT });

  if (loading) return <div className="text-center py-20 text-gray-400">Loading branding...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Branding</h1>
          <p className="text-sm text-gray-500 mt-1">Customize the look and feel of your platform.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <Badge variant="success">Saved to database!</Badge>}
          <Button variant="secondary" onClick={handleReset}>Reset to Default</Button>
          <Button onClick={handleSave} loading={saving}>Save Changes</Button>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card padding="lg">
            <h3 className="font-bold mb-4">Identity</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Site Name</label>
                <input type="text" value={config.site_name} onChange={e => update('site_name', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500/30" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Logo URL</label>
                  <input type="text" value={config.logo_url} onChange={e => update('logo_url', e.target.value)} placeholder="https://..." className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none" />
                  <div className="mt-3 p-6 rounded-xl border-2 border-dashed border-gray-200 text-center text-gray-300 text-xs">
                    {config.logo_url ? <img src={config.logo_url} alt="Logo" className="h-12 mx-auto" /> : 'Enter logo URL above'}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Favicon URL</label>
                  <input type="text" value={config.favicon_url} onChange={e => update('favicon_url', e.target.value)} placeholder="https://..." className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none" />
                  <div className="mt-3 p-6 rounded-xl border-2 border-dashed border-gray-200 text-center text-gray-300 text-xs">
                    {config.favicon_url ? <img src={config.favicon_url} alt="Favicon" className="w-8 h-8 mx-auto" /> : '32x32px recommended'}
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <Card padding="lg">
            <h3 className="font-bold mb-4">Color Palette</h3>
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker label="Primary Color" value={config.primary_color} onChange={v => update('primary_color', v)} />
              <ColorPicker label="Secondary Color" value={config.secondary_color} onChange={v => update('secondary_color', v)} />
              <ColorPicker label="Accent Color" value={config.accent_color} onChange={v => update('accent_color', v)} />
              <ColorPicker label="Dark Mode Primary" value={config.dark_mode_primary} onChange={v => update('dark_mode_primary', v)} />
            </div>
          </Card>
          <Card padding="lg">
            <h3 className="font-bold mb-4">Typography</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Heading Font</label>
                <select value={config.font_heading} onChange={e => update('font_heading', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none bg-white">
                  {['Plus Jakarta Sans','Inter','DM Sans','Poppins','Manrope'].map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Body Font</label>
                <select value={config.font_body} onChange={e => update('font_body', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none bg-white">
                  {['DM Sans','Inter','Plus Jakarta Sans','Nunito','Lato'].map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
            </div>
          </Card>
        </div>
        <Card padding="lg" className="sticky top-8">
          <h3 className="font-bold mb-4">Live Preview</h3>
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex">
              <div className="w-14 p-2 flex flex-col gap-2" style={{ backgroundColor: config.primary_color }}>
                <div className="w-8 h-8 rounded-lg mx-auto" style={{ backgroundColor: config.secondary_color }} />
                {[1,2,3].map(i => <div key={i} className="w-8 h-5 rounded mx-auto" style={{ backgroundColor: i===1 ? config.accent_color : '#ffffff30' }} />)}
              </div>
              <div className="flex-1 bg-gray-50 p-3">
                <div className="h-4 w-20 rounded mb-2" style={{ backgroundColor: config.primary_color, opacity:0.8 }} />
                <div className="h-3 w-28 rounded bg-gray-200 mb-3" />
                <div className="h-6 w-16 rounded text-[8px] text-white flex items-center justify-center font-bold" style={{ backgroundColor: config.secondary_color }}>Button</div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4 justify-center">
            {[config.primary_color, config.secondary_color, config.accent_color, config.dark_mode_primary].map((c,i) => (
              <div key={i} className="w-10 h-10 rounded-xl border-2 border-white shadow" style={{ backgroundColor: c }} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
