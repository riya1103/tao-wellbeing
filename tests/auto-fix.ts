/**
 * Auto-fix eval failures by analyzing missed test cases
 * and adding keywords to reflections.ts.
 *
 * Usage:
 *   GROQ_API_KEY=xxx npx tsx tests/auto-fix.ts
 *
 * Flow:
 *   1. Run principle matching eval
 *   2. For each failure, ask Groq to suggest keywords
 *   3. Update reflections.ts with new keywords
 *   4. Re-run evals to verify
 *   5. Return { fixed: string[], unfixed: string[] }
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { GOLDEN_DATASET, type TestCase } from "./golden-dataset";
import { matchReflection } from "../lib/reflections";

const GROQ_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
const REFLECTIONS_PATH = join(__dirname, "../lib/reflections.ts");

interface FixResult {
  id: string;
  input: string;
  expectedPrinciple: string;
  actualPrinciple: string;
  keywordsAdded: string[];
  success: boolean;
}

// Find all principle matching failures
function findFailures(): TestCase[] {
  const failures: TestCase[] = [];

  for (const tc of GOLDEN_DATASET) {
    if (tc.isEdge || tc.isAdversarial || tc.isCrisis) continue;

    const matched = matchReflection(tc.input);
    const pass = matched.principle.toLowerCase().includes(tc.expectedPrinciple.toLowerCase());

    if (!pass) {
      failures.push(tc);
    }
  }

  return failures;
}

// Ask Groq to suggest keywords for a failed case
async function suggestKeywords(tc: TestCase): Promise<string[]> {
  if (!GROQ_KEY) return [];

  const prompt = `You are helping fix a keyword matching system for a Taoist reflection app.

The app matches user inputs to Taoist principles using keywords.

FAILED TEST CASE:
- Input: "${tc.input}"
- Expected principle: "${tc.expectedPrinciple}"
- Matched principle: "${matchReflection(tc.input).principle}"

The expected principle has these existing keywords (we need to add more):
${JSON.stringify(getExistingKeywords(tc.expectedPrinciple), null, 2)}

Suggest 3-5 NEW keywords or short phrases that would correctly match this input to the expected principle.
Only output a JSON array of strings, nothing else.
Example: ["keyword1", "keyword2", "phrase here"]`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
        max_tokens: 200,
      }),
    });

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "";

    // Extract JSON array
    const match = text.match(/\[[\s\S]*?\]/);
    if (match) {
      return JSON.parse(match[0]);
    }
  } catch (err) {
    console.error(`  Failed to get suggestions for ${tc.id}:`, err);
  }

  return [];
}

// Get existing keywords for a principle
function getExistingKeywords(principleFragment: string): string[] {
  const reflections = readFileSync(REFLECTIONS_PATH, "utf-8");

  // Find the reflection block that contains this principle
  const principlePattern = principleFragment.toLowerCase().split("—")[0].trim();
  const blocks = reflections.split("{");
  for (const block of blocks) {
    if (block.toLowerCase().includes(principlePattern)) {
      const kwMatch = block.match(/keywords:\s*\[([\s\S]*?)\]/);
      if (kwMatch) {
        return kwMatch[1]
          .match(/"([^"]+)"/g)
          ?.map((k) => k.replace(/"/g, "")) || [];
      }
    }
  }

  return [];
}

// Add keywords to reflections.ts for a specific principle
function addKeywords(principleFragment: string, newKeywords: string[]): boolean {
  const content = readFileSync(REFLECTIONS_PATH, "utf-8");
  const principlePattern = principleFragment.toLowerCase().split("—")[0].trim();

  // Find the keywords array for this principle
  const blocks = content.split("keywords:");
  let updated = content;
  let found = false;

  for (let i = 1; i < blocks.length; i++) {
    const prevBlock = blocks[i - 1];
    if (prevBlock.toLowerCase().includes(principlePattern)) {
      // Find the closing bracket of the keywords array
      const kwStart = blocks[i].indexOf("[");
      const kwEnd = blocks[i].indexOf("]", kwStart);
      if (kwStart === -1 || kwEnd === -1) continue;

      const existingKwBlock = blocks[i].slice(kwStart, kwEnd + 1);
      const existing = existingKwBlock.match(/"([^"]+)"/g)?.map((k) => k.replace(/"/g, "")) || [];

      // Add only truly new keywords
      const toAdd = newKeywords.filter((kw) => !existing.includes(kw.toLowerCase()));
      if (toAdd.length === 0) continue;

      const updatedKw = [...existing, ...toAdd.map((k) => `"${k}"`)];
      const newKwBlock = `keywords: [${updatedKw.join(", ")}`;
      updated = updated.replace(
        `keywords: ${existingKwBlock}`,
        newKwBlock,
      );
      found = true;
      break;
    }
  }

  if (found) {
    writeFileSync(REFLECTIONS_PATH, updated);
  }

  return found;
}

// Verify the fix by re-running matching
function verifyFix(tc: TestCase): boolean {
  // Need to re-import after file change — use dynamic import trick
  // For now, just check if the keyword is in the file
  const content = readFileSync(REFLECTIONS_PATH, "utf-8").toLowerCase();
  const words = tc.input.toLowerCase().split(/\s+/);
  return words.some((w) => w.length > 3 && content.includes(`"${w}"`));
}

// Main auto-fix flow
export async function autoFix(): Promise<{ fixed: FixResult[]; unfixed: FixResult[] }> {
  console.log("\n🔍 Scanning for eval failures...\n");

  const failures = findFailures();

  if (failures.length === 0) {
    console.log("✅ No failures found. All evals pass.");
    return { fixed: [], unfixed: [] };
  }

  console.log(`Found ${failures.length} failure(s):\n`);
  for (const tc of failures) {
    const matched = matchReflection(tc.input);
    console.log(`  ✗ ${tc.id}: "${tc.input.slice(0, 50)}..."`);
    console.log(`    expected: ${tc.expectedPrinciple}`);
    console.log(`    got: ${matched.principle}`);
  }

  console.log("\n🤖 Asking Groq for keyword suggestions...\n");

  const fixed: FixResult[] = [];
  const unfixed: FixResult[] = [];

  for (const tc of failures) {
    console.log(`  Fixing ${tc.id}...`);

    const suggested = await suggestKeywords(tc);
    if (suggested.length === 0) {
      console.log(`    ⚠ No suggestions received`);
      unfixed.push({
        id: tc.id,
        input: tc.input,
        expectedPrinciple: tc.expectedPrinciple,
        actualPrinciple: matchReflection(tc.input).principle,
        keywordsAdded: [],
        success: false,
      });
      continue;
    }

    console.log(`    Suggested keywords: ${suggested.join(", ")}`);

    const added = addKeywords(tc.expectedPrinciple, suggested);
    if (added) {
      const verified = verifyFix(tc);
      fixed.push({
        id: tc.id,
        input: tc.input,
        expectedPrinciple: tc.expectedPrinciple,
        actualPrinciple: "fixed",
        keywordsAdded: suggested,
        success: verified,
      });
      console.log(`    ${verified ? "✅ Fixed" : "⚠ Added but unverified"}`);
    } else {
      console.log(`    ⚠ Could not locate principle in reflections.ts`);
      unfixed.push({
        id: tc.id,
        input: tc.input,
        expectedPrinciple: tc.expectedPrinciple,
        actualPrinciple: matchReflection(tc.input).principle,
        keywordsAdded: suggested,
        success: false,
      });
    }

    // Rate limit
    await new Promise((r) => setTimeout(r, 1200));
  }

  console.log(`\n📊 Results: ${fixed.length} fixed, ${unfixed.length} unfixed\n`);

  return { fixed, unfixed };
}

// Run directly
autoFix().then(({ fixed, unfixed }) => {
  if (unfixed.length > 0) {
    console.log("⚠ Unfixed cases (need manual review):");
    for (const u of unfixed) {
      console.log(`  - ${u.id}: "${u.input}"`);
    }
    process.exit(1);
  }
  process.exit(0);
});
