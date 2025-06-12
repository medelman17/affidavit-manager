# Affidavit Manager

A professional legal document generation system for creating affidavits, certifications, and verifications for civil litigation. Built with Next.js 15, React 19, TypeScript, and Tailwind CSS v4.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38B2AC)

## 🚀 Features

### Document Management
- **Create Legal Documents**: Generate affidavits, certifications, and verifications
- **Multi-Jurisdiction Support**: Templates for Federal (28 U.S.C. § 1746) and New Jersey (R. 1:4-4(b)) requirements
- **Edit Existing Documents**: Full editing capabilities for all document fields
- **Document Storage**: PostgreSQL database with Prisma ORM for reliable persistence

### Document Generation
- **PDF Export**: Professional PDF generation with court-compliant formatting
  - 1-inch margins and double-spacing
  - Headers and footers with page numbers
  - Proper legal document structure
- **Word Export**: Generate editable .docx files with matching formatting
- **Instant Download**: One-click document generation and download

### Form Features
- **Multi-Tab Interface**: Organized form sections for better user experience
  - Basics: Case information and court details
  - Content: Document paragraphs with rich formatting
  - Exhibits: Manage document exhibits (A-Z, AA-ZZ labeling)
  - Signature: Declarant and attorney information
- **Smart Defaults**: Jurisdiction-specific language and formatting
- **Validation**: Required field enforcement and legal compliance checks

### UI/UX
- **Modern Design**: Beautiful interface built with shadcn/ui components
- **Responsive Layout**: Works seamlessly on desktop and tablet devices
- **Real-time Updates**: Form state management with immediate feedback
- **Loading States**: Clear indicators for async operations

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15.3.3](https://nextjs.org/) with App Router
- **UI Library**: [React 19.0.0](https://react.dev/) with Server Components
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with PostCSS
- **Components**: [shadcn/ui](https://ui.shadcn.com/) (canary version for Tailwind v4)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/) with strict mode

### Backend
- **API**: Next.js API Routes with App Router
- **Database**: PostgreSQL 16 with Docker
- **ORM**: [Prisma](https://www.prisma.io/) for type-safe database access
- **PDF Generation**: [Puppeteer](https://pptr.dev/) for pixel-perfect PDFs
- **Word Generation**: [docx](https://docx.js.org/) for .docx file creation

### Development
- **Package Manager**: pnpm with workspace support
- **Dev Server**: Turbopack for lightning-fast HMR
- **Code Quality**: ESLint with Next.js configuration
- **Version Control**: Git with semantic commits

## 📋 Prerequisites

- Node.js 18.17 or later
- pnpm 8.0 or later
- Docker and Docker Compose (for PostgreSQL)
- Git

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/affidavit-manager.git
   cd affidavit-manager
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your configuration:
   ```env
   DATABASE_URL="postgresql://affidavit_user:affidavit_pass@localhost:5432/affidavit_manager?schema=public"
   ```

4. **Start the database**
   ```bash
   pnpm db:up
   ```

5. **Run database migrations**
   ```bash
   pnpm db:migrate
   ```

6. **Seed the database (optional)**
   ```bash
   pnpm db:seed
   ```

7. **Start the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📚 Available Scripts

### Development
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Create production build
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Database Management
- `pnpm db:up` - Start PostgreSQL container
- `pnpm db:down` - Stop PostgreSQL container
- `pnpm db:migrate` - Run Prisma migrations
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:seed` - Seed database with sample data

## 📁 Project Structure

```
affidavit-manager/
├── app/                      # Next.js App Router
│   ├── (dashboard)/         # Dashboard layout group
│   │   ├── documents/       # Document management pages
│   │   │   ├── [id]/       # Dynamic document routes
│   │   │   │   └── edit/   # Edit document page
│   │   │   ├── new/        # Create document flow
│   │   │   └── page.tsx    # Documents list
│   │   └── layout.tsx      # Dashboard layout
│   ├── api/                # API routes
│   │   └── documents/      # Document CRUD endpoints
│   ├── lib/                # Utility functions
│   │   └── document-templates.ts  # Legal document templates
│   └── types/              # TypeScript type definitions
├── components/             # Reusable React components
│   └── ui/                # shadcn/ui components
├── prisma/                # Database schema and migrations
│   ├── schema.prisma      # Prisma schema definition
│   └── seed.ts           # Database seeding script
├── public/               # Static assets
└── docker-compose.yml    # PostgreSQL container config
```

## 🔧 Configuration

### Database Schema

The application uses the following main models:

- **Document**: Core document entity with case information
- **Paragraph**: Document content sections with exhibit references
- **Exhibit**: Document exhibits with auto-labeling
- **Template**: Reusable document templates

### Document Types

1. **Affidavit**: Sworn statement requiring notarization (NJ only)
2. **Certification**: Attorney certification of facts
3. **Verification**: Party verification of pleadings

### Jurisdictions

1. **Federal**: Uses 28 U.S.C. § 1746 declaration language
2. **New Jersey**: Uses R. 1:4-4(b) certification language

## 🧪 Testing

```bash
# Run tests (when implemented)
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run e2e tests
pnpm test:e2e
```

## 📦 Building for Production

1. **Build the application**
   ```bash
   pnpm build
   ```

2. **Set up production database**
   Update `DATABASE_URL` in production environment

3. **Run production server**
   ```bash
   pnpm start
   ```

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project to Vercel
3. Set environment variables
4. Deploy

### Docker
```bash
# Build Docker image
docker build -t affidavit-manager .

# Run container
docker run -p 3000:3000 affidavit-manager
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions or modifications
- `chore:` Build process or auxiliary tool changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the amazing framework
- [shadcn](https://twitter.com/shadcn) for the beautiful UI components
- [Vercel](https://vercel.com/) for hosting and deployment
- Legal professionals who provided guidance on document requirements

## 📮 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Built with ❤️ for the legal community