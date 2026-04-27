import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function scoreColor(score: number): string {
  if (score >= 85) return 'text-accent';
  if (score >= 70) return 'text-primary';
  return 'text-success';
}

export function scoreBarColor(score: number): string {
  if (score >= 85) return 'bg-accent';
  if (score >= 70) return 'bg-primary';
  return 'bg-success';
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    hot: 'bg-accent text-accent-foreground',
    new: 'bg-primary text-primary-foreground',
    contacted: 'bg-secondary text-secondary-foreground',
    converted: 'bg-success text-success-foreground',
    rejected: 'bg-gray-600 text-gray-200',
    'follow-up': 'bg-warning text-warning-foreground',
  };
  return map[status] ?? 'bg-gray-600 text-gray-200';
}

export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}
