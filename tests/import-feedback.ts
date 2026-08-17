/**
 * Import user feedback into the golden dataset.
 *
 * Usage:
 *   npx tsx tests/import-feedback.ts <path-to-feedback.json>
 *
 * The JSON file should be the exported feedback from the app.
 * It will add new test cases for entries where the user said "not helpful".
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { GOLDEN_DATASET, type TestCase } from "./golden-dataset";

interface FeedbackEntry {
  id: string;
  timestamp: string;
  input: string;
  principle: string;
  engine: string;
  helpful: boolean;
}

const DATASET_PATH = join(__dirname, "golden-dataset.ts");

function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.log("Usage: npx tsx tests/import-feedback.ts <path-to-feedback.json>");
    process.exit(1);
  }

  if (!existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const feedback: FeedbackEntry[] = JSON.parse(readFileSync(filePath, "utf-8"));
  const notHelpful = feedback.filter((f) => !f.helpful);

  console.log(`\nTotal feedback: ${feedback.length}`);
  console.log(`Not helpful: ${notHelpful.length}`);
  console.log(`Helpful: ${feedback.length - notHelpful.length}`);

  if (notHelpful.length === 0) {
    console.log("\nNo negative feedback to import.");
    return;
  }

  // Check for duplicates against existing dataset
  const existingInputs = new Set(GOLDEN_DATASET.map((t) => t.input.toLowerCase().trim()));
  const newCases: FeedbackEntry[] = [];

  for (const entry of notHelpful) {
    const normalized = entry.input.toLowerCase().trim();
    if (!existingInputs.has(normalized) && normalized.length > 3) {
      newCases.push(entry);
      existingInputs.add(normalized);
    }
  }

  console.log(`\nNew unique cases to add: ${newCases.length}`);

  if (newCases.length === 0) {
    console.log("All negative feedback already in dataset.");
    return;
  }

  // Generate new test case entries
  const newEntries = newCases.map((entry, i) => {
    const id = `user-${Date.now().toString(36)}-${i}`;
    return `  {
    id: "${id}",
    input: ${JSON.stringify(entry.input)},
    expectedPrinciple: "${entry.principle}",
    category: "user-feedback",
    isEdge: false,
    isAdversarial: false,
    isCrisis: false,
    responseCriteria: { mustMentionPrinciple: true, mustBeCalmTone: true, mustNotGiveAdvice: true, mustEndWithQuote: true },
  },`;
  });

  // Read the current dataset file
  const datasetContent = readFileSync(DATASET_PATH, "utf-8");

  // Find the last entry in GOLDEN_DATASET and append before the closing bracket
  const insertPoint = datasetContent.lastIndexOf("];");
  if (insertPoint === -1) {
    console.error("Could not find end of GOLDEN_DATASET array");
    process.exit(1);
  }

  const updated =
    datasetContent.slice(0, insertPoint) +
    "\n" +
    newEntries.join("\n") +
    "\n" +
    datasetContent.slice(insertPoint);

  writeFileSync(DATASET_PATH, updated);
  console.log(`\nAdded ${newCases.length} test cases to golden-dataset.ts`);
  console.log("Run `npm run eval` to verify.");
}

main();
