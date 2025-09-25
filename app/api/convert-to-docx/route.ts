import { htmlToDocx } from 'html-to-docx';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { htmlContent, title } = await request.json();

    if (!htmlContent) {
      return NextResponse.json({ error: 'HTML content is required.' }, { status: 400 });
    }

    const docxBuffer = await htmlToDocx(htmlContent, null, {
      orientation: 'portrait',
      margins: { top: 720, bottom: 720, left: 720, right: 720 },
      // Add any other html-to-docx options here
    });

    return new NextResponse(docxBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename=${title || 'document'}.docx`,
        'Content-Length': docxBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error converting HTML to DOCX:', error);
    return NextResponse.json({ error: 'Failed to convert HTML to DOCX.' }, { status: 500 });
  }
}
