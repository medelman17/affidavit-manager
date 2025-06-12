import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Header,
  Footer,
  PageNumber,
  AlignmentType,
  LineSpacing,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  HeadingLevel,
} from 'docx';
import { DocumentType, Jurisdiction } from '@/app/types';
import { format } from 'date-fns';

// Disable static generation for this route
export const dynamic = 'force-dynamic';

const getDocumentTitle = (type: DocumentType): string => {
  switch (type) {
    case DocumentType.AFFIDAVIT:
      return 'AFFIDAVIT';
    case DocumentType.CERTIFICATION:
      return 'CERTIFICATION';
    case DocumentType.VERIFICATION:
      return 'VERIFICATION';
    default:
      return 'LEGAL DOCUMENT';
  }
};

const getJurisdictionText = (jurisdiction: Jurisdiction, type: DocumentType): string => {
  if (jurisdiction === Jurisdiction.FEDERAL) {
    return `I declare under penalty of perjury under the laws of the United States of America that the foregoing is true and correct. Executed on ${format(new Date(), 'MMMM d, yyyy')}.`;
  } else {
    switch (type) {
      case DocumentType.CERTIFICATION:
        return 'I certify that the foregoing statements made by me are true. I am aware that if any of the foregoing statements made by me are willfully false, I am subject to punishment.';
      case DocumentType.AFFIDAVIT:
        return 'Sworn to and subscribed before me this ___ day of _________, 20__.';
      default:
        return '';
    }
  }
};

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

    const title = getDocumentTitle(document.type as DocumentType);
    const jurisdictionText = getJurisdictionText(
      document.jurisdiction as Jurisdiction,
      document.type as DocumentType
    );

    // Create document sections
    const children: Paragraph[] = [];

    // Court Header
    children.push(
      new Paragraph({
        text: document.court,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );

    if (document.division) {
      children.push(
        new Paragraph({
          text: document.division,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        })
      );
    }

    // Case Caption Table
    const captionTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  text: document.caseCaption,
                  spacing: { after: 200 },
                }),
              ],
            }),
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  text: 'Civil Action No.',
                  alignment: AlignmentType.RIGHT,
                }),
                new Paragraph({
                  text: document.caseNumber,
                  alignment: AlignmentType.RIGHT,
                  spacing: { after: 200 },
                }),
                ...(document.judge
                  ? [
                      new Paragraph({
                        text: `Judge: ${document.judge}`,
                        alignment: AlignmentType.RIGHT,
                      }),
                    ]
                  : []),
              ],
            }),
          ],
        }),
      ],
    });

    children.push(
      new Paragraph({
        children: [],
      })
    );

    // Document Title
    children.push(
      new Paragraph({
        text: `${title} OF ${document.declarantName.toUpperCase()}`,
        alignment: AlignmentType.CENTER,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 400 },
      })
    );

    // Personal Knowledge Statement
    const personalKnowledge = document.personalKnowledgeStatement ||
      `I, ${document.declarantName}, ${
        document.declarantTitle ? `${document.declarantTitle}, ` : ''
      }being of full age and competent to testify, hereby ${
        document.type === DocumentType.AFFIDAVIT ? 'depose and say' : 'state'
      } as follows:`;

    children.push(
      new Paragraph({
        text: personalKnowledge,
        indent: { firstLine: 720 }, // 0.5 inch indent
        spacing: { line: 480, after: 240 }, // Double spacing
      })
    );

    // Paragraphs
    document.paragraphs.forEach((para) => {
      const exhibitRefs =
        para.exhibitReferences && para.exhibitReferences.length > 0
          ? ` (See Exhibit${para.exhibitReferences.length > 1 ? 's' : ''} ${para.exhibitReferences.join(
              ', '
            )})`
          : '';

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${para.number}. `,
              bold: true,
            }),
            new TextRun({
              text: para.content + exhibitRefs,
            }),
          ],
          indent: { firstLine: 720 },
          spacing: { line: 480, after: 240 },
        })
      );
    });

    // Exhibits List
    if (document.exhibits && document.exhibits.length > 0) {
      children.push(
        new Paragraph({
          text: 'EXHIBITS:',
          bold: true,
          spacing: { before: 400, after: 200 },
        })
      );

      document.exhibits.forEach((exhibit) => {
        children.push(
          new Paragraph({
            text: `Exhibit ${exhibit.label} - ${exhibit.description}${
              exhibit.isConfidential ? ' (CONFIDENTIAL)' : ''
            }`,
            indent: { left: 720 },
            spacing: { line: 480, after: 120 },
          })
        );
      });
    }

    // Signature Block
    children.push(
      new Paragraph({
        text: jurisdictionText,
        spacing: { before: 800, after: 600, line: 480 },
      })
    );

    // Signature Line
    children.push(
      new Paragraph({
        text: '_________________________________',
        alignment: AlignmentType.RIGHT,
        spacing: { before: 800 },
      })
    );

    children.push(
      new Paragraph({
        text: document.declarantName,
        alignment: AlignmentType.RIGHT,
      })
    );

    if (document.declarantTitle) {
      children.push(
        new Paragraph({
          text: document.declarantTitle,
          alignment: AlignmentType.RIGHT,
        })
      );
    }

    if (document.declarantOrganization) {
      children.push(
        new Paragraph({
          text: document.declarantOrganization,
          alignment: AlignmentType.RIGHT,
        })
      );
    }

    // Date and Location
    if (document.signatureDate || document.signatureLocation) {
      children.push(
        new Paragraph({
          text: '',
          spacing: { before: 400 },
        })
      );

      if (document.signatureDate) {
        children.push(
          new Paragraph({
            text: `Dated: ${format(new Date(document.signatureDate), 'MMMM d, yyyy')}`,
            spacing: { line: 480 },
          })
        );
      }

      if (document.signatureLocation) {
        children.push(
          new Paragraph({
            text: `Location: ${document.signatureLocation}`,
            spacing: { line: 480 },
          })
        );
      }
    }

    // Attorney Information
    if (document.attorneyName) {
      children.push(
        new Paragraph({
          text: '',
          spacing: { before: 600 },
        })
      );

      children.push(
        new Paragraph({
          text: `${document.attorneyName}, Esq.`,
          spacing: { line: 480 },
        })
      );

      if (document.attorneyBarNumber) {
        children.push(
          new Paragraph({
            text: `Attorney ID: ${document.attorneyBarNumber}`,
            spacing: { line: 480 },
          })
        );
      }

      if (document.attorneyFirm) {
        children.push(
          new Paragraph({
            text: document.attorneyFirm,
            spacing: { line: 480 },
          })
        );
      }

      if (document.attorneyEmail) {
        children.push(
          new Paragraph({
            text: document.attorneyEmail,
            spacing: { line: 480 },
          })
        );
      }

      if (document.attorneyPhone) {
        children.push(
          new Paragraph({
            text: document.attorneyPhone,
            spacing: { line: 480 },
          })
        );
      }

      children.push(
        new Paragraph({
          text: `Attorney for ${
            document.type === DocumentType.VERIFICATION ? 'Plaintiff' : 'Declarant'
          }`,
          spacing: { line: 480 },
        })
      );
    }

    // Create the document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  text: `${document.caseCaption} - ${document.caseNumber}`,
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 200 },
                }),
              ],
            }),
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun('Page '),
                    new TextRun({
                      children: [PageNumber.CURRENT],
                    }),
                    new TextRun(' of '),
                    new TextRun({
                      children: [PageNumber.TOTAL_PAGES],
                    }),
                  ],
                }),
              ],
            }),
          },
          children: [captionTable, ...children],
        },
      ],
    });

    // Generate the Word document
    const buffer = await Packer.toBuffer(doc);

    // Return the document
    return new NextResponse(buffer, {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${document.caseNumber.replace(
          /[^a-z0-9]/gi,
          '_'
        )}_${document.type}.docx"`,
      },
    });
  } catch (error) {
    console.error('Error generating Word document:', error);
    return NextResponse.json(
      { error: 'Failed to generate Word document' },
      { status: 500 }
    );
  }
}