import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { marked } from 'marked';

@Component({
  selector: 'app-legal-page',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="l-page l-section">
      <a mat-button routerLink="/" class="legal-back">
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
  `],
})
export class LegalPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);
  private readonly sanitizer = inject(DomSanitizer);

  loading = signal(true);
  error = signal<string | null>(null);
  content = signal<SafeHtml | null>(null);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    if (slug !== 'imprint' && slug !== 'privacy') {
      this.error.set('Seite nicht gefunden.');
      this.loading.set(false);
      return;
    }

    const lang = 'de';
    const path = `assets/legal/${slug}.${lang}.md`;

    this.http.get(path, { responseType: 'text' }).subscribe({
      next: async (md) => {
        const html = await marked.parse(md);
        this.content.set(this.sanitizer.bypassSecurityTrustHtml(String(html)));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Inhalt konnte nicht geladen werden.');
        this.loading.set(false);
      },
    });
  }
}
