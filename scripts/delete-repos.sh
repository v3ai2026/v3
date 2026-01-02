#!/bin/bash

#############################################################################
# GitHub Repository Batch Deletion Script
# 
# This script helps you safely delete multiple GitHub repositories while
# preserving important ones. Requires GitHub CLI (gh) to be installed.
#
# Usage: ./scripts/delete-repos.sh
#############################################################################

# Configuration - Edit these to specify which repositories to keep
# REQUIRED: Set GITHUB_USER environment variable before running
# Example: export GITHUB_USER="your-username"
GITHUB_USER="${GITHUB_USER:-your-username-here}"
KEEP_REPOS=(
    "vision-"        # Main frontend project
    "nova"           # Nova project (新星)
    "v3aihub"        # V3AI Hub
    "vision-AI"      # Backend project (视觉人工智能)
    "v3ai.xin"       # V3AI website
    "saas-starter"   # SaaS starter template
    # Edit above to change which 6 repositories to keep
    # All other repositories will be deleted
)

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Helper functions
print_success() { echo -e "${GREEN}$1${NC}"; }
print_warning() { echo -e "${YELLOW}$1${NC}"; }
print_error() { echo -e "${RED}$1${NC}"; }
print_info() { echo -e "${CYAN}$1${NC}"; }
print_gray() { echo -e "${GRAY}$1${NC}"; }

# Header
echo ""
echo -e "${CYAN}======================================================================${NC}"
echo -e "${YELLOW}  GitHub Repository Batch Deletion Tool${NC}"
echo -e "${CYAN}======================================================================${NC}"

# Check if gh is installed
print_info "\nChecking GitHub CLI installation..."
if ! command -v gh &> /dev/null; then
    print_error "❌ GitHub CLI not found!"
    print_warning "Please install it from: https://cli.github.com/"
    exit 1
fi
print_success "✅ GitHub CLI is installed"

# Check if jq is installed
print_info "Checking jq installation..."
if ! command -v jq &> /dev/null; then
    print_error "❌ jq not found! jq is required for JSON parsing."
    print_warning "Install it:"
    print_warning "  Mac: brew install jq"
    print_warning "  Ubuntu/Debian: sudo apt install jq"
    print_warning "  Other: https://stedolan.github.io/jq/download/"
    exit 1
fi
print_success "✅ jq is installed"

# Check authentication
print_info "Checking GitHub authentication..."
if ! gh auth status &> /dev/null; then
    print_error "❌ Not authenticated with GitHub!"
    print_warning "Run: gh auth login"
    exit 1
fi
print_success "✅ Authenticated as $GITHUB_USER"

# Fetch all repositories
print_info "\nFetching repository list..."
repos_json=$(gh repo list "$GITHUB_USER" --limit 200 --json name,description,stargazerCount,updatedAt)
if [ $? -ne 0 ]; then
    print_error "❌ Failed to fetch repositories"
    exit 1
fi

total_repos=$(echo "$repos_json" | jq '. | length')
print_success "✅ Found $total_repos repositories"

# Separate repos to keep and delete
repos_to_keep=()
repos_to_delete=()

while IFS= read -r repo_name; do
    keep=false
    for keep_repo in "${KEEP_REPOS[@]}"; do
        if [ "$repo_name" = "$keep_repo" ]; then
            keep=true
            repos_to_keep+=("$repo_name")
            break
        fi
    done
    if [ "$keep" = false ]; then
        repos_to_delete+=("$repo_name")
    fi
done < <(echo "$repos_json" | jq -r '.[].name')

# Display summary
echo ""
echo -e "${CYAN}======================================================================${NC}"
echo -e "${YELLOW}  Summary${NC}"
echo -e "${CYAN}======================================================================${NC}"

print_success "\nRepositories to KEEP (${#repos_to_keep[@]}):"
if [ ${#repos_to_keep[@]} -eq 0 ]; then
    print_warning "  ⚠️  No repositories will be kept!"
else
    for repo in "${repos_to_keep[@]}"; do
        stars=$(echo "$repos_json" | jq -r ".[] | select(.name==\"$repo\") | .stargazerCount")
        desc=$(echo "$repos_json" | jq -r ".[] | select(.name==\"$repo\") | .description // empty")
        star_text=""
        [ "$stars" != "0" ] && [ "$stars" != "null" ] && star_text=" ⭐$stars"
        echo -e "  ${GREEN}✅ $repo$star_text${NC}"
        [ -n "$desc" ] && print_gray "     $desc"
    done
fi

print_error "\nRepositories to DELETE (${#repos_to_delete[@]}):"
if [ ${#repos_to_delete[@]} -eq 0 ]; then
    print_success "  ✅ No repositories will be deleted"
    exit 0
fi

for repo in "${repos_to_delete[@]}"; do
    stars=$(echo "$repos_json" | jq -r ".[] | select(.name==\"$repo\") | .stargazerCount")
    desc=$(echo "$repos_json" | jq -r ".[] | select(.name==\"$repo\") | .description // empty")
    updated=$(echo "$repos_json" | jq -r ".[] | select(.name==\"$repo\") | .updatedAt" | cut -d'T' -f1)
    star_text=""
    [ "$stars" != "0" ] && [ "$stars" != "null" ] && star_text=" ⭐$stars"
    echo -e "  ${RED}❌ $repo$star_text (updated: $updated)${NC}"
    [ -n "$desc" ] && print_gray "     $desc"
done

# Confirmation
echo ""
echo -e "${CYAN}======================================================================${NC}"
print_warning "⚠️  WARNING: This action cannot be undone!"
echo -e "${CYAN}======================================================================${NC}"

read -p $'\nType \'DELETE\' (in capitals) to confirm deletion of '"${#repos_to_delete[@]}"' repositories: ' confirmation
if [ "$confirmation" != "DELETE" ]; then
    print_info "\n✋ Deletion cancelled. No repositories were deleted."
    exit 0
fi

read -p $'\nAre you ABSOLUTELY sure? Type \'YES\' to proceed: ' final_confirm
if [ "$final_confirm" != "YES" ]; then
    print_info "\n✋ Deletion cancelled. No repositories were deleted."
    exit 0
fi

# Perform deletion
echo ""
echo -e "${CYAN}======================================================================${NC}"
echo -e "${YELLOW}  Deleting Repositories${NC}"
echo -e "${CYAN}======================================================================${NC}"

success_count=0
fail_count=0
total_to_delete=${#repos_to_delete[@]}

for i in "${!repos_to_delete[@]}"; do
    repo="${repos_to_delete[$i]}"
    repo_full_name="$GITHUB_USER/$repo"
    current=$((i + 1))
    
    echo ""
    print_warning "[$current/$total_to_delete] Deleting: $repo_full_name"
    
    if gh repo delete "$repo_full_name" --yes 2>&1; then
        print_success "  ✅ Successfully deleted: $repo"
        ((success_count++))
    else
        print_error "  ❌ Failed to delete: $repo"
        ((fail_count++))
    fi
    
    # Rate limiting prevention
    sleep 0.5
done

# Final summary
echo ""
echo -e "${CYAN}======================================================================${NC}"
echo -e "${YELLOW}  Deletion Complete${NC}"
echo -e "${CYAN}======================================================================${NC}"

print_success "\n✅ Successfully deleted: $success_count repositories"
[ $fail_count -gt 0 ] && print_error "❌ Failed to delete: $fail_count repositories"

echo ""
echo -e "${CYAN}======================================================================${NC}"
print_success "🎉 Process completed!"
echo -e "${CYAN}======================================================================${NC}"
echo ""
