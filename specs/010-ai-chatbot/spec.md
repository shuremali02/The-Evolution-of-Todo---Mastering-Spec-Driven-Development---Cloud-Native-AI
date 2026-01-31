# Phase III: Todo AI Chatbot Specification

## 1. Feature Overview

### 1.1 Purpose
Create an AI-powered chatbot interface for managing todos through natural language using MCP (Model Context Protocol) server architecture. The chatbot will integrate with the existing todo management system and provide conversational task management capabilities.

### 1.2 Scope
- **In Scope**: AI chatbot for todo management, MCP server, OpenAI Agents integration, ChatKit UI
- **Out of Scope**: New AI features beyond basic task operations, complex conversational flows, advanced personalization

### 1.3 Success Criteria
- Working chatbot that understands natural language commands for todo operations
- Seamless integration with existing authentication system
- Stateful conversation persistence via database
- MCP tools that properly interact with task management system

## 2. Functional Requirements

### 2.1 Core Chat Functionality
- **FR-1**: User can send natural language messages to the chatbot
- **FR-2**: Chatbot can understand and process todo management commands
- **FR-3**: Chatbot provides helpful responses with action confirmations
- **FR-4**: Conversation history is maintained across sessions

### 2.2 Todo Management Operations
- **FR-5**: Chatbot can add tasks via natural language ("Add a task to buy groceries")
- **FR-6**: Chatbot can list tasks with various filters ("Show me all my tasks", "What's pending?")
- **FR-7**: Chatbot can mark tasks as complete ("Mark task 3 as complete")
- **FR-8**: Chatbot can delete tasks ("Delete the meeting task")
- **FR-9**: Chatbot can update task titles or descriptions ("Change task 1 to 'Call mom tonight'")

### 2.3 MCP Integration
- **FR-10**: MCP server exposes standardized tools for task operations
- **FR-11**: AI agent can invoke MCP tools to manage tasks
- **FR-12**: MCP tools interact statelessly with database
- **FR-13**: Tool invocations are properly logged and tracked

### 2.4 Authentication & Authorization
- **FR-14**: Chat endpoint validates JWT tokens for user authentication
- **FR-15**: All operations are restricted to authenticated user's data
- **FR-16**: User isolation is maintained for all task operations
- **FR-17**: Conversation access is restricted to owning user

## 3. Non-Functional Requirements

### 3.1 Performance
- **NFR-1**: Response time under 3 seconds for typical chat interactions
- **NFR-2**: Handle concurrent users without degradation
- **NFR-3**: Stateless server architecture for horizontal scalability

### 3.2 Security
- **NFR-4**: All user data properly isolated by user_id
- **NFR-5**: JWT validation on all protected endpoints
- **NFR-6**: MCP tools validate user permissions before operations
- **NFR-7**: No sensitive data exposed in chat responses

### 3.3 Availability
- **NFR-8**: Service should maintain 99% uptime during business hours (Monday-Friday, 9:00 AM - 6:00 PM EST)
- **NFR-9**: Conversation state persists through server restarts
- **NFR-10**: Graceful error handling when AI services are unavailable

### 3.4 Scalability
- **NFR-11**: Stateless architecture allows horizontal scaling
- **NFR-12**: Database operations optimized for concurrent access
- **NFR-13**: MCP tools designed for concurrent usage

## 4. System Architecture

### 4.1 Component Overview
```
┌─────────────────┐     ┌──────────────────────────────────────────────┐     ┌─────────────────┐
│                 │     │              FastAPI Server                   │     │                 │
│                 │     │  ┌────────────────────────────────────────┐  │     │    Neon DB      │
│  ChatKit UI     │────▶│  │         Chat Endpoint                  │  │     │  (PostgreSQL)   │
│  (Frontend)     │     │  │  POST /api/v1/chat                   │  │     │                 │
│                 │     │  └───────────────┬────────────────────────┘  │     │  - tasks        │
│                 │     │                  │                           │     │  - conversations│
│                 │     │                  ▼                           │     │  - messages     │
│                 │     │  ┌────────────────────────────────────────┐  │     │                 │
│                 │◀────│  │      OpenAI Agents SDK                 │  │     │                 │
│                 │     │  │      (Agent + Runner)                  │  │     │                 │
│                 │     │  └───────────────┬────────────────────────┘  │     │                 │
│                 │     │                  │                           │     │                 │
│                 │     │                  ▼                           │     │                 │
│                 │     │  ┌────────────────────────────────────────┐  │────▶│                 │
│                 │     │  │    Official MCP Server                 │  │     │                 │
│                 │     │  │  (mcp.server.fastmcp)                 │  │◀────│                 │
│                 │     │  │  (MCP Tools for Task Operations)       │  │     │                 │
│                 │     │  └────────────────────────────────────────┘  │     │                 │
└─────────────────┘     └──────────────────────────────────────────────┘     └─────────────────┘
```

