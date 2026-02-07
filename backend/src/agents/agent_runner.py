"""
Task: T026, T085, T086
Spec: 011-chatbot-issues-fixes/spec.md - Agent Runner with proper logging

Agent runner for processing messages through the AI agent and managing tool executions.
Handles message persistence and conversation state management with proper logging.
"""

import asyncio
import structlog
from typing import Dict, Any, List
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.conversation_service import ConversationService
from app.services.message_service import MessageService
from app.services.task_service import TaskService
from .ai_agent import AIAgent

# Configure structlog
logger = structlog.get_logger(__name__)


class AgentRunner:
    """Runs the AI agent and manages the conversation lifecycle."""

    def __init__(self):
        """Initialize the agent runner with required services."""
        self.ai_agent = AIAgent()

    async def process_conversation(
        self,
        session: AsyncSession,
        user_id: str,
        conversation_id: str,
        message_content: str
    ) -> Dict[str, Any]:
        """
        Process a conversation with a user message and return the AI response.

        Args:
            session: Database session
            user_id: ID of the authenticated user
            conversation_id: ID of the conversation (None for new conversation)
            message_content: Content of the user's message

        Returns:
            Dictionary containing the AI response and conversation details
        """
        try:
            # Get or create conversation
            if conversation_id:
                # Verify the conversation belongs to the user
                conversation = await ConversationService.get_conversation_by_id(
                    session, conversation_id, user_id
                )
                if not conversation:
                    return {
                        "error": "Conversation not found or doesn't belong to user",
                        "status": "error"
                    }
            else:
                # Create a new conversation
                conversation = await ConversationService.create_conversation(
                    session, user_id
                )
                conversation_id = conversation.id

            # Save user's message to the conversation
            user_message = await MessageService.create_message(
                session=session,
                user_id=user_id,
                conversation_id=conversation_id,
                role="user",
                content=message_content
            )

            # Get recent conversation history for context
            recent_messages = await MessageService.get_latest_messages_by_conversation(
                session, conversation_id, user_id, limit=10  # Get last 10 messages for context
            )

            # Format messages for AI processing (exclude the current message as it was just added)
            conversation_history = []
            for msg in recent_messages[:-1]:  # Exclude the current user message
                conversation_history.append({
                    "role": msg.role,
                    "content": msg.content
                })

            # Process the message with the AI agent
            logger.info("Processing message with AI agent", user_id=user_id, message_content=message_content)
            ai_response = await self.ai_agent.process_message(
                user_id=user_id,
                message_content=message_content,
                conversation_history=conversation_history,
                session=session
            )
            logger.debug("AI agent response received", response=ai_response)

            if not ai_response["success"]:
                logger.warning("AI agent returned failure", response=ai_response)
                # Save error response message
                await MessageService.create_message(
                    session=session,
                    user_id=user_id,
                    conversation_id=conversation_id,
                    role="assistant",
                    content=ai_response["response"]
                )
                return ai_response

            logger.debug("AI agent successful, checking for tool calls", tool_calls=ai_response.get('tool_calls', []))

            # Execute any tool calls that were generated
            logger.debug("About to execute tool calls", tool_calls=ai_response.get('tool_calls', []))
            tool_responses = []
            tool_results = []  # Store results to incorporate into response

            if ai_response.get("tool_calls"):
                logger.debug(f"Processing {len(ai_response['tool_calls'])} tool calls")
                for tool_call in ai_response["tool_calls"]:
                    logger.debug(f"Processing tool call", tool_call=tool_call)
                    try:
                        # Extract function name and arguments
                        func_name = tool_call["function"]["name"]
                        import json
                        args = json.loads(tool_call["function"]["arguments"])
                        logger.debug(f"Tool function: {func_name}, Args: {args}")

                        # Execute the appropriate tool function
                        if func_name == "add_task":
                            from app.services.task_service import TaskService
                            logger.debug(f"Calling TaskService.create_task", user_id=args['user_id'], title=args['title'])
                            task = await TaskService.create_task(
                                session=session,
                                user_id=args["user_id"],
                                title=args["title"],
                                description=args.get("description")
                            )
                            logger.debug(f"Task created", task_id=task.id, title=task.title)
                            result = {
                                "task_id": task.id,
                                "status": "created",
                                "title": task.title
                            }
                            # Store result for response incorporation
                            tool_results.append(f"Added task: '{task.title}' (ID: {task.id})")

                        elif func_name == "list_tasks":
                            from app.services.task_service import TaskService
                            logger.debug(f"Calling TaskService.get_user_tasks", user_id=args['user_id'])
                            tasks = await TaskService.get_user_tasks(
                                session=session,
                                user_id=args["user_id"],
                                status=args.get("status", "all")
                            )
                            logger.debug(f"Retrieved tasks", count=len(tasks))
                            result = [
                                {
                                    "id": task.id,
                                    "title": task.title,
                                    "completed": task.completed
                                }
                                for task in tasks
                            ]
                            # Create a readable response for the user
                            if tasks:
                                # Group tasks by status for better readability
                                pending_tasks = [task for task in tasks if not task.completed]
                                completed_tasks = [task for task in tasks if task.completed]

                                response_parts = []

                                if pending_tasks:
                                    pending_list = "\n".join([f"  • {task.title} (ID: {task.id})" for task in pending_tasks])
                                    response_parts.append(f"Pending Tasks ({len(pending_tasks)}):\n{pending_list}")

                                if completed_tasks:
                                    completed_list = "\n".join([f"  • {task.title} (ID: {task.id})" for task in completed_tasks])
                                    response_parts.append(f"Completed Tasks ({len(completed_tasks)}):\n{completed_list}")

                                if response_parts:
                                    tool_results.append("Here are your tasks:\n" + "\n\n".join(response_parts))
                                else:
                                    tool_results.append("You don't have any tasks yet.")
                            else:
                                tool_results.append("You don't have any tasks yet.")

                        elif func_name == "complete_task":
                            from app.services.task_service import TaskService
                            logger.debug(f"Calling TaskService.complete_task", task_id=args['task_id'])
                            task = await TaskService.complete_task(
                                session=session,
                                task_id=args["task_id"],
                                user_id=args["user_id"]
                            )
                            if task:
                                logger.debug(f"Task completed", task_id=task.id)
                                result = {
                                    "task_id": task.id,
                                    "status": "completed",
                                    "title": task.title
                                }
                                tool_results.append(f"Completed task: '{task.title}' (ID: {task.id})")
                            else:
                                logger.warning(f"Could not complete task", task_id=args['task_id'])
                                result = {"error": f"Task {args['task_id']} not found or doesn't belong to user"}
                                tool_results.append(f"Could not complete task: {result['error']}")

                        elif func_name == "delete_task":
                            from app.services.task_service import TaskService
                            logger.debug(f"Calling TaskService.delete_task", task_id=args['task_id'])
                            success = await TaskService.delete_task(
                                session=session,
                                task_id=args["task_id"],
                                user_id=args["user_id"]
                            )
                            if success:
                                logger.debug(f"Task deleted", task_id=args['task_id'])
                                result = {
                                    "task_id": args["task_id"],
                                    "status": "deleted"
                                }
                                tool_results.append(f"Deleted task with ID: {args['task_id']}")
                            else:
                                logger.warning(f"Could not delete task", task_id=args['task_id'])
                                result = {"error": f"Task {args['task_id']} not found or doesn't belong to user"}
                                tool_results.append(f"Could not delete task: {result['error']}")

                        elif func_name == "update_task":
                            from app.services.task_service import TaskService
                            logger.debug(f"Calling TaskService.update_task", task_id=args['task_id'])
                            updated_task = await TaskService.update_task(
                                session=session,
                                task_id=args["task_id"],
                                user_id=args["user_id"],
                                title=args.get("title"),
                                description=args.get("description")
                            )
                            if updated_task:
                                logger.debug(f"Task updated", task_id=updated_task.id)
                                result = {
                                    "task_id": updated_task.id,
                                    "status": "updated",
                                    "title": updated_task.title
                                }
                                tool_results.append(f"Updated task: '{updated_task.title}' (ID: {updated_task.id})")
                            else:
                                logger.warning(f"Could not update task", task_id=args['task_id'])
                                result = {"error": f"Task {args['task_id']} not found or doesn't belong to user"}
                                tool_results.append(f"Could not update task: {result['error']}")

                        else:
                            logger.warning(f"Unknown tool function", func_name=func_name)
                            result = {"error": f"Unknown tool: {func_name}"}
                            tool_results.append(f"Error: {result['error']}")

                        tool_responses.append({
                            "tool_call_id": tool_call["id"],
                            "output": result
                        })
                        logger.debug(f"Tool call executed successfully", tool_call_id=tool_call["id"])
                    except Exception as e:
                        logger.error(f"Failed to execute tool call", tool_call=tool_call, error=str(e))
                        import traceback
                        traceback.print_exc()
                        tool_responses.append({
                            "tool_call_id": tool_call["id"],
                            "output": {"error": f"Error executing tool {tool_call['function']['name']}: {str(e)}"}
                        })
                        tool_results.append(f"Error executing tool: {str(e)}")
            else:
                logger.debug("No tool calls to execute")

            # Update the AI response with tool responses
            logger.debug("Tool responses prepared", tool_responses=tool_responses)
            ai_response["tool_responses"] = tool_responses

            # Create a more informative response that incorporates tool results
            original_response = ai_response["response"]
            if tool_results:
                # Combine the original response with the tool results
                enhanced_response = original_response + "\n\n" + "\n".join(tool_results)
                content_to_save = enhanced_response
            else:
                content_to_save = original_response

            # Save the AI's response to the conversation
            ai_message = await MessageService.create_message(
                session=session,
                user_id=user_id,
                conversation_id=conversation_id,
                role="assistant",
                content=content_to_save,
                tool_calls=ai_response.get("tool_calls"),
                tool_responses=tool_responses
            )

            # Update the conversation's updated_at timestamp
            await ConversationService.update_conversation_updated_at(
                session, conversation_id, user_id
            )

            # Apply message limits to prevent conversation bloat
            await MessageService.truncate_old_messages(
                session, conversation_id, user_id
            )

            # Return the AI response with conversation info
            result = {
                "conversation_id": conversation_id,
                "response": content_to_save,
                "tool_calls": ai_response.get("tool_calls", []),
                "success": True
            }

            return result

        except Exception as e:
            return {
                "error": f"Error processing conversation: {str(e)}",
                "status": "error",
                "success": False
            }

    async def get_conversation_history(
        self,
        session: AsyncSession,
        conversation_id: str,
        user_id: str
    ) -> List[Dict[str, Any]]:
        """
        Retrieve the conversation history for a specific conversation.

        Args:
            session: Database session
            conversation_id: ID of the conversation to retrieve
            user_id: ID of the authenticated user

        Returns:
            List of messages in the conversation
        """
        try:
            messages = await MessageService.get_messages_by_conversation(
                session, conversation_id, user_id
            )

            return [
                {
                    "role": msg.role,
                    "content": msg.content,
                    "timestamp": msg.created_at.isoformat() if msg.created_at else None,
                    "tool_calls": msg.tool_calls,
                    "tool_responses": msg.tool_responses
                }
                for msg in messages
            ]
        except Exception as e:
            raise e

    async def list_user_conversations(
        self,
        session: AsyncSession,
        user_id: str
    ) -> List[Dict[str, Any]]:
        """
        List all conversations for a user.

        Args:
            session: Database session
            user_id: ID of the authenticated user

        Returns:
            List of user's conversations
        """
        try:
            conversations = await ConversationService.get_user_conversations(
                session, user_id
            )

            return [
                {
                    "id": conv.id,
                    "created_at": conv.created_at.isoformat() if conv.created_at else None,
                    "updated_at": conv.updated_at.isoformat() if conv.updated_at else None
                }
                for conv in conversations
            ]
        except Exception as e:
            raise e