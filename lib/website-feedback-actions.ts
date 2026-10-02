'use server';

import { prisma } from '@/lib/prisma';

export type WebsiteFeedbackInput = {
  experience: number;
  performance: number;
  navigation: number;
  readability: number;
  comment: string;
  pagePath: string;
  elapsedMs: number;
  website: string;
};

export type WebsiteFeedbackResult = { ok: true } | { ok: false; message: string };

function isRating(value: unknown): value is number {
  return Number.isInteger(value) && typeof value === 'number' && value >= 1 && value <= 5;
}

export async function submitWebsiteFeedback(input: WebsiteFeedbackInput): Promise<WebsiteFeedbackResult> {
  if (!input || typeof input !== 'object') {
    return { ok: false, message: 'تعذر إرسال الإجابات. حاول مرة أخرى.' };
  }

  // Quietly discard automated submissions caught by the honeypot field.
  if (typeof input.website === 'string' && input.website.trim()) {
    return { ok: true };
  }

  if (
    !isRating(input.experience) ||
    !isRating(input.performance) ||
    !isRating(input.navigation) ||
    !isRating(input.readability) ||
    typeof input.comment !== 'string' ||
    input.comment.length > 1200 ||
    typeof input.pagePath !== 'string' ||
    !input.pagePath.startsWith('/') ||
    input.pagePath.length > 400 ||
    input.pagePath.includes('?') ||
    input.pagePath.includes('#') ||
    !Number.isInteger(input.elapsedMs) ||
    input.elapsedMs < 1000 ||
    input.elapsedMs > 30 * 60 * 1000
  ) {
    return { ok: false, message: 'يرجى مراجعة الإجابات والمحاولة مرة أخرى.' };
  }

  try {
    await prisma.websiteFeedback.create({
      data: {
        experience: input.experience,
        performance: input.performance,
        navigation: input.navigation,
        readability: input.readability,
        comment: input.comment.trim() || null,
        pagePath: input.pagePath,
      },
    });

    return { ok: true };
  } catch (error) {
    console.error('Website feedback submission failed.', error);
    return { ok: false, message: 'تعذر حفظ رأيك الآن. حاول مرة أخرى بعد قليل.' };
  }
}
