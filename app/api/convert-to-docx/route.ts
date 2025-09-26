import { NextRequest, NextResponse } from 'next/server';
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer, UnderlineType } from 'docx';

function parseHtmlContent(html: string): Paragraph[] {
  const docxParagraphs: Paragraph[] = [];
  const htmlParts = html.split(/(<[^>]+>)/).filter(Boolean);

  let currentParagraphChildren: TextRun[] = [];
  let isBold = false;
  let isItalic = false;
  let isUnderline = false;
  let currentAlignment: typeof AlignmentType[keyof typeof AlignmentType] | undefined = undefined;
  let currentHeading: typeof HeadingLevel[keyof typeof HeadingLevel] | undefined = undefined;
  let inList = false;
  let listType: 'bullet' | 'numbering' | undefined = undefined;
  let listLevel = 0;

  const createParagraph = (children: TextRun[], heading?: typeof HeadingLevel[keyof typeof HeadingLevel], alignment?: typeof AlignmentType[keyof typeof AlignmentType], list?: { level: number; type: 'bullet' | 'numbering' }) => {
    if (children.length > 0 || list) {
      docxParagraphs.push(
        new Paragraph({
          children: children,
          heading: heading,
          alignment: alignment,
          spacing: { after: 200, line: 276 },
          bullet: list?.type === 'bullet' ? { level: list.level } : undefined,
          numbering: list?.type === 'numbering' ? { reference: 'my-numbering', level: list.level } : undefined,
        })
      );
    }
  };

  for (const part of htmlParts) {
    if (part.startsWith('<') && part.endsWith('>')) {
      const isClosingTag = part.startsWith('</');
      const tagName = part.replace(/<|\/|>/g, '').split(' ')[0].toLowerCase();

      switch (tagName) {
        case 'p':
        case 'div':
          if (!isClosingTag) {
            createParagraph(currentParagraphChildren, currentHeading, currentAlignment);
            currentParagraphChildren = [];
            currentHeading = undefined;
            currentAlignment = undefined;
          }
          break;
        case 'strong':
        case 'b':
          isBold = !isClosingTag;
          break;
        case 'em':
        case 'i':
          isItalic = !isClosingTag;
          break;
        case 'u':
          isUnderline = !isClosingTag;
          break;
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          if (!isClosingTag) {
            createParagraph(currentParagraphChildren, currentHeading, currentAlignment);
            currentParagraphChildren = [];
            currentAlignment = undefined;
            switch (tagName) {
              case 'h1': currentHeading = HeadingLevel.HEADING_1; break;
              case 'h2': currentHeading = HeadingLevel.HEADING_2; break;
              case 'h3': currentHeading = HeadingLevel.HEADING_3; break;
              case 'h4': currentHeading = HeadingLevel.HEADING_4; break;
              case 'h5': currentHeading = HeadingLevel.HEADING_5; break;
              case 'h6': currentHeading = HeadingLevel.HEADING_6; break;
            }
          } else {
            createParagraph(currentParagraphChildren, currentHeading, currentAlignment);
            currentParagraphChildren = [];
            currentHeading = undefined;
            currentAlignment = undefined;
          }
          break;
        case 'ul':
          if (!isClosingTag) {
            createParagraph(currentParagraphChildren, currentHeading, currentAlignment);
            currentParagraphChildren = [];
            inList = true;
            listType = 'bullet';
            listLevel++;
          } else {
            createParagraph(currentParagraphChildren, currentHeading, currentAlignment, inList ? { level: listLevel, type: listType! } : undefined);
            currentParagraphChildren = [];
            listLevel--;
            if (listLevel === 0) {
              inList = false;
              listType = undefined;
            }
          }
          break;
        case 'ol':
          if (!isClosingTag) {
            createParagraph(currentParagraphChildren, currentHeading, currentAlignment);
            currentParagraphChildren = [];
            inList = true;
            listType = 'numbering';
            listLevel++;
          } else {
            createParagraph(currentParagraphChildren, currentHeading, currentAlignment, inList ? { level: listLevel, type: listType! } : undefined);
            currentParagraphChildren = [];
            listLevel--;
            if (listLevel === 0) {
              inList = false;
              listType = undefined;
            }
          }
          break;
        case 'li':
          if (!isClosingTag) {
            createParagraph(currentParagraphChildren, currentHeading, currentAlignment, inList ? { level: listLevel -1, type: listType! } : undefined);
            currentParagraphChildren = [];
          } else {
            createParagraph(currentParagraphChildren, currentHeading, currentAlignment, inList ? { level: listLevel -1, type: listType! } : undefined);
            currentParagraphChildren = [];
          }
          break;
        case 'br':
          currentParagraphChildren.push(new TextRun({ text: '\n' }));
          break;
        case 'align-left':
          currentAlignment = AlignmentType.LEFT;
          break;
        case 'align-center':
          currentAlignment = AlignmentType.CENTER;
          break;
        case 'align-right':
          currentAlignment = AlignmentType.RIGHT;
          break;
        case 'align-justify':
          currentAlignment = AlignmentType.JUSTIFIED;
          break;
      }
    } else {
      if (part.trim().length > 0) {
        currentParagraphChildren.push(
          new TextRun({
            text: part,
            bold: isBold,
            italics: isItalic,
            underline: isUnderline ? { type: UnderlineType.SINGLE } : undefined,
            size: 22,
            font: 'Arial'
          })
        );
      }
    }
  }

  createParagraph(currentParagraphChildren, currentHeading, currentAlignment, inList ? { level: listLevel, type: listType! } : undefined);

  return docxParagraphs;
}

