import { readFile, rename, writeFile } from 'node:fs/promises';
import JSZip from 'jszip';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';

const input = process.argv[2];
if (!input) throw new Error('Usage: node scripts/sanitize-presentation-template.mjs <template.pptx>');

const zip = await JSZip.loadAsync(await readFile(input));
let removed = 0;

for (const [name, file] of Object.entries(zip.files)) {
  if (!/^ppt\/slides\/slide\d+\.xml$/.test(name)) continue;
  const doc = new DOMParser().parseFromString(await file.async('string'), 'application/xml');
  for (const picture of Array.from(doc.getElementsByTagName('p:pic'))) {
    const blip = picture.getElementsByTagName('a:blip').item(0);
    if (blip && !blip.getAttribute('r:embed') && !blip.getAttribute('r:link')) {
      picture.parentNode?.removeChild(picture);
      removed += 1;
    }
  }
  zip.file(name, new XMLSerializer().serializeToString(doc));
}

const temporary = `${input}.sanitized`;
await writeFile(temporary, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
await rename(temporary, input);
console.log(`Removed ${removed} unsupported preview-only image placeholders.`);
