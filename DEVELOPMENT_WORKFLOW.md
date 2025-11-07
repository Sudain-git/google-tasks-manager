# Development Workflow - Google Tasks Manager

This document explains how to work with this project across multiple sessions, especially when the sandbox environment resets.

---

## Repository Information

- **GitHub Repository**: https://github.com/Sudain-git/google-tasks-manager
- **Live Site**: https://googletask-ng5war.manus.space/
- **Project Type**: React (JavaScript) + Vite static web app
- **Manus Checkpoint**: `manus-webdev://0b1c66fd`

---

## For Future AI Sessions (When Sandbox Resets)

### Step 1: Restore from GitHub

When starting a new session after sandbox reset:

```bash
# Clone the repository
cd /home/ubuntu
git clone https://github.com/Sudain-git/google-tasks-manager.git

# Install dependencies
cd google-tasks-manager
pnpm install

# Start development server
pnpm run dev
```

### Step 2: Make Changes

Edit files as needed:
- Main app code: `client/src/App.jsx`
- Styles: `client/src/index.css`
- Configuration: `vite.config.ts`, `package.json`

### Step 3: Test Changes

```bash
# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

### Step 4: Commit and Push Changes

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "Description of changes"

# Push to GitHub (requires token)
git push origin main
```

### Step 5: Deploy to Production

Use the Manus webdev checkpoint system:
1. Save checkpoint: `webdev_save_checkpoint`
2. User clicks "Publish" button in Manus UI
3. Changes go live at https://googletask-ng5war.manus.space/

---

## GitHub Authentication

### Using Personal Access Token

When pushing to GitHub, you'll need a Personal Access Token:

```bash
# Set remote URL with token
git remote set-url origin https://USERNAME:TOKEN@github.com/Sudain-git/google-tasks-manager.git

# Or configure git credential helper
git config credential.helper store
```

**Token Requirements:**
- Type: Classic Personal Access Token
- Permissions: `repo` (full repository access)
- Generate at: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)

---

## Project Structure

```
google-tasks-manager/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── App.jsx        # Main application component (4000+ lines)
│   │   ├── index.css      # Global styles
│   │   ├── main.tsx       # React entry point
│   │   └── pages/         # Page components
│   ├── public/            # Static assets
│   └── index.html         # HTML template
├── server/                # Placeholder (static app, no backend)
├── shared/                # Shared constants
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript configuration
```

---

## Key Features Implemented

1. **Bulk Insert** - Insert multiple tasks at once
2. **Bulk Set Notes** - Set notes for multiple tasks
3. **Automatic Notes Entry** - Auto-populate notes from task titles
4. **Due Date Management** - Assign due dates with recurrence
   - ✅ Duration filter and sorting (shortest/longest)
   - ✅ Fixed creation date sorting bug
5. **Bulk Move** - Move tasks between lists
   - ✅ Duration filter
   - ✅ Duplicate detection filter
6. **Subtasks Management** - Manage parent-child task relationships
7. **YouTube List** - Import YouTube playlist as tasks

---

## Common Tasks

### Fix a Bug

1. Clone repository (if not already)
2. Create a new branch: `git checkout -b fix/bug-description`
3. Make changes
4. Test thoroughly
5. Commit and push
6. Merge to main

### Add a New Feature

1. Update `client/src/App.jsx` with new functionality
2. Test in development: `pnpm run dev`
3. Build and verify: `pnpm run build`
4. Commit, push, and deploy

### Update Dependencies

```bash
# Check for updates
pnpm outdated

# Update specific package
pnpm update package-name

# Update all packages
pnpm update
```

---

## OAuth Configuration

**Google OAuth Credentials:**
- Client ID: `367863809541-6j28nl498c3nu8lsea72v5ie9ovee0mh.apps.googleusercontent.com`
- API Key: `AIzaSyCyiaTJQvRxteisE1oB5TB4JHUPEVdq-YE`
- Authorized Domain: `googletask-ng5war.manus.space`

**Note:** OAuth only works on the production domain, not on development servers with different URLs.

---

## Troubleshooting

### Sandbox Reset Issues

**Problem:** Project files missing after sandbox reset

**Solution:** Clone from GitHub:
```bash
git clone https://github.com/Sudain-git/google-tasks-manager.git
cd google-tasks-manager
pnpm install
```

### OAuth Redirect URI Mismatch

**Problem:** Error 400: redirect_uri_mismatch

**Solution:** 
- This happens on dev servers with different URLs
- Deploy to production domain instead
- Or update Google Cloud Console with dev server URL

### Build Failures

**Problem:** Build fails with module errors

**Solution:**
```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear Vite cache
rm -rf .vite

# Rebuild
pnpm run build
```

---

## Deployment Checklist

- [ ] All changes committed to Git
- [ ] Pushed to GitHub repository
- [ ] Tested in development (`pnpm run dev`)
- [ ] Production build successful (`pnpm run build`)
- [ ] Manus checkpoint saved
- [ ] Published via Manus UI
- [ ] Tested on production domain
- [ ] OAuth sign-in works

---

## Important Notes

1. **Always use GitHub as source of truth** - Push all changes there
2. **Manus checkpoints are for deployment** - Not for source control
3. **Test OAuth on production only** - Dev servers have different URLs
4. **Keep tokens secure** - Never commit tokens to Git
5. **Document all major changes** - Update this file when needed

---

## Contact & Resources

- **Repository**: https://github.com/Sudain-git/google-tasks-manager
- **Live Site**: https://googletask-ng5war.manus.space/
- **Google Tasks API**: https://developers.google.com/tasks
- **Vite Docs**: https://vitejs.dev/
- **React Docs**: https://react.dev/

---

**Last Updated:** November 6, 2025
**Current Version:** 0b1c66fd (Creation date sorting fix)
