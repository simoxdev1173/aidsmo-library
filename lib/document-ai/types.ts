export type OcrMode = "auto" | "always" | "off";

export type ExtractedDocumentPage = {
  pageNumber: number;
  text: string;
  method: "pdf-text" | "ocr";
};

export type DocumentQuestionAnswer = {
  question: string;
  answer: string;
  sourcePages: number[];
};

export type GeneratedDocumentContent = {
  summary: string;
  questions: DocumentQuestionAnswer[];
};

export type GenerationProvider = "gemini" | "ollama";
