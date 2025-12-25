# Deployment Guide

## GitHub Deployment

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right, then "New repository"
3. Repository name: `hacker-tools-platform` (or your preferred name)
4. Description: "Security Tool Discovery & Sharing Platform for the hacker community"
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

### Step 2: Push to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
cd /Users/yoshikondo/hacker-tools-platform

# Add the remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/hacker-tools-platform.git

# Push to GitHub
git push -u origin main
```

If you're using SSH instead of HTTPS:

```bash
git remote add origin git@github.com:YOUR_USERNAME/hacker-tools-platform.git
git push -u origin main
```

### Step 3: Verify

Visit your repository on GitHub to verify all files are uploaded.

## GitHub Pages Deployment (Frontend Only)

To deploy the frontend as a static site:

1. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Configure GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" in the left sidebar
   - Source: Select "GitHub Actions"
   - Or use the `gh-pages` branch method (see below)

3. **Using gh-pages package**:
   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```
   
   Add to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
   
   Then deploy:
   ```bash
   npm run deploy
   ```

## Vercel Deployment (Recommended for Full Stack)

Vercel is great for deploying both frontend and backend:

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy Frontend**:
   ```bash
   cd frontend
   vercel
   ```

3. **Deploy Backend**:
   ```bash
   cd backend
   vercel
   ```

4. **Configure Environment Variables**:
   - In Vercel dashboard, add environment variables
   - Update frontend API URL to point to backend URL

## Railway Deployment

Railway is excellent for full-stack apps:

1. Go to [Railway](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will auto-detect the project structure
6. Configure:
   - Backend service: Set start command to `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Frontend service: Set start command to `npm run dev` or build and serve
   - Add environment variables as needed

## Render Deployment

1. Go to [Render](https://render.com)
2. Create new "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Backend**: 
     - Build Command: `cd backend && pip install -r requirements.txt`
     - Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Frontend**:
     - Build Command: `cd frontend && npm install && npm run build`
     - Start Command: `cd frontend && npm run preview`

## Environment Variables

For production, you may want to set:

**Backend (.env)**:
```
DATABASE_URL=postgresql://user:pass@host/dbname  # For PostgreSQL
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=https://your-frontend-domain.com
```

**Frontend (.env)**:
```
VITE_API_URL=https://your-backend-api.com
```

## Database Migration (Production)

For production, consider migrating from SQLite to PostgreSQL:

1. Update `backend/database.py`:
   ```python
   SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./hacker_tools.db")
   ```

2. Install PostgreSQL adapter:
   ```bash
   pip install psycopg2-binary
   ```

3. Update `requirements.txt`:
   ```
   psycopg2-binary==2.9.9
   ```

## CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
      - name: Run tests (if you add them)
        run: |
          cd backend
          pytest

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd frontend
          npm install
      - name: Build
        run: |
          cd frontend
          npm run build
```

## Security Considerations

Before deploying to production:

1. **Environment Variables**: Never commit `.env` files
2. **CORS**: Configure CORS origins properly
3. **Rate Limiting**: Add rate limiting to API endpoints
4. **Authentication**: Implement user authentication
5. **HTTPS**: Always use HTTPS in production
6. **Database**: Use a managed database service
7. **Secrets**: Use secret management for API keys

## Quick Reference

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit"

# Connect to GitHub
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main

# Update repository
git add .
git commit -m "Your commit message"
git push
```


