# 🚀 CampusOLX Deployment Guide

## Quick Start (Development)

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Git

### 1. Clone and Install
```bash
git clone https://github.com/ladesai123/campus-OLX.git
cd campus-OLX

# Install frontend dependencies
cd campus-olx
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Environment Setup

**Backend Environment** (`backend/.env`):
```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-here
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-role-key
```

**Frontend Environment** (`campus-olx/.env`):
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_BASE_URL=http://localhost:3001/api
```

### 3. Database Setup
Run the SQL commands from `README.md` in your Supabase SQL editor to create the required tables and policies.

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd campus-olx
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Production Deployment

### Recommended Stack
- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
- **Backend**: Railway, Heroku, or AWS EC2
- **Database**: Supabase (managed PostgreSQL)
- **File Storage**: Supabase Storage or AWS S3

### Environment Variables for Production
Update all localhost URLs to your production domains and use secure, randomly generated secrets.

### Build Commands
```bash
# Frontend build
cd campus-olx
npm run build

# Backend (no build needed, runs directly)
cd backend
npm start
```

## Features Verification Checklist

- ✅ Landing page loads correctly
- ✅ User authentication (signup/login)
- ✅ Product listing and browsing
- ✅ Image upload and compression
- ✅ Real-time chat system
- ✅ Admin dashboard
- ✅ Email notifications
- ✅ Responsive design
- ✅ Security features (JWT, rate limiting)

## Support

For issues or questions:
1. Check the logs in browser console and server terminal
2. Verify environment variables are set correctly
3. Ensure Supabase database is properly configured
4. Check API endpoints are responding at `/api/health`