import { useState } from 'react';
import { Brain, Copy, PaperPlaneTilt, Sparkle } from '@phosphor-icons/react';
import { useQuery, useMutation } from '@animaapp/playground-react-sdk';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { copyToClipboard, scoreColor, statusColor } from '../lib/utils';
import type { Lead } from '@animaapp/playground-react-sdk';

interface OutreachScreenProps {
  preselectedLead?: Lead | null;
}

function generateMessages(lead: Lead) {
  const firstName = lead.leadName.split(' ')[0];
  return {
    dm: `Hi ${firstName}, I reviewed ${lead.company}\'s current setup and found a few strong opportunities in ${lead.category.toLowerCase()}. I can share a concise plan tailored to your goals — would that be useful?`,
    email: `Subject: ${lead.category} improvement plan for ${lead.company}\n\nHi ${lead.leadName},\n\nI specialize in ${lead.category.toLowerCase()} and noticed ${lead.company} could benefit from a focused upgrade.\n\nI can put together a short, actionable proposal with no commitment — just clear value.\n\nWould you be open to a quick overview?\n\nBest regards,\n[Your Name]`,
    whatsapp: `Hi ${firstName}! I put together a quick idea for improving ${lead.company}\'s ${lead.category.toLowerCase()}. Happy to send it over here — no pressure at all!`,
    followUp: `Hi ${firstName}, just following up on my earlier note about ${lead.company}. Totally fine if timing\'s off — but if you\'re still exploring ${lead.category.toLowerCase()} solutions, I\'d love to help with a small, low-risk start.`,
  };
}

export function OutreachScreen({ preselectedLead }: OutreachScreenProps) {
  const { data: leads, isPending } = useQuery('Lead', { orderBy: { score: 'desc' } });
  const { create: createLog } = useMutation('ActivityLog');
  const { update: updateLead } = useMutation('Lead');

  const [selectedLeadId, setSelectedLeadId] = useState<string>(preselectedLead?.id ?? '');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const selectedLead = leads?.find((l) => l.id === selectedLeadId) ?? preselectedLead ?? null;
  const messages = selectedLead ? generateMessages(selectedLead) : null;

  const handleCopy = async (key: string, text: string) => {
    await copyToClipboard(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);

    if (selectedLead) {
      await createLog({
        action: 'Message Copied',
        entityId: selectedLead.id,
        details: `${key} message copied for ${selectedLead.company}`,
      });
    }
  };

  const handleMarkContacted = async () => {
    if (!selectedLead) return;
    await updateLead(selectedLead.id, { status: 'contacted', lastContact: new Date() });
    await createLog({
      action: 'Lead Contacted',
      entityId: selectedLead.id,
      details: `${selectedLead.company} marked as contacted from Outreach screen`,
    });
  };

  if (isPending) return <div className="flex h-64 items-center justify-center text-muted-foreground text-sm">Loading…</div>;

  const messageConfig = messages
    ? [
        { key: 'dm', label: 'Short DM', icon: PaperPlaneTilt, value: messages.dm },
        { key: 'email', label: 'Email Pitch', icon: Brain, value: messages.email },
        { key: 'whatsapp', label: 'WhatsApp', icon: Sparkle, value: messages.whatsapp },
        { key: 'followUp', label: 'Follow-up', icon: Copy, value: messages.followUp },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Outreach Generator</h2>
        <p className="text-xs text-muted-foreground mt-1">Select a lead and get AI-generated, personalized messages for every channel.</p>
      </div>

      <Card className="border-border bg-panel">
        <CardContent className="p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Select Lead</label>
              <Select value={selectedLeadId} onValueChange={setSelectedLeadId}>
                <SelectTrigger className="border-border bg-background text-foreground text-sm">
                  <SelectValue placeholder="Choose a lead…" />
                </SelectTrigger>
                <SelectContent className="border-border bg-panel text-foreground">
                  {(leads ?? []).map((l) => (
                    <SelectItem key={l.id} value={l.id} className="text-sm">
                      {l.company} — {l.leadName} ({l.score})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedLead && (
              <div className="flex items-end">
                <Button className="bg-success text-success-foreground hover:opacity-90 text-xs" onClick={handleMarkContacted}>
                  <PaperPlaneTilt size={14} weight="fill" />
                  Mark as Contacted
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedLead && (
        <>
          <Card className="border-border bg-panel-alt">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Selected Lead</p>
                  <h3 className="text-base font-semibold text-foreground mt-1">{selectedLead.company}</h3>
                  <p className="text-xs text-muted-foreground">{selectedLead.leadName} · {selectedLead.source} · {selectedLead.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${statusColor(selectedLead.status)} border-transparent text-xs`}>{selectedLead.status}</Badge>
                  <span className={`font-mono text-sm font-semibold ${scoreColor(selectedLead.score)}`}>{selectedLead.score}/100</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {messageConfig.map((msg) => {
              const Icon = msg.icon;
              const copied = copiedKey === msg.key;
              return (
                <Card key={msg.key} className="border-border bg-panel flex flex-col">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm text-foreground flex items-center gap-2">
                      <Icon size={14} weight="fill" className="text-primary" />
                      {msg.label}
                    </CardTitle>
                    <Button
                      className={`text-xs h-8 px-3 transition-all ${copied ? 'bg-success text-success-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary-hover'}`}
                      onClick={() => handleCopy(msg.key, msg.value)}
                    >
                      <Copy size={12} weight="fill" />
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <pre className="text-xs text-foreground leading-5 whitespace-pre-wrap font-sans">{msg.value}</pre>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {!selectedLead && (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
          <Brain size={40} weight="fill" className="text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Select a lead above to generate personalized outreach messages.</p>
        </div>
      )}
    </div>
  );
}
