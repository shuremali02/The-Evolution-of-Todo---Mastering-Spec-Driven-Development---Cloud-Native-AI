"""
Task: T027
Spec: 010-ai-chatbot/spec.md - MCP Server Runner

Script to run the official MCP server for task management tools.
This script starts the MCP server and makes it available for AI agents.
"""

import asyncio
from mcp.server.fastmcp import FastMCP
from src.mcp_server import mcp  # Import the configured MCP instance


async def main():
    """Start the MCP server and run it."""
    print("Starting MCP Server for task management tools...")

    # Start the MCP server
    async with mcp.create_server() as server:
        print(f"MCP Server running on {server.url}")
        print("Available tools:")
        print("- list_tasks")
        print("- add_task")
        print("- complete_task")
        print("- delete_task")
        print("- update_task")
        print("\nPress Ctrl+C to stop the server")

        await server.wait_shutdown()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nShutting down MCP server...")