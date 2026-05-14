export interface MarkdownSubsection {
  id: string;
  title: string;
  content: string;
}

export interface MarkdownSection {
  id: string;
  title: string;
  baseContent: string;
  subsections: MarkdownSubsection[];
}

export function parseMarkdownSections(markdown: string): MarkdownSection[] {
  const sections: MarkdownSection[] = [];
  const mainSections = markdown.split(/^##\s+/m).slice(1);

  mainSections.forEach((section, index) => {
    const lines = section.split('\n');
    const title = lines[0].replace(/[🎯🔑📌⚡💡]/g, '').trim();
    const sectionId = `section-${index}`;

    const subsections: MarkdownSubsection[] = [];
    let baseContent = '';
    let currentSubsectionTitle = '';
    let currentSubsectionContent = '';

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];

      if (line.match(/^###\s+/)) {
        if (currentSubsectionTitle) {
          subsections.push({
            id: `${sectionId}-sub-${subsections.length}`,
            title: currentSubsectionTitle.replace(/[🎯🔑📌⚡💡]/g, '').trim(),
            content: currentSubsectionContent.trim(),
          });
        }
        currentSubsectionTitle = line.replace(/^###\s+/, '').trim();
        currentSubsectionContent = '';
      } else if (currentSubsectionTitle) {
        currentSubsectionContent += (currentSubsectionContent ? '\n' : '') + line;
      } else {
        baseContent += (baseContent ? '\n' : '') + line;
      }
    }

    if (currentSubsectionTitle) {
      subsections.push({
        id: `${sectionId}-sub-${subsections.length}`,
        title: currentSubsectionTitle.replace(/[🎯🔑📌⚡💡]/g, '').trim(),
        content: currentSubsectionContent.trim(),
      });
    }

    sections.push({
      id: sectionId,
      title,
      baseContent: baseContent.trim(),
      subsections,
    });
  });

  return sections;
}
