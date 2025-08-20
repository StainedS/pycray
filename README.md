## How to Run

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start the development server
cd apps/web && pnpm dev
```

The application will be available at:
- **Home Page**: http://localhost:3001/
- **Events Page**: http://localhost:3001/events

## Path of the Page

The main EventManager functionality is located at:
- **Component**: `apps/web/app/components/EventManager.tsx`
- **Page**: `apps/web/app/events/page.tsx`
- **Home**: `apps/web/app/page.tsx`
- **Layout**: `apps/web/app/layout.tsx`