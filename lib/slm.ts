import type { Reflection } from "./reflections";

function cleanIssue(issue: string): string {
  const trimmed = issue.trim();
  return trimmed.length > 220 ? `${trimmed.slice(0, 220).trim()}…` : trimmed;
}

export function buildSlmReply(issue: string, grounding: Reflection): string {
  const subject = cleanIssue(issue);
  const brief = subject ? `You are carrying ${subject.toLowerCase()}.` : "You are carrying a difficult weight.";

  return `${brief}

This is not a problem to overpower. It is a current to listen to. The Tao does not ask you to fight the river; it asks you to feel where the water is pulling and move with the least resistance.

${grounding.body}

You do not need to solve everything in one breath. Meet the feeling plainly, then let it settle. A quieter mind is often the first honest answer.

— ${grounding.line}`;
}
