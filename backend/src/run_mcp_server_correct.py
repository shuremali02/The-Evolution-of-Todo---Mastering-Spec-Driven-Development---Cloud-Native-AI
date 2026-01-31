"""
Task: T027
Spec: 010-ai-chatbot/spec.md - Correct MCP Server Runner

Script to properly run the MCP server for task management tools.
This script starts the MCP server using the correct method for streamable-http transport.
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from mcp.server.fastmcp import FastMCP
from src.mcp_server import mcp  # Import the configured MCP instance
import asyncio
import argparse


async def run_mcp_server():
    """Run the MCP server with proper streamable-http transport."""
    print("Starting MCP Server for task management tools...")
    print("Using streamable-http transport...")

    # Run the server with streamable-http transport
    # This will create an HTTP server that AI agents can connect to
    async with mcp.session_manager.run():
        # The server is now running and available
        print("MCP Server is running and ready for connections.")
        print("Tools available:")
        for tool_name in mcp._tools.keys():
            print(f"  - {tool_name}")

        # Keep the server running
        try:
            while True:
                await asyncio.sleep(1)
        except KeyboardInterrupt:
            print("\nShutting down MCP server...")


def main():
    """Entry point for running the MCP server."""
    parser = argparse.ArgumentParser(description="MCP Server for task management")
    parser.add_argument("--port", type=int, default=8002, help="Port for MCP server (default: 8002)")
    args = parser.parse_args()

    # Note: For streamable-http, the port is managed by the MCP framework
    # The actual port will be displayed when the server starts

    try:
        asyncio.run(run_mcp_server())
    except KeyboardInterrupt:
        print("\nMCP server stopped by user.")


if __name__ == "__main__":
    main()