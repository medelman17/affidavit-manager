import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DocumentFormData } from '@/app/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data: DocumentFormData = await request.json();

    // Update the document and related data
    const document = await prisma.$transaction(async (tx) => {
      // Delete existing paragraphs and exhibits
      await tx.paragraph.deleteMany({
        where: { documentId: id },
      });
      
      await tx.exhibit.deleteMany({
        where: { documentId: id },
      });

      // Update the document with new data
      return await tx.document.update({
        where: { id },
        data: {
          type: data.type!,
          jurisdiction: data.jurisdiction!,
          status: 'draft',
          
          // Case Information
          caseCaption: data.caseInfo!.caption,
          caseNumber: data.caseInfo!.caseNumber,
          court: data.caseInfo!.court,
          judge: data.caseInfo?.judge,
          division: data.caseInfo?.division,
          
          // Declarant Information
          declarantName: data.declarant!.name,
          declarantTitle: data.declarant?.title,
          declarantOrganization: data.declarant?.organization,
          declarantAddress: data.declarant?.address,
          
          // Content
          personalKnowledgeStatement: data.personalKnowledgeStatement,
          
          // Signature Block
          signatureDate: data.signatureBlock?.date,
          signatureLocation: data.signatureBlock?.location,
          notaryRequired: data.signatureBlock?.notaryRequired || false,
          
          // Attorney Information
          attorneyName: data.signatureBlock?.attorneyInfo?.name,
          attorneyBarNumber: data.signatureBlock?.attorneyInfo?.barNumber,
          attorneyFirm: data.signatureBlock?.attorneyInfo?.firm,
          attorneyPhone: data.signatureBlock?.attorneyInfo?.phone,
          attorneyEmail: data.signatureBlock?.attorneyInfo?.email,
          
          // Create related records
          paragraphs: {
            create: data.paragraphs?.map(p => ({
              number: p.number,
              content: p.content,
              exhibitReferences: p.exhibitReferences || [],
            })) || [],
          },
          exhibits: {
            create: data.exhibits?.map(e => ({
              label: e.label,
              description: e.description,
              type: e.type,
              isConfidential: e.isConfidential || false,
            })) || [],
          },
        },
        include: {
          paragraphs: true,
          exhibits: true,
        },
      });
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.document.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}