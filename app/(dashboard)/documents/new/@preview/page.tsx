'use client';

import { useMemo, useDeferredValue } from 'react';
import { useDocumentForm } from '../DocumentFormContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { DocumentType, Jurisdiction } from '@/app/types/document';

export default function DocumentPreview() {
  const { formData } = useDocumentForm();
  
  // Use deferred value for smooth performance
  const deferredFormData = useDeferredValue(formData);
  
  const documentHeader = useMemo(() => {
    const { caseInfo, jurisdiction } = deferredFormData;
    
    return (
      <div className="text-center space-y-4 mb-8">
        {jurisdiction === Jurisdiction.FEDERAL ? (
          <>
            <div className="font-bold">UNITED STATES DISTRICT COURT</div>
            <div>{caseInfo?.division || 'DISTRICT OF NEW JERSEY'}</div>
          </>
        ) : (
          <>
            <div className="font-bold">SUPERIOR COURT OF NEW JERSEY</div>
            <div>{caseInfo?.division || 'LAW DIVISION'}</div>
          </>
        )}
      </div>
    );
  }, [deferredFormData]);

  const caseCaption = useMemo(() => {
    const { caseInfo } = deferredFormData;
    if (!caseInfo?.caption) return null;
    
    return (
      <div className="mb-8">
        <div className="float-left w-3/5">
          <div className="whitespace-pre-line">{caseInfo.caption}</div>
        </div>
        <div className="float-right w-2/5 text-right">
          <div>Civil Action No. {caseInfo.caseNumber || '[Case Number]'}</div>
          {caseInfo.judge && <div>Judge: {caseInfo.judge}</div>}
        </div>
        <div className="clear-both"></div>
      </div>
    );
  }, [deferredFormData]);

  const documentTitle = useMemo(() => {
    const { type, declarant } = deferredFormData;
    const declarantName = declarant?.name || '[Declarant Name]';
    
    let title = '';
    switch (type) {
      case DocumentType.AFFIDAVIT:
        title = `AFFIDAVIT OF ${declarantName.toUpperCase()}`;
        break;
      case DocumentType.CERTIFICATION:
        title = `CERTIFICATION OF ${declarantName.toUpperCase()}`;
        break;
      case DocumentType.VERIFICATION:
        title = `VERIFICATION`;
        break;
    }
    
    return (
      <div className="text-center font-bold text-lg mb-8 underline">
        {title}
      </div>
    );
  }, [deferredFormData]);

  const personalKnowledge = useMemo(() => {
    const { type, declarant, jurisdiction } = deferredFormData;
    const declarantName = declarant?.name || '[Declarant Name]';
    const declarantTitle = declarant?.title ? `, ${declarant.title}` : '';
    const declarantOrg = declarant?.organization ? ` of ${declarant.organization}` : '';
    
    if (type === DocumentType.VERIFICATION) {
      return (
        <div className="mb-6">
          <p className="indent-8">
            {declarantName}{declarantTitle}{declarantOrg}, being duly sworn, deposes and says:
          </p>
        </div>
      );
    }
    
    const statement = jurisdiction === Jurisdiction.FEDERAL
      ? `I, ${declarantName}, hereby declare under penalty of perjury pursuant to 28 U.S.C. § 1746 that the following is true and correct:`
      : `I, ${declarantName}, of full age, hereby certify that:`;
    
    return (
      <div className="mb-6">
        <p className="indent-8">{statement}</p>
      </div>
    );
  }, [deferredFormData]);

  const paragraphs = useMemo(() => {
    const { paragraphs: paras = [], exhibits = [] } = deferredFormData;
    
    return (
      <div className="space-y-4 mb-8">
        {paras.length === 0 ? (
          <p className="text-gray-500 italic indent-8">
            [Document paragraphs will appear here as you add them]
          </p>
        ) : (
          paras.map((para, index) => {
            let content = para.content;
            
            // Replace exhibit references with formatted text
            if (para.exhibitReferences && para.exhibitReferences.length > 0) {
              para.exhibitReferences.forEach(ref => {
                const exhibit = exhibits.find(e => e.id === ref);
                if (exhibit) {
                  content = content.replace(
                    new RegExp(`\\[${ref}\\]`, 'g'),
                    `(Ex. ${exhibit.label})`
                  );
                }
              });
            }
            
            return (
              <div key={para.id || `para-${index}`} className="flex">
                <div className="w-12 text-right pr-4">{para.number}.</div>
                <div className="flex-1">{content}</div>
              </div>
            );
          })
        )}
      </div>
    );
  }, [deferredFormData]);

  const signatureBlock = useMemo(() => {
    const { type, jurisdiction, signatureBlock: sig, declarant } = deferredFormData;
    const declarantName = sig?.declarantName || declarant?.name || '[Declarant Name]';
    const location = sig?.location || '[City, State]';
    const date = sig?.date ? new Date(sig.date).toLocaleDateString() : '[Date]';
    
    if (type === DocumentType.VERIFICATION) {
      return (
        <div className="mt-12 space-y-6">
          <div className="w-1/2">
            <div className="border-b border-black mb-1"></div>
            <div>{declarantName}</div>
          </div>
          
          <div className="mt-8">
            <p>Sworn to and subscribed before me this _____ day of _________, 20__</p>
            <div className="mt-8 w-1/2">
              <div className="border-b border-black mb-1"></div>
              <div>Notary Public</div>
            </div>
          </div>
        </div>
      );
    }
    
    if (jurisdiction === Jurisdiction.FEDERAL) {
      return (
        <div className="mt-12">
          <p className="mb-6">
            I declare under penalty of perjury under the laws of the United States 
            that the foregoing is true and correct.
          </p>
          <p className="mb-8">Executed on {date} at {location}.</p>
          <div className="w-1/2">
            <div className="border-b border-black mb-1"></div>
            <div>{declarantName}</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="mt-12">
          <p className="mb-6">
            I certify that the foregoing statements made by me are true. I am aware 
            that if any of the foregoing statements made by me are willfully false, 
            I am subject to punishment.
          </p>
          <p className="mb-8">Dated: {date}</p>
          <div className="w-1/2">
            <div className="border-b border-black mb-1"></div>
            <div>{declarantName}</div>
          </div>
        </div>
      );
    }
  }, [deferredFormData]);

  const attorneyBlock = useMemo(() => {
    const { signatureBlock: sig } = deferredFormData;
    if (!sig?.attorneyInfo) return null;
    
    const { name, barNumber, firm, address, phone, email } = sig.attorneyInfo;
    
    return (
      <div className="mt-12 text-sm">
        <div className="font-bold">{name || '[Attorney Name]'}</div>
        {firm && <div>{firm}</div>}
        {address && <div className="whitespace-pre-line">{address}</div>}
        {phone && <div>Tel: {phone}</div>}
        {email && <div>Email: {email}</div>}
        {barNumber && <div>Attorney ID: {barNumber}</div>}
        <div className="mt-2">Attorney for [Party Name]</div>
      </div>
    );
  }, [deferredFormData]);

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Preview</CardTitle>
          <Badge variant="secondary">Live Preview</Badge>
        </div>
      </CardHeader>
      
      <Separator />
      
      <ScrollArea className="flex-1">
        <CardContent className="pt-6">
          <div className="max-w-[8.5in] mx-auto bg-white dark:bg-gray-950 p-[1in] shadow-lg min-h-[11in]">
            <div className="font-serif text-sm leading-relaxed">
              {documentHeader}
              {caseCaption}
              {documentTitle}
              {personalKnowledge}
              {paragraphs}
              {signatureBlock}
              {attorneyBlock}
            </div>
          </div>
        </CardContent>
      </ScrollArea>
    </div>
  );
}