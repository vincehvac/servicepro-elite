#!/bin/bash

# ServicePro Elite - GitHub Deployment Script
# This script helps deploy the project to GitHub Pages

echo "🚀 ServicePro Elite - GitHub Deployment"
echo "========================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Error: Git repository not initialized"
    exit 1
fi

echo "✅ Git repository found"
echo ""

# Check if remote exists
if git remote | grep -q "origin"; then
    echo "✅ Remote 'origin' already exists"
    REMOTE_URL=$(git remote get-url origin)
    echo "   URL: $REMOTE_URL"
else
    echo "📝 Adding remote repository..."
    git remote add origin https://github.com/vincehvac/servicepro-elite.git
    echo "✅ Remote 'origin' added"
fi

echo ""
echo "📊 Current status:"
git status --short

echo ""
echo "🔄 Pushing to GitHub..."
echo ""

# Try to push
if git push -u origin master; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Go to: https://github.com/vincehvac/servicepro-elite"
    echo "2. Click on 'Settings' tab"
    echo "3. Navigate to 'Pages' in the left sidebar"
    echo "4. Under 'Source', select:"
    echo "   - Branch: master"
    echo "   - Folder: / (root)"
    echo "5. Click 'Save'"
    echo ""
    echo "⏳ Wait 1-2 minutes for deployment, then visit:"
    echo "   https://vincehvac.github.io/servicepro-elite/"
    echo ""
else
    echo ""
    echo "❌ Push failed. This usually means:"
    echo "1. You need to authenticate with GitHub"
    echo "2. The repository doesn't exist yet"
    echo "3. You don't have permission to push"
    echo ""
    echo "💡 Solutions:"
    echo ""
    echo "Option 1: Use GitHub CLI"
    echo "  gh auth login"
    echo "  gh repo create vincehvac/servicepro-elite --public --source=. --remote=origin"
    echo "  git push -u origin master"
    echo ""
    echo "Option 2: Use Personal Access Token"
    echo "  1. Create token at: https://github.com/settings/tokens"
    echo "  2. Run: git remote set-url origin https://YOUR_TOKEN@github.com/vincehvac/servicepro-elite.git"
    echo "  3. Run: git push -u origin master"
    echo ""
    echo "Option 3: Use SSH"
    echo "  1. Set up SSH key: https://docs.github.com/en/authentication/connecting-to-github-with-ssh"
    echo "  2. Run: git remote set-url origin git@github.com:vincehvac/servicepro-elite.git"
    echo "  3. Run: git push -u origin master"
    echo ""
fi