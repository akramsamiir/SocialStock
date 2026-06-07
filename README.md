# SocialStock

A full-stack stock portfolio and social commentary platform.  
**Backend:** ASP.NET Core 9 · Entity Framework Core · SQL Server · JWT Auth  
**Frontend:** React 19 · TypeScript · Vite · Turborepo · shadcn (base-mira)

---

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| [.NET SDK](https://dotnet.microsoft.com/download) | 9.0+ | `dotnet --version` |
| [Node.js](https://nodejs.org) | 20+ | `node --version` |
| [npm](https://www.npmjs.com) | 11+ | comes with Node |
| [SQL Server LocalDB](https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb) | any | included with Visual Studio or install standalone |
| [EF Core CLI](https://learn.microsoft.com/en-us/ef/core/cli/dotnet) | any | `dotnet tool install --global dotnet-ef` |

---

## Getting started

### 1. Clone the repo

```bash
git clone <repo-url>
cd SocialStock
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Database setup

The backend auto-creates the database and tables on first run using LocalDB.  
No manual setup is needed as long as SQL Server LocalDB is installed.

If you need to apply pending EF migrations manually:

```bash
cd backend/api
dotnet ef database update
```

---

## Running the project

### One command — run everything simultaneously

From the **repo root**:

```bash
cd frontend
npm run dev:all
```

This starts the .NET API (`http://localhost:5067`) and the Vite dev server (`http://localhost:5173`) in parallel.

---

### Run separately

**Backend only:**

```bash
cd backend/api
dotnet run --launch-profile http
```

**Frontend only:**

```bash
cd frontend
npm run dev
```

---

## Project structure

```
SocialStock/
├── backend/
│   └── api/                  # ASP.NET Core 9 Web API
│       ├── Controllers/       # HTTP endpoints
│       ├── Models/            # EF Core entities
│       ├── Repository/        # Data access layer
│       ├── Interfaces/        # Repository contracts
│       ├── Dtos/              # Request / response shapes
│       ├── Mappers/           # Entity ↔ DTO mapping
│       ├── Service/           # JWT token service
│       └── Migrations/        # EF Core migrations
└── frontend/
    ├── apps/
    │   └── web/               # React app (Vite)
    │       └── src/
    │           ├── pages/     # Route-level components
    │           ├── services/  # API call functions
    │           ├── schemas/   # Zod validation schemas
    │           ├── hooks/     # Custom React hooks
    │           └── components/
    └── packages/
        └── ui/                # Shared component library (shadcn)
```

---

## Environment

The frontend reads the API base URL from an environment variable.  
Create `frontend/apps/web/.env.local` to override the default:

```env
VITE_API_URL=http://localhost:5067
```

The default is `http://localhost:5067` so this file is optional for local development.
