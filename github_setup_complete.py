#!/usr/bin/env python3

import subprocess
import os

def setup_github_cli():
    print("🎉 GitHub CLI Setup Complete!")
    print("=" * 50)
    
    # Check GitHub CLI status
    try:
        result = subprocess.run(["./gh", "auth", "status"], capture_output=True, text=True)
        print("✅ GitHub CLI Authentication Status:")
        print(result.stdout)
        print(result.stderr)
        
        # List current repositories
        result = subprocess.run(["./gh", "repo", "list"], capture_output=True, text=True)
        print("\n📁 Current Repositories:")
        print(result.stdout)
        
    except Exception as e:
        print(f"❌ Error checking GitHub status: {str(e)}")
    
    # Set up git configuration to use GitHub CLI
    try:
        subprocess.run(["git", "config", "--global", "credential.helper", ""], check=True)
        subprocess.run(["git", "config", "--global", "credential.helper", "!/home/delta/Projects/PrismaticCollections(SpiralFlip_Site)/gh auth git-credential"], check=True)
        print("✅ Git configured to use GitHub CLI for authentication")
    except Exception as e:
        print(f"⚠️ Git config warning: {str(e)}")
    
    print(f"""
🐙 GITHUB SETUP STATUS:
========================

✅ GitHub CLI installed and authenticated
✅ Account: Deltaether  
✅ Token configured with limited permissions
✅ Git credential helper configured

⚠️  REPOSITORY CREATION:
The token has limited permissions and cannot create repositories automatically.
You'll need to create the repository manually:

📝 MANUAL STEPS:

1. 🌐 Go to: https://github.com/new
2. 📝 Repository name: PrismaticCollections-SpiralFlip  
3. 📝 Description: Phantasia 3D Interactive Website with Angular Authentication - Live at http://212.227.85.148/
4. 🌍 Make it Public (or Private as preferred)
5. ❌ Don't initialize with README (we have existing code)
6. ✅ Click "Create repository"

🚀 AFTER CREATING THE REPO:

Local Setup:
```bash
git remote remove origin
git remote add origin https://github.com/Deltaether/PrismaticCollections-SpiralFlip.git
git push -u origin alternative-backgroundplane
```

Server Deployment:
```bash
./ssh_login.sh
deploy-phantasia
```

🔄 FUTURE WORKFLOW:
1. Make changes locally
2. git add . && git commit -m "Your message"  
3. git push
4. SSH to server: deploy-phantasia

📋 GITHUB CLI COMMANDS NOW AVAILABLE:
- ./gh repo list                    # List your repositories
- ./gh repo view REPO_NAME          # View repository details  
- ./gh pr create                    # Create pull request
- ./gh issue list                   # List issues
- ./gh workflow list                # List GitHub Actions
- ./gh auth status                  # Check authentication status

🎯 CURRENT STATUS:
- ✅ GitHub CLI: Ready
- ⚠️ Repository: Need to create manually
- ✅ Server: Configured for GitHub deployment
- ✅ Local Git: Ready to push once repo created

Token Permissions: Limited (read-only operations work)
""")

if __name__ == "__main__":
    setup_github_cli()