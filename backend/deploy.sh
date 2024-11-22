#!/bin/bash
set -e

# Set working directory
BASE_DIR="$(pwd)"
DEPLOY_DIR=$(mktemp -d)
echo "Created temporary directory: $DEPLOY_DIR"

# Copy only necessary files
cp -r "$BASE_DIR/app" "$DEPLOY_DIR/"
cp -r "$BASE_DIR/alembic" "$DEPLOY_DIR/"
cp "$BASE_DIR/alembic.ini" "$DEPLOY_DIR/"
cp "$BASE_DIR/requirements.txt" "$DEPLOY_DIR/"
cp "$BASE_DIR/Dockerfile" "$DEPLOY_DIR/"
cp "$BASE_DIR/docker-entrypoint.sh" "$DEPLOY_DIR/"
cp "$BASE_DIR/.dockerignore" "$DEPLOY_DIR/"

# Remove unnecessary files
find "$DEPLOY_DIR" -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
find "$DEPLOY_DIR" -type f -name "*.pyc" -delete
find "$DEPLOY_DIR" -type f -name "*.pyo" -delete
find "$DEPLOY_DIR" -type f -name "*.pyd" -delete

# Create deployment archive
cd "$DEPLOY_DIR"
tar -czf "$BASE_DIR/backend-deploy.tar.gz" .

# Cleanup
cd "$BASE_DIR"
rm -rf "$DEPLOY_DIR"

echo "Created deployment package: $BASE_DIR/backend-deploy.tar.gz"
ls -lh "$BASE_DIR/backend-deploy.tar.gz"
