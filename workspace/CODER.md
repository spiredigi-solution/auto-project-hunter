<instructions>
This file will be automatically added to your context. 
It serves multiple purposes:
  1. Storing frequently used tools so you can use them without searching each time
  2. Recording the user's code style preferences (naming conventions, preferred libraries, etc.)
  3. Maintaining useful information about the codebase structure and organization
  4. Remembering tricky quirks from this codebase

When you spend time searching for certain configuration files, tricky code coupled dependencies, or other codebase information, add that to this CODER.md file so you can remember it for next time.
Keep entries sorted in DESC order (newest first) so recent knowledge stays in prompt context if the file is truncated.
</instructions>

<coder>
# Architecture
- SDK: `@animaapp/playground-react-sdk` — AnimaProvider wraps app in `src/index.tsx`
- All DB access via `useQuery`, `useMutation`, `useLazyQuery` from SDK
- Entity names: `Lead`, `Template`, `LeadSource`, `ActivityLog` (PascalCase)
- Screens live in `src/screens/`, layout components in `src/components/layout/`
- Seed hook: `src/hooks/useLeadSeeder.ts` — runs once per session, seeds only if empty
- Seed data: `src/data/seedData.ts`
- Utils: `src/lib/utils.ts` — cn, formatDate, scoreColor, statusColor, copyToClipboard
- Types: `src/types/index.ts` — LeadStatus, NavKey

# Key Patterns
- Navigation: `NavKey` union type drives `renderScreen()` switch in App.tsx
- Outreach flow: selecting a lead in LeadsScreen calls `handleSelectLead` → sets `outreachLead` → navigates to OutreachScreen
- All forms: inline add/edit with local useState, submitted via SDK `create`/`update`
- Theme: CSS class toggle on `document.documentElement` (`light` class), stored in localStorage
- No Zustand, no global state beyond App.tsx local state
</coder>
