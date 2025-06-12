import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { prisma } from '@/lib/prisma';
import { LegalDocumentTemplate } from '@/app/lib/document-templates';

// Disable static generation for this route
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Fetch the document from the database
    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        paragraphs: {
          orderBy: { number: 'asc' },
        },
        exhibits: {
          orderBy: { label: 'asc' },
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Generate HTML from template
    const template = new LegalDocumentTemplate();
    const html = template.generateHTML(document as any); // Type assertion for now

    // Launch Puppeteer with development-friendly settings
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ],
    });

    try {
      const page = await browser.newPage();
      
      // Set content and wait for any resources
      await page.setContent(html, {
        waitUntil: 'networkidle0'
      });

      // Generate PDF with legal document formatting
      const pdf = await page.pdf({
        format: 'letter',
        margin: {
          top: '1in',
          right: '1in',
          bottom: '1in',
          left: '1in'
        },
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: `
          <div style="font-size: 10px; text-align: center; width: 100%; margin: 0 1in;">
            <span>${document.caseCaption} - ${document.caseNumber}</span>
          </div>
        `,
        footerTemplate: `
          <div style="font-size: 10px; text-align: center; width: 100%; margin: 0 1in;">
            Page <span class="pageNumber"></span> of <span class="totalPages"></span>
          </div>
        `,
      });

      await browser.close();

      // Return the PDF
      return new NextResponse(pdf, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${document.caseNumber.replace(/[^a-z0-9]/gi, '_')}_${document.type}.pdf"`,
        },
      });
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}