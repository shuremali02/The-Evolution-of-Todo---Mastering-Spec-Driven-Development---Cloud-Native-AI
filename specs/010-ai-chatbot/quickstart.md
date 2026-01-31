# Quickstart: AI Chatbot Development

## Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL (or Neon Serverless account)
- OpenAI API key
- Better Auth configured

## Setup

### Backend Setup
```bash
cd backend
pip install fastapi openai python-mcp-sdk sqlmodel psycopg2-binary python-jose[cryptography] python-multipart
```

### Frontend Setup
```bash
cd frontend
npm install @openai/chat-components
```

## Environment Variables

### Backend (.env)
```bash
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=postgresql://user:password@localhost/dbname
SECRET_KEY=your_secret_key_for_jwt
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=your_chatkit_domain_key
BACKEND_API_URL=http://localhost:8000
```

## Database Setup

1. Install Alembic for migrations:
```bash
pip install alembic
```

2. Initialize migrations:
```bash
alembic init alembic
```

3. Create migration for new models:
```bash
alembic revision --autogenerate -m "Add conversation and message models"
alembic upgrade head
```

## Running the Application

### Backend
```bash
cd backend
uvicorn src.main:app --reload
```

### Frontend
```bash
cd frontend
npm run dev
```

## Key Endpoints

- Chat API: `POST /api/chat` (requires JWT)
- MCP Server: Running on separate port for tool access

## Development Workflow

1. Start database (PostgreSQL)
2. Run database migrations
3. Set environment variables
4. Start backend server
5. Start frontend server
6. Access frontend at http://localhost:3000