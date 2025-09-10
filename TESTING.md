# 🧪 Testing the CampusOLX Application

## Manual Testing Guide

### 1. Application Startup Test
```bash
# Test backend startup
cd backend
npm run dev
# Should see: "Server running on port 3001" and "Connected to Supabase"

# Test frontend startup  
cd campus-olx
npm run dev
# Should see: "Local: http://localhost:5173"
```

### 2. API Health Check
```bash
curl http://localhost:3001/api/health
# Expected response: {"status":"ok","timestamp":"..."}
```

### 3. Frontend Functionality Tests

#### Landing Page
- ✅ Page loads without errors
- ✅ Navigation menu renders correctly
- ✅ Featured products display
- ✅ Testimonials section visible
- ✅ Footer with proper links

#### Authentication Flow
1. Click "Log In / Sign Up" button
2. Test university email validation (should require .edu domain)
3. Test signup flow with valid email
4. Test login with existing credentials
5. Verify JWT token storage in localStorage

#### Product Browsing
1. Login and navigate to marketplace
2. Verify product grid displays correctly
3. Test search functionality
4. Test category filtering
5. Test product detail views

#### Image Upload
1. Try to list a new item
2. Upload an image (should compress automatically)
3. Verify image preview works
4. Check file size reduction

#### Chat System
1. Click "Connect" on any product
2. Send a test message
3. Verify message appears in chat
4. Test online/offline status indicators

#### Admin Panel (if admin user)
1. Access admin dashboard
2. Review pending items
3. Test approve/reject functionality
4. Verify email notifications

### 4. Browser Compatibility
Test in:
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

### 5. Security Tests
- Verify JWT tokens expire appropriately
- Test rate limiting by making rapid API calls
- Check that non-admin users cannot access admin endpoints
- Verify file upload restrictions work

### 6. Performance Tests
- Check initial page load time
- Test image compression effectiveness
- Verify chat messages load quickly
- Monitor memory usage during extended use

## Common Issues & Solutions

### Backend Won't Start
- Check if port 3001 is available
- Verify all environment variables are set
- Ensure Supabase credentials are correct

### Frontend Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check for TypeScript errors: `npm run type-check`

### Database Connection Issues
- Verify Supabase URL and keys in .env
- Check if database tables exist
- Ensure Row Level Security policies are set

### Image Upload Failures
- Check file size (must be under 10MB)
- Verify file type (JPEG, PNG, WebP only)
- Ensure Supabase storage bucket exists

## Automated Testing (Future Enhancement)

### Unit Tests
```bash
# Frontend tests
cd campus-olx
npm run test

# Backend tests  
cd backend
npm run test
```

### E2E Tests
```bash
# Cypress tests (when implemented)
npm run e2e
```

### API Tests
```bash
# Postman/Newman collection
newman run campus-olx-api-tests.json
```