### 4.2 Data Models

#### 4.2.1 Task Model (extends existing model)
```
Task:
- user_id (string, required, indexed)
- id (integer, primary key)
- title (string, required)
- description (string, optional)
- completed (boolean, default: false)
- created_at (timestamp, default: now)
- updated_at (timestamp, default: now)
```

#### 4.2.2 Conversation Model
```
Conversation:
- user_id (string, required, indexed)
- id (integer, primary key)
- created_at (timestamp, default: now)
- updated_at (timestamp, default: now)
```

#### 4.2.3 Message Model
```
Message:
- user_id (string, required, indexed)
- id (integer, primary key)
- conversation_id (integer, foreign key to Conversation)
- role (string, enum: "user" | "assistant", required)
- content (string, required)
- created_at (timestamp, default: now)
- tool_calls (json, optional)
- tool_responses (json, optional)
```

### 4.3 API Contract

#### 4.3.1 Chat Endpoint
```
POST /api/v1/chat
Headers: Authorization: Bearer <jwt_token>

Request Body:
{
  "conversation_id": integer (optional),
  "message": string (required)
}

Response:
{
  "conversation_id": integer,
  "response": string,
  "tool_calls": array,
  "tool_responses": array
}
```

**Security Rule**: The `user_id` MUST be extracted from JWT claims and any user_id passed in the request body or URL MUST be ignored for security purposes.

#### 4.3.2 Official MCP Tools Contract

Using the official `mcp.server.fastmcp` implementation, the following tools are registered with the MCP server:

##### add_task Tool
Input:
```json
{
  "user_id": "string (required)",
  "title": "string (required)",
  "description": "string (optional)"
}
```

Output:
```json
{
  "task_id": string,  /* Changed to string to match UUID */
  "status": "created",
  "title": string
}
```

##### list_tasks Tool
Input:
```json
{
  "user_id": "string (required)",
  "status": "string (optional: all|pending|completed)"
}
```

Output:
```json
[
  {
    "id": string,      /* Changed to string to match UUID */
    "title": string,
    "completed": boolean
  }
]
```

##### complete_task Tool
Input:
```json
{
  "user_id": "string (required)",
  "task_id": "string (required)"  /* Changed to string to match UUID */
}
```

Output:
```json
{
  "task_id": string,
  "status": "completed",
  "title": string
}
```

##### delete_task Tool
Input:
```json
{
  "user_id": "string (required)",
  "task_id": "string (required)"  /* Changed to string to match UUID */
}
```

Output:
```json
{
  "task_id": string,
  "status": "deleted",
  "title": string
}
```

##### update_task Tool
Input:
```json
{
  "user_id": "string (required)",
  "task_id": "string (required)",  /* Changed to string to match UUID */
  "title": string (optional),
  "description": string (optional)
}
```

Output:
```json
{
  "task_id": string,
  "status": "updated",
  "title": string
}
```

#### 4.3.3 MCP Server Implementation
The MCP server is implemented using the official `mcp.server.fastmcp` package and deployed as a separate service. The server exposes the above tools through the standard MCP protocol and integrates with the existing task management services.

Files:
- `src/mcp_server.py`: Main MCP server implementation with all task management tools
- `src/run_mcp_server.py`: Script to start the MCP server
- `src/test_mcp_server.py`: Test script for verifying MCP server functionality

## 5. User Stories

### 5.1 As an authenticated user, I want to chat naturally with the AI to manage my tasks
- So that I can add, update, complete, and delete tasks without clicking buttons
- Given I am logged in
- When I send a message like "Add a task to buy groceries"
- Then the AI creates a task and confirms "Created task: Buy groceries"

### 5.2 As an authenticated user, I want to continue conversations across sessions
- So that I maintain context when I return
- Given I have had previous conversations
- When I send a new message
- Then the AI has access to our conversation history

### 5.3 As an authenticated user, I want my data to be private
- So that others cannot access my tasks or conversations
- Given I am authenticated with my user_id
- When I interact with the chatbot
- Then only my tasks and conversations are accessible

## 6. Business Rules

### 6.1 User Isolation
- All operations must be filtered by the authenticated user's ID
- Users cannot access other users' tasks or conversations
- MCP tools must validate user permissions before any database operation

