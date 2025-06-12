import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DocumentFormData } from '@/app/types';

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      include: {
        paragraphs: {
          orderBy: { number: 'asc' },
        },
        exhibits: {
          orderBy: { label: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: DocumentFormData = await request.json();

    // Create the document with related data
    const document = await prisma.document.create({
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

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}