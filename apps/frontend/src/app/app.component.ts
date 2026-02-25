import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="app-layout">
      <a href="#main-content" class="app-skip-link">Zum Inhalt springen</a>
      <main id="main-content" class="app-main" role="main">
        <router-outlet />
      </main>
      <footer class="app-footer" role="contentinfo">
        <div class="app-footer__inner">
          <span class="app-footer__copy">© {{ year }} arsnova.click</span>
          <div class="app-footer__links">
            <a mat-button routerLink="/legal/imprint">
              <mat-icon class="app-footer__icon">business</mat-icon>
              Impressum
            </a>
            <a mat-button routerLink="/legal/privacy">
              <mat-icon class="app-footer__icon">privacy_tip</mat-icon>
              Datenschutz
            </a>
          </div>
        </div>
      </footer>
    </div>
    `,
  styles: [`
    .app-layout {
      position: relative;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-main {
      flex: 1;
    }

    .app-skip-link {
      position: absolute;
      top: -100px;
      left: 0.5rem;
      z-index: 100;
      padding: 0.5rem 1rem;
      background: var(--mat-sys-primary);
      color: var(--mat-sys-on-primary);
      font: var(--mat-sys-label-large);
      border-radius: var(--mat-sys-corner-small);
      text-decoration: none;
      transition: top 0.2s;
    }

    .app-skip-link:focus,
    .app-skip-link:focus-visible {
      top: 0.5rem;
      outline: 2px solid var(--mat-sys-on-primary);
      outline-offset: 2px;
    }

    .app-footer {
      margin-top: 2rem;
      padding: 1.25rem 1rem;
      border-top: 1px solid var(--mat-sys-outline-variant);
      background: var(--mat-sys-surface-container-low);
    }

    .app-footer__inner {
      max-width: 56rem;
      margin-inline: auto;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .app-footer__copy {
      font: var(--mat-sys-body-small);
      color: var(--mat-sys-on-surface-variant);
    }

    .app-footer__links {
      display: flex;
      gap: 0.5rem;
    }

    .app-footer a {
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-small);
    }

    .app-footer__icon {
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
      margin-right: 0.35rem;
    }
  `],
})
export class AppComponent {
  readonly year = new Date().getFullYear();
}
