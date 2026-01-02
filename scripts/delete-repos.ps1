<#
.SYNOPSIS
    Batch delete GitHub repositories while keeping specified ones.

.DESCRIPTION
    This script helps you safely delete multiple GitHub repositories while preserving important ones.
    It requires GitHub CLI (gh) to be installed and authenticated.

.EXAMPLE
    .\scripts\delete-repos.ps1
#>

# Configuration - Edit these to specify which repositories to keep
# REQUIRED: Set GITHUB_USER environment variable before running
# Example: $env:GITHUB_USER = "your-username"
$GITHUB_USER = if ($env:GITHUB_USER) { $env:GITHUB_USER } else { "your-username-here" }
$KEEP_REPOS = @(
    "vision-",       # Main frontend project
    "nova",          # Nova project (新星)
    "v3aihub",       # V3AI Hub
    "vision-AI",     # Backend project (视觉人工智能)
    "v3ai.xin",      # V3AI website
    "saas-starter"   # SaaS starter template
    # Edit above to change which 6 repositories to keep
    # All other repositories will be deleted
)

# Color functions
function Write-Success { param($msg) Write-Host $msg -ForegroundColor Green }
function Write-Warning { param($msg) Write-Host $msg -ForegroundColor Yellow }
function Write-Error { param($msg) Write-Host $msg -ForegroundColor Red }
function Write-Info { param($msg) Write-Host $msg -ForegroundColor Cyan }

# Header
Write-Host "`n" + ("=" * 70) -ForegroundColor Cyan
Write-Host "  GitHub Repository Batch Deletion Tool" -ForegroundColor Yellow
Write-Host ("=" * 70) -ForegroundColor Cyan

# Check if gh is installed
Write-Info "`nChecking GitHub CLI installation..."
try {
    $ghVersion = gh --version 2>&1
    Write-Success "✅ GitHub CLI is installed"
} catch {
    Write-Error "❌ GitHub CLI not found!"
    Write-Warning "Please install it from: https://cli.github.com/"
    exit 1
}

# Check authentication
Write-Info "Checking GitHub authentication..."
try {
    $authStatus = gh auth status 2>&1
    if ($authStatus -match "Logged in") {
        Write-Success "✅ Authenticated as $GITHUB_USER"
    } else {
        throw "Not authenticated"
    }
} catch {
    Write-Error "❌ Not authenticated with GitHub!"
    Write-Warning "Run: gh auth login"
    exit 1
}

# Fetch all repositories
Write-Info "`nFetching repository list..."
try {
    $allReposJson = gh repo list $GITHUB_USER --limit 200 --json name,description,stargazerCount,updatedAt
    $allRepos = $allReposJson | ConvertFrom-Json
    Write-Success "✅ Found $($allRepos.Count) repositories"
} catch {
    Write-Error "❌ Failed to fetch repositories: $_"
    exit 1
}

# Separate repos to keep and delete
$reposToKeep = @()
$reposToDelete = @()

foreach ($repo in $allRepos) {
    if ($KEEP_REPOS -contains $repo.name) {
        $reposToKeep += $repo
    } else {
        $reposToDelete += $repo
    }
}

# Display summary
Write-Host "`n" + ("=" * 70) -ForegroundColor Cyan
Write-Host "  Summary" -ForegroundColor Yellow
Write-Host ("=" * 70) -ForegroundColor Cyan

Write-Success "`nRepositories to KEEP ($($reposToKeep.Count)):"
if ($reposToKeep.Count -eq 0) {
    Write-Warning "  ⚠️  No repositories will be kept!"
} else {
    foreach ($repo in $reposToKeep) {
        $stars = if ($repo.stargazerCount -gt 0) { " ⭐$($repo.stargazerCount)" } else { "" }
        Write-Host "  ✅ $($repo.name)$stars" -ForegroundColor Green
        if ($repo.description) {
            Write-Host "     $($repo.description)" -ForegroundColor Gray
        }
    }
}

Write-Error "`nRepositories to DELETE ($($reposToDelete.Count)):"
if ($reposToDelete.Count -eq 0) {
    Write-Success "  ✅ No repositories will be deleted"
    exit 0
}

foreach ($repo in $reposToDelete) {
    $stars = if ($repo.stargazerCount -gt 0) { " ⭐$($repo.stargazerCount)" } else { "" }
    $updated = ([DateTime]$repo.updatedAt).ToString("yyyy-MM-dd")
    Write-Host "  ❌ $($repo.name)$stars (updated: $updated)" -ForegroundColor Red
    if ($repo.description) {
        Write-Host "     $($repo.description)" -ForegroundColor Gray
    }
}

# Confirmation
Write-Host "`n" + ("=" * 70) -ForegroundColor Cyan
Write-Warning "⚠️  WARNING: This action cannot be undone!"
Write-Host ("=" * 70) -ForegroundColor Cyan

$confirmation = Read-Host "`nType 'DELETE' (in capitals) to confirm deletion of $($reposToDelete.Count) repositories"

if ($confirmation -ne "DELETE") {
    Write-Info "`n✋ Deletion cancelled. No repositories were deleted."
    exit 0
}

# Final confirmation
$finalConfirm = Read-Host "`nAre you ABSOLUTELY sure? Type 'YES' to proceed"
if ($finalConfirm -ne "YES") {
    Write-Info "`n✋ Deletion cancelled. No repositories were deleted."
    exit 0
}

# Perform deletion
Write-Host "`n" + ("=" * 70) -ForegroundColor Cyan
Write-Host "  Deleting Repositories" -ForegroundColor Yellow
Write-Host ("=" * 70) -ForegroundColor Cyan

$successCount = 0
$failCount = 0

foreach ($repo in $reposToDelete) {
    $repoFullName = "$GITHUB_USER/$($repo.name)"
    Write-Host "`n[$($successCount + $failCount + 1)/$($reposToDelete.Count)] Deleting: $repoFullName" -ForegroundColor Yellow
    
    try {
        # Attempt deletion
        gh repo delete $repoFullName --yes 2>&1 | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "  ✅ Successfully deleted: $($repo.name)"
            $successCount++
        } else {
            Write-Error "  ❌ Failed to delete: $($repo.name)"
            $failCount++
        }
        
        # Rate limiting prevention
        Start-Sleep -Milliseconds 500
        
    } catch {
        Write-Error "  ❌ Exception while deleting: $($repo.name)"
        Write-Host "     Error: $_" -ForegroundColor Red
        $failCount++
    }
}

# Final summary
Write-Host "`n" + ("=" * 70) -ForegroundColor Cyan
Write-Host "  Deletion Complete" -ForegroundColor Yellow
Write-Host ("=" * 70) -ForegroundColor Cyan

Write-Success "`n✅ Successfully deleted: $successCount repositories"
if ($failCount -gt 0) {
    Write-Error "❌ Failed to delete: $failCount repositories"
}

Write-Host "`n" + ("=" * 70) -ForegroundColor Cyan
Write-Success "🎉 Process completed!"
Write-Host ("=" * 70) + "`n" -ForegroundColor Cyan
