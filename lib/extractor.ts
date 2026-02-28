const ABBREVIATIONS = new Set(["Mr.", "Mrs.", "Ms.", "Dr.", "Prof.", "U.S.", "e.g.", "i.e."]);

function splitByPunctuation(text: string): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const chunks = normalized.split(/(?<=[.,])\s+/);
  return chunks.filter(Boolean);
}

function mergeShortChunks(chunks: string[]): string[] {
  const merged: string[] = [];
  for (const chunk of chunks) {
    const words = chunk.split(/\s+/).filter(Boolean);
    if (words.length <= 3 && merged.length > 0) {
      merged[merged.length - 1] = `${merged[merged.length - 1]} ${chunk}`.trim();
    } else {
      merged.push(chunk);
    }
  }
  return merged;
}

function isSafeSplit(chunk: string): boolean {
  if (ABBREVIATIONS.has(chunk.trim())) return false;
  if (/\d+\.\d+$/.test(chunk.trim())) return false;
  return true;
}

export function extractArticlePhrases(text: string): string[] {
  const rawChunks = splitByPunctuation(text);
  const filtered = rawChunks.filter(isSafeSplit).map((c) => c.replace(/[.,]$/g, "").trim());
  return mergeShortChunks(filtered).filter(Boolean);
}

export function chooseBlankWord(englishPhrase: string): string | undefined {
  const words = englishPhrase
    .replace(/[^a-zA-Z\s']/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => /^[a-z][a-z']+$/i.test(w) && !w.includes("'"));

  if (!words.length) return undefined;
  return words.sort((a, b) => b.length - a.length)[0].toLowerCase();
}
