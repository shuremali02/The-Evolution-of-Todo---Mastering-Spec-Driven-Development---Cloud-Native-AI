# Data Model: AI Chatbot

## Entities

### Task
Extends existing Phase 2 Task model
- **user_id** (string, required, indexed) - Owner of the task
- **id** (integer, primary key) - Unique identifier
- **title** (string, required) - Task title
- **description** (string, optional) - Task description
- **completed** (boolean, default: false) - Completion status
- **created_at** (timestamp, default: now) - Creation timestamp
- **updated_at** (timestamp, default: now) - Last update timestamp

### Conversation
- **user_id** (string, required, indexed) - Owner of the conversation
- **id** (integer, primary key) - Unique identifier
- **created_at** (timestamp, default: now) - Creation timestamp
- **updated_at** (timestamp, default: now) - Last update timestamp

### Message
- **user_id** (string, required, indexed) - Owner of the message
- **id** (integer, primary key) - Unique identifier
- **conversation_id** (integer, foreign key to Conversation) - Associated conversation
- **role** (string, enum: "user" | "assistant", required) - Sender role
- **content** (string, required) - Message content
- **created_at** (timestamp, default: now) - Creation timestamp
- **tool_calls** (json, optional) - MCP tool calls made during this message
- **tool_responses** (json, optional) - Responses from MCP tools

## Relationships

- **Conversation** (1) ←→ (Many) **Message**: One conversation contains many messages
- **User** (1) ←→ (Many) **Conversation**: One user owns many conversations
- **User** (1) ←→ (Many) **Message**: One user owns many messages
- **User** (1) ←→ (Many) **Task**: One user owns many tasks

## Validation Rules

### Task Validation
- Title must be 1-255 characters
- Description must be 0-1000 characters
- User_id must match authenticated user

### Conversation Validation
- User_id must match authenticated user
- Created_at and updated_at are automatically managed

### Message Validation
- Content must be 1-10000 characters
- Role must be either "user" or "assistant"
- Conversation_id must reference existing conversation
- User_id must match authenticated user and conversation owner

## State Transitions

### Task State Transitions
- Pending (completed: false) → Completed (completed: true) via complete_task operation
- Completed (completed: true) → Pending (completed: false) via update_task operation

## Indexes

- Task.user_id (B-tree) - For user isolation queries
- Conversation.user_id (B-tree) - For user conversation queries
- Message.user_id (B-tree) - For user message queries
- Message.conversation_id (B-tree) - For conversation message queries
- Message.created_at (B-tree) - For chronological ordering