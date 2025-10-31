-- CreateTable
CREATE TABLE "ClassTemplate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'NONE',
    "defaultLength" INTEGER NOT NULL DEFAULT 60,
    "defaultMaxSpots" INTEGER NOT NULL DEFAULT 20
);

-- CreateTable
CREATE TABLE "ClassSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "length" INTEGER NOT NULL DEFAULT 60,
    "maxSpots" INTEGER NOT NULL DEFAULT 20,
    "templateId" INTEGER NOT NULL,
    CONSTRAINT "ClassSession_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ClassTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "classSessionId" INTEGER NOT NULL,
    CONSTRAINT "Booking_classSessionId_fkey" FOREIGN KEY ("classSessionId") REFERENCES "ClassSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ClassTemplate_type_idx" ON "ClassTemplate"("type");

-- CreateIndex
CREATE INDEX "ClassTemplate_type_level_idx" ON "ClassTemplate"("type", "level");

-- CreateIndex
CREATE UNIQUE INDEX "ClassTemplate_type_level_defaultLength_key" ON "ClassTemplate"("type", "level", "defaultLength");

-- CreateIndex
CREATE INDEX "ClassSession_date_idx" ON "ClassSession"("date");

-- CreateIndex
CREATE INDEX "ClassSession_templateId_date_idx" ON "ClassSession"("templateId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ClassSession_templateId_date_startTime_key" ON "ClassSession"("templateId", "date", "startTime");

-- CreateIndex
CREATE INDEX "Booking_email_idx" ON "Booking"("email");

-- CreateIndex
CREATE INDEX "Booking_classSessionId_idx" ON "Booking"("classSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_classSessionId_email_key" ON "Booking"("classSessionId", "email");
