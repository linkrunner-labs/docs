# AWS Amplify Deployment Guide

This guide will help you deploy your Linkrunner Mintlify documentation to AWS Amplify.

## Prerequisites

-   AWS Account with Amplify access
-   GitHub repository containing this documentation project
-   Node.js 18+ installed locally (for testing)

## Project Setup (Already Completed)

✅ The following files have been added to prepare your project for AWS Amplify:

-   `package.json` - Defines build scripts and dependencies
-   `amplify.yml` - AWS Amplify build configuration
-   `.gitignore` - Excludes build artifacts and dependencies
-   `DEPLOYMENT.md` - This deployment guide

## Local Testing (Optional)

Before deploying, you can test the build locally:

```bash
# Install dependencies
npm install

# Install Mintlify CLI globally
npm run install-mintlify

# Test local development
npm run dev

# Test build process
npm run build
```

## AWS Amplify Deployment Steps

### 1. Push to GitHub

Make sure all your changes are committed and pushed to your GitHub repository:

```bash
git add .
git commit -m "Prepare project for AWS Amplify deployment"
git push origin main
```

### 2. Set up AWS Amplify

1. **Go to AWS Amplify Console**

    - Navigate to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
    - Click "Get started" under "Amplify Hosting"

2. **Connect Repository**

    - Choose "GitHub" as your Git provider
    - Authorize AWS Amplify to access your GitHub account
    - Select your repository and branch (usually `main` or `master`)

3. **Configure Build Settings**

    - AWS Amplify should automatically detect the `amplify.yml` file
    - Verify the build configuration matches:
        ```yaml
        version: 1
        frontend:
            phases:
                preBuild:
                    commands:
                        - npm install
                        - npm install -g mintlify
                build:
                    commands:
                        - mintlify build
                postBuild:
                    commands:
                        - echo "Build completed successfully"
            artifacts:
                baseDirectory: _site
                files:
                    - "**/*"
            cache:
                paths:
                    - node_modules/**/*
        ```

4. **Environment Variables (if needed)**

    - Add any necessary environment variables in the Amplify console
    - For Mintlify docs, typically no special environment variables are needed

5. **Deploy**
    - Review your settings
    - Click "Save and deploy"
    - AWS Amplify will build and deploy your documentation

### 3. Custom Domain (Optional)

After successful deployment:

1. **Add Custom Domain**

    - Go to "Domain management" in your Amplify app
    - Click "Add domain"
    - Enter your domain name
    - Follow DNS configuration instructions

2. **SSL Certificate**
    - AWS Amplify automatically provides SSL certificates
    - Wait for DNS validation to complete

## Build Process

AWS Amplify will:

1. **Install Dependencies**: Install npm packages and Mintlify CLI
2. **Build Documentation**: Run `mintlify build` to generate static files
3. **Deploy**: Serve the generated static files from the `_site` directory

## Troubleshooting

### Common Issues:

1. **Build Fails**

    - Check build logs in Amplify console
    - Ensure all referenced pages in `docs.json` exist
    - Verify Node.js version compatibility

2. **404 Errors**

    - Check that all navigation pages listed in `docs.json` have corresponding `.mdx` files
    - Verify file paths and naming conventions

3. **Styling Issues**
    - Ensure all logo and image files are present in their respective directories
    - Check that favicon.svg exists in the root directory

### Support

-   [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
-   [Mintlify Documentation](https://mintlify.com/docs)
-   [Mintlify Build Issues](https://mintlify.com/docs/development)

## Automatic Deployments

Once connected to GitHub:

-   Every push to your main branch will trigger an automatic deployment
-   You can configure branch-based deployments for staging/production workflows
-   Build status and logs are available in the Amplify console

## Monitoring

AWS Amplify provides:

-   Real-time build logs
-   Deployment history
-   Access logs and analytics
-   Performance monitoring

Your documentation site will be available at a URL like:
`https://branch-name.random-id.amplifyapp.com`

Enjoy your deployed Mintlify documentation! 🚀
