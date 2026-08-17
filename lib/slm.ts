import type { Reflection } from "./reflections";

function cleanIssue(issue: string): string {
  const trimmed = issue.trim();
  return trimmed.length > 220 ? `${trimmed.slice(0, 220).trim()}…` : trimmed;
}

export function buildSlmReply(issue: string, grounding: Reflection): string {
  const subject = cleanIssue(issue);
  const brief = subject
    ? `You're carrying ${subject.toLowerCase()}.`
    : "You're carrying something heavy.";

  return `${brief}

That's real, and it matters. The Tao doesn't ask you to fight it — it asks you to feel where things are flowing and move gently with that, not against it.

${grounding.body}

You don't have to sort this all out right now. Just meet the feeling as it is, then let it settle. A quieter mind is often the first honest answer.

— ${grounding.line}`;
}
