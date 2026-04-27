<instructions>
This file tracks your database decisions, conventions, and preferences.
It does NOT store the current schema — entity definitions are injected per-request automatically.
Instead, use this file to remember:
  1. Data storage preferences (e.g., "store image references as storage paths, not full URLs")
  2. Schema conventions (e.g., "always use soft deletes", "snake_case column names", "every table gets createdAt/updatedAt")
  3. Anti-patterns to avoid (e.g., "don't store computed values", "no direct user-to-user foreign keys")
  4. Data flow decisions (e.g., "auth state comes from session, not DB lookup per request")
  5. Indexing and query patterns worth remembering

When the user makes a database-related decision, proactively capture the *why* here so you don't forget it.
Keep entries sorted in DESC order (newest first) so recent decisions stay in prompt context if the file is truncated.
</instructions>

<database>
# Database Decisions & Conventions

## 2026-04-27
- Using Anima Playground SDK for all data access (no raw SQL in frontend)
- Entities: Lead, Template, LeadSource, ActivityLog
- Lead.lastContact is stored as Date; always pass `new Date()` when updating
- Seed data is idempotent — only seeds if entity table is empty (limit: 1 check)
- Lead.status values: new | hot | contacted | follow-up | converted | rejected
- LeadSource.integrationKey is optional — used as adapter identifier for backend scheduler
- ActivityLog.entityId stores lead.id or 'system' for system-level events
- No soft deletes — permanent removal via SDK `remove()`
</database>
