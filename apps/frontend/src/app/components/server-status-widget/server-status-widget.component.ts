/**
 * Server-Status-Widget (Story 0.4).
 * Zeigt aggregierte Kennzahlen und Status-Indikator; Polling alle 30s.
 */
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { trpc } from '../../trpc.client';
import type { ServerStatsDTO } from '@arsnova/shared-types';

@Component({
  selector: 'app-server-status-widget',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div
      class="server-status"
      role="status"
      aria-live="polite"
      [attr.aria-label]="ariaStatusLabel()"
    >
      <div class="server-status__header">
        <mat-icon class="server-status__icon" aria-hidden="true">monitor_heart</mat-icon>
        <span
          class="server-status__dot"
          [class.server-status__dot--healthy]="statusColor() === 'green'"
          [class.server-status__dot--busy]="statusColor() === 'yellow'"
          [class.server-status__dot--overloaded]="statusColor() === 'red'"
          [class.server-status__dot--unknown]="statusColor() === 'gray'"
          aria-hidden="true"
        ></span>
        Server-Status
      </div>
      @if (stats(); as s) {
        <p class="server-status__text">
          {{ s.activeSessions }} Quiz live · {{ s.totalParticipants }} Teilnehmer ·
          {{ s.completedSessions }} Quizzes durchgeführt
        </p>
      } @else {
        <p class="server-status__text">Wird geladen…</p>
      }
    </div>
  `,
  styles: [`
    .server-status {
      border-radius: var(--mat-sys-corner-small);
      border: 1px solid var(--mat-sys-outline-variant);
      background: var(--mat-sys-surface-container);
      color: var(--mat-sys-on-surface);
      padding: 0.75rem;
      text-align: left;
    }

    .server-status__header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font: var(--mat-sys-label-large);
    }

    .server-status__icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      color: var(--mat-sys-on-surface-variant);
    }

    .server-status__dot {
      width: 0.625rem;
      height: 0.625rem;
      border-radius: var(--mat-sys-corner-full);
      flex-shrink: 0;
      background: var(--mat-sys-outline);
    }

    .server-status__dot--healthy {
      background: var(--app-color-success-fg);
    }

    .server-status__dot--busy {
      background: var(--mat-sys-tertiary);
    }

    .server-status__dot--overloaded {
      background: var(--mat-sys-error);
    }

    .server-status__dot--unknown {
      background: var(--mat-sys-outline);
    }

    .server-status__text {
      margin: 0.25rem 0 0;
      font: var(--mat-sys-body-small);
      color: var(--mat-sys-on-surface-variant);
    }
  `],
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
