# Quick GitHub Setup Guide

Your repository is already initialized and committed! Follow these steps to push to GitHub:

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `hacker-tools-platform` (or your choice)
3. Description: "Security Tool Discovery & Sharing Platform for the hacker community"
4. Choose **Public** or **Private**
5. **IMPORTANT**: Do NOT check "Initialize this repository with a README" (we already have one)
6. Click "Create repository"

## Step 2: Push Your Code

After creating the repository, GitHub will show you commands. Use these:

### Option A: HTTPS (Recommended for beginners)

```bash
cd /Users/yoshikondo/hacker-tools-platform

# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/hacker-tools-platform.git

# Push to GitHub
git push -u origin main
```

You'll be prompted for your GitHub username and password (use a Personal Access Token if 2FA is enabled).

### Option B: SSH (If you have SSH keys set up)

```bash
cd /Users/yoshikondo/hacker-tools-platform

# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin git@github.com:YOUR_USERNAME/hacker-tools-platform.git

# Push to GitHub
git push -u origin main
```

## Step 3: Verify

Visit `https://github.com/YOUR_USERNAME/hacker-tools-platform` to see your code!

## Troubleshooting

### Authentication Issues

If you get authentication errors:

1. **For HTTPS**: Use a Personal Access Token instead of password
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token with `repo` scope
   - Use the token as your password

2. **For SSH**: Make sure your SSH key is added to GitHub
   - Check: `ssh -T git@github.com`
   - If it fails, add your SSH key: GitHub Settings → SSH and GPG keys

### Remote Already Exists

If you see "remote origin already exists":

```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/hacker-tools-platform.git
```

### Branch Name Issues

If you need to rename your branch:

```bash
git branch -m main
git push -u origin main
```

## Next Steps After Pushing

1. **Add a description** to your GitHub repository
2. **Add topics/tags** like: `security`, `hacking`, `tools`, `fastapi`, `react`, `typescript`
3. **Enable GitHub Pages** (optional) - see `DEPLOYMENT.md`
4. **Set up CI/CD** (optional) - see `DEPLOYMENT.md`

## Future Updates

To push future changes:

```bash
git add .
git commit -m "Your commit message"
git push
```

That's it! Your code is now on GitHub! 🚀


