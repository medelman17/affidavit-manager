import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create templates
  const templates = await Promise.all([
    prisma.template.create({
      data: {
        name: 'Summary Judgment Opposition',
        description: 'Standard certification for opposing summary judgment motions in NJ Superior Court',
        type: 'certification',
        jurisdiction: 'nj',
        category: 'Motion Practice',
        content: {
          personalKnowledgeStatement: 'I, [NAME], hereby certify as follows:',
          paragraphs: [
            'I am the [TITLE] in this matter and submit this certification in opposition to [PARTY]\'s motion for summary judgment.',
            'I have personal knowledge of the facts set forth herein.',
            'The facts contained in this certification are based upon my personal knowledge, my review of documents produced in discovery, and my involvement in the events at issue.',
          ],
        },
      },
    }),
    prisma.template.create({
      data: {
        name: 'Discovery Motion',
        description: 'Certification in support of motion to compel discovery responses',
        type: 'certification',
        jurisdiction: 'federal',
        category: 'Discovery',
        content: {
          personalKnowledgeStatement: 'I, [NAME], hereby declare under penalty of perjury pursuant to 28 U.S.C. § 1746 as follows:',
          paragraphs: [
            'I am counsel of record for [PARTY] in this action.',
            'I submit this declaration in support of [PARTY]\'s motion to compel discovery responses from [OPPOSING PARTY].',
            'On [DATE], [PARTY] served its First Set of Interrogatories and Requests for Production of Documents on [OPPOSING PARTY].',
            'Despite multiple meet and confer efforts, [OPPOSING PARTY] has failed to provide adequate responses.',
          ],
        },
      },
    }),
    prisma.template.create({
      data: {
        name: 'Preliminary Injunction',
        description: 'Affidavit supporting request for preliminary injunctive relief',
        type: 'affidavit',
        jurisdiction: 'federal',
        category: 'Injunctive Relief',
        content: {
          personalKnowledgeStatement: 'I, [NAME], being duly sworn, depose and say:',
          paragraphs: [
            'I am the [TITLE] of [COMPANY], the plaintiff in this action.',
            'I have personal knowledge of the facts set forth in this affidavit.',
            'Unless [DEFENDANT] is immediately enjoined from [CONDUCT], [PLAINTIFF] will suffer irreparable harm.',
            'The harm to [PLAINTIFF] includes [SPECIFIC HARMS].',
            '[PLAINTIFF] is likely to succeed on the merits of its claims because [REASONS].',
          ],
        },
      },
    }),
    prisma.template.create({
      data: {
        name: 'Default Judgment',
        description: 'Affidavit of amount due and owing for default judgment applications',
        type: 'affidavit',
        jurisdiction: 'nj',
        category: 'Default Proceedings',
        content: {
          personalKnowledgeStatement: 'I, [NAME], being duly sworn according to law upon my oath, depose and say:',
          paragraphs: [
            'I am [TITLE] of [COMPANY], the plaintiff in this matter.',
            'I am fully familiar with the books and records of [COMPANY] pertaining to the account of the defendant.',
            'Based upon my review of the books and records, the following amounts are due and owing:',
            'Principal Balance: $[AMOUNT]',
            'Interest through [DATE]: $[AMOUNT]',
            'Total Amount Due: $[AMOUNT]',
            'No payments have been received since [DATE].',
          ],
        },
      },
    }),
    prisma.template.create({
      data: {
        name: 'Expert Qualification',
        description: 'Expert witness certification of qualifications and opinions',
        type: 'certification',
        jurisdiction: 'federal',
        category: 'Expert Testimony',
        content: {
          personalKnowledgeStatement: 'I, [NAME], hereby declare under penalty of perjury pursuant to 28 U.S.C. § 1746:',
          paragraphs: [
            'I have been retained as an expert witness by [PARTY] in this matter.',
            'My qualifications include: [QUALIFICATIONS]',
            'I have reviewed the following materials: [MATERIALS]',
            'Based on my education, training, and experience, it is my professional opinion that: [OPINIONS]',
            'The bases for my opinions are: [BASES]',
          ],
        },
      },
    }),
  ]);

  console.log(`Created ${templates.length} templates`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });