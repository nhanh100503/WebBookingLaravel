# Flight Booking Frontend

React + Vite frontend for the flight booking system.

## Prerequisites

- Node.js 18+ 
- pnpm 10+
- Laravel backend running on `http://localhost:8000`

## First Time Setup
```bash
# 1. Clone the repository
git clone <your-repo-url>
cd flight-booking-frontend

# 2. Install dependencies
pnpm install

# 3. Approve build scripts (pnpm v10+ security feature)
pnpm approve-builds

# 4. Copy environment file
cp .env.example .env

# 5. Update .env with your API URL if different
# VITE_API_URL=http://localhost:8000/api

# 6. Start development server
pnpm dev
```

## Daily Development
```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linter
pnpm lint
```

## Project Structure
```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── services/      # API services
├── context/       # React context
├── hooks/         # Custom hooks
└── utils/         # Helper functions
```

## Backend Setup

Make sure the Laravel backend is running:
```bash
cd ../WebBookingLaravel
php artisan serve
```

## Troubleshooting

**Build script warning:**
```bash
pnpm approve-builds
```

**Port already in use:**
```bash
# Vite will automatically try the next available port
# Or specify a different port in vite.config.js
```

**CORS errors:**
- Check Laravel `config/cors.php` allows `http://localhost:5174`
- Ensure backend is running on correct port