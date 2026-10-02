CREATE TABLE "WebsiteFeedback" (
    "id" TEXT NOT NULL,
    "experience" INTEGER NOT NULL,
    "performance" INTEGER NOT NULL,
    "navigation" INTEGER NOT NULL,
    "readability" INTEGER NOT NULL,
    "comment" TEXT,
    "pagePath" VARCHAR(400),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WebsiteFeedback_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "WebsiteFeedback_experience_check" CHECK ("experience" BETWEEN 1 AND 5),
    CONSTRAINT "WebsiteFeedback_performance_check" CHECK ("performance" BETWEEN 1 AND 5),
    CONSTRAINT "WebsiteFeedback_navigation_check" CHECK ("navigation" BETWEEN 1 AND 5),
    CONSTRAINT "WebsiteFeedback_readability_check" CHECK ("readability" BETWEEN 1 AND 5)
);

CREATE INDEX "WebsiteFeedback_createdAt_idx" ON "WebsiteFeedback"("createdAt");
