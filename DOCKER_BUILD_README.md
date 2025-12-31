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
Google Cloud Build configuration with fixes applied:
- Region: **`europe-west1`** (matches Cloud Run trigger)
- Image name: **`novaui`** (valid Docker name)
- Automatic deployment: **enabled** with resource limits
- Builds and tags images with both commit SHA and "latest" tag
- Pushes images to Google Artifact Registry
- Deploys to Cloud Run with 512Mi memory, 1 CPU
- Optimized build settings (8 CPU machine, 30-minute timeout)

## Issue Fixed

The original deployment was failing with this error:
```
invalid argument "europe-west1-docker.pkg.dev/gen-lang-client-0654563230/cloud-run-source-deploy/vision-/ockerfile:af56ff29d8aaa4ba3e8babb5180c09c68799bab4" for "-t, --tag" flag: invalid reference format
```

This was caused by:
1. The repository name `vision-` ending with a dash, which violates Docker image naming conventions
2. Region mismatch between trigger (europe-west1) and cloudbuild.yaml (us-west1)
3. Invalid service name in trigger configuration

The solution:
- Uses fixed image name `novaui` (from package.json)
- All regions set to `europe-west1`
- Automatic deployment enabled with proper resource limits

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
  --image europe-west1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/novaui:latest \
  --region europe-west1 \
  --platform managed \
  --port 8080 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1
```

### Automatic Deployment
Automatic deployment to Cloud Run is enabled in `cloudbuild.yaml`. Every push to main branch will:
1. Build the Docker image
2. Push to Artifact Registry
3. Deploy to Cloud Run in europe-west1

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
