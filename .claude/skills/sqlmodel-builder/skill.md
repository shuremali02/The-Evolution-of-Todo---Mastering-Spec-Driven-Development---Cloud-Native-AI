---
name: "sqlmodel-builder"
description: "Generates SQLModel database models and relationships from database schema specifications."
version: "1.0.0"
---

# SQLModel Builder Skill

## When to Use This Skill

- Working with **Neon PostgreSQL**
- Reading `@specs/database/schema.md`
- Creating or modifying database models

## How This Skill Works

1. Reads schema spec
2. Converts tables → SQLModel classes
3. Adds relationships
4. Adds indexes & constraints
5. Generates clean models.py

## Output Format

- SQLModel classes
- Fields
- Relationships
- Ready-to-run models

## Example

**Input:** "@specs/database/schema.md create models"

**Output:**  
`backend/models.py` containing User and Task SQLModel classes
