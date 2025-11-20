# Flight Booking Frontend

React + Vite frontend for the flight booking system with Tailwind CSS.

## Prerequisites

- Node.js 18+ 
- pnpm 10+
- Laravel backend running on `http://localhost:8000`

## Installation Guide

### Step 1: Install Node.js

If you don't have Node.js installed:

**macOS/Linux:**
```bash
# Using Homebrew (macOS)
brew install node

# Or download from https://nodejs.org/
```

**Windows:**
- Download and install from [nodejs.org](https://nodejs.org/)
- Or use Chocolatey: `choco install nodejs`

Verify installation:
```bash
node --version  # Should show v18.0.0 or higher
npm --version
```

### Step 2: Install pnpm

**macOS/Linux:**
```bash
# Using npm (recommended)
npm install -g pnpm

# Or using Homebrew (macOS)
brew install pnpm

# Or using curl
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

**Windows:**
```bash
# Using npm
npm install -g pnpm

# Or using PowerShell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

Verify installation:
```bash
pnpm --version  # Should show v10.0.0 or higher
```

### Step 3: Clone and Setup Project

```bash
# 1. Navigate to the project directory
cd flight-booking-frontend

# 2. Install all dependencies (including Tailwind CSS)
pnpm install

# 3. Approve build scripts (pnpm v10+ security feature)
pnpm approve-builds

# 4. Copy environment file (if .env.example exists)
cp .env.example .env
# env for folder flight-booking-frontend
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=VJP_Flight_Booking
# 5. Update .env with your API URL if different
# VITE_API_URL=http://localhost:8000/api
```
### Step 4: Start Development Server

```bash
pnpm dev
```

The frontend will be available at `http://localhost:5173` (or the next available port: `http://localhost:5174`).

## Tailwind CSS

This project uses **Tailwind CSS v4** with the Vite plugin. Tailwind is already configured and ready to use.

### Configuration

- **Config file:** `tailwind.config.js`
```
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
}
```
- **Vite plugin:** Already set up in `vite.config.js`
```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```
- **Content paths:** Configured to scan `./src/**/*.{js,ts,jsx,tsx}`

### Using Tailwind

Simply use Tailwind utility classes in your components:

```jsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <h1 className="text-2xl font-bold text-black">Title</h1>
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Click me
  </button>
</div>
```

### Custom Colors

The project uses custom colors defined inline:
- `bg-[#a3e7a3]` - Light green background
- `border-[#b98d5d]` - Brown border
- `text-[#c02b0b]` - Red text for required fields

### Tailwind Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS v4 Guide](https://tailwindcss.com/docs/v4-beta)
- [Tailwind UI Components](https://tailwindui.com/)

## First Time Setup (Quick Start)

For new teammates, run this complete setup:

```bash
# 1. Clone the repository (if not already cloned)
git clone <your-repo-url>
cd flight-booking-frontend

# 2. Install pnpm (if not installed)
npm install -g pnpm

# 3. Install all dependencies
pnpm install

# 4. Approve build scripts
pnpm approve-builds

# 5. Start development server
pnpm dev
```

## Daily Development

### Common Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linter
pnpm lint

# Install a new package
pnpm add <package-name>

# Install a dev dependency
pnpm add -D <package-name>

# Remove a package
pnpm remove <package-name>

# Update all dependencies
pnpm update
```

### pnpm Commands Reference

```bash
# Check pnpm version
pnpm --version

# Check installed packages
pnpm list

# Check for outdated packages
pnpm outdated

# Clear pnpm cache (if having issues)
pnpm store prune

# Run a script defined in package.json
pnpm run <script-name>
```

## Tech Stack

- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router 7** - Client-side routing
- **Axios** - HTTP client for API requests
- **pnpm** - Fast, disk space efficient package manager

## Project Structure
```
flight-booking-frontend/
├── src/
│   ├── components/     # Reusable components
│   │   ├── BookingStep1.jsx
│   │   ├── BookingStep2.jsx
│   │   ├── BookingStep3.jsx
│   │   ├── Error.jsx
│   │   ├── FieldRequired.jsx
│   │   ├── PriceBar.jsx
│   │   └── ProcessIndicator.jsx
│   ├── services/      # API services
│   ├── App.jsx        # Main app component
│   └── main.jsx       # Entry point
├── public/            # Static assets
├── uploads/           # Uploaded files (LINE QR code, etc.)
├── tailwind.config.js # Tailwind configuration
├── vite.config.js     # Vite configuration
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

## Backend Setup

Make sure the Laravel backend is running:
```bash
cd ../WebBookingLaravel
php artisan serve
```

## Troubleshooting

### pnpm Issues

**pnpm command not found:**
```bash
# Reinstall pnpm globally
npm install -g pnpm

# Or add to PATH (check pnpm documentation for your OS)
```

**Build script warning:**
```bash
pnpm approve-builds
```

**Permission errors (macOS/Linux):**
```bash
# Fix pnpm permissions
sudo chown -R $(whoami) ~/.pnpm-store
```

**Clear pnpm cache:**
```bash
pnpm store prune
rm -rf node_modules
pnpm install
```

### Tailwind CSS Issues

**Styles not applying:**
- Make sure you're using Tailwind classes correctly
- Check that `tailwind.config.js` includes your file paths
- Restart the dev server: `pnpm dev`
- Clear Vite cache: Delete `.vite` folder and restart

**Custom colors not working:**
- Use bracket notation: `bg-[#a3e7a3]` for custom colors
- Or add to `tailwind.config.js` theme if used frequently

### Development Server Issues

**Port already in use:**
```bash
# Vite will automatically try the next available port
# Or specify a different port in vite.config.js
# Or kill the process using the port:
# macOS/Linux: lsof -ti:5173 | xargs kill
# Windows: netstat -ano | findstr :5173
```

**Module not found errors:**
```bash
# Reinstall dependencies
rm -rf node_modules
pnpm install
```

**Hot reload not working:**
- Save the file again
- Restart the dev server
- Check file is in the correct directory structure

### CORS Errors

**Backend connection issues:**
- Check Laravel `config/cors.php` allows `http://localhost:5173` (or your Vite port)
- Ensure backend is running on correct port (`http://localhost:8000`)
- Check `.env` file has correct `VITE_API_URL`

### General Issues

**Node version mismatch:**
```bash
# Use nvm to switch Node versions (if installed)
nvm use 18

# Or install the correct Node version
```

**Dependencies out of sync:**
```bash
# Remove lock file and reinstall
rm pnpm-lock.yaml
rm -rf node_modules
pnpm install
```