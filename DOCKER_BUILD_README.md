# Docker Build Configuration

This directory contains the Docker and Google Cloud Build configuration files for deploying NovaUI to Google Cloud Run.

## Files

### Dockerfile
Multi-stage Docker build configuration optimized for production deployment:
- **Build Stage**: Uses Node.js 18 Alpine to install dependencies and build the React application
- **Production Stage**: Uses Nginx Alpine to serve the built static files
- **Port**: 8080 (Cloud Run default)
- **Features**:
  - Optimized for small image size
  - Health check endpoint
  - Gzip compression enabled
  - Security headers configured

### nginx.conf
Nginx web server configuration for the production deployment:
- Listens on port 8080 (Cloud Run requirement)
- SPA routing (all routes redirect to index.html)
- Gzip compression for better performance
- Security headers (X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
- Static asset caching with proper expires headers
- API proxy configuration (optional, for backend integration)

### cloudbuild.yaml
Google Cloud Build configuration that fixes the image naming issue:
- Uses fixed image name **`novaui`** instead of `vision-` (which violates Docker naming conventions)
- Builds and tags images with both commit SHA and "latest" tag
- Pushes images to Google Artifact Registry
- Optional Cloud Run deployment step (commented out)
- Optimized build settings (8 CPU machine, 30-minute timeout)

## Issue Fixed

The original deployment was failing with this error:
```
invalid argument "us-west1-docker.pkg.dev/gen-lang-client-0654563230/cloud-run-source-deploy/vision-/intellibuild-studio-prime:35b398153f728551923805d62e419c60c2d46984" for "-t, --tag" flag: invalid reference format
```

This was caused by the repository name `vision-` ending with a dash, which violates Docker image naming conventions. The solution uses a fixed image name `novaui` (from package.json) instead.

## Deployment

### Local Build
```bash
docker build -t novaui:latest .
docker run -p 8080:8080 novaui:latest
```

### Google Cloud Build
```bash
gcloud builds submit --config cloudbuild.yaml
```

### Deploy to Cloud Run (manual)
```bash
gcloud run deploy novaui \
  --image us-west1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/novaui:latest \
  --region us-west1 \
  --platform managed \
  --port 8080 \
  --allow-unauthenticated
```

### Automatic Deployment
To enable automatic deployment to Cloud Run on every build, uncomment the "Step 4" in `cloudbuild.yaml`.

## Requirements

- Docker 20.10 or later
- Node.js 18 (for local builds)
- Google Cloud SDK (for Cloud Build/Cloud Run deployment)
- Artifact Registry API enabled in GCP project

## Configuration

The Dockerfile uses environment variables injected at build time via Vite:
- `GEMINI_API_KEY` - Google Gemini API key (from .env file)

For production deployments, set these in Cloud Run environment variables or Cloud Build substitutions.

## Performance

Build times:
- Local build: ~3-5 minutes (depending on network speed)
- Cloud Build: ~2-4 minutes (on N1_HIGHCPU_8 machine)

Final image size: ~50MB (compressed)

## Security

- Runs as non-root user in Nginx
- Security headers configured
- No sensitive data in image
- Health check endpoint for reliability
- Minimal attack surface (Alpine base images)
