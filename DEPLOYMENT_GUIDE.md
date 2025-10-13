# ServicePro Elite - Deployment Guide

## Quick Deployment to GitHub Pages

### Prerequisites
- GitHub account
- Git installed locally
- Repository access to `vincehvac/servicepro-elite`

### Step 1: Push to GitHub

The repository is already initialized with all files committed. To push to GitHub:

```bash
cd servicepro-elite

# Add the remote repository
git remote add origin https://github.com/vincehvac/servicepro-elite.git

# Push to GitHub (you'll need to authenticate)
git push -u origin master
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub: https://github.com/vincehvac/servicepro-elite
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select:
   - Branch: `master`
   - Folder: `/ (root)`
5. Click **Save**
6. Wait 1-2 minutes for deployment

### Step 3: Access Your Live Site

After deployment, your site will be available at:
- **Main Landing Page**: https://vincehvac.github.io/servicepro-elite/
- **Full Demo**: https://vincehvac.github.io/servicepro-elite/standalone-demo.html
- **Desktop Preview**: https://vincehvac.github.io/servicepro-elite/preview/index.html
- **Mobile Preview**: https://vincehvac.github.io/servicepro-elite/preview/mobile.html

## Alternative: Deploy Using GitHub CLI

If you have GitHub CLI installed:

```bash
cd servicepro-elite

# Login to GitHub
gh auth login

# Create repository (if it doesn't exist)
gh repo create vincehvac/servicepro-elite --public --source=. --remote=origin

# Push code
git push -u origin master

# Enable GitHub Pages
gh api repos/vincehvac/servicepro-elite/pages -X POST -f source[branch]=master -f source[path]=/
```

## Alternative: Deploy Using Git with Personal Access Token

1. Create a Personal Access Token on GitHub:
   - Go to Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token with `repo` scope
   - Copy the token

2. Push using the token:
```bash
cd servicepro-elite
git remote add origin https://YOUR_TOKEN@github.com/vincehvac/servicepro-elite.git
git push -u origin master
```

## Troubleshooting

### 404 Error After Deployment
- Wait 2-3 minutes after enabling GitHub Pages
- Check that `index.html` exists in the root directory
- Verify GitHub Pages is enabled in repository settings
- Clear browser cache and try again

### Files Not Updating
- Make sure you've pushed the latest changes
- GitHub Pages can take a few minutes to rebuild
- Check the Actions tab for deployment status

### Links Not Working
- All internal links use relative paths
- Ensure all HTML files are in the correct directories
- Check browser console for any errors

## Current Deployment Status

✅ Repository initialized with git
✅ All files committed
✅ Demo files created and tested locally
✅ Server tested on port 8090
⏳ Waiting for GitHub authentication to push

## Local Testing

You can test the site locally before deploying:

```bash
cd servicepro-elite
python3 -m http.server 8080
```

Then visit: http://localhost:8080

## Files Included

- `index.html` - Main landing page
- `standalone-demo.html` - Full interactive demo
- `preview/index.html` - Desktop preview
- `preview/mobile.html` - Mobile preview
- Complete backend, frontend, and mobile app code
- Documentation and setup scripts

## Next Steps After Deployment

1. Verify all URLs are working
2. Test functionality on different devices
3. Share the live demo URL with users
4. Consider setting up a custom domain
5. Deploy backend API to production (Vercel/Railway/Heroku)
6. Connect frontend to live API
7. Deploy mobile app to app stores

---

**Need Help?** Check the main README.md for more information or contact support.