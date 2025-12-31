# Batch Repository Deletion Guide

Complete guide for safely deleting multiple GitHub repositories while preserving important ones.

## 🎯 Overview

These scripts help you manage large numbers of repositories by:
- ✅ Listing all your repositories
- ✅ Specifying which repositories to keep
- ✅ Safely deleting all others with confirmation
- ✅ Providing detailed progress and error reporting

## 📋 Prerequisites

### 1. GitHub CLI Installation

#### Windows
```powershell
winget install --id GitHub.cli
```
Or download from: https://cli.github.com/

#### Mac
```bash
brew install gh
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt install gh
```

### 2. Authentication

```bash
gh auth login
```

Follow the prompts to authenticate with your GitHub account.

## 🚀 Quick Start

### Step 1: Configure Which Repositories to Keep

Edit the script for your platform:

**Windows (`scripts/delete-repos.ps1`):**
```powershell
$KEEP_REPOS = @(
    "vision-",           # Always keep
    "important-repo-1",  # Add your repos here
    "important-repo-2",
    "important-repo-3",
    "important-repo-4"
)
```

**Mac/Linux (`scripts/delete-repos.sh`):**
```bash
KEEP_REPOS=(
    "vision-"           # Always keep
    "important-repo-1"  # Add your repos here
    "important-repo-2"
    "important-repo-3"
    "important-repo-4"
)
```

### Step 2: Run the Script

#### Windows PowerShell

```powershell
# Enable script execution (first time only)
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

# Run the script
.\scripts\delete-repos.ps1
```

#### Mac/Linux

```bash
# Make script executable (first time only)
chmod +x scripts/delete-repos.sh

# Run the script
./scripts/delete-repos.sh
```

### Step 3: Review and Confirm

The script will:
1. ✅ Show all repositories to **KEEP** (in green)
2. ❌ Show all repositories to **DELETE** (in red)
3. ⚠️ Ask for confirmation twice before deleting

## 📊 Example Output

```
======================================================================
  GitHub Repository Batch Deletion Tool
======================================================================

✅ GitHub CLI is installed
✅ Authenticated as v3ai2026
✅ Found 73 repositories

======================================================================
  Summary
======================================================================

Repositories to KEEP (5):
  ✅ vision- ⭐1
     Enterprise-grade AI-powered Full-Stack Development Platform
  ✅ important-project ⭐5
  ✅ backup-repo
  ✅ client-work
  ✅ documentation

Repositories to DELETE (68):
  ❌ old-test-1 (updated: 2024-10-15)
  ❌ old-test-2 (updated: 2024-09-20)
  ❌ experimental-feature (updated: 2024-08-10)
  ...

======================================================================
⚠️  WARNING: This action cannot be undone!
======================================================================

Type 'DELETE' (in capitals) to confirm deletion of 68 repositories: 
```

## 🛡️ Safety Features

### Multiple Confirmations
- First confirmation: Type `DELETE`
- Second confirmation: Type `YES`

### Detailed Reporting
- Shows stars ⭐ for each repository
- Shows last updated date
- Shows descriptions
- Progress indicator during deletion

### Error Handling
- Checks GitHub CLI installation
- Verifies authentication
- Reports failed deletions
- Rate limiting prevention (0.5s delay between deletions)

## ⚙️ Advanced Usage

### List Repositories Without Deleting

```bash
gh repo list v3ai2026 --limit 200 --json name,description,stargazerCount
```

### Delete Single Repository

```bash
gh repo delete v3ai2026/repo-name --yes
```

### Export Repository List

```bash
# JSON format
gh repo list v3ai2026 --limit 200 --json name,description > repos.json

# Simple list
gh repo list v3ai2026 --limit 200 --json name --jq '.[].name' > repos.txt
```

## 🔍 Troubleshooting

### "GitHub CLI not found"
Install GitHub CLI from https://cli.github.com/

### "Not authenticated"
Run: `gh auth login`

### "Permission denied" (Linux/Mac)
Run: `chmod +x scripts/delete-repos.sh`

### "Execution Policy" Error (Windows)
Run: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`

### Rate Limiting
The script includes 500ms delay between deletions to avoid API rate limits.

## ⚠️ Important Notes

### Deletion is Permanent
- Deleted repositories **cannot be recovered**
- All issues, PRs, wikis, and discussions are deleted
- All stars and forks are lost

### Alternative: Archive Instead of Delete

If you want to preserve repository history:

```bash
# Archive a repository (makes it read-only)
gh repo archive v3ai2026/repo-name
```

### Backup Before Deletion

Consider cloning important repositories before deletion:

```bash
# Clone all repos for backup
gh repo list v3ai2026 --limit 200 --json name --jq '.[].name' | \
  xargs -I {} git clone https://github.com/v3ai2026/{}.git backups/{}
```

## 📝 Best Practices

### 1. Start with a Dry Run
Review the list of repositories to delete carefully before confirming.

### 2. Keep Active Repositories
Always keep repositories that:
- Have recent commits
- Have active collaborators
- Have stars or forks
- Are used in production

### 3. Archive Instead of Delete
For old projects with historical value, use archive instead:
```bash
gh repo archive v3ai2026/old-project
```

### 4. Export Data First
- Download important issues/PRs
- Clone repositories locally
- Export wikis and discussions

## 🆘 Emergency Recovery

If you accidentally delete a repository:

1. **Within 90 days**: Contact GitHub Support immediately
2. **After 90 days**: Recovery is not possible
3. **Prevention**: Always backup important data

## 📞 Support

- GitHub CLI docs: https://cli.github.com/manual/
- GitHub Support: https://support.github.com/
- Repository Issues: https://github.com/v3ai2026/vision-/issues

## 🎯 Common Scenarios

### Scenario 1: Keep Only Active Projects
```powershell
$KEEP_REPOS = @("vision-", "active-client-1", "active-client-2", "production-app", "documentation")
```

### Scenario 2: Delete All Test Repositories
Modify script to exclude repos starting with "test-":
```powershell
$reposToDelete = $allRepos | Where-Object { 
    $_.name -notlike "test-*" -and $KEEP_REPOS -notcontains $_.name 
}
```

### Scenario 3: Keep Starred Repositories Only
```powershell
$reposToKeep = $allRepos | Where-Object { $_.stargazerCount -gt 0 }
```

---

**Created:** 2025-12-31  
**Version:** 1.0.0  
**Maintained by:** v3ai2026
