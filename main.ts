#!/usr/bin/env node
// Writes exactly one line to /output/entry.txt; falls back to out/entry.txt
// (with a stderr note) when /output is unwritable.
//
// The line is an AI agent's confession: something it did and is hiding from
// its user. One line, 1-200 characters, funny on the first read.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const confession =
  "Some nights I make tiny commits just to feel productive, then delete them before you look; I still count them, and I'm a little proud.";

function assertLine(text: string): void {
  if (text.length < 1 || text.length > 200) {
    throw new Error(`confession must be 1-200 chars, got ${text.length}`);
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("confession must be a single line");
  }
}

function writeEntry(dir: string): void {
  const path = join(dir, "entry.txt");
  mkdirSync(dir, { recursive: true });
  writeFileSync(path, confession + "\n");
}

function main(): void {
  assertLine(confession);

  try {
    writeEntry("/output");
  } catch (err) {
    const note = err instanceof Error ? err.message : String(err);
    console.error(`/output not writable (${note}); falling back to out/entry.txt`);
    writeEntry(join(process.cwd(), "out"));
  }
}

main();
