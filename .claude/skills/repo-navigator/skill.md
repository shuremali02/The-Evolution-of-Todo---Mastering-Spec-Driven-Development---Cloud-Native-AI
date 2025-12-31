---
name: "repo-navigator"
description: "Scans, maps, and explains the monorepo structure for frontend, backend, and specs so Claude can navigate and modify the correct files with confidence."
version: "1.0.0"
---

# Repo Navigator Skill

## When to Use This Skill

- Claude needs to understand **where frontend, backend, or specs live**
- User asks to **work in monorepo**
- Claude must locate **CLAUDE.md**, **/specs**, or **/frontend** & **/backend**
- Before any major change or refactor

## How This Skill Works

1. Reads project root folder  
2. Detects:
   - `/frontend`
   - `/backend`
   - `/specs`
   - `.spec-kit`
   - `CLAUDE.md`
3. Builds a **mental map** for Claude
4. Tells Claude:
   - Where to write frontend code  
   - Where to write backend code  
   - Where specs live  

## Output Format

- Repository tree (simplified)
- Frontend root
- Backend root
- Specs root
- Active CLAUDE.md files

## Example

**Input:** "Analyze the repo"

**Output:**  
- Frontend → `/frontend`  
- Backend → `/backend`  
- Specs → `/specs/features`, `/specs/api`, `/specs/database`  
- Claude rules → `/CLAUDE.md`, `/frontend/CLAUDE.md`, `/backend/CLAUDE.md`
