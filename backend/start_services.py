#!/usr/bin/env python3
"""
Script to start both the main FastAPI application and the MCP server together.

This script starts both services to ensure the AI agent can connect to the MCP server.
"""

import asyncio
import subprocess
import sys
import signal
import os
from concurrent.futures import ThreadPoolExecutor
import time


class ServiceManager:
    def __init__(self):
        self.processes = []
        self.running = True

    def start_mcp_server(self):
        """Start the MCP server as a subprocess."""
        print("Starting MCP Server on port 8001...")

        # Create the MCP server process
        cmd = [sys.executable, "src/run_mcp_server.py"]
        env = os.environ.copy()
        env['MCP_SERVER_URL'] = 'http://localhost:8001'

        proc = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env=env,
            text=True
        )
        self.processes.append(proc)
        print("MCP Server process started")
        return proc

    def start_main_app(self):
        """Start the main FastAPI application."""
        print("Starting Main Application on port 8000...")

        cmd = [
            sys.executable, '-m', 'uvicorn',
            'app.main:app',
            '--host', '0.0.0.0',
            '--port', '8000',
            '--reload'
        ]

        proc = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        self.processes.append(proc)
        print("Main Application process started")
        return proc

    def stop_all(self):
        """Stop all running processes."""
        print("Stopping all services...")
        for proc in self.processes:
            try:
                proc.terminate()
                proc.wait(timeout=5)
            except subprocess.TimeoutExpired:
                proc.kill()
        print("All services stopped.")

    def monitor_processes(self):
        """Monitor running processes."""
        while self.running:
            for i, proc in enumerate(self.processes):
                if proc.poll() is not None:
                    print(f"Process {i} terminated with code {proc.returncode}")
                    if self.running:  # Only restart if we're still running
                        print("Restarting process...")
                        # Restart logic could go here if needed
            time.sleep(1)

    def run(self):
        """Run both services."""
        print("Starting services...")

        # Start MCP server first
        mcp_proc = self.start_mcp_server()

        # Wait a bit for MCP server to initialize
        time.sleep(3)

        # Start main app
        main_proc = self.start_main_app()

        try:
            # Monitor processes
            self.monitor_processes()
        except KeyboardInterrupt:
            print("\nReceived interrupt signal")
        finally:
            self.running = False
            self.stop_all()


def main():
    """Main entry point."""
    manager = ServiceManager()

    # Handle SIGINT/SIGTERM
    def signal_handler(signum, frame):
        print(f"\nReceived signal {signum}")
        manager.running = False
        manager.stop_all()
        sys.exit(0)

    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    manager.run()


if __name__ == "__main__":
    main()