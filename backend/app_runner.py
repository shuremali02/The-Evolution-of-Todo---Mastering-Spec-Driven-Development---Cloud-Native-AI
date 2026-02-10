#!/usr/bin/env python3
"""
Hugging Face Spaces FastAPI Runner
This file serves as the entry point for Hugging Face Spaces deployment.
"""

import os
import subprocess
import sys
import time
from threading import Thread
from app.main import app
from uvicorn import Config, Server


def run_migrations():
    """Run database migrations before starting the server."""
    print("📦 Running database migrations...")
    try:
        result = subprocess.run([
            sys.executable, "-m", "alembic", "upgrade", "head"
        ], capture_output=True, text=True, cwd=os.path.dirname(os.path.abspath(__file__)))

        if result.returncode == 0:
            print("✅ Database migrations completed successfully")
        else:
            print(f"⚠️  Database migrations completed with warnings: {result.stderr}")
    except Exception as e:
        print(f"⚠️  Error running migrations: {e}")


def main():
    """Main entry point for Hugging Face Spaces."""
    print("🚀 Starting Hackathon Todo Backend...")

    # Run migrations first
    run_migrations()

    # Get port from environment or default to 7860 for Hugging Face
    port = int(os.environ.get("PORT", 7860))

    print(f"🏃 Starting FastAPI application on port {port}...")

    # Create Uvicorn server configuration
    config = Config(
        app=app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )
    server = Server(config)

    # Run the server
    server.run()


if __name__ == "__main__":
    main()