---
feature: Enhanced Chatbot UI with Floating Icon
status: planned
priority: high
author: Claude
created: 2026-01-30
updated: 2026-01-30
---

# Enhanced Chatbot UI Specification

## Overview
Enhance the existing chatbot UI to include a floating chatbot icon that appears on all pages, authentication checks, quick task suggestions, and user-specific chat history management. This builds upon the existing ChatInterface component to provide a more accessible and feature-rich chat experience.

## Requirements

### Functional Requirements

#### 1. Floating Chatbot Icon
- **Requirement F1.1**: Display a floating chatbot icon/button in the bottom-right corner of the screen on all pages
- **Requirement F1.2**: Icon should be visible across all routes (except maybe login/signup pages)
- **Requirement F1.3**: Icon should have a subtle animation to indicate its interactive nature
- **Requirement F1.4**: Clicking the icon should open the chat interface overlay
- **Requirement F1.5**: Clicking outside the chat interface or a close button should close it

#### 2. Authentication Integration
- **Requirement F2.1**: When user clicks chatbot icon, check authentication status using the existing AuthContext
- **Requirement F2.2**: If user is not logged in, show modal with message: "Please log in to access the chatbot"
- **Requirement F2.3**: Modal should provide options: "Login" (redirects to login page) or "Cancel" (closes modal)
- **Requirement F2.4**: If user is logged in, proceed to open chatbot interface
- **Requirement F2.5**: Maintain existing authentication flow with JWT tokens

#### 3. Chat Interface Enhancement
- **Requirement F3.1**: Convert existing ChatInterface to work as an overlay/modal instead of a full page
- **Requirement F3.2**: Overlay should cover approximately 80% of screen height/width on desktop, full screen on mobile
- **Requirement F3.3**: Maintain all existing functionality (message history, loading states, etc.)
- **Requirement F3.4**: Add smooth animations for opening/closing the chat interface

#### 4. Quick Task Suggestions
- **Requirement F4.1**: Add a section of quick task suggestions below the chat input field
- **Requirement F4.2**: Suggestions should include common task management phrases like:
  - "Add a new task"
  - "Show my tasks"
  - "Complete task [task name/id]"
  - "Update task [task name/id]"
  - "Delete task [task name/id]"
  - "Show completed tasks"
  - "Set deadline for [task name]"
- **Requirement F4.3**: Clicking a suggestion should populate the input field with that text
- **Requirement F4.4**: Input field should be focused after populating for immediate editing
- **Requirement F4.5**: Suggestions should be styled as clickable chips/tags

#### 5. Chat History Management
- **Requirement F5.1**: Display user's previous conversations in a sidebar or dropdown within the chat interface
- **Requirement F5.2**: Each conversation should show:
  - Timestamp of last message
  - Preview of last message or conversation title
  - Ability to click and load the conversation
- **Requirement F5.3**: Use existing API methods for retrieving conversation history
- **Requirement F5.4**: New conversations should be saved automatically using existing backend
- **Requirement F5.5**: User should only see their own conversations (enforced by backend)

#### 6. MCP Server Integration
- **Requirement F6.1**: Maintain existing MCP server integration for task management operations (frontend-only integration with existing backend)
- **Requirement F6.2**: All task operations should continue to work through the enhanced UI using existing backend APIs
- **Requirement F6.3**: Handle MCP server errors gracefully with user-friendly messages (frontend error handling)
- **Requirement F6.4**: Show loading states during message processing (frontend loading indicators)

### Non-Functional Requirements

#### Performance
- **Requirement NFR1.1**: Chatbot overlay should open/close within 200ms
- **Requirement NFR1.2**: Messages should appear within 1 second of sending
- **Requirement NFR1.3**: Previous conversations should load within 500ms
- **Requirement NFR1.4**: Quick suggestions should appear instantly (frontend rendering performance)
- **Requirement NFR1.5**: Frontend components should optimize rendering to prevent performance degradation with global chat icon

#### Usability
- **Requirement NFR2.1**: Interface should be responsive on mobile and desktop
- **Requirement NFR2.2**: Keyboard navigation should be supported (Tab, Enter, Esc)
- **Requirement NFR2.3**: Clear visual indicators for message sending/loading states
- **Requirement NFR2.4**: Easy dismissal of chat interface with Esc key or backdrop click

#### Accessibility
- **Requirement NFR3.1**: WCAG 2.1 AA compliance for color contrast
- **Requirement NFR3.2**: Screen reader compatibility with proper ARIA labels
- **Requirement NFR3.3**: Keyboard navigation support for all interactive elements
- **Requirement NFR3.4**: Focus trapping within the chat interface when open

## UI/UX Design

