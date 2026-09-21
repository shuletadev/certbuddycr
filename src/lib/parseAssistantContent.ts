export type AssistantSegment =
  | { type: "text"; content: string }
  | { type: "short-answer-quiz"; heading: string; instructions: string; questions: string[] };

// Matches the exact "drill" pattern observed in certbuddycr.com's live chat output today:
// a standalone heading line, an optional instruction line, then a numbered question list.
// This is the block we intercept and render as an interactive card instead of flat text.
const DRILL_HEADING_RE = /^(fast study drill|quick check|study drill|recall check)\s*$/i;

export function parseAssistantContent(raw: string): AssistantSegment[] {
  const lines = raw.split("\n");
  const segments: AssistantSegment[] = [];
  let textBuffer: string[] = [];
  let i = 0;

  const flushText = () => {
    const text = textBuffer.join("\n").trim();
    if (text) segments.push({ type: "text", content: text });
    textBuffer = [];
  };

  while (i < lines.length) {
    const line = lines[i].trim();

    if (DRILL_HEADING_RE.test(line)) {
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === "") j++;

      let instructions = "";
      if (j < lines.length && !/^\d+\.\s+/.test(lines[j].trim())) {
        instructions = lines[j].trim();
        j++;
        while (j < lines.length && lines[j].trim() === "") j++;
      }

      const questions: string[] = [];
      while (j < lines.length && /^\d+\.\s+/.test(lines[j].trim())) {
        questions.push(lines[j].trim().replace(/^\d+\.\s+/, ""));
        j++;
      }

      if (questions.length > 0) {
        flushText();
        segments.push({ type: "short-answer-quiz", heading: line, instructions, questions });
        i = j;
        continue;
      }
    }

    textBuffer.push(lines[i]);
    i++;
  }

  flushText();
  return segments;
}
