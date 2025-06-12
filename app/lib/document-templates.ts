import { LegalDocument, DocumentType, Jurisdiction } from '@/app/types';
import { format } from 'date-fns';

export interface DocumentTemplate {
  generateHTML(document: LegalDocument): string;
  generateStyles(): string;
}

const escapeHtml = (text: string): string => {
  const div = typeof document !== 'undefined' ? document.createElement('div') : null;
  if (div) {
    div.textContent = text;
    return div.innerHTML;
  }
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

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

export class LegalDocumentTemplate implements DocumentTemplate {
  generateStyles(): string {
    return `
      @page {
        size: letter;
        margin: 1in;
      }

      body {
        font-family: 'Times New Roman', Times, serif;
        font-size: 12pt;
        line-height: 2;
        margin: 0;
        padding: 0;
      }

      .document-container {
        max-width: 8.5in;
        margin: 0 auto;
        background: white;
      }

      .header {
        text-align: center;
        margin-bottom: 2em;
      }

      .court-caption {
        text-align: center;
        margin-bottom: 1em;
        font-weight: bold;
      }

      .case-caption {
        display: table;
        width: 100%;
        margin-bottom: 1em;
        border-collapse: collapse;
      }

      .case-caption-left,
      .case-caption-right {
        display: table-cell;
        vertical-align: top;
        padding: 0.5em 0;
      }

      .case-caption-left {
        width: 70%;
        text-align: left;
      }

      .case-caption-right {
        width: 30%;
        text-align: right;
        padding-left: 2em;
      }

      .case-number {
        margin-top: 0.5em;
      }

      .document-title {
        text-align: center;
        font-weight: bold;
        text-transform: uppercase;
        margin: 1.5em 0;
        font-size: 14pt;
      }

      .document-content {
        text-align: justify;
        text-justify: inter-word;
      }

      .paragraph {
        margin-bottom: 1em;
        text-indent: 0.5in;
      }

      .paragraph-number {
        display: inline-block;
        width: 2em;
        text-indent: 0;
        margin-left: -0.5in;
      }

      .personal-knowledge {
        margin-bottom: 1em;
        text-indent: 0.5in;
      }

      .exhibit-list {
        margin: 1em 0;
        padding-left: 0.5in;
      }

      .exhibit-item {
        margin-bottom: 0.5em;
      }

      .signature-block {
        margin-top: 3em;
        page-break-inside: avoid;
      }

      .signature-line {
        margin-top: 3em;
        border-bottom: 1px solid black;
        width: 300px;
      }

      .signature-name {
        margin-top: 0.25em;
      }

      .attorney-block {
        margin-top: 2em;
      }

      .notary-block {
        margin-top: 2em;
        border: 1px solid black;
        padding: 1em;
        page-break-inside: avoid;
      }

      .right-align {
        text-align: right;
      }

      .center-align {
        text-align: center;
      }

      /* Page break controls */
      .page-break {
        page-break-after: always;
      }

      .no-break {
        page-break-inside: avoid;
      }

      /* Headers and footers for print */
      @media print {
        .header-footer {
          position: fixed;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 10pt;
          line-height: 1.2;
        }

        .header-footer.header {
          top: 0.5in;
        }

        .header-footer.footer {
          bottom: 0.5in;
        }

        .page-number:after {
          content: counter(page);
        }

        .total-pages:after {
          content: counter(pages);
        }
      }
    `;
  }

  generateHTML(document: LegalDocument): string {
    const title = getDocumentTitle(document.type);
    const jurisdictionText = getJurisdictionText(document.jurisdiction, document.type);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${escapeHtml(document.caseCaption)} - ${title}</title>
        <style>${this.generateStyles()}</style>
      </head>
      <body>
        <div class="document-container">
          <!-- Court Header -->
          <div class="header">
            <div class="court-caption">${escapeHtml(document.court)}</div>
            ${document.division ? `<div>${escapeHtml(document.division)}</div>` : ''}
          </div>

          <!-- Case Caption -->
          <div class="case-caption">
            <div class="case-caption-left">
              ${escapeHtml(document.caseCaption)}
            </div>
            <div class="case-caption-right">
              <div>Civil Action No.</div>
              <div class="case-number">${escapeHtml(document.caseNumber)}</div>
              ${document.judge ? `<div style="margin-top: 1em;">Judge: ${escapeHtml(document.judge)}</div>` : ''}
            </div>
          </div>

          <!-- Document Title -->
          <div class="document-title">
            ${title} OF ${escapeHtml(document.declarantName.toUpperCase())}
          </div>

          <!-- Document Content -->
          <div class="document-content">
            <!-- Personal Knowledge Statement -->
            ${document.personalKnowledgeStatement ? 
              `<div class="personal-knowledge">${escapeHtml(document.personalKnowledgeStatement)}</div>` : 
              `<div class="personal-knowledge">I, ${escapeHtml(document.declarantName)}, ${document.declarantTitle ? `${escapeHtml(document.declarantTitle)}, ` : ''}being of full age and competent to testify, hereby ${document.type === DocumentType.AFFIDAVIT ? 'depose and say' : 'state'} as follows:</div>`
            }

            <!-- Paragraphs -->
            ${document.paragraphs.map(para => `
              <div class="paragraph">
                <span class="paragraph-number">${para.number}.</span>
                ${escapeHtml(para.content)}
                ${para.exhibitReferences && para.exhibitReferences.length > 0 ? 
                  ` (See Exhibit${para.exhibitReferences.length > 1 ? 's' : ''} ${para.exhibitReferences.join(', ')})` : 
                  ''
                }
              </div>
            `).join('')}

            <!-- Exhibits List -->
            ${document.exhibits && document.exhibits.length > 0 ? `
              <div class="exhibit-list">
                <div style="font-weight: bold; margin-bottom: 0.5em;">EXHIBITS:</div>
                ${document.exhibits.map(exhibit => `
                  <div class="exhibit-item">
                    Exhibit ${escapeHtml(exhibit.label)} - ${escapeHtml(exhibit.description)}
                    ${exhibit.isConfidential ? ' (CONFIDENTIAL)' : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Signature Block -->
          <div class="signature-block">
            <!-- Jurisdiction-specific certification -->
            <div style="margin-bottom: 2em;">
              ${jurisdictionText}
            </div>

            <!-- Signature -->
            <div class="right-align">
              <div class="signature-line"></div>
              <div class="signature-name">${escapeHtml(document.declarantName)}</div>
              ${document.declarantTitle ? `<div>${escapeHtml(document.declarantTitle)}</div>` : ''}
              ${document.declarantOrganization ? `<div>${escapeHtml(document.declarantOrganization)}</div>` : ''}
            </div>

            <!-- Date and Location -->
            ${document.signatureDate || document.signatureLocation ? `
              <div style="margin-top: 1em;">
                ${document.signatureDate ? `Dated: ${format(new Date(document.signatureDate), 'MMMM d, yyyy')}` : ''}
                ${document.signatureLocation ? `<br/>Location: ${escapeHtml(document.signatureLocation)}` : ''}
              </div>
            ` : ''}

            <!-- Attorney Information -->
            ${document.attorneyName ? `
              <div class="attorney-block">
                <div>${escapeHtml(document.attorneyName)}, Esq.</div>
                ${document.attorneyBarNumber ? `<div>Attorney ID: ${escapeHtml(document.attorneyBarNumber)}</div>` : ''}
                ${document.attorneyFirm ? `<div>${escapeHtml(document.attorneyFirm)}</div>` : ''}
                ${document.attorneyEmail ? `<div>${escapeHtml(document.attorneyEmail)}</div>` : ''}
                ${document.attorneyPhone ? `<div>${escapeHtml(document.attorneyPhone)}</div>` : ''}
                <div style="margin-top: 0.5em;">Attorney for ${document.type === DocumentType.VERIFICATION ? 'Plaintiff' : 'Declarant'}</div>
              </div>
            ` : ''}

            <!-- Notary Block (if required) -->
            ${document.notaryRequired && document.jurisdiction === Jurisdiction.NEW_JERSEY && document.type === DocumentType.AFFIDAVIT ? `
              <div class="notary-block">
                <div class="center-align" style="font-weight: bold;">NOTARY ACKNOWLEDGMENT</div>
                <div style="margin-top: 1em;">
                  State of New Jersey<br/>
                  County of __________
                </div>
                <div style="margin-top: 1em;">
                  Sworn to and subscribed before me this _____ day of __________, 20__.
                </div>
                <div style="margin-top: 3em;">
                  <div style="display: inline-block; width: 45%; text-align: center;">
                    _______________________<br/>
                    Notary Public
                  </div>
                  <div style="display: inline-block; width: 45%; text-align: center; float: right;">
                    My Commission Expires:<br/>
                    _______________________
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </body>
      </html>
    `;
  }
}