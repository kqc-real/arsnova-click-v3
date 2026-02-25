import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { trpc } from '../../trpc.client';
import { ServerStatusWidgetComponent } from '../../components/server-status-widget/server-status-widget.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatChipsModule,
    MatIconModule,
    ServerStatusWidgetComponent,
  ],
  template: `
    <div class="l-page">
      @if (presetToastVisible()) {
        <div class="preset-toast">
          <p class="preset-toast__title">{{ presetToastTitle() }}</p>
          <p class="preset-toast__subtitle">Preset-Wirkung</p>
          <mat-chip-set class="preset-toast__chips">
            @for (item of presetToastOn(); track item) {
              <mat-chip highlighted>{{ item }} an</mat-chip>
            }
            @for (item of presetToastOff(); track item) {
              <mat-chip>{{ item }} aus</mat-chip>
            }
          </mat-chip-set>
          @if (presetToastHint()) {
            <p class="preset-toast__hint">{{ presetToastHint() }}</p>
          }
        </div>
      }

      <header #homeHeader class="home-header" role="banner">
        <div class="home-header__row">
          <div class="home-brand">
            <svg class="home-brand__icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <defs>
                <linearGradient id="brand-fg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="var(--mat-sys-primary)" />
                  <stop offset="100%" stop-color="var(--mat-sys-tertiary)" />
                </linearGradient>
              </defs>
              <rect width="32" height="32" rx="6" fill="url(#brand-fg)" />
              <rect x="2" y="2" width="28" height="28" rx="5" fill="var(--mat-sys-surface)" />
              <circle cx="24" cy="22" r="4" fill="var(--mat-sys-primary)" />
            </svg>
            <h1 class="home-brand__title">arsnova.click</h1>
          </div>

          <button
            #controlsToggleBtn
            mat-icon-button
            class="mobile-only"
            [attr.aria-expanded]="controlsMenuOpen() ? 'true' : 'false'"
            aria-controls="home-controls-mobile"
            aria-label="Schalter öffnen"
            (click)="toggleControlsMenu()"
          >
            <mat-icon>menu</mat-icon>
          </button>

          <div class="home-controls desktop-only">
            <mat-button-toggle-group
              [value]="theme()"
              (change)="onThemeChange($event.value)"
              appearance="standard"
              aria-label="Theme"
              class="home-icon-toggles"
            >
              <mat-button-toggle value="system" aria-label="System">
                <mat-icon>contrast</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle value="dark" aria-label="Dark">
                <mat-icon>dark_mode</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle value="light" aria-label="Light">
                <mat-icon>light_mode</mat-icon>
              </mat-button-toggle>
            </mat-button-toggle-group>

            <button mat-icon-button [matMenuTriggerFor]="langMenu" aria-label="Sprache" class="home-icon-btn">
              <mat-icon>language</mat-icon>
            </button>
            <mat-menu #langMenu="matMenu">
              <button mat-menu-item (click)="language.set('de')">
                <mat-icon matMenuItemIcon>language</mat-icon>
                DE
              </button>
              <button mat-menu-item (click)="language.set('en')">
                <mat-icon matMenuItemIcon>language</mat-icon>
                EN
              </button>
            </mat-menu>

            <mat-button-toggle-group
              [value]="preset()"
              (change)="setPreset($event.value)"
              appearance="standard"
              aria-label="Preset auswählen"
              class="home-icon-toggles"
            >
              <mat-button-toggle value="serious">
                <mat-icon>school</mat-icon> Seriös
              </mat-button-toggle>
              <mat-button-toggle value="spielerisch">
                <mat-icon class="home-preset-icon--playful">celebration</mat-icon> Spielerisch
              </mat-button-toggle>
            </mat-button-toggle-group>
          </div>
        </div>

        @if (controlsMenuOpen()) {
          <div id="home-controls-mobile" class="home-controls-mobile l-stack l-stack--sm">
            <mat-button-toggle-group
              [value]="theme()"
              (change)="onThemeChange($event.value)"
              appearance="standard"
              aria-label="Theme"
              class="home-icon-toggles home-icon-toggles--full"
            >
              <mat-button-toggle value="system" aria-label="System">
                <mat-icon>contrast</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle value="dark" aria-label="Dark">
                <mat-icon>dark_mode</mat-icon>
              </mat-button-toggle>
              <mat-button-toggle value="light" aria-label="Light">
                <mat-icon>light_mode</mat-icon>
              </mat-button-toggle>
            </mat-button-toggle-group>

            <button mat-icon-button [matMenuTriggerFor]="langMenuMobile" aria-label="Sprache" class="home-icon-btn">
              <mat-icon>language</mat-icon>
            </button>
            <mat-menu #langMenuMobile="matMenu">
              <button mat-menu-item (click)="language.set('de'); closeControlsMenu()">
                <mat-icon matMenuItemIcon>language</mat-icon>
                DE
              </button>
              <button mat-menu-item (click)="language.set('en'); closeControlsMenu()">
                <mat-icon matMenuItemIcon>language</mat-icon>
                EN
              </button>
            </mat-menu>

            <mat-button-toggle-group
              [value]="preset()"
              (change)="setPreset($event.value, true)"
              appearance="standard"
              aria-label="Preset auswählen"
              class="home-icon-toggles home-preset-toggle--full"
            >
              <mat-button-toggle value="serious">
                <mat-icon>school</mat-icon> Seriös
              </mat-button-toggle>
              <mat-button-toggle value="spielerisch">
                <mat-icon class="home-preset-icon--playful">celebration</mat-icon> Spielerisch
              </mat-button-toggle>
            </mat-button-toggle-group>
          </div>
        }
      </header>

      <main class="home-main">
        <mat-card appearance="raised" class="home-card home-card--create">
          <mat-card-header>
            <mat-card-subtitle>
              <mat-icon class="home-card__icon">school</mat-icon>
              Lehrkraft
            </mat-card-subtitle>
            <mat-card-title class="home-card__title">Erstellen</mat-card-title>
          </mat-card-header>

          <mat-card-content>
            <div class="home-card__meta">
              <p class="home-card__copy">Neue Session für Kurs oder Q&amp;A in wenigen Klicks.</p>
              <a
                mat-stroked-button
                href="https://github.com/arsnova-dev/arsnova-click-v3/blob/main/docs/onboarding.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                <mat-icon>help</mat-icon>
                Hilfe
              </a>
            </div>
          </mat-card-content>

          <mat-card-actions class="l-stack l-stack--sm">
            <a mat-flat-button routerLink="/quiz" class="home-cta">
              <mat-icon class="home-cta__icon">add_circle</mat-icon>
              Session erstellen
            </a>
            <a mat-stroked-button routerLink="/quiz" class="home-cta">
              <mat-icon class="home-cta__icon">quiz</mat-icon>
              Quiz wählen
            </a>
            <a mat-stroked-button routerLink="/quiz" class="home-cta">
              <mat-icon class="home-cta__icon">question_answer</mat-icon>
              Q&amp;A
            </a>
          </mat-card-actions>
        </mat-card>

        <mat-card appearance="raised" id="student-entry" class="home-card">
          <mat-card-header>
            <mat-card-subtitle>
              <mat-icon class="home-card__icon">group</mat-icon>
              Student/in
            </mat-card-subtitle>
            <mat-card-title class="home-card__title">Beitreten</mat-card-title>
          </mat-card-header>

          <mat-card-content class="l-stack l-stack--sm">
            <div
              class="home-code-slots"
              [class.home-code-slots--valid]="isValidSessionCode()"
              aria-hidden="true"
            >
              @for (char of codeSlots(); track $index) {
                <span class="home-code-slot">{{ char || '·' }}</span>
              }
            </div>
            <p class="home-code-help">A–Z, 0–9 · 6 Zeichen</p>

            <mat-form-field appearance="outline" subscriptSizing="dynamic" class="home-code-field">
              <mat-label>Session-Code</mat-label>
              <input
                #sessionCodeInput
                matInput
                maxlength="6"
                [value]="sessionCode()"
                (input)="onSessionCodeInput($event)"
                (keydown.enter)="joinSession()"
                placeholder="A7K9P2"
                autocapitalize="characters"
                autocomplete="off"
                spellcheck="false"
              />
            </mat-form-field>
          </mat-card-content>

          <mat-card-actions class="l-stack l-stack--sm">
            @if (isJoining()) {
              <button mat-flat-button class="home-cta" disabled aria-label="Session beitreten">
                <mat-icon class="home-cta__icon home-spin">sync</mat-icon>
                Beitreten…
              </button>
            } @else {
              <button
                mat-flat-button
                class="home-cta"
                (click)="joinSession()"
                [disabled]="!isValidSessionCode()"
                aria-label="Session beitreten"
              >
                <mat-icon class="home-cta__icon">login</mat-icon>
                Beitreten
              </button>
            }
            @if (joinError()) {
              <p class="home-error" role="alert">{{ joinError() }}</p>
            }
          </mat-card-actions>
        </mat-card>
      </main>

      <section class="home-grid">
        <mat-card appearance="raised">
          <mat-card-header>
            <mat-card-title>
              <mat-icon class="home-card__icon">library_books</mat-icon>
              Quiz-Bibliothek
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="home-subcard__links l-stack l-stack--xs">
              <a mat-button routerLink="/quiz" class="home-subcard__link">
                <mat-icon class="home-subcard__link-icon">menu_book</mat-icon>
                Zur Bibliothek
              </a>
              <a mat-button routerLink="/quiz" class="home-subcard__link">
                <mat-icon class="home-subcard__link-icon">content_copy</mat-icon>
                Quiz aus Vorlage erstellen
              </a>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card appearance="raised" class="home-subcard--status">
          <mat-card-header>
            <mat-card-title>
              <mat-icon class="home-card__icon">sensors</mat-icon>
              Status
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p class="home-subcard__body">
              @if (apiStatus()) { Backend online } @else { Verbinde… }
            </p>
            <app-server-status-widget />
          </mat-card-content>
        </mat-card>
      </section>
    </div>
  `,
  styles: [`
    .preset-toast {
      position: fixed;
      user-select: none;
      right: 1rem;
      bottom: 1rem;
      z-index: 70;
      width: min(92vw, 24rem);
      border-radius: var(--mat-sys-corner-large);
      border: 1px solid var(--mat-sys-outline-variant);
      background: var(--mat-sys-surface-container);
      padding: 0.75rem;
      box-shadow: var(--mat-sys-level3);
    }

    .preset-toast__title {
      margin: 0;
      font: var(--mat-sys-title-small);
    }

    .preset-toast__subtitle,
    .preset-toast__hint {
      margin: 0.35rem 0 0;
      font: var(--mat-sys-body-small);
      color: var(--mat-sys-on-surface-variant);
    }

    .preset-toast__chips {
      margin-top: 0.5rem;
      pointer-events: none;
    }

    .home-header {
      position: sticky;
      top: 0;
      z-index: 10;
      margin-bottom: 1.25rem;
      border-radius: var(--mat-sys-corner-extra-large);
      border: 1px solid var(--mat-sys-outline-variant);
      background: var(--mat-sys-surface-container);
      padding: 1rem;
      box-shadow: var(--mat-sys-level1);
    }

    .home-header__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .home-brand {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .home-brand__icon {
      width: 1.75rem;
      height: 1.75rem;
      border-radius: var(--mat-sys-corner-small);
    }

    .home-brand__title {
      margin: 0;
      font: var(--mat-sys-title-large);
    }


    .mobile-only { display: inline-flex; }
    .desktop-only { display: none; }
    @media (min-width: 768px) {
      .mobile-only { display: none; }
      .desktop-only { display: inline-flex; }
    }

    .home-controls {
      align-items: center;
      gap: 0.5rem;
    }

    .home-icon-toggles {
      border: none;
      background: transparent;
    }

    .home-icon-toggles .mat-mdc-button-toggle {
      border: none !important;
      background: transparent;
    }

    .home-icon-toggles .mat-mdc-button-toggle:focus,
    .home-icon-toggles .mat-mdc-button-toggle:focus-visible {
      outline: none !important;
      box-shadow: none !important;
    }

    .home-icon-toggles .mat-mdc-button-toggle-checked {
      border: none !important;
      background: var(--mat-sys-surface-container);
    }

    .home-icon-toggles .mat-mdc-button-toggle-checked .mat-icon {
      color: var(--mat-sys-primary);
    }

    .home-icon-btn:focus,
    .home-icon-btn:focus-visible {
      outline: none !important;
      box-shadow: none !important;
    }

    .home-icon-toggles--full {
      width: 100%;
    }

    .home-icon-toggles--full .mat-mdc-button-toggle {
      flex: 1;
    }

    .home-controls-mobile {
      margin-top: 1rem;
      border-top: 1px solid var(--mat-sys-outline-variant);
      padding-top: 1rem;
    }

    .home-preset-toggle--full {
      width: 100%;
    }

    .home-preset-toggle--full mat-button-toggle {
      flex: 1;
    }

    .home-main {
      display: grid;
      gap: 1rem;
    }

    @media (min-width: 1024px) {
      .home-main {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    .home-card {
      padding: 0.25rem;
      box-shadow: var(--mat-sys-level4);
    }

    .home-card--create mat-card-content {
      padding-top: 0;
      padding-bottom: 0.5rem;
    }

    .home-card--create .home-card__meta {
      gap: 0.5rem;
    }

    .home-card--create .home-card__copy {
      margin: 0;
    }

    .home-card--create mat-card-actions {
      padding-top: 0.5rem;
    }

    .home-card__icon {
      vertical-align: middle;
      margin-right: 0.25rem;
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
    }

    .home-card__title {
      font: var(--mat-sys-display-small);
    }

    .home-card__meta {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .home-card__meta a {
      flex-shrink: 0;
    }

    .home-card__copy {
      margin: 0;
      font: var(--mat-sys-body-small);
      color: var(--mat-sys-on-surface-variant);
    }

    mat-card-actions.l-stack {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .home-cta {
      width: 100%;
    }

    @media (min-width: 640px) {
      mat-card-actions.l-stack {
        flex-direction: row;
        flex-wrap: wrap;
      }

      .home-cta {
        width: auto;
        flex: 1 1 0;
      }

      .home-card--create mat-card-actions {
        flex-direction: column;
      }

      .home-card--create mat-card-actions .home-cta {
        width: 100%;
        flex: none;
      }
    }

    .home-code-slots {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .home-code-slots--valid .home-code-slot {
      border-color: var(--app-color-success-fg);
      background: var(--app-color-success-bg);
    }

    .home-code-slot {
      width: 2.75rem;
      height: 2.75rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--mat-sys-corner-small);
      border: 1px solid var(--mat-sys-outline);
      background: var(--mat-sys-surface-container);
      font-weight: 600;
      font-size: 1.25rem;
      text-transform: uppercase;
    }

    @media (min-width: 640px) {
      .home-code-slot {
        width: 3rem;
        height: 3rem;
        font-size: 1.5rem;
      }
    }

    .home-code-help {
      margin: 0.75rem 0 0;
      font: var(--mat-sys-body-small);
      color: var(--mat-sys-on-surface-variant);
    }

    .home-code-field {
      width: 100%;
      margin-top: 0.75rem;
    }

    .home-code-field input {
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.25em;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 600;
      font-size: 1.1rem;
    }

    @media (min-width: 640px) {
      .home-code-field input {
        font-size: 1.2rem;
        letter-spacing: 0.35em;
      }
    }

    .home-error {
      margin: 0;
      color: var(--mat-sys-error);
      font: var(--mat-sys-body-small);
    }

    .home-spin {
      animation: home-spin 1s linear infinite;
    }

    @keyframes home-spin {
      to { transform: rotate(360deg); }
    }

    .home-grid mat-card {
      box-shadow: var(--mat-sys-level4);
    }

    .home-grid {
      margin-top: 1rem;
      display: grid;
      gap: 0.75rem;
    }

    @media (min-width: 640px) {
      .home-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (min-width: 1280px) {
      .home-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    .home-subcard__body {
      margin: 0;
      font: var(--mat-sys-body-small);
      color: var(--mat-sys-on-surface-variant);
    }

    .home-subcard__links {
      margin-top: 0.5rem;
    }

    .home-subcard__link {
      justify-content: flex-start;
    }

    .home-subcard__link-icon {
      margin-right: 0.35rem;
    }

    .home-subcard--status mat-card-content {
      margin-top: 0.75rem;
    }

    .home-subcard--status .home-subcard__body {
      margin-bottom: 0.5rem;
    }

    :host-context(html.preset-playful) {
      .home-header {
        background: linear-gradient(
          135deg,
          var(--mat-sys-surface-container),
          var(--mat-sys-tertiary-container)
        );
        border-color: var(--mat-sys-primary);
        box-shadow: var(--app-shadow-accent);
      }

      .home-brand__icon {
        border-radius: 50%;
      }

      .home-code-slot {
        border-radius: 50%;
      }

      .home-card__icon,
      .home-preset-icon--playful,
      .home-subcard__link-icon {
        color: var(--mat-sys-primary);
      }

      a[mat-stroked-button] .home-cta__icon {
        color: var(--mat-sys-primary);
      }

      .home-preset-icon--playful {
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
      }

      .home-card__icon {
        transform: scale(1.15);
      }

      .preset-toast {
        border-radius: 1.5rem;
        border-color: var(--mat-sys-primary);
      }
    }
  `],
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  @ViewChild('homeHeader') private readonly homeHeader?: ElementRef<HTMLElement>;
  @ViewChild('controlsToggleBtn') private readonly controlsToggleBtn?: ElementRef<HTMLButtonElement>;
  @ViewChild('sessionCodeInput') private readonly sessionCodeInput?: ElementRef<HTMLInputElement>;

  apiStatus = signal<string | null>(null);
  redisStatus = signal<string | null>(null);
  sessionCode = signal('');
  joinError = signal<string | null>(null);
  isJoining = signal(false);

  theme = signal<'system' | 'dark' | 'light'>('system');
  language = signal<'de' | 'en'>('de');
  preset = signal<'serious' | 'spielerisch'>('serious');
  controlsMenuOpen = signal(false);
  presetToastVisible = signal(false);
  presetToastTitle = signal('');
  presetToastOn = signal<string[]>([]);
  presetToastOff = signal<string[]>([]);
  presetToastHint = signal('');
  private presetToastTimer: ReturnType<typeof setTimeout> | null = null;

  isValidSessionCode = computed(() => /^[A-Z0-9]{6}$/.test(this.sessionCode()));
  codeSlots = computed(() => {
    const code = this.sessionCode().padEnd(6, ' ').slice(0, 6);
    return code.split('').map((c) => (c.trim() ? c : ''));
  });

  async ngOnInit(): Promise<void> {
    const storedTheme = localStorage.getItem('home-theme');
    if (storedTheme === 'system' || storedTheme === 'dark' || storedTheme === 'light') {
      this.theme.set(storedTheme);
    }
    this.applyTheme();

    const storedPreset = localStorage.getItem('home-preset');
    const preset = storedPreset === 'serioes' ? 'serious' : storedPreset; // Migration: serioes → serious
    if (preset === 'serious' || preset === 'spielerisch') {
      this.preset.set(preset);
      this.applyPreset();
      if (preset !== storedPreset) localStorage.setItem('home-preset', preset);
    }

    try {
      const health = await trpc.health.check.query();
      this.apiStatus.set(health.status);
      this.redisStatus.set(health.redis ?? null);
    } catch {
      this.apiStatus.set(null);
    }
  }

  ngOnDestroy(): void {
    if (this.presetToastTimer) {
      clearTimeout(this.presetToastTimer);
      this.presetToastTimer = null;
    }
  }

  onThemeChange(value: 'system' | 'dark' | 'light'): void {
    this.theme.set(value);
    localStorage.setItem('home-theme', value);
    this.applyTheme();
    this.closeControlsMenu();
  }

  setPreset(nextPreset: 'serious' | 'spielerisch', closeMenu = false): void {
    if (this.preset() !== nextPreset) {
      this.preset.set(nextPreset);
      localStorage.setItem('home-preset', nextPreset);
      this.applyPreset();
      this.showPresetToast(nextPreset);
    }
    if (closeMenu) this.closeControlsMenu();
  }

  toggleControlsMenu(): void {
    this.controlsMenuOpen.set(!this.controlsMenuOpen());
  }

  closeControlsMenu(restoreFocus = false): void {
    this.controlsMenuOpen.set(false);
    if (restoreFocus) {
      setTimeout(() => this.controlsToggleBtn?.nativeElement.focus(), 0);
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePressed(): void {
    if (this.controlsMenuOpen()) {
      this.closeControlsMenu(true);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.controlsMenuOpen()) return;
    const target = event.target as Node | null;
    if (!target) return;
    const insideHeader = this.homeHeader?.nativeElement.contains(target) ?? false;
    if (!insideHeader) {
      this.closeControlsMenu();
    }
  }

  onSessionCodeInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const normalized = target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    this.sessionCode.set(normalized);
    this.joinError.set(null);
  }

  async joinSession(): Promise<void> {
    if (this.isJoining()) return;
    const code = this.sessionCode().trim().toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(code)) {
      this.joinError.set('Bitte einen gültigen 6-stelligen Code eingeben.');
      this.sessionCodeInput?.nativeElement.focus();
      return;
    }
    this.joinError.set(null);
    this.isJoining.set(true);
    try {
      await this.router.navigate(['/session', code]);
    } finally {
      this.isJoining.set(false);
    }
  }

  private applyTheme(): void {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    const selected = this.theme();
    if (selected === 'dark') {
      root.classList.add('dark');
    } else if (selected === 'light') {
      root.classList.add('light');
    }
  }

  private applyPreset(): void {
    const root = document.documentElement;
    root.classList.toggle('preset-playful', this.preset() === 'spielerisch');
  }

  private showPresetToast(preset: 'serious' | 'spielerisch'): void {
    if (this.presetToastTimer) {
      clearTimeout(this.presetToastTimer);
      this.presetToastTimer = null;
    }
    if (preset === 'serious') {
      this.presetToastTitle.set('Preset: Seriös');
      this.presetToastOn.set(['Anonym']);
      this.presetToastOff.set(['Leaderboard', 'Sound', 'Belohnung', 'Motivation', 'Emoji']);
      this.presetToastHint.set('Antwortphase offen (kein Standard-Timer).');
    } else {
      this.presetToastTitle.set('Preset: Spielerisch');
      this.presetToastOn.set(['Leaderboard', 'Sound', 'Belohnung', 'Motivation', 'Emoji']);
      this.presetToastOff.set(['Anonym']);
      this.presetToastHint.set('');
    }
    this.presetToastVisible.set(true);
    this.presetToastTimer = setTimeout(() => {
      this.presetToastVisible.set(false);
      this.presetToastTimer = null;
    }, 7000);
  }
}
