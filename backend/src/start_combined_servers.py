"""
Task: T027
Spec: 010-ai-chatbot/spec.md - Combined Service Starter

Script to start both the main FastAPI server and MCP server simultaneously.
This allows both services to run together for the AI chatbot functionality.
"""

import asyncio
import subprocess
import sys
import threading
import time
import signal
from concurrent.futures import ThreadPoolExecutor
import os

def run_fastapi_server():
    """Run the FastAPI server."""
    cmd = [
        sys.executable, "-m", "uvicorn",
        "app.main:app",
        "--host", "127.0.0.1",
        "--port", "8000",
        "--reload"
    ]
    process = subprocess.Popen(cmd)
    try:
        process.wait()
    except KeyboardInterrupt:
        process.terminate()
        process.wait()


def run_mcp_server():
    """Run the MCP server."""
    cmd = [sys.executable, "src/run_mcp_server.py"]
    process = subprocess.Popen(cmd)
    try:
        process.wait()
    except KeyboardInterrupt:
        process.terminate()
        process.wait()


def signal_handler(signum, frame):
    print("\nReceived interrupt signal. Exiting...")
    sys.exit(0)


async def main():
    """Start both servers in separate processes."""
    print("Starting combined services...")
    print("FastAPI server will run on http://127.0.0.1:8000")
    print("MCP server will run on its own port (automatically assigned)")

    # Set up signal handler for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    # Create subprocesses for both servers
    loop = asyncio.get_event_loop()

    with ThreadPoolExecutor() as executor:
        # Run both servers concurrently
        fastapi_future = loop.run_in_executor(executor, run_fastapi_server)
        mcp_future = loop.run_in_executor(executor, run_mcp_server)

        try:
            # Wait for both servers to complete (they run indefinitely)
            await asyncio.gather(fastapi_future, mcp_future)
        except KeyboardInterrupt:
            print("\nShutting down services...")
        except Exception as e:
            print(f"Error running services: {e}")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nServices stopped by user.")