import * as XLSX from "xlsx";
import { chooseBlankWord } from "@/lib/extractor";
import type { PhraseCardDraft } from "@/lib/types";

export async function parseSubtitleXlsx(file: File): Promise<PhraseCardDraft[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json<(string | number | null)[]>(sheet, { header: 1, raw: false });

  const cards: PhraseCardDraft[] = [];

  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i] || [];
    const english = String(row[1] ?? "").trim();
    const koreanLiteral = String(row[2] ?? "").trim();

    if (!english) continue;

    cards.push({
      id: `xlsx-${i}-${Math.random().toString(36).slice(2, 8)}`,
      sourceType: "xlsx",
      english,
      koreanLiteral,
      blankWord: chooseBlankWord(english),
    });
  }

  return cards;
}
