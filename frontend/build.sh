#!/bin/bash
set -e

# Install dependencies
pnpm install

# Build the application
pnpm build

# Prepare for deployment
if [ ! -d "dist" ]; then
    echo "Build failed: dist directory not found"
    exit 1
fi

echo "Build completed successfully!"
