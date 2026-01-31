"""
Task: T027
Spec: 010-ai-chatbot/spec.md - MCP Server Runner

Script to run the official MCP server for task management tools.
This script starts the MCP server and makes it available for AI agents.
"""

import asyncio
from mcp.server.fastmcp import FastMCP
from src.mcp_server import mcp  # Import the configured MCP instance


def main():
    """Start the MCP server and run it."""
    print("Starting MCP Server for task management tools...")

    # Start the MCP server using the correct method
    # According to MCP documentation, use transport parameter
    # The port for streamable-http is determined by the server automatically
    # Use the context manager to properly initialize the lifespan
    import asyncio

    async def run_server():
        async with mcp.session_manager.run():
            print("MCP Server is running and ready for connections...")
            print("Tools available:")
            for tool_name in mcp._tools.keys():
                print(f"  - {tool_name}")

            # Keep the server running
            while True:
                await asyncio.sleep(1)

    asyncio.run(run_server())


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nShutting down MCP server...")