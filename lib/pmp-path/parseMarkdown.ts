export interface MarkdownSubsection {
  id: string;
  title: string;
  content: string[];
}

export interface MarkdownSection {
  id: string;
  title: string;
  content: string[];
  subsections: MarkdownSubsection[];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[*#:`"'’]/g, '')
    .replace(/[^a-z0-9\u0600-\u06FF]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function cleanHeading(value: string) {
  return value
    .replace(/^#+\s*/, '')
    .replace(/^[▶▸▹►>•\-–—]\s*/, '')
    .replace(/^\d+\.\s*/, '')
    .replace(/\*\*/g, '')
    .trim();
}

function parseSubheading(line: string): { title: string; remainder: string } | null {
  const trimmed = line.trim();

  if (!trimmed) return null;

  // Matches lines such as:
  // **Title**
  // ▶ **Title**
  // - **Title**
  // **Title**: continuation text
  const match = trimmed.match(/^(?:[▶▸▹►>•\-–—]\s*)?\*\*(.+?)\*\*:?\s*(.*)$/);

  if (!match) return null;

  const title = cleanHeading(match[1] ?? '');
  const remainder = (match[2] ?? '').trim();

  // Avoid treating tiny bold fragments as full learning capsules.
  if (!title || title.length < 6) return null;

  return { title, remainder };
}

function createSection(title: string, index: number): MarkdownSection {
  return {
    id: `${slugify(title) || 'section'}-${index}`,
    title: cleanHeading(title),
    content: [],
    subsections: [],
  };
}

function createSubsection(title: string, sectionIndex: number, subIndex: number): MarkdownSubsection {
  return {
    id: `${slugify(title) || 'subsection'}-${sectionIndex}-${subIndex}`,
    title: cleanHeading(title),
    content: [],
  };
}

function cleanContentLines(lines: string[]) {
  return lines
    .filter((line) => line.trim() !== '[END_OF_DEEP_DIVE]')
    .filter((line, index, arr) => {
      if (line.trim()) return true;
      return arr[index - 1]?.trim() && arr[index + 1]?.trim();
    });
}

function hasMeaningfulContent(lines: string[]) {
  return lines.some((line) => line.trim().length > 0);
}

export function parseMarkdownSections(markdown: string): MarkdownSection[] {
  const lines = markdown.split(/\r?\n/);
  const sections: MarkdownSection[] = [];

  let currentSection: MarkdownSection | null = null;
  let currentSubsection: MarkdownSubsection | null = null;

  const ensureSection = () => {
    if (!currentSection) {
      currentSection = createSection('Overview', sections.length);
      sections.push(currentSection);
    }

    return currentSection;
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (trimmed === '[END_OF_DEEP_DIVE]') continue;

    if (!trimmed) {
      if (currentSubsection) currentSubsection.content.push('');
      else if (currentSection) currentSection.content.push('');
      continue;
    }

    const parentHeading = trimmed.match(/^##\s+(.+)$/);
    if (parentHeading) {
      currentSection = createSection(parentHeading[1] ?? 'Section', sections.length);
      sections.push(currentSection);
      currentSubsection = null;
      continue;
    }

    const section = ensureSection();

    const subheading = parseSubheading(trimmed);
    if (subheading) {
      currentSubsection = createSubsection(
        subheading.title,
        sections.length - 1,
        section.subsections.length
      );

      section.subsections.push(currentSubsection);

      if (subheading.remainder) {
        currentSubsection.content.push(subheading.remainder);
      }

      continue;
    }

    if (currentSubsection) {
      currentSubsection.content.push(line);
    } else {
      section.content.push(line);
    }
  }

  return sections
    .map((section) => {
      const content = cleanContentLines(section.content);
      const subsections = section.subsections
        .map((subsection) => ({
          ...subsection,
          content: cleanContentLines(subsection.content),
        }))
        .filter((subsection) => hasMeaningfulContent(subsection.content));

      return {
        ...section,
        content,
        subsections,
      };
    })
    .filter(
      (section) =>
        hasMeaningfulContent(section.content) || section.subsections.length > 0
    );
}
