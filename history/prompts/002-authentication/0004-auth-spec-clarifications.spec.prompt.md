---
id: 0004
title: auth-spec-clarifications
stage: spec
date: 2026-01-06
surface: cli
model: claude-sonnet-4-5-20250929
feature: 002-authentication
branch: 002-auth-fixes
user: shuremali02
command: /sp.clarify
labels: [spec, clarification, auth]
links:
  spec: specs/002-authentication/spec.md
  ticket:
  adr:
  pr:
files:
  - path: specs/002-authentication/spec.md
    change: enhanced
    details: Added username field to User entity, updated registration/login endpoints, added profile/logout user stories, clarified validation requirements
tests:
---
## Prompt

$ARGUMENTS

---

## Response snapshot

Completed clarification session with 4 questions answered:

1. **Username feature approach**: Extend current 002-authentication spec to include username field in User entity, registration/login, and profile display (rather than separate spec)

2. **Form validation location**: Real-time validation on both frontend (immediate feedback) and backend (server-side validation)

3. **Session expiration handling**: Redirect to login with "Session expired" message, preserve unsaved form data

4. **Username retrieval for profile**: Frontend decodes JWT client-side to get username/display name (username added to JWT payload)

Spec updated with:
- Username field added to User entity (3-20 chars, alphanumeric/_/- only, case-insensitive uniqueness)
- Registration endpoint now requires username, email, password, confirm_password
- Login endpoint accepts either email OR username
- JWT token now includes username claim
- User stories added: US-4 (Profile Display), US-5 (Logout)
- Functional requirements added: FR-5 (Username Validation), FR-6 (Profile/Logout Endpoint)
- Security requirement added: SR-4 (Username Validation)
- Error handling updated with username-specific errors
- Success criteria updated with username/avatar requirements
- Clarifications section created documenting all decisions

## Outcome

- ✅ Impact: Enhanced authentication spec with username support and profile display feature
- 🧪 Tests: Not applicable (spec clarification only)
- 📁 Files: specs/002-authentication/spec.md
- 🔁 Next prompts: /sp.plan to design technical architecture
- 🧠 Reflection: Key ambiguities resolved around data model (username field), validation approach (double validation), UX flows (session handling), and API contracts (JWT payload extension)

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): None
- Next experiment (smallest change to try): None
