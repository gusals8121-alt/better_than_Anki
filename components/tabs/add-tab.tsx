"use client";

import { useMemo, useState } from "react";
import { extractArticlePhrases, chooseBlankWord } from "@/lib/extractor";
import { translateToKorean } from "@/lib/translator";
import { parseSubtitleXlsx } from "@/lib/xlsx-parser";
import type { PhraseCardDraft } from "@/lib/types";

export function AddTab() {
  const [articleText, setArticleText] = useState("");
  const [cards, setCards] = useState<PhraseCardDraft[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardCountText = useMemo(() => `${cards.length} cards`, [cards.length]);

  const handleArticleExtract = async () => {
    setError(null);
    const phrases = extractArticlePhrases(articleText);
    if (!phrases.length) {
      setError("추출할 영어 구문이 없습니다.");
      return;
    }

    setLoading(true);
    try {
      const nextCards: PhraseCardDraft[] = [];
      for (let i = 0; i < phrases.length; i += 1) {
        const english = phrases[i];
        const koreanLiteral = await translateToKorean(english);
        nextCards.push({
          id: `article-${i}-${Math.random().toString(36).slice(2, 8)}`,
          sourceType: "article",
          english,
          koreanLiteral,
          blankWord: chooseBlankWord(english),
        });
      }
      setCards(nextCards);
    } catch {
      setError("번역 중 문제가 발생했습니다. 네트워크를 확인해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleXlsxUpload = async (file: File | null) => {
    if (!file) return;
    setError(null);
    setLoading(true);
    try {
      const parsed = await parseSubtitleXlsx(file);
      setCards(parsed);
    } catch {
      setError("xlsx 파싱에 실패했습니다. 파일 형식을 확인해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-card bg-cream p-4">
        <h2 className="text-lg font-semibold">Add Content</h2>
        <p className="mt-1 text-sm text-muted">기사 텍스트 붙여넣기 또는 xlsx 업로드</p>

        <textarea
          value={articleText}
          onChange={(e) => setArticleText(e.target.value)}
          rows={5}
          placeholder="영어 기사 텍스트를 붙여넣으세요"
          className="mt-3 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
        />

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={handleArticleExtract}
            disabled={loading}
            className="rounded-xl bg-lime px-4 py-2 text-sm font-semibold disabled:opacity-60"
          >
            {loading ? "처리 중..." : "기사 구문 추출"}
          </button>

          <label className="cursor-pointer rounded-xl border border-black/20 bg-white px-4 py-2 text-sm">
            xlsx 업로드
            <input
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={(e) => handleXlsxUpload(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      <div className="rounded-card bg-cream p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Preview</h3>
          <span className="text-xs text-muted">{cardCountText}</span>
        </div>

        <div className="mt-3 space-y-3">
          {cards.slice(0, 20).map((card) => (
            <article key={card.id} className="rounded-xl border border-black/10 bg-white p-3">
              <p className="text-sm font-medium">{card.english}</p>
              <p className="mt-1 text-sm text-muted">{card.koreanLiteral || "(번역 없음)"}</p>
              <p className="mt-1 text-xs text-black/60">blank: {card.blankWord ?? "-"}</p>
            </article>
          ))}
          {!cards.length && <p className="text-sm text-muted">아직 카드가 없습니다.</p>}
        </div>
      </div>
    </section>
  );
}
