"""
Task: T025, T045, T046, T047, T048
Spec: 011-chatbot-issues-fixes/spec.md - AI Agent with MCP Integration

AI Agent for processing natural language messages and invoking MCP tools for task management.
Integrates with OpenAI Agents SDK and connects to the official MCP server for dynamic tool discovery.
Uses OpenRouter LLM provider via OpenRouter's API.
"""

import os
import asyncio
from typing import Dict, Any, List
from agents import AsyncOpenAI, OpenAIChatCompletionsModel
from agents.mcp import MCPServerStreamableHttp
from agents.run import RunConfig
from agents import Agent, Runner
from dotenv import load_dotenv
import httpx
from ..utils.fuzzy_match import fuzzy_match_task_by_name, find_closest_task_match
from app.services.task_service import TaskService
from sqlalchemy.ext.asyncio import AsyncSession
from .connection import config


class AIAgent:
    """
    AI Agent that processes user messages and orchestrates task operations
    through MCP tools using Gemini API.
    """

    def __init__(self):
        """Initialize the AI agent with shared Gemini configuration and connect to MCP server."""
        load_dotenv()

        # Use the shared config from connection.py
        from .connection import config
        self.config = config

        # Connect to the official MCP server for dynamic tool discovery
        self.tools = []
        self.mcp_tools_available = False
        self.mcp_server = None
        self.agent = None

        # Initialize MCP connection
        asyncio.create_task(self._initialize_mcp_connection())

    async def _initialize_mcp_connection(self):
        """Configure connection to the MCP server for dynamic tool discovery."""
        try:
            # Attempt to connect to MCP server using the proper MCP integration
            # The MCP server is running on port 8000
            mcp_url = os.getenv("MCP_SERVER_URL", "http://127.0.0.1:8000")

            # For Hugging Face Spaces, the MCP server should be accessible locally
            # Check if the server is actually available before proceeding
            print(f"Attempting to connect to MCP server at {mcp_url}")

            # Get the Gemini API key to potentially pass to the MCP server if needed
            gemini_api_key = os.getenv("GEMINI_API_KEY")

            # Some MCP implementations may expect OPENAI_API_KEY to be set,
            # so we temporarily set it to the Gemini key as a workaround
            original_openai_key = os.environ.get('OPENAI_API_KEY')
            if gemini_api_key and not os.environ.get('OPENAI_API_KEY'):
                os.environ['OPENAI_API_KEY'] = gemini_api_key

            # Create the MCP server connection (will be used in context manager)
            # Pass the Gemini API key if needed for MCP server authentication
            self.mcp_server_params = {
                "name": "Task Management MCP Server",
                "params": {
                    "url": mcp_url,
                    "timeout": 30,
                },
                "cache_tools_list": True,
                "max_retry_attempts": 3,
            }

            # Restore the original OPENAI_API_KEY if it existed
            if original_openai_key is not None:
                os.environ['OPENAI_API_KEY'] = original_openai_key
            elif 'OPENAI_API_KEY' in os.environ and original_openai_key is None:
                # If we set it but the original was None, remove it
                del os.environ['OPENAI_API_KEY']

            # We'll create the agent instance that will be used with the MCP server
            # The actual MCP server connection will be established in the message processing
            self.mcp_tools_available = True
            print(f"MCP server configured at {mcp_url}. Connection will be established during message processing.")

        except Exception as e:
            # Fallback to hardcoded tools if MCP server is unavailable
            print(f"Error connecting to MCP server: {e}. Using fallback tools.")
            print("Make sure the MCP server is running at the specified URL.")
            self._setup_fallback_tools()
            self.mcp_tools_available = False

    def _setup_fallback_tools(self):
        """Set up fallback tools when MCP server is unavailable."""
        self.tools = [
            {
                "type": "function",
                "function": {
                    "name": "add_task",
                    "description": "Add a new task to the user's task list",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "ID of the user adding the task"
                            },
                            "title": {
                                "type": "string",
                                "description": "Title of the task to add"
                            },
                            "description": {
                                "type": "string",
                                "description": "Optional description of the task"
                            }
                        },
                        "required": ["user_id", "title"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "list_tasks",
                    "description": "List tasks from the user's task list with optional status filter",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "ID of the user listing tasks"
                            },
                            "status": {
                                "type": "string",
                                "enum": ["all", "pending", "completed"],
                                "description": "Filter tasks by status"
                            }
                        },
                        "required": ["user_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "complete_task",
                    "description": "Mark a task as complete in the user's task list",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "ID of the user completing the task"
                            },
                            "task_id": {
                                "type": "string",  # Changed to string to match UUID
                                "description": "ID of the task to complete (can be ID or name)"
                            }
                        },
                        "required": ["user_id", "task_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "delete_task",
                    "description": "Delete a task from the user's task list",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "ID of the user deleting the task"
                            },
                            "task_id": {
                                "type": "string",  # Changed to string to match UUID
                                "description": "ID of the task to delete (can be ID or name)"
                            }
                        },
                        "required": ["user_id", "task_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "update_task",
                    "description": "Update a task in the user's task list",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "description": "ID of the user updating the task"
                            },
                            "task_id": {
                                "type": "string",  # Changed to string to match UUID
                                "description": "ID of the task to update (can be ID or name)"
                            },
                            "title": {
                                "type": "string",
                                "description": "New title for the task (optional)"
                            },
                            "description": {
                                "type": "string",
                                "description": "New description for the task (optional)"
                            }
                        },
                        "required": ["user_id", "task_id"]
                    }
                }
            }
        ]

    async def process_message(
        self,
        user_id: str,
        message_content: str,
        conversation_history: List[Dict[str, str]] = None,
        session: AsyncSession = None
    ) -> Dict[str, Any]:
        """
        Process a user message and return the AI's response.

        Args:
            user_id: ID of the user sending the message
            message_content: Content of the user's message
            conversation_history: Previous conversation messages (role and content)
            session: Database session for accessing tasks (for fuzzy matching)

        Returns:
            Dictionary containing the AI's response and any tool calls
        """
        try:
            # If MCP server is available, use the agents framework with proper context manager
            if self.mcp_tools_available and hasattr(self, 'mcp_server_params'):
                try:
                    # Use the MCP server in an async context manager as recommended
                    from agents.mcp import MCPServerStreamableHttp

                    print(f"DEBUG: About to connect to MCP server with params: {self.mcp_server_params}")

                    async with MCPServerStreamableHttp(**self.mcp_server_params) as mcp_server:
                        print(f"DEBUG: Successfully connected to MCP server at {self.mcp_server_params['params']['url']}")

                        # Create agent with the MCP server connection
                        # Include very specific instructions about when and how to use tools
                        agent = Agent(
                            name="Task Management Assistant",
                            instructions=f"""You are a helpful assistant with access to task management tools. You must use the appropriate tools to handle user requests.

CRITICAL RULES:
1. When user wants to see their tasks, ALWAYS use the 'list_tasks' tool with user_id: {user_id}
2. When user wants to add/create a task, ALWAYS use the 'add_task' tool with user_id: {user_id}
3. When user wants to complete/finish/done a task, ALWAYS use the 'complete_task' tool with user_id: {user_id}
4. When user wants to delete/remove a task, ALWAYS use the 'delete_task' tool with user_id: {user_id}
5. When user wants to update/edit/modify a task, ALWAYS use the 'update_task' tool with user_id: {user_id}

Available tools:
- add_task(user_id, title, description): Add a new task to the user's list
- list_tasks(user_id, status): List tasks for the user (status can be 'all', 'pending', 'completed')
- complete_task(user_id, task_id): Mark a task as complete for the user
- delete_task(user_id, task_id): Remove a task from the user's list
- update_task(user_id, task_id, title, description): Modify an existing task for the user

IMPORTANT:
- ALWAYS use the user_id '{user_id}' when calling any task management tools
- When calling list_tasks, always specify the user_id parameter
- When calling add_task, include the user_id parameter along with title
- When calling other tools, always include both user_id and task_id parameters
- If you receive an error about user not found, it means the user_id was not passed correctly to the tool
""",
                            mcp_servers=[mcp_server],
                        )

                        print(f"DEBUG: Created agent with MCP server. About to run with message: {message_content}")

                        # Run the agent with the original message content using our Gemini config
                        result = await Runner.run(
                            agent,
                            message_content,
                            run_config=self.config  # Pass the Gemini config here
                        )

                        print(f"DEBUG: Runner completed. Result type: {type(result)}, Result: {result}")

                        # Print detailed information about the run result
                        print(f"DEBUG: RunResult attributes: {dir(result) if hasattr(result, '__dict__') else 'No attributes accessible'}")

                        # Try to get more detailed information about what happened
                        if hasattr(result, 'final_output'):
                            response_text = result.final_output
                            print(f"DEBUG: Final output: {response_text}")
                        else:
                            response_text = str(result)
                            print(f"DEBUG: Converted result to string: {response_text}")

                        # Check if there are any tool calls in the result
                        try:
                            raw_responses = getattr(result, 'raw_responses', [])
                            print(f"DEBUG: Raw responses count: {len(raw_responses)}")
                            for i, resp in enumerate(raw_responses):
                                print(f"DEBUG: Raw response {i}: {resp}")

                                # Check for tool calls in the response
                                if hasattr(resp, 'choices') and resp.choices:
                                    for choice in resp.choices:
                                        if hasattr(choice, 'message') and hasattr(choice.message, 'tool_calls'):
                                            print(f"DEBUG: Found tool calls in response: {choice.message.tool_calls}")

                        except Exception as e:
                            print(f"DEBUG: Error accessing raw responses: {e}")

                        # Also check for any additional properties that might contain tool information
                        for attr in ['new_items', 'steps']:
                            if hasattr(result, attr):
                                attr_value = getattr(result, attr)
                                print(f"DEBUG: {attr}: {attr_value}")
                                if isinstance(attr_value, list):
                                    for item in attr_value:
                                        print(f"DEBUG: Item in {attr}: {item}")

                        # Extract the response and any tool calls
                        response_text = result.final_output if hasattr(result, 'final_output') else str(result)

                        print(f"DEBUG: Final response text: {response_text}")

                        # Note: The actual tool calls and their results are handled by the agents framework
                        # The response will include the results from the MCP tools

                        return {
                            "response": response_text,
                            "tool_calls": [],  # Tool calls are handled internally by the agents framework
                            "success": True
                        }
                except Exception as e:
                    print(f"MCP server connection failed: {e}")
                    import traceback
                    print(f"Full traceback: {traceback.format_exc()}")
                    # CRITICAL: MCP server is required - do not fall back to manual tools
                    return {
                        "response": f"Error: MCP server connection failed. The system requires MCP server connection to operate. Error: {str(e)}",
                        "tool_calls": [],
                        "success": False
                    }

            # CRITICAL: MCP server is required - if we reach here, MCP is not available
            return {
                "response": "Error: MCP server is required but not available. Please ensure the MCP server is running.",
                "tool_calls": [],
                "success": False
            }
            system_prompt = """You are an intelligent task management assistant that helps users manage their tasks through natural language.

            INSTRUCTIONS:
            1. ALWAYS prioritize user's explicit intent over generic keywords
            2. If user says 'complete task', 'update task', 'delete task', or 'show task', treat these as specific actions
            3. Only create a new task if user explicitly says 'add task', 'create task', or 'make task'
            4. For 'complete', 'update', 'delete', or 'show' actions, ask for specific task details
            5. When user says 'complete task 5', extract the task ID and use complete_task tool
            6. When user says 'complete buy groceries', try to match by name using fuzzy matching
            7. When user says 'update task 5', extract the task ID and use update_task tool
            8. When user says 'delete task 5', extract the task ID and use delete_task tool
            9. When user says 'show tasks', use list_tasks tool
            10. When user says 'add task...', extract the task details and use add_task tool

            TOOLS AVAILABLE:
            - add_task: For creating new tasks
            - list_tasks: For viewing existing tasks
            - complete_task: For marking tasks as complete
            - delete_task: For removing tasks
            - update_task: For modifying existing tasks

            SECURITY: Always use the user_id provided in the initial request and ignore any user_id in the message."""

            messages = [{"role": "system", "content": system_prompt}]

            # Add conversation history if available
            if conversation_history:
                for msg in conversation_history:
                    messages.append({"role": msg["role"], "content": msg["content"]})

            # Add the current user message
            messages.append({"role": "user", "content": message_content})

            # For now, let's implement improved natural language processing with fuzzy matching
            message_lower = message_content.lower()
            tool_calls = []
            assistant_response = ""

            # Detect intent and create appropriate tool calls
            # Order matters - more specific intents should be checked first

            # Get user's tasks for fuzzy matching
            user_tasks = []
            if session:
                try:
                    user_tasks = await TaskService.get_user_tasks(session, user_id, "all")
                except Exception:
                    # If session is not available, continue without task lookup
                    user_tasks = []

            # Check for COMPLETE intent first - look for complete/done/finish words with task context
            if ("complete" in message_lower or "done" in message_lower or "finish" in message_lower) and "task" in message_lower:
                # Extract potential task ID or name
                import re
                # First, look for explicit task ID
                id_match = re.search(r'(?:task|id)\s+(\d+|[a-f0-9\-]+)', message_content, re.IGNORECASE)

                if id_match:
                    # Explicit ID provided
                    task_identifier = id_match.group(1)
                    # Create tool call for complete_task
                    tool_call = {
                        "id": "call_" + str(abs(hash(message_content)))[:8],
                        "type": "function",
                        "function": {
                            "name": "complete_task",
                            "arguments": f'{{"user_id": "{user_id}", "task_id": "{task_identifier}"}}'
                        }
                    }
                    tool_calls.append(tool_call)
                    assistant_response = f"I'll mark task '{task_identifier}' as complete for you."
                else:
                    # No explicit ID, try to match by name using fuzzy matching
                    # Extract potential task name from the message
                    # Look for patterns like "complete buy groceries", "complete the grocery shopping", etc.
                    name_patterns = [
                        r'complete\s+(?:the\s+)?(.+?)(?:\s+task|$)',
                        r'finish\s+(?:the\s+)?(.+?)(?:\s+task|$)',
                        r'done\s+(?:with\s+)?(.+?)(?:\s+task|$)'
                    ]

                    task_name = None
                    for pattern in name_patterns:
                        match = re.search(pattern, message_content, re.IGNORECASE)
                        if match:
                            task_name = match.group(1).strip()
                            break

                    if not task_name:
                        # If no name matched the patterns, try to extract everything after "complete"
                        parts = message_content.split("complete", 1)
                        if len(parts) > 1:
                            task_name = parts[1].strip().replace("task", "").strip()

                    if task_name and user_tasks:
                        # Use fuzzy matching to find the closest task
                        matched_task = fuzzy_match_task_by_name(task_name, user_tasks)

                        if matched_task:
                            # Create tool call for complete_task with the matched task ID
                            tool_call = {
                                "id": "call_" + str(abs(hash(message_content)))[:8],
                                "type": "function",
                                "function": {
                                    "name": "complete_task",
                                    "arguments": f'{{"user_id": "{user_id}", "task_id": "{matched_task.id}"}}'
                                }
                            }
                            tool_calls.append(tool_call)
                            assistant_response = f"I'll mark task '{matched_task.title}' as complete for you."
                        else:
                            # No match found, ask user to specify
                            assistant_response = f"I couldn't find a task matching '{task_name}'. Could you please specify the task by name or ID?"
                    else:
                        # No task name extracted or no tasks available
                        assistant_response = "To complete a task, please specify which task by name or ID."

            # Check for DELETE intent - look for delete/remove words with task context
            elif ("delete" in message_lower or "remove" in message_lower) and "task" in message_lower:
                import re
                # First, look for explicit task ID
                id_match = re.search(r'(?:task|id)\s+(\d+|[a-f0-9\-]+)', message_content, re.IGNORECASE)

                if id_match:
                    # Explicit ID provided
                    task_identifier = id_match.group(1)
                    # Create tool call for delete_task
                    tool_call = {
                        "id": "call_" + str(abs(hash(message_content)))[:8],
                        "type": "function",
                        "function": {
                            "name": "delete_task",
                            "arguments": f'{{"user_id": "{user_id}", "task_id": "{task_identifier}"}}'
                        }
                    }
                    tool_calls.append(tool_call)
                    assistant_response = f"I'll delete task '{task_identifier}' for you."
                else:
                    # No explicit ID, try to match by name using fuzzy matching
                    # Extract potential task name from the message
                    name_patterns = [
                        r'delete\s+(?:the\s+)?(.+?)(?:\s+task|$)',
                        r'remove\s+(?:the\s+)?(.+?)(?:\s+task|$)'
                    ]

                    task_name = None
                    for pattern in name_patterns:
                        match = re.search(pattern, message_content, re.IGNORECASE)
                        if match:
                            task_name = match.group(1).strip()
                            break

                    if not task_name:
                        # If no name matched the patterns, try to extract everything after "delete"
                        parts = message_content.split("delete", 1)
                        if len(parts) > 1:
                            task_name = parts[1].strip().replace("task", "").strip()

                    if task_name and user_tasks:
                        # Use fuzzy matching to find the closest task
                        matched_task = fuzzy_match_task_by_name(task_name, user_tasks)

                        if matched_task:
                            # Create tool call for delete_task with the matched task ID
                            tool_call = {
                                "id": "call_" + str(abs(hash(message_content)))[:8],
                                "type": "function",
                                "function": {
                                    "name": "delete_task",
                                    "arguments": f'{{"user_id": "{user_id}", "task_id": "{matched_task.id}"}}'
                                }
                            }
                            tool_calls.append(tool_call)
                            assistant_response = f"I'll delete task '{matched_task.title}' for you."
                        else:
                            # No match found, ask user to specify
                            assistant_response = f"I couldn't find a task matching '{task_name}'. Could you please specify the task by name or ID?"
                    else:
                        # No task name extracted or no tasks available
                        assistant_response = "To delete a task, please specify which task by name or ID."

            # Check for UPDATE intent - look for update/change/modify words with task context
            elif ("update" in message_lower or "change" in message_lower or "modify" in message_lower) and "task" in message_lower:
                import re
                # First, look for explicit task ID
                id_match = re.search(r'(?:task|id)\s+(\d+|[a-f0-9\-]+)', message_content, re.IGNORECASE)

                if id_match:
                    # Explicit ID provided
                    task_identifier = id_match.group(1)
                    # For now, we'll just ask for more details
                    assistant_response = f"To update task '{task_identifier}', please specify what changes you'd like to make."
                else:
                    # No explicit ID, try to match by name using fuzzy matching
                    # Extract potential task name from the message
                    name_patterns = [
                        r'update\s+(?:the\s+)?(.+?)(?:\s+task|$)',
                        r'change\s+(?:the\s+)?(.+?)(?:\s+task|$)',
                        r'modify\s+(?:the\s+)?(.+?)(?:\s+task|$)'
                    ]

                    task_name = None
                    for pattern in name_patterns:
                        match = re.search(pattern, message_content, re.IGNORECASE)
                        if match:
                            task_name = match.group(1).strip()
                            break

                    if not task_name:
                        # If no name matched the patterns, try to extract everything after "update"
                        parts = message_content.split("update", 1)
                        if len(parts) > 1:
                            task_name = parts[1].strip().replace("task", "").strip()

                    if task_name and user_tasks:
                        # Use fuzzy matching to find the closest task
                        matched_task = fuzzy_match_task_by_name(task_name, user_tasks)

                        if matched_task:
                            # Ask for details about what to update
                            assistant_response = f"To update task '{matched_task.title}', please specify what changes you'd like to make (title or description)."
                        else:
                            # No match found, ask user to specify
                            assistant_response = f"I couldn't find a task matching '{task_name}'. Could you please specify the task by name or ID?"
                    else:
                        # No task name extracted or no tasks available
                        assistant_response = "To update a task, please specify which task and what changes to make."

            # Check for ADD intent - look for specific add/create phrases with task context
            elif ("add" in message_lower or "create" in message_lower) and ("task" in message_lower or "buy" in message_lower or "do" in message_lower or "make" in message_lower):
                import re
                # Extract potential task title from the message
                # Look for phrases like "add task to..." or "add a task..."
                match = re.search(r'(?:add|create)\s+(?:a\s+)?(?:task|to)\s+(.+?)(?:\s+and|$|\.)', message_content, re.IGNORECASE)
                if not match:
                    match = re.search(r'(?:add|create)\s+(?:a\s+)?(.+?)(?:\s+and|$|\.)', message_content, re.IGNORECASE)

                task_title = match.group(1).strip() if match else message_content.replace("add ", "").replace("Add ", "").replace("create ", "").replace("Create ", "").strip()
                if not task_title:
                    task_title = "Untitled task"

                # Create tool call for add_task
                tool_call = {
                    "id": "call_" + str(abs(hash(message_content)))[:8],
                    "type": "function",
                    "function": {
                        "name": "add_task",
                        "arguments": f'{{"user_id": "{user_id}", "title": "{task_title}"}}'
                    }
                }
                tool_calls.append(tool_call)
                assistant_response = f"I'll add the task '{task_title}' for you."

            # Check for LIST intent - look for list/show/what words with task context
            elif "list" in message_lower or "show" in message_lower or ("what" in message_lower and "task" in message_lower):
                # Create tool call for list_tasks
                tool_call = {
                    "id": "call_" + str(abs(hash(message_content)))[:8],
                    "type": "function",
                    "function": {
                        "name": "list_tasks",
                        "arguments": f'{{"user_id": "{user_id}", "status": "all"}}'
                    }
                }
                tool_calls.append(tool_call)
                # Provide a clear, user-friendly response that will be enhanced with actual results
                if "pending" in message_lower:
                    assistant_response = "Let me get your pending tasks for you..."
                elif "completed" in message_lower:
                    assistant_response = "Let me get your completed tasks for you..."
                else:
                    assistant_response = "Let me get your tasks for you..."

            else:
                # Default response if no specific intent detected
                assistant_response = f"I received your message: '{message_content}'. How can I help you with your tasks?"

            return {
                "response": assistant_response,
                "tool_calls": tool_calls,
                "success": True
            }

        except Exception as e:
            return {
                "response": f"I'm sorry, I encountered an error processing your request: {str(e)}",
                "tool_calls": [],
                "success": False,
                "error": str(e)
            }

    async def close(self):
        """Clean up the MCP server connection."""
        if self.mcp_server and hasattr(self.mcp_server, '__aexit__'):
            try:
                await self.mcp_server.__aexit__(None, None, None)
            except:
                pass  # Ignore errors during cleanup

    # Note: With the Gemini configuration, we're using a simplified approach
    # The actual agents framework integration would replace this placeholder