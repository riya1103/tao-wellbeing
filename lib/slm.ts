import type { Reflection } from "./reflections";

function cleanIssue(issue: string): string {
  const trimmed = issue.trim();
  return trimmed.length > 220 ? `${trimmed.slice(0, 220).trim()}…` : trimmed;
}

export function buildSlmReply(issue: string, grounding: Reflection): string {
  const subject = cleanIssue(issue);

  return `${grounding.body}

— ${grounding.line}`;
}
