<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1pKtDgh7WukKx9-Yh1Rmpy0ihKgvkExTf

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deployment Configuration

### GitHub Integration

To deploy your projects to GitHub repositories, you'll need a Personal Access Token:

#### Creating a GitHub Personal Access Token

1. Navigate to GitHub Settings: **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **"Generate new token (classic)"**
3. Give your token a descriptive name (e.g., "IntelliBuild Studio")
4. Select the following scopes:
   - ✅ `repo` - Full control of private repositories
   - ✅ `user` - Read user profile data
   - ✅ `workflow` - Update GitHub Action workflows
5. Click **"Generate token"** at the bottom
6. **Important:** Copy the token immediately - you won't be able to see it again!
7. Paste the token in the **Deploy** tab in the application

#### Token Permissions

The token requires these permissions:
- **`repo`** - Create repositories, push code, and manage repository settings
- **`user`** - Verify your GitHub identity
- **`workflow`** - Inject CI/CD workflows automatically

#### Features

Once authenticated, you can:
- ✨ Create new GitHub repositories directly from the app
- 📦 Push generated code files automatically
- 🔄 Auto-inject GitHub Actions workflows for CI/CD
- 🔗 Get direct links to your deployed repositories

### Vercel Integration

To deploy to Vercel:

#### Creating a Vercel Token

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Go to **Settings** → **Tokens**
3. Click **"Create Token"**
4. Give it a name (e.g., "IntelliBuild Studio")
5. Copy the generated token
6. Paste it in the **Deploy** tab in the application

#### Deployment Process

1. Generate your project in the **Build** tab
2. Navigate to the **Deploy** tab
3. Enter your Vercel token
4. Click **"部署到 Vercel"** (Deploy to Vercel)
5. Monitor deployment status in real-time
6. Get your live URL once deployment is complete

### Environment Variables

For production deployments, you may need to configure environment variables in your Vercel project:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add required variables (e.g., `GEMINI_API_KEY`, database credentials)
4. Redeploy to apply changes

## Security Notes

- 🔒 Tokens are stored locally in your browser's localStorage
- 🚫 Never commit tokens to version control
- ♻️ Rotate tokens regularly for security
- 🗑️ Revoke tokens when no longer needed

## Workflow

The complete deployment workflow:

1. **Generate** - Create your project in the Build tab
2. **Validate** - Verify your GitHub token in the Deploy tab
3. **Configure** - Set repository name and description
4. **Deploy** - Automatically create repo, push code, and inject CI/CD
5. **Monitor** - Track deployment progress and access your live repository

Happy building! 🚀
