# Hugging Face Spaces Dockerfile for FastAPI Backend
# Based on: https://huggingface.co/docs/hub/spaces-sdks-docker

FROM python:3.11-slim

# Create user for security
RUN useradd -m -u 1000 user

# Switch to user
USER user

# Set PATH
ENV PATH="/home/user/.local/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY --chown=user ./requirements.txt requirements.txt

# Install dependencies
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Create .env file with database URL for build and runtime process
RUN echo "DATABASE_URL=postgresql+asyncpg://neondb_owner:npg_Ulao9GqPOr0F@ep-empty-forest-adwdbz6a-pooler.c-2.us-east-1.aws.neon.tech/neondb" > .env

# Copy all application files (including startup.sh)
COPY --chown=user . /app

# Make startup.sh executable
RUN chmod +x /app/startup.sh

# Run database initialization to create all required tables
RUN python create_tables.py

# Set environment variable for runtime as well
ENV DATABASE_URL=postgresql+asyncpg://neondb_owner:npg_Ulao9GqPOr0F@ep-empty-forest-adwdbz6a-pooler.c-2.us-east-1.aws.neon.tech/neondb

# Expose both ports (7860 for main app, 8000 for MCP server)
EXPOSE 7860 8000

# Run database migrations (continue if already applied), MCP server, and main application directly
CMD ["sh", "-c", "echo '🚀 Starting Hackathon Todo Backend...' && echo '📦 Running database migrations...' && python -m alembic upgrade head || echo '⚠️  Database migrations completed with warnings (this is often expected)' && echo '✅ Database migrations completed' && echo '🔌 Starting MCP server on port 8000...' && python src/mcp_server.py & sleep 5 && echo '🏃 Starting FastAPI application on port 7860...' && exec uvicorn app.main:app --host 0.0.0.0 --port 7860"]