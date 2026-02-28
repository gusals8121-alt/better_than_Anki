export async function translateToKorean(text: string): Promise<string> {
  const params = new URLSearchParams({
    q: text,
    langpair: "en|ko",
  });

  const response = await fetch(`https://api.mymemory.translated.net/get?${params.toString()}`);
  if (!response.ok) return "";

  const json = (await response.json()) as {
    responseData?: { translatedText?: string };
  };

  return json.responseData?.translatedText?.trim() ?? "";
}
