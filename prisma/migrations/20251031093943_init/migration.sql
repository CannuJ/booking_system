-- CreateTable
CREATE TABLE "Template" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'NONE',
    "defaultLength" INTEGER NOT NULL DEFAULT 60,
    "defaultMaxSpots" INTEGER NOT NULL DEFAULT 20
);

-- CreateTable
CREATE TABLE "Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "length" INTEGER NOT NULL DEFAULT 60,
    "maxSpots" INTEGER NOT NULL DEFAULT 20,
    "templateId" INTEGER NOT NULL,
    CONSTRAINT "Session_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" INTEGER NOT NULL,
    CONSTRAINT "Booking_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Template_type_idx" ON "Template"("type");

-- CreateIndex
CREATE INDEX "Template_type_level_idx" ON "Template"("type", "level");

-- CreateIndex
CREATE UNIQUE INDEX "Template_type_level_defaultLength_key" ON "Template"("type", "level", "defaultLength");

-- CreateIndex
CREATE INDEX "Session_date_idx" ON "Session"("date");

-- CreateIndex
CREATE INDEX "Session_templateId_date_idx" ON "Session"("templateId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Session_templateId_date_startTime_key" ON "Session"("templateId", "date", "startTime");

-- CreateIndex
CREATE INDEX "Booking_email_idx" ON "Booking"("email");

-- CreateIndex
CREATE INDEX "Booking_sessionId_idx" ON "Booking"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_sessionId_email_key" ON "Booking"("sessionId", "email");
