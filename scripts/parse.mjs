const PASTE = /(?:Replace the contents of|Create) `([^`]+)` with the code below/;
const FENCE = /^```(\w*)\n([\s\S]*?)^```/gm;

function splitDoc(source) {
  const [head, ...rest] = source.split(/^# /m);
  const meta = Object.fromEntries(
    head.split('\n').filter((l) => l.includes(':')).map((l) => {
      const i = l.indexOf(':');
      return [l.slice(0, i).trim().toLowerCase(), l.slice(i + 1).trim()];
    }),
  );
  const [titleLine, ...stepChunks] = rest.join('# ').split(/^## /m);
  const steps = stepChunks.map((chunk) => {
    const [title, ...lines] = chunk.split('\n');
    let text = lines.join('\n');
    const duration = text.match(/^Duration: (\S+)/m)?.[1] ?? null;
    text = text.replace(/^Duration: .*\n/m, '');
    return { title: title.trim(), duration, markdown: text.trim() };
  });
  return { meta, title: titleLine.trim(), steps };
}

export function parseCodelab(source) {
  const doc = splitDoc(source);
  for (const step of doc.steps) {
    step.duration ??= '0:00:00';
    step.blocks = [];
    let m, last = 0;
    FENCE.lastIndex = 0;
    while ((m = FENCE.exec(step.markdown))) {
      const lead = step.markdown.slice(last, m.index).trim().split('\n').pop() ?? '';
      step.blocks.push({ lang: m[1], code: m[2], file: lead.match(PASTE)?.[1] ?? null });
      last = m.index + m[0].length;
    }
    step.pastes = step.blocks.filter((b) => b.file);
  }
  return doc;
}

export function parseTranslation(source, english, name) {
  const doc = splitDoc(source);
  if (doc.steps.length !== english.steps.length) {
    throw new Error(`${name}: has ${doc.steps.length} steps, English has ${english.steps.length}`);
  }
  doc.steps.forEach((step, i) => {
    const en = english.steps[i];
    if (/^```/m.test(step.markdown)) throw new Error(`${name}, step ${i + 1}: use <<code>> instead of writing code blocks`);
    const markers = step.markdown.match(/^<<code>>$/gm)?.length ?? 0;
    if (markers !== en.blocks.length) {
      throw new Error(`${name}, step ${i + 1}: has ${markers} <<code>> markers, English has ${en.blocks.length} code blocks`);
    }
    let k = 0;
    step.markdown = step.markdown.replace(/^<<code>>$/gm, () => {
      const b = en.blocks[k++];
      return '```' + b.lang + '\n' + b.code + '```';
    });
    step.duration = en.duration;
    step.blocks = en.blocks;
    step.pastes = en.pastes;
  });
  doc.meta = { ...english.meta, ...doc.meta };
  return doc;
}
