-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('affidavit', 'certification', 'verification');

-- CreateEnum
CREATE TYPE "Jurisdiction" AS ENUM ('federal', 'nj');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('draft', 'final', 'filed');

-- CreateEnum
CREATE TYPE "ExhibitType" AS ENUM ('document', 'image', 'video', 'other');

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "jurisdiction" "Jurisdiction" NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'draft',
    "caseCaption" TEXT NOT NULL,
    "caseNumber" TEXT NOT NULL,
    "court" TEXT NOT NULL,
    "judge" TEXT,
    "division" TEXT,
    "declarantName" TEXT NOT NULL,
    "declarantTitle" TEXT,
    "declarantOrganization" TEXT,
    "declarantAddress" TEXT,
    "personalKnowledgeStatement" TEXT,
    "signatureDate" TIMESTAMP(3),
    "signatureLocation" TEXT,
    "notaryRequired" BOOLEAN NOT NULL DEFAULT false,
    "attorneyName" TEXT,
    "attorneyBarNumber" TEXT,
    "attorneyFirm" TEXT,
    "attorneyPhone" TEXT,
    "attorneyEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paragraph" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "exhibitReferences" TEXT[],

    CONSTRAINT "Paragraph_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exhibit" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "ExhibitType" NOT NULL,
    "isConfidential" BOOLEAN NOT NULL DEFAULT false,
    "attachmentPath" TEXT,

    CONSTRAINT "Exhibit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "DocumentType" NOT NULL,
    "jurisdiction" "Jurisdiction" NOT NULL,
    "category" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Document_caseNumber_idx" ON "Document"("caseNumber");

-- CreateIndex
CREATE INDEX "Document_status_idx" ON "Document"("status");

-- CreateIndex
CREATE INDEX "Paragraph_documentId_idx" ON "Paragraph"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Paragraph_documentId_number_key" ON "Paragraph"("documentId", "number");

-- CreateIndex
CREATE INDEX "Exhibit_documentId_idx" ON "Exhibit"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Exhibit_documentId_label_key" ON "Exhibit"("documentId", "label");

-- CreateIndex
CREATE INDEX "Template_type_jurisdiction_idx" ON "Template"("type", "jurisdiction");

-- CreateIndex
CREATE INDEX "Template_category_idx" ON "Template"("category");

-- AddForeignKey
ALTER TABLE "Paragraph" ADD CONSTRAINT "Paragraph_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exhibit" ADD CONSTRAINT "Exhibit_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
