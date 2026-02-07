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

# Start the MCP server in background on port 8000
echo "🔌 Starting MCP server on port 8000..."
python src/mcp_server.py &
MCP_PID=$!

# Wait a moment for the MCP server to start
sleep 5

# Check if MCP server started successfully
if kill -0 $MCP_PID 2>/dev/null; then
    echo "✅ MCP server is running (PID: $MCP_PID)"
else
    echo "❌ MCP server failed to start"
    exit 1
fi

# Start the FastAPI application on port 7860
echo "🏃 Starting FastAPI application on port 7860..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7860}