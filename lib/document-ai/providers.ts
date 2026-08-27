import type {
  DocumentQuestionAnswer,
  ExtractedDocumentPage,
  GeneratedDocumentContent,
  GenerationProvider,
} from "@/lib/document-ai/types";

const outputSchema = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "questions"],
  properties: {
    summary: {
      type: "string",
      description: "A grounded Arabic summary of the document.",
    },
    questions: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["question", "answer", "sourcePages"],
        properties: {
          question: { type: "string" },
          answer: { type: "string" },
          sourcePages: {
            type: "array",
            minItems: 1,
            items: { type: "integer" },
          },
        },
      },
    },
  },
} as const;

type ProviderOptions = {
  provider: GenerationProvider;
  model?: string;
  title: string;
  sourceTitle?: string | null;
  pages: ExtractedDocumentPage[];
};

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function sourceTextWithinBudget(pages: ExtractedDocumentPage[]) {
  const configured = Number(process.env.DOCUMENT_AI_MAX_INPUT_CHARS ?? "180000");
  const maxCharacters = Number.isFinite(configured) && configured >= 20_000
    ? Math.floor(configured)
    : 180_000;
  const nonEmptyPages = pages.filter((page) => page.text.trim());
  const complete = nonEmptyPages
    .map((page) => `[PAGE ${page.pageNumber}]\n${page.text}`)
    .join("\n\n");

  if (complete.length <= maxCharacters) return complete;

  // Give every sampled page an equal minimum share so the final pages are not
  // lost when a long document exceeds the model-input budget.
  const perPage = Math.max(500, Math.floor(maxCharacters / Math.max(1, nonEmptyPages.length)) - 30);
  return nonEmptyPages
    .map((page) => `[PAGE ${page.pageNumber}]\n${page.text.slice(0, perPage)}`)
    .join("\n\n")
    .slice(0, maxCharacters);
}

function prompts(options: ProviderOptions) {
  const usablePages = options.pages.filter((page) => page.text.trim());
  const sourcePages = usablePages.map((page) => page.pageNumber).join(", ");
  const source = sourceTextWithinBudget(usablePages);
  if (source.length < 200) {
    throw new Error("The sampled pages did not yield enough text for a grounded summary.");
  }

  return {
    system: [
      "أنت محرر مكتبة رقمية عربية دقيق.",
      "اعتمد حصراً على النص المرفق، ولا تخترع أسماء أو أرقاماً أو نتائج غير موجودة فيه.",
      "اكتب بالعربية الفصحى الواضحة حتى لو احتوى المصدر على لغة أخرى.",
      "يجب أن يكون الملخص مفيداً ومستقلاً، وأن يشرح موضوع الوثيقة وهدفها وأبرز أفكارها أو نتائجها في نحو 120 إلى 220 كلمة.",
      "أنشئ أربعة أسئلة مختلفة ومثيرة لاهتمام القارئ، مع إجابات مباشرة ومعللة من جملتين إلى أربع جمل.",
      "لا تسأل عن معلومة شكلية مثل عدد الصفحات. غطِّ الغرض، وفكرة أو نتيجة محورية، ودلالة عملية، ونقطة تستحق التأمل.",
      "لكل إجابة أدرج أرقام الصفحات التي تسندها كما ظهرت في وسوم PAGE. لا تذكر صفحة غير موجودة في العينة.",
    ].join("\n"),
    user: [
      `عنوان المدخل: ${options.title}`,
      `عنوان الملف: ${options.sourceTitle?.trim() || "غير محدد"}`,
      `الصفحات المتاحة للاستشهاد: ${sourcePages}`,
      "\nالنص المستخرج من الصفحات العينية:\n",
      source,
    ].join("\n"),
  };
}

async function responseError(response: Response) {
  const detail = (await response.text()).slice(0, 1_000);
  return new Error(`AI provider returned ${response.status}: ${detail || response.statusText}`);
}

async function fetchWithRetry(url: string, init: RequestInit) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...init,
        signal: AbortSignal.timeout(120_000),
      });
      if (response.ok) return response;
      if (response.status !== 429 && response.status < 500) throw await responseError(response);
      lastError = await responseError(response);
    } catch (error) {
      lastError = error;
      if (attempt === 4) break;
    }

    await new Promise((resolve) => setTimeout(resolve, 1_500 * 2 ** (attempt - 1)));
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

async function generateWithGemini(options: ProviderOptions) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new Error("GEMINI_API_KEY is required for the Gemini provider.");
  const model = options.model?.trim() || process.env.GEMINI_MODEL?.trim() || "gemini-3.1-flash-lite";
  const prompt = prompts(options);
  const response = await fetchWithRetry(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: prompt.system }] },
        contents: [{ role: "user", parts: [{ text: prompt.user }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 3_000,
          responseMimeType: "application/json",
          responseJsonSchema: outputSchema,
        },
      }),
    },
  );
  const payload = await response.json() as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  if (!text) throw new Error("Gemini returned no generated content.");
  return { text, model };
}

async function generateWithOllama(options: ProviderOptions) {
  const model = options.model?.trim() || process.env.OLLAMA_MODEL?.trim() || "qwen3:8b";
  const baseUrl = (process.env.OLLAMA_BASE_URL?.trim() || "http://127.0.0.1:11434").replace(/\/$/, "");
  const prompt = prompts(options);
  const response = await fetchWithRetry(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      format: outputSchema,
      messages: [
        { role: "system", content: prompt.system },
        { role: "user", content: prompt.user },
      ],
      options: { temperature: 0.2 },
    }),
  });
  const payload = await response.json() as { message?: { content?: string } };
  const text = payload.message?.content?.trim();
  if (!text) throw new Error("Ollama returned no generated content.");
  return { text, model };
}

function parseAndValidate(text: string, sampledPageNumbers: Set<number>): GeneratedDocumentContent {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error("The AI provider returned invalid JSON.");
  }

  if (!value || typeof value !== "object") throw new Error("The AI response is not an object.");
  const record = value as Record<string, unknown>;
  const summary = cleanString(record.summary);
  if (summary.length < 80 || !/[\u0600-\u06FF]/u.test(summary)) {
    throw new Error("The generated Arabic summary is empty or too short.");
  }
  if (!Array.isArray(record.questions) || record.questions.length !== 4) {
    throw new Error("The AI response must contain exactly four questions.");
  }

  const questions: DocumentQuestionAnswer[] = record.questions.map((raw, index) => {
    if (!raw || typeof raw !== "object") throw new Error(`Question ${index + 1} is invalid.`);
    const item = raw as Record<string, unknown>;
    const question = cleanString(item.question);
    const answer = cleanString(item.answer);
    const sourcePages = Array.isArray(item.sourcePages)
      ? [...new Set(item.sourcePages
        .filter((page): page is number => Number.isInteger(page) && sampledPageNumbers.has(page as number)))]
      : [];

    if (question.length < 10 || answer.length < 40 || sourcePages.length === 0) {
      throw new Error(`Question ${index + 1} is too short or has no valid source page.`);
    }
    return { question, answer, sourcePages };
  });

  if (new Set(questions.map((item) => item.question.toLocaleLowerCase("ar"))).size !== 4) {
    throw new Error("The AI provider generated duplicate questions.");
  }

  return { summary, questions };
}

export async function generateDocumentContent(options: ProviderOptions) {
  const generated = options.provider === "ollama"
    ? await generateWithOllama(options)
    : await generateWithGemini(options);
  const content = parseAndValidate(
    generated.text,
    new Set(options.pages.filter((page) => page.text.trim()).map((page) => page.pageNumber)),
  );
  return { ...content, model: generated.model };
}
