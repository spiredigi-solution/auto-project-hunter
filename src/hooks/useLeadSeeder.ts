import { useEffect, useRef } from 'react';
import { useMutation, useLazyQuery } from '@animaapp/playground-react-sdk';
import { seedLeads, seedTemplates, seedLeadSources, seedActivityLogs } from '../data/seedData';

export function useLeadSeeder() {
  const seeded = useRef(false);
  const { query: queryLeads } = useLazyQuery('Lead');
  const { create: createLead } = useMutation('Lead');
  const { query: queryTemplates } = useLazyQuery('Template');
  const { create: createTemplate } = useMutation('Template');
  const { query: querySources } = useLazyQuery('LeadSource');
  const { create: createSource } = useMutation('LeadSource');
  const { query: queryLogs } = useLazyQuery('ActivityLog');
  const { create: createLog } = useMutation('ActivityLog');

  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;

    async function seed() {
      try {
        const [existingLeads, existingTemplates, existingSources, existingLogs] = await Promise.all([
          queryLeads({ limit: 1 }),
          queryTemplates({ limit: 1 }),
          querySources({ limit: 1 }),
          queryLogs({ limit: 1 }),
        ]);

        if (!existingLeads || existingLeads.length === 0) {
          for (const lead of seedLeads) {
            await createLead(lead);
          }
        }
        if (!existingTemplates || existingTemplates.length === 0) {
          for (const template of seedTemplates) {
            await createTemplate(template);
          }
        }
        if (!existingSources || existingSources.length === 0) {
          for (const source of seedLeadSources) {
            await createSource(source);
          }
        }
        if (!existingLogs || existingLogs.length === 0) {
          for (const log of seedActivityLogs) {
            await createLog(log);
          }
        }
      } catch {
        // non-fatal
      }
    }

    seed();
  }, []);
}
