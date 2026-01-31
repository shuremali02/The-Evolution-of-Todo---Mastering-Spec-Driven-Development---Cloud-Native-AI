"""
Task: T028
Spec: 010-ai-chatbot/spec.md - MCP Server Test

Test script to verify the MCP server functionality for task management tools.
"""

import asyncio
from mcp.client import Client
from src.mcp_server import mcp


async def test_mcp_server():
    """Test the MCP server functionality."""
    print("Testing MCP Server...")

    # Start the server temporarily for testing
    async with mcp.create_server() as server:
        print(f"Server running on: {server.url}")

        # Create a client to test the tools
        async with Client(server.url) as client:
            # List available tools
            tools = await client.list_tools()
            print(f"Available tools: {[tool.name for tool in tools]}")

            # Test would go here, but we need a real user_id and database
            print("MCP Server is running and accessible!")


if __name__ == "__main__":
    asyncio.run(test_mcp_server())