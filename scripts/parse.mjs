const PASTE = /(?:Replace the contents of|Create) `([^`]+)` with the code below/;

export function parseCodelab(source) {
  const [head, ...rest] = source.split(/^# /m);
  const meta = Object.fromEntries(
    head.split('\n').filter((l) => l.includes(':')).map((l) => {
      const i = l.indexOf(':');
      return [l.slice(0, i).trim().toLowerCase(), l.slice(i + 1).trim()];
    }),
  );
  const body = rest.join('# ');
  const [titleLine, ...stepChunks] = body.split(/^## /m);
  const steps = stepChunks.map((chunk) => {
    const [title, ...lines] = chunk.split('\n');
    let text = lines.join('\n');
    const duration = text.match(/^Duration: (\S+)/m)?.[1] ?? '0:00:00';
    text = text.replace(/^Duration: .*\n/m, '');
    const pastes = [];
    const re = /^```(\w*)\n([\s\S]*?)^```/gm;
    let m, last = 0;
    while ((m = re.exec(text))) {
      const before = text.slice(last, m.index);
      const lead = before.trim().split('\n').pop() ?? '';
      const target = lead.match(PASTE)?.[1];
      if (target) pastes.push({ file: target, code: m[2] });
      last = m.index + m[0].length;
    }
    return { title: title.trim(), duration, markdown: text.trim(), pastes };
  });
  return { meta, title: titleLine.trim(), steps };
}
