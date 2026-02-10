#!/bin/bash
# Startup script to run both servers

echo "Starting MCP Server and FastAPI Server..."

# Start MCP server in background
echo "Starting MCP server on port 8002..."
cd /mnt/e/The Evolution of Todo – Mastering Spec-Driven Development & Cloud Native AI/backend
source .venv/bin/activate
python src/run_mcp_server.py &
MCP_PID=$!

# Wait a moment for MCP to start
sleep 3

# Start FastAPI server in foreground
echo "Starting FastAPI server on port 8000..."
uv run uvicorn app.main:app --reload --port 8000

# Kill MCP server when done
kill $MCP_PID 2>/dev/null