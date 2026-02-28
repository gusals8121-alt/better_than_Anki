export type TabKey = "home" | "add" | "study" | "wordbook" | "stats";

export type PhraseCardDraft = {
  id: string;
  sourceType: "article" | "xlsx";
  english: string;
  koreanLiteral: string;
  blankWord?: string;
};
