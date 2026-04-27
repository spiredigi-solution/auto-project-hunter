<instructions>
## 🚨 MANDATORY: CHANGELOG TRACKING 🚨

You MUST maintain this file to track your work across messages. This is NON-NEGOTIABLE.

---

## INSTRUCTIONS

- **MAX 5 lines** per entry - be concise but informative
- **Include file paths** of key files modified or discovered
- **Note patterns/conventions** found in the codebase
- **Sort entries by date** in DESCENDING order (most recent first)
- If this file gets corrupted, messy, or unsorted -> re-create it. 
- CRITICAL: Updating this file at the END of EVERY response is MANDATORY.
- CRITICAL: Keep this file under 300 lines. You are allowed to summarize, change the format, delete entries, etc., in order to keep it under the limit.

</instructions>

<changelog>
## 2026-04-27 — Full Database + SDK Refactor + Add-on Screens

- Integrated `@animaapp/playground-react-sdk` (AnimaProvider in index.tsx, all hooks)
- Created 9 full screens: Dashboard, Leads, Insights, Templates, Outreach, Sources, Automation, Settings, Logs
- All data (Leads, Templates, LeadSources, ActivityLogs) now backed by SDK useQuery/useMutation/useLazyQuery
- Added `useLeadSeeder` hook to auto-seed database on first run (10 leads, 5 templates, 8 sources, 6 logs)
- Decomposed layout into `AppSidebar` + `AppHeader` components under `src/components/layout/`
- New screens: OutreachScreen (AI message generator per lead), AutomationScreen (scheduler + keywords + notifications), SettingsScreen (6 sections), InsightsScreen (radar + bar charts)
- Seed data in `src/data/seedData.ts`, types in `src/types/index.ts`, utils in `src/lib/utils.ts`
</changelog>
