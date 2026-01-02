---
name: "fastapi-route-builder"
description: "Creates FastAPI REST endpoints based on API specs including validation, authentication, and database integration."
version: "1.0.0"
---

# FastAPI Route Builder Skill

## When to Use This Skill

- Reading `@specs/api/rest-endpoints.md`
- Creating CRUD APIs
- Adding JWT protection
- Connecting database models to routes

## How This Skill Works

1. Reads API spec
2. Reads models
3. Generates FastAPI routes
4. Adds filters & ownership checks
5. Wires everything into `main.py`

## Output Format

- Route files
- Endpoints
- Request/response schemas

## Example

**Input:** "Implement GET /api/tasks"

**Output:**  
`backend/routes/tasks.py` with JWT-protected GET endpoint
