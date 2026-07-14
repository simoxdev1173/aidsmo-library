import { translate } from "google-translate-api-x";

const cache = new Map<string, string>();

function cacheKey(text: string, target: string) {
  return `${target}::${text}`;
}

// Translates a batch of Arabic (or any source) strings to the target language,
// caching every result in-process so repeat titles/tags across page loads and
// users are served instantly without hitting Google Translate again.
export async function translateTexts(texts: string[], target = "en"): Promise<string[]> {
  const uncached = Array.from(new Set(texts.filter((text) => text.trim() && !cache.has(cacheKey(text, target)))));

  if (uncached.length > 0) {
    try {
      const results = await translate(uncached, { to: target, forceBatch: true });
      const list = Array.isArray(results) ? results : [results];
      list.forEach((result, index) => {
        cache.set(cacheKey(uncached[index], target), result.text);
      });
    } catch {
      // Translation service unavailable: fall back to source text for this batch.
      uncached.forEach((text) => cache.set(cacheKey(text, target), text));
    }
  }

  return texts.map((text) => {
    if (!text.trim()) return text;
    return cache.get(cacheKey(text, target)) ?? text;
  });
}