### 6.2 Conversation State
- Each user can have multiple conversations
- Conversation state is stored in database, not in server memory
- Server holds no state between requests (stateless architecture)

### 6.3 Conversation Size & Context Management
- Maximum of 50 most recent messages stored per conversation
- Oldest messages are removed first when limit is exceeded (FIFO)
- Messages are deleted rather than summarized to maintain performance
- Server remains stateless despite conversation persistence

### 6.4 Agent Behavior Rules
- Agent must not hallucinate task IDs (always use exact IDs from database or ask user for clarification)
- Agent must confirm destructive actions (delete/update) before executing them
- Agent must ask for clarification if task reference is ambiguous (e.g., "delete the task" without specifics)
- Agent must prefer read (list) operations before write operations when uncertain about task existence

### 6.5 Error Handling
- HTTP 400: Invalid request parameters (malformed JSON, missing required fields)
- HTTP 401: Unauthorized - Invalid or missing JWT token
- HTTP 403: Forbidden - User lacks permission for requested resource
- HTTP 404: Not Found - Requested resource does not exist
- HTTP 422: Unprocessable Entity - Semantic validation failed
- HTTP 500: Internal Server Error - Unexpected server error occurred
- Standard error response shape: {"error": {"message": "descriptive error message", "code": "error_code"}}
- Graceful handling of non-existent tasks with appropriate error messages
- Friendly error messages to users that don't expose sensitive information
- Proper logging of failures for debugging without exposing sensitive data

## 7. Constraints

### 7.1 Technical Constraints
- Must use existing database schema where possible
- Must integrate with existing authentication system
- Must maintain backward compatibility with Phase 2 APIs
- MCP server must be stateless

### 7.2 Performance Constraints
- Response time must be under 3 seconds
- System must handle at least 100 concurrent users
- Database operations must be optimized

### 7.3 Security Constraints
- All endpoints must validate JWT tokens
- No hard-coded credentials or secrets
- MCP tools must validate all inputs

## 8. External Dependencies

### 8.1 Third-party Services
- OpenAI API (for agents functionality)
- OpenAI ChatKit (for frontend UI)
- Official MCP SDK (mcp.server.fastmcp) for tool protocol implementation

### 8.2 Internal Dependencies
- Existing Phase 2 authentication system (Better Auth)
- Existing Phase 2 task management APIs
- Existing database schema
- TaskService (app.services.task_service) for database operations

## 9. Integration Points

### 9.1 Authentication Integration
- JWT token validation from Phase 2 system
- User ID extraction from token claims
- Permission checking before operations

### 9.2 Task Management Integration
- Reuse existing Task model and database tables
- Leverage existing database connection pooling
- Maintain consistency with Phase 2 data structures

### 9.3 Frontend Integration
- ChatKit UI integration with existing application
- Consistent styling with Phase 2 UI
- Shared authentication context

## 10. Risks & Mitigation

### 10.1 High Risks
- **AI API availability**: Dependence on external OpenAI services
  - Mitigation: Implement graceful degradation and caching strategies

- **Security vulnerabilities**: Potential for user data cross-contamination
  - Mitigation: Rigorous user_id validation at every layer

### 10.2 Medium Risks
- **Performance**: Slow AI responses affecting user experience
  - Mitigation: Caching and timeout mechanisms

- **Complexity**: MCP server architecture adds complexity
  - Mitigation: Thorough testing and monitoring

### 10.3 Low Risks
- **Frontend compatibility**: ChatKit may not integrate smoothly
  - Mitigation: Early integration testing

## 11. Quality Assurance

### 11.1 Testing Strategy
- Unit tests for MCP tools
- Integration tests for AI agent workflows
- End-to-end tests for complete chat flows
- Security tests for user isolation

### 11.2 Acceptance Criteria
- All functional requirements satisfied
- All non-functional requirements met
- Security audit passed
- Performance benchmarks achieved
- User acceptance testing completed

## 12. Deployment Considerations

### 12.1 Environment Setup
- OpenAI API key configuration
- MCP server deployment
- Database migration scripts
- CORS configuration for ChatKit

### 12.2 Monitoring
- API response times
- Error rates
- User engagement metrics
- Resource utilization

## 13. Glossary

- **MCP**: Model Context Protocol - standard for AI model context communication
- **Official MCP**: The mcp.server.fastmcp package implementation of MCP protocol
- **ChatKit**: OpenAI's frontend component for chat interfaces
- **Agent**: AI system that processes user requests and invokes tools
- **Runner**: Component that executes the agent and manages tool calls
- **Tool**: MCP-exposed function for specific operations (e.g., add_task)
- **Stateless**: Server doesn't maintain session state between requests