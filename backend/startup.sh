#!/bin/bash
# Task: T045
# Spec: 002-authentication/deployment.md - Startup Script with Migrations

set -e  # Exit on any error

echo "🚀 Starting Hackathon Todo Backend..."

# Run database migrations to ensure schema is up-to-date
echo "📦 Running database migrations..."
python -m alembic upgrade head

if [ $? -eq 0 ]; then
    echo "✅ Database migrations completed successfully"
else
    echo "⚠️  Database migrations completed with warnings (this is often expected)"
fi

# Start the FastAPI application
echo "🏃 Starting FastAPI application..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}