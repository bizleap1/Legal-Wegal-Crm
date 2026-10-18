# Legal-Wegal-Crm

Enterprise Lead Management CRM with Meta Ads, WhatsApp Cloud API, Website Forms, and Google Ads attribution.

## Architecture

This repository is structured as a monorepo:
- **`apps/api`**: Express.js REST API with JWT authentication, role authorization, request tracing, and webhook ingestion.
- **`apps/web`**: Next.js 15 frontend with dark theme, glassmorphic UI, pipeline kanban, reporting, and lead details.
- **`apps/worker`**: Background queue worker and durable task reconciler for follow-up reminders.
- **`packages/database`**: Prisma schema and SQLite/PostgreSQL client.
- **`packages/shared`**: Shared validation schemas (Zod), constants, and type definitions.

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

### Installation
```bash
npm install
```

### Setup Database
```bash
npm run db:push
npm run db:seed
```

### Running Locally
```bash
npm run dev
```
- Web Application: http://localhost:3000
- API Server: http://localhost:4000
- Health Check: http://localhost:4000/api/v1/health/live

### Default Test Credentials
- **Admin**: `admin@legalwegal.com` / `Password123!`
- **Sales Manager**: `manager@legalwegal.com` / `Password123!`
- **Sales Rep**: `rahul@legalwegal.com` / `Password123!`
