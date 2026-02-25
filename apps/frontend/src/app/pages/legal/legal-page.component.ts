import { Component, inject, NgZone, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { marked } from 'marked';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-legal-page',
  imports: [RouterLink, MatButton, MatIcon],
  template: `
    <div class="l-page l-section">
      <a matButton routerLink="/" class="legal-back">
        <mat-icon>arrow_back</mat-icon>
        Startseite
      </a>

      @if (loading()) {
        <p class="legal-loading">Wird geladen…</p>
      } @else if (error()) {
        <p class="legal-error" role="alert">{{ error() }}</p>
      } @else if (content()) {
        <article class="legal-content" [innerHTML]="content()"></article>
      }
    </div>
  `,
  styles: [`
    .legal-back {
      margin-bottom: 1.5rem;
    }

    .legal-loading,
    .legal-error {
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-medium);
    }

    .legal-error {
      color: var(--mat-sys-error);
    }

    .legal-content {
      font: var(--mat-sys-body-medium);
      color: var(--mat-sys-on-surface);
      line-height: 1.6;
    }

    .legal-content :deep(h1) {
      font: var(--mat-sys-headline-medium);
      margin: 0 0 1rem;
    }

    .legal-content :deep(h2) {
      font: var(--mat-sys-title-large);
      margin: 1.5rem 0 0.5rem;
    }

    .legal-content :deep(p) {
      margin: 0 0 0.75rem;
    }

    .legal-content :deep(ul) {
      margin: 0 0 0.75rem;
      padding-left: 1.5rem;
    }

    .legal-content :deep(hr) {
      border: none;
      border-top: 1px solid var(--mat-sys-outline-variant);
      margin: 1.5rem 0;
    }

    .legal-content :deep(a) {
      color: var(--mat-sys-primary);
      text-decoration: none;
    }

    .legal-content :deep(a:hover) {
      text-decoration: underline;
    }

    .legal-content :deep(li) {
      margin-bottom: 0.25rem;
    }
  `],
})
export class LegalPageComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly ngZone = inject(NgZone);
  private readonly destroy$ = new Subject<void>();

  loading = signal(true);
  error = signal<string | null>(null);
  content = signal<SafeHtml | null>(null);

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((paramMap) => {
      const slug = paramMap.get('slug') ?? '';
      this.loading.set(true);
      this.error.set(null);
      this.content.set(null);

      if (slug !== 'imprint' && slug !== 'privacy') {
        this.error.set('Seite nicht gefunden.');
        this.loading.set(false);
        return;
      }

      const lang = 'de';
      const baseHref = document.querySelector('base')?.getAttribute('href') ?? '/';
      const baseUrl = `${window.location.origin}${baseHref.endsWith('/') ? baseHref : baseHref + '/'}`;
      const path = `${baseUrl.replace(/\/$/, '')}/assets/legal/${slug}.${lang}.md`;

      this.http.get(path, { responseType: 'text' }).subscribe({
        next: (md) => {
          Promise.resolve(marked.parse(md)).then((html: string) => {
            this.ngZone.run(() => {
              this.content.set(this.sanitizer.bypassSecurityTrustHtml(html));
              this.loading.set(false);
            });
          });
        },
        error: () => {
          this.error.set('Inhalt konnte nicht geladen werden.');
          this.loading.set(false);
        },
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
