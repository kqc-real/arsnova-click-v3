/**
 * Server-Status-Widget (Story 0.4).
 * Zeigt aggregierte Kennzahlen und Status-Indikator; Polling alle 30s.
 */
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { trpc } from '../../trpc.client';
import type { ServerStatsDTO } from '@arsnova/shared-types';

@Component({
  selector: 'app-server-status-widget',
  standalone: true,
  template: `
    <div
      class="rounded-lg border border-slate-500/80 bg-white p-3 text-left dark:border-indigo-300/60 dark:bg-indigo-950/75"
      role="status"
      aria-live="polite"
      [attr.aria-label]="ariaStatusLabel()"
    >
      <div class="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
        <span
          class="h-2.5 w-2.5 shrink-0 rounded-full"
          [class.bg-green-500]="statusColor() === 'green'"
          [class.bg-yellow-500]="statusColor() === 'yellow'"
          [class.bg-red-500]="statusColor() === 'red'"
          [class.bg-gray-400]="statusColor() === 'gray'"
          aria-hidden="true"
        ></span>
        Server-Status
      </div>
      @if (stats(); as s) {
        <p class="mt-1 text-xs text-slate-900 dark:text-slate-100">
          {{ s.activeSessions }} Quiz live · {{ s.totalParticipants }} Teilnehmer ·
          {{ s.completedSessions }} Quizzes durchgeführt
        </p>
      } @else {
        <p class="mt-1 text-xs text-slate-800 dark:text-slate-200">Wird geladen…</p>
      }
    </div>
  `,
})
export class ServerStatusWidgetComponent implements OnInit, OnDestroy {
  stats = signal<ServerStatsDTO | null>(null);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  ariaStatusLabel(): string {
    const s = this.stats();
    if (!s) return 'Server-Status wird geladen';
    const statusText = s.serverStatus === 'healthy' ? 'gesund' : s.serverStatus === 'busy' ? 'ausgelastet' : 'überlastet';
    return `Server-Status: ${statusText}. ${s.activeSessions} Quiz live, ${s.totalParticipants} Teilnehmer, ${s.completedSessions} Quizzes durchgeführt.`;
  }

  statusColor(): 'green' | 'yellow' | 'red' | 'gray' {
    const s = this.stats();
    if (!s) return 'gray';
    switch (s.serverStatus) {
      case 'healthy':
        return 'green';
      case 'busy':
        return 'yellow';
      case 'overloaded':
        return 'red';
      default:
        return 'gray';
    }
  }

  async ngOnInit(): Promise<void> {
    const fetchStats = async (): Promise<void> => {
      try {
        const data = await trpc.health.stats.query();
        this.stats.set(data);
      } catch {
        this.stats.set(null);
      }
    };
    await fetchStats();
    this.intervalId = setInterval(fetchStats, 30_000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}
