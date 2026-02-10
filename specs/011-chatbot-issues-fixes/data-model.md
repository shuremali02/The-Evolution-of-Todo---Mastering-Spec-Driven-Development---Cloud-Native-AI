# Data Model: Phase III Chatbot Issues Fixes

## Entities

### Task (Unchanged)
- **id**: string (primary key, UUID)
- **user_id**: string (foreign key to users, indexed)
- **title**: string (required, max 255 chars)
- **description**: string (optional)
- **completed**: boolean (default: false)
- **created_at**: datetime
- **updated_at**: datetime
- **position**: integer (for ordering)
- **priority**: enum (LOW, MEDIUM, HIGH)
- **due_date**: string (optional)
- **reminder**: string (optional)

### Conversation (Unchanged)
- **id**: string (primary key, UUID)
- **user_id**: string (foreign key to users, indexed)
- **created_at**: datetime
- **updated_at**: datetime

### Message (Unchanged)
- **id**: string (primary key, UUID)
- **user_id**: string (foreign key to users, indexed)
- **conversation_id**: string (foreign key to conversations, indexed)
- **role**: enum (user, assistant)
- **content**: string (max 10000 chars)
- **tool_calls**: string (JSON, optional)
- **tool_responses**: string (JSON, optional)
- **created_at**: datetime

## Validation Rules
- All entities require user_id for proper isolation
- Task title must not be empty
- Message content must not exceed 10000 characters
- Conversation and message timestamps are auto-generated

## Relationships
- User (1) → (Many) Conversations
- User (1) → (Many) Messages
- Conversation (1) → (Many) Messages
- All operations filtered by user_id for security

## State Transitions
- Task: pending → completed (via complete_task operation)
- Message: created → stored in conversation context
- Conversation: created → updated (when new messages added)