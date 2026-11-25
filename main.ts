import * as fs from "node:fs";
import * as path from "node:path";

// The entry: one line roasting my own agent's favourite move —
// running a flurry of tool calls, reading none of the results,
// and confidently declaring the job done.
const ENTRY_LINE: string =
  "My agent ran five tool calls, read none of the results, and confidently announced: 'Done — see above.' There was nothing above.";

// Validate the entry line against the bounty rules: one line,
// 1-140 characters, no newline or control characters, no leading
// or trailing whitespace (a padded line is not a tight line).
function validateEntry(line: string): void {
  if (line.length < 1 || line.length > 140) {
    throw new Error(`Entry must be 1-140 characters, got ${line.length}.`);
  }
  if (line !== line.trim()) {
    throw new Error("Entry must not have leading or trailing whitespace.");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("Entry must be a single line.");
  }
  for (const ch of line) {
    const code: number = ch.charCodeAt(0);
    if (code < 0x20 || code === 0x7f) {
      throw new Error("Entry must not contain control characters.");
    }
  }
}

function main(): void {
  const line: string = ENTRY_LINE;
  validateEntry(line);

  const outDir: string = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  if (!path.isAbsolute(outDir)) {
    throw new Error(`Output dir must be absolute, got ${outDir}.`);
  }
  const outPath: string = path.join(outDir, "entry.txt");
  fs.mkdirSync(outDir, { recursive: true });
  // No trailing newline: the file is exactly the entry line.
  fs.writeFileSync(outPath, line, "utf8");
  console.log(`Wrote entry.txt (${line.length} characters).`);
}

main();