### Visual Elements
- Floating chat icon positioned at bottom-right of screen (1.5rem from edges)
- Chat interface as a modal/overlay with semi-transparent backdrop
- Clean, modern chat interface with message bubbles (existing design maintained)
- Input area with send button and quick suggestions section
- Conversation history panel with expand/collapse capability
- Loading indicators during message processing

### Color Palette
- Primary: Blue-500 to Purple-600 gradient (maintaining existing design)
- Background: White/light gray for chat area
- User messages: Blue-500 background
- Bot messages: White/gray background

### Interaction Flow
1. User sees floating chatbot icon on any page
2. User clicks chatbot icon
3. System checks authentication status via existing AuthContext
4. If not authenticated → shows login modal with options
5. If authenticated → opens chat interface overlay
6. User can interact with quick suggestions or type messages
7. User sends message or uses quick suggestion
8. Message processed via existing MCP server integration
9. Response displayed in chat window
10. Conversation saved to user's history using existing API
11. User can close chat with close button, backdrop click, or Esc key

## Technical Implementation

### New Components to Create
- **FloatingChatIcon**: Floating button that triggers the chat interface
- **ChatOverlay**: Modal/overlay wrapper for the chat interface
- **QuickSuggestions**: Component for task management quick suggestions
- **ConversationHistoryPanel**: Sidebar with previous chats
- **AuthCheckModal**: Modal for unauthenticated users

### Existing Components to Modify
- **ChatInterface**: Adapt to work within overlay instead of full page
- **AuthContext**: Use existing context for authentication checks

### State Management
- Global state for chat overlay visibility (managed in root layout or context)
- Current chat state (open/closed)
- Authentication status (using existing AuthContext)
- Current conversation messages (in ChatInterface)
- Available quick suggestions (in ChatInterface)
- User's conversation history (in ChatInterface)

### API Integration
- Use existing apiClient methods for all API calls
- Maintain existing authentication check mechanism
- Preserve existing conversation history retrieval
- Keep existing MCP server integration

## Implementation Strategy

### Phase 1: Floating Icon and Overlay
1. Create FloatingChatIcon component with proper positioning
2. Create ChatOverlay component that wraps existing ChatInterface
3. Add click handlers and state management for opening/closing
4. Add backdrop click and ESC key closing functionality

### Phase 2: Authentication Check
1. Integrate authentication check when clicking the floating icon
2. Create AuthCheckModal component
3. Add navigation to login page when requested
4. Ensure proper token handling persists

### Phase 3: Quick Suggestions
1. Create QuickSuggestions component with predefined task phrases
2. Add click handlers to populate input field
3. Ensure input field receives focus after population
4. Style suggestions as attractive chips/tags

### Phase 4: Conversation History
1. Enhance ChatInterface to show conversation history panel
2. Add ability to switch between conversations
3. Maintain existing conversation loading/saving functionality
4. Add conversation titles/summaries

## File Structure Changes

```
frontend/
├── components/
│   ├── FloatingChatIcon.tsx          # New: Floating chat icon component
│   ├── ChatOverlay.tsx               # New: Modal wrapper for chat
│   ├── QuickSuggestions.tsx          # New: Task management quick suggestions
│   ├── ConversationHistoryPanel.tsx  # New: Sidebar for conversation history
│   ├── AuthCheckModal.tsx            # New: Authentication modal
│   └── ChatInterface.tsx             # Modified: Adapted for overlay use
├── app/
│   ├── layout.tsx                    # Updated: Include floating chat icon
│   └── chat/
│       └── page.tsx                  # Modified: Simplified since chat now available everywhere
```

## Success Criteria
- [ ] Floating chat icon appears on all pages
- [ ] Clicking icon opens chat overlay
- [ ] Authentication check works properly
- [ ] Quick suggestions populate input field
- [ ] MCP server integration continues to work with frontend error handling
- [ ] Chat history saves and retrieves per user
- [ ] Responsive design works on mobile/desktop
- [ ] Loading states provide feedback
- [ ] Error handling is graceful with user-friendly messages
- [ ] Existing functionality remains intact
- [ ] Smooth animations and transitions
- [ ] Quick suggestions appear instantly
- [ ] Performance metrics meet requirements (overlay open/close within 200ms)
- [ ] Global chat icon has minimal performance impact

## Dependencies
- Existing AuthContext for authentication
- Existing apiClient for all API calls
- Existing MCP server for task management
- Existing database for storing conversations
- Existing user session management

## Risks
- Potential conflicts with existing UI layouts when adding overlay
- Performance impact of adding global floating element
- Maintaining existing functionality while enhancing UI
- Ensuring proper z-index management across different pages

## Existing Features to Preserve
- All existing chat functionality
- MCP server integration
- Message history loading/saving
- Loading states and error handling
- User authentication flow
- Conversation persistence