async function convertHtmlToDocx(htmlContent: string, title: string): Promise<Paragraph[]> {
  const docxParagraphs: Paragraph[] = [];

  if (title?.trim()) {
    docxParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: title.trim(),
            bold: true,
            size: 32,
            font: 'Arial'
          })
        ],
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.LEFT,
        spacing: { 
          after: 400,
          before: 0 
        }
      })
    );

    docxParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '='.repeat(title.length > 0 ? title.length : 10),
            size: 24,
            font: 'Arial'
          })
        ],
        spacing: { after: 400, before: 0 }
      })
    );
  }

  const parsedContent = parseHtmlContent(htmlContent);
  docxParagraphs.push(...parsedContent);

  return docxParagraphs;
}

export async function POST(request: NextRequest) {
  try {
    const { htmlContent, title, options } = await request.json();

    if (!htmlContent) {
      return NextResponse.json({ error: 'HTML content is required.' }, { status: 400 });
    }

    const docxParagraphs = await convertHtmlToDocx(htmlContent, title);

    if (options?.includeFooter) {
      docxParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: '_'.repeat(50),
              size: 20,
              font: 'Arial'
            })
          ],
          spacing: { before: 400, after: 200 }
        })
      );

      const footerText = `Generated by LegalDoc AI${
        options.includeTimestamp ? ` on ${new Date().toLocaleString()}` : ''
      }`;

      docxParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: footerText,
              size: 20,
              font: 'Arial',
              italics: true
            })
          ],
          spacing: { before: 0, after: 0 }
        })
      );
    }

    // Create the document
    const doc = new Document({
      numbering: {
        config: [
          {
            reference: 'my-numbering',
            levels: [
              {
                level: 0,
                format: 'decimal',
                text: '%1.\t',
                alignment: AlignmentType.START,
              },
            ],
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 720,
                bottom: 720,
                left: 720,
                right: 720,
              },
            },
          },
          children: docxParagraphs,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    if (!buffer || buffer.length === 0) {
      throw new Error('Generated DOCX buffer is empty');
    }

    const sanitizedTitle = (title || 'document')
      .replace(/[^\w\s-]/gi, '')
      .trim()
      .replace(/\s+/g, '-');

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${sanitizedTitle}.docx"`,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });

  } catch (error) {
    console.error('Error converting to DOCX:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json({ 
      error: 'Failed to convert to DOCX',
      details: errorMessage
    }, { status: 500 });
  }
}