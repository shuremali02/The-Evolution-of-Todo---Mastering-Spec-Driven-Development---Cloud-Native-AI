# Quickstart Guide: Phase III Chatbot Issues Fixes

## Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL-compatible database (Neon recommended)
- OpenAI API key
- MCP server access

### Environment Configuration
```bash
# Backend
cp backend/.env.example backend/.env
# Update backend/.env with your API keys and database URL

# Frontend
cp frontend/.env.example frontend/.env
# Update frontend/.env with backend API URLs
```

## Running the Application

### Backend (with fixes applied)
```bash
cd backend
pip install -r requirements.txt
python -m alembic upgrade head
python -m uvicorn app.main:app --reload --port 8000
```

### MCP Server
```bash
cd backend
python src/mcp_server.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoint Access
- Fixed endpoint: `http://localhost:8000/api/v1/chat`
- Legacy endpoint: `http://localhost:8000/api/chat` (redirects to new path)

## Testing the Fixes
1. Natural language task completion (e.g., "complete buy groceries task")
2. MCP dynamic tool discovery
3. Clean UI without debug information
4. Proper error handling