# 🚀 Next.js Migration - Quick Reference Card

## 📋 Essential Commands

```bash
# Navigate to Next.js project
cd pharmacy-nextjs

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Essential Files Checklist

Create these files in `pharmacy-nextjs/`:

- [ ] `.env.local` - Environment variables
- [ ] `src/app/globals.css` - Global styles
- [ ] `src/app/layout.jsx` - Root layout
- [ ] `src/app/page.jsx` - Home page
- [ ] `src/context/AuthContext.jsx` - Authentication
- [ ] `src/lib/api.js` - API client
- [ ] `src/app/(auth)/login/page.jsx` - Login page
- [ ] `src/app/admin/page.jsx` - Admin dashboard
- [ ] `src/app/cashier/page.jsx` - Cashier dashboard
- [ ] `src/app/pharmacist/page.jsx` - Pharmacist dashboard

## 🔄 Component Migration Pattern

### 1. Add Client Directive
```jsx
'use client'; // Add this at the very top
```

### 2. Update Imports
```jsx
// OLD
import { useAuth } from '../../context/AuthContext';

// NEW
import { useAuth } from '@/context/AuthContext';
```

### 3. Replace Navigation
```jsx
// OLD
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/path');

// NEW
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/path');
```

### 4. Handle localStorage
```jsx
// OLD
localStorage.setItem('key', 'value');

// NEW
if (typeof window !== 'undefined') {
  localStorage.setItem('key', 'value');
}
```

## 🎯 File Locations

| File Type | Old Location | New Location |
|-----------|-------------|--------------|
| Components | `frontend/src/components/` | `pharmacy-nextjs/src/components/` |
| Context | `frontend/src/context/` | `pharmacy-nextjs/src/context/` |
| Pages | `frontend/src/App.jsx` | `pharmacy-nextjs/src/app/*/page.jsx` |
| Assets | `frontend/public/` | `pharmacy-nextjs/public/` |
| Styles | `frontend/src/App.css` | `pharmacy-nextjs/src/app/globals.css` |

## 🔑 Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost/pharmacy-system/api
```

## 🧪 Testing URLs

- **Development**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Admin**: http://localhost:3000/admin
- **Cashier**: http://localhost:3000/cashier
- **Pharmacist**: http://localhost:3000/pharmacist

## 🔐 Test Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Pharmacist | pharmacist1 | admin123 |
| Cashier | cashier1 | admin123 |

## 🐛 Common Errors & Fixes

### Error: "Module not found"
```jsx
// Add at top of file
'use client';
```

### Error: "useRouter is not a function"
```jsx
// Use correct import
import { useRouter } from 'next/navigation';
```

### Error: "localStorage is not defined"
```jsx
// Check window exists
if (typeof window !== 'undefined') {
  // use localStorage
}
```

### Error: "Failed to fetch"
```jsx
// Check .env.local exists and has:
NEXT_PUBLIC_API_URL=http://localhost/pharmacy-system/api
```

## 📦 Import Aliases

```jsx
// Use @ alias for cleaner imports
import { useAuth } from '@/context/AuthContext';
import AdminDashboard from '@/components/Admin/AdminDashboard';
import { apiClient } from '@/lib/api';
```

## 🎨 Styling

```jsx
// Inline styles work the same
<div style={{ color: 'red', fontSize: '16px' }}>Text</div>

// Global styles in globals.css
import './globals.css';
```

## 🔄 Routing

| React Router | Next.js |
|--------------|---------|
| `<Route path="/admin">` | `app/admin/page.jsx` |
| `<Route path="/cashier">` | `app/cashier/page.jsx` |
| `navigate('/admin')` | `router.push('/admin')` |
| `<Link to="/admin">` | `<Link href="/admin">` |

## 📊 Migration Steps

1. ✅ Create Next.js project (Done)
2. ⏳ Create essential files
3. ⏳ Copy components
4. ⏳ Update imports
5. ⏳ Test functionality
6. ⏳ Fix bugs
7. ⏳ Deploy

## 🚀 Quick Start (5 Steps)

```bash
# 1. Go to project
cd pharmacy-nextjs

# 2. Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost/pharmacy-system/api" > .env.local

# 3. Create essential files
# (Copy code from NEXTJS_MIGRATION_COMPLETE.md)

# 4. Copy components
# (Copy from frontend/src/components/)

# 5. Run
npm run dev
```

## 📚 Documentation Files

1. **`MIGRATION_SUMMARY.md`** - Overview and progress
2. **`NEXTJS_MIGRATION_COMPLETE.md`** - Complete code and instructions
3. **`setup-nextjs.md`** - Detailed setup guide
4. **`QUICK_REFERENCE.md`** - This file (quick tips)

## ✅ Success Checklist

- [ ] Next.js project created
- [ ] Essential files created
- [ ] Components copied
- [ ] Imports updated
- [ ] Can run `npm run dev`
- [ ] Can access http://localhost:3000
- [ ] Login works
- [ ] All dashboards work
- [ ] All features work
- [ ] No console errors

## 🎯 Time Estimate

- Setup: 30 min
- Copy files: 1 hour
- Update code: 1 hour
- Testing: 1 hour
- **Total: 3-4 hours**

## 💡 Pro Tips

1. **Test incrementally** - Don't copy everything at once
2. **Keep old app running** - Compare side-by-side
3. **Check console** - Look for errors
4. **Use DevTools** - Network tab shows API calls
5. **Git commit often** - Save progress

## 🎉 You're Ready!

Follow `NEXTJS_MIGRATION_COMPLETE.md` for detailed instructions.

**Your PHP backend stays exactly the same!** 🚀
