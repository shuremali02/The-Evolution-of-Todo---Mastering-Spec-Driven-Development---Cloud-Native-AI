# Hugging Face Spaces Dockerfile for FastAPI Backend
# Based on: https://huggingface.co/docs/hub/spaces-sdks-docker

FROM python:3.13-slim

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

# Copy all application files
COPY --chown=user . /app

# Create .env file with database URL for build and runtime process
RUN echo "DATABASE_URL=postgresql+asyncpg://neondb_owner:npg_Ulao9GqPOr0F@ep-empty-forest-adwdbz6a-pooler.c-2.us-east-1.aws.neon.tech/neondb" > .env

# Run database initialization to create all required tables
RUN python create_tables.py

# Set environment variable for runtime as well
ENV DATABASE_URL=postgresql+asyncpg://neondb_owner:npg_Ulao9GqPOr0F@ep-empty-forest-adwdbz6a-pooler.c-2.us-east-1.aws.neon.tech/neondb

# Expose both ports (7860 for main app, 8000 for MCP server)
EXPOSE 7860 8000

# Run both servers using a single CMD with shell, ensuring proper PYTHONPATH
CMD ["sh", "-c", "cd /app && python src/mcp_server.py & sleep 5 && uvicorn app.main:app --host 0.0.0.0 --port 7860"]