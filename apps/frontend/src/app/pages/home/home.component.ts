import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { trpc } from '../../trpc.client';
import { ServerStatusWidgetComponent } from '../../components/server-status-widget/server-status-widget.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ServerStatusWidgetComponent],
  template: `
    <div
      class="min-h-screen px-4 py-6 text-slate-900 dark:text-slate-50 sm:px-6 lg:px-8"
      [ngClass]="rootToneClass()"
    >
      <div class="mx-auto max-w-6xl">
        @if (presetToastVisible()) {
          <div class="fixed bottom-4 right-4 z-[70] w-[min(92vw,24rem)] rounded-xl border border-slate-300 bg-white/95 p-3 text-sm shadow-xl dark:border-indigo-300/45 dark:bg-indigo-950/90">
            <p class="font-semibold text-slate-900 dark:text-slate-50">{{ presetToastTitle() }}</p>
            <p class="mt-1 text-xs text-slate-600 dark:text-slate-300">Preset-Wirkung</p>
            <div class="mt-2 flex flex-wrap gap-1.5">
              @for (item of presetToastOn(); track item) {
                <span class="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                  {{ item }} an
                </span>
              }
              @for (item of presetToastOff(); track item) {
                <span class="inline-flex items-center rounded-full border border-rose-500/35 bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-800 dark:bg-rose-900/35 dark:text-rose-200">
                  {{ item }} aus
                </span>
              }
            </div>
            @if (presetToastHint()) {
              <p class="mt-2 text-xs text-slate-700 dark:text-slate-200">{{ presetToastHint() }}</p>
            }
          </div>
        }

        <header
          #homeHeader
          class="relative z-50 mb-6 rounded-2xl border p-4 backdrop-blur"
          [ngClass]="headerToneClass()"
        >
          <div class="flex items-center justify-between gap-4">
            <div class="inline-flex items-center gap-2">
              <img src="assets/icons/favicon.svg" alt="" class="h-7 w-7 rounded-md" />
              <h1 class="text-xl font-semibold tracking-tight">arsnova.click <span class="text-sky-500 dark:text-sky-400">V3</span></h1>
            </div>

            <button
              #controlsToggleBtn
              type="button"
              class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white/80 text-slate-700 dark:border-indigo-300/30 dark:bg-indigo-950/55 dark:text-slate-200 md:hidden"
              [attr.aria-expanded]="controlsMenuOpen() ? 'true' : 'false'"
              aria-controls="home-controls-mobile"
              aria-label="Schalter öffnen"
              (click)="toggleControlsMenu()"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>

            <div class="hidden flex-wrap items-center gap-2 text-sm md:flex">
              <label class="inline-flex items-center gap-2 rounded-lg border px-2.5 py-2" [ngClass]="controlToneClass()">
                <svg class="h-4 w-4 text-slate-800 dark:text-slate-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.5M12 18.5V21M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M3 12h2.5M18.5 12H21M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
                <select
                  class="bg-transparent text-slate-900 outline-none dark:text-slate-100"
                  [value]="theme()"
                  (change)="onThemeChange(($any($event.target).value))"
                  aria-label="Theme auswählen"
                >
                  <option value="system">System</option>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </label>
              <label class="inline-flex items-center gap-2 rounded-lg border px-2.5 py-2" [ngClass]="controlToneClass()">
                <svg class="h-4 w-4 text-slate-800 dark:text-slate-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" />
                </svg>
                <select
                  class="bg-transparent text-slate-900 outline-none dark:text-slate-100"
                  [value]="language()"
                  (change)="language.set($any($event.target).value)"
                  aria-label="Sprache auswählen"
                >
                  <option value="de">DE</option>
                  <option value="en">EN</option>
                </select>
              </label>
              <div class="inline-flex items-center gap-1 rounded-lg border p-1" [ngClass]="controlToneClass()" aria-label="Preset auswählen">
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm"
                  [ngClass]="{
                    'bg-sky-500 text-slate-950': preset() === 'serioes',
                    'text-slate-800 hover:bg-slate-300 dark:text-slate-100 dark:hover:bg-indigo-800/80': preset() !== 'serioes',
                  }"
                  (click)="setPreset('serioes')"
                >
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3l7 3v5c0 4.6-2.9 8.6-7 10-4.1-1.4-7-5.4-7-10V6l7-3z" />
                  </svg>
                  <span>Seriös</span>
                </button>
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm"
                  [ngClass]="{
                    'bg-fuchsia-500 text-slate-950': preset() === 'spielerisch',
                    'text-slate-800 hover:bg-slate-300 dark:text-slate-100 dark:hover:bg-indigo-800/80': preset() !== 'spielerisch',
                  }"
                  (click)="setPreset('spielerisch')"
                >
                  <svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2l2.1 5.3L20 9.4l-4.5 3.7L16.8 19 12 15.8 7.2 19l1.3-5.9L4 9.4l5.9-2.1L12 2z" />
                  </svg>
                  <span>Spielerisch</span>
                </button>
              </div>
            </div>
          </div>

          @if (controlsMenuOpen()) {
            <div id="home-controls-mobile" class="mt-4 grid gap-2 border-t border-slate-400/70 pt-4 dark:border-indigo-300/40 md:hidden">
              <label class="inline-flex items-center justify-between gap-2 rounded-lg border px-3 py-2" [ngClass]="controlToneClass()">
                <svg class="h-4 w-4 text-slate-800 dark:text-slate-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.5M12 18.5V21M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M3 12h2.5M18.5 12H21M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
                <select
                  #mobileThemeSelect
                  class="bg-transparent text-slate-900 outline-none dark:text-slate-100"
                  [value]="theme()"
                  (change)="onThemeChange(($any($event.target).value))"
                  aria-label="Theme auswählen"
                >
                  <option value="system">System</option>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </label>

              <label class="inline-flex items-center justify-between gap-2 rounded-lg border px-3 py-2" [ngClass]="controlToneClass()">
                <svg class="h-4 w-4 text-slate-800 dark:text-slate-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" />
                </svg>
                <select
                  class="bg-transparent text-slate-900 outline-none dark:text-slate-100"
                  [value]="language()"
                  (change)="language.set($any($event.target).value)"
                  aria-label="Sprache auswählen"
                >
                  <option value="de">DE</option>
                  <option value="en">EN</option>
                </select>
              </label>

              <div class="inline-flex items-center gap-1 rounded-lg border p-1" [ngClass]="controlToneClass()" aria-label="Preset auswählen">
                <button
                  type="button"
                  class="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm"
                  [ngClass]="{
                    'bg-sky-500 text-slate-950': preset() === 'serioes',
                    'text-slate-800 hover:bg-slate-300 dark:text-slate-100 dark:hover:bg-indigo-800/80': preset() !== 'serioes',
                  }"
                  (click)="setPreset('serioes', true)"
                >
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3l7 3v5c0 4.6-2.9 8.6-7 10-4.1-1.4-7-5.4-7-10V6l7-3z" />
                  </svg>
                  <span>Seriös</span>
                </button>
                <button
                  type="button"
                  class="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm"
                  [ngClass]="{
                    'bg-fuchsia-500 text-slate-950': preset() === 'spielerisch',
                    'text-slate-800 hover:bg-slate-300 dark:text-slate-100 dark:hover:bg-indigo-800/80': preset() !== 'spielerisch',
                  }"
                  (click)="setPreset('spielerisch', true)"
                >
                  <svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2l2.1 5.3L20 9.4l-4.5 3.7L16.8 19 12 15.8 7.2 19l1.3-5.9L4 9.4l5.9-2.1L12 2z" />
                  </svg>
                  <span>Spielerisch</span>
                </button>
              </div>
            </div>
          }
        </header>

        <main class="grid gap-4 lg:grid-cols-2">
          <section
            class="rounded-2xl border p-6 backdrop-blur"
            [ngClass]="panelToneClass()"
          >
            <p class="mb-2 inline-flex items-center gap-1.5 text-sm text-slate-800 dark:text-slate-200">
              <svg [ngClass]="[compactIconClass(), iconToneClass()]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l9-4 9 4-9 4-9-4zM7 10.5V14c0 1.7 2.7 3 5 3s5-1.3 5-3v-3.5" />
              </svg>
              Lehrkraft
            </p>
            <h2 class="mb-6 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Erstellen</h2>
            <div class="mb-4 flex items-start justify-between gap-3">
              <p class="text-sm text-slate-800 dark:text-slate-200">Neue Session für Kurs oder Q&amp;A in wenigen Klicks.</p>
              <a
                href="https://github.com/arsnova-dev/arsnova-click-v3/blob/main/docs/onboarding.md"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-slate-200 dark:hover:bg-indigo-900/60"
                [ngClass]="{
                  'border-slate-400 text-slate-800 dark:border-indigo-300/40 dark:text-slate-100': preset() === 'serioes',
                  'border-fuchsia-400/70 text-fuchsia-800 dark:border-fuchsia-300/60 dark:text-fuchsia-200': preset() === 'spielerisch',
                }"
              >
                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-.8.7-1.7 1.3-1.7 2.2v.5M12 17h.01" />
                </svg>
                Hilfe
              </a>
            </div>
            <a
              routerLink="/quiz"
              class="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-semibold text-slate-950 transition active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900"
              [ngClass]="{
                'bg-sky-500 hover:bg-sky-400 focus:ring-sky-400': preset() === 'serioes',
                'bg-gradient-to-r from-fuchsia-400 via-amber-300 to-sky-300 hover:brightness-105 focus:ring-fuchsia-300 shadow-[0_10px_30px_-14px_rgba(217,70,239,1)]': preset() === 'spielerisch',
              }"
            >
              @if (preset() === 'serioes') {
                <svg class="h-4 w-4 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3l7 3v5c0 4.6-2.9 8.6-7 10-4.1-1.4-7-5.4-7-10V6l7-3z" />
                </svg>
              } @else {
                <svg class="h-6 w-6 text-fuchsia-900 drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2l2.4 6 6.2.5-4.7 4 1.5 6-5.4-3.5-5.4 3.5 1.5-6-4.7-4 6.2-.5L12 2z" />
                </svg>
              }
              Session erstellen
            </a>
            <div class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <a
                routerLink="/quiz"
                class="inline-flex min-h-11 items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-slate-200 dark:hover:bg-indigo-900/60"
                [ngClass]="{
                  'border-slate-400 text-slate-800 dark:border-indigo-300/40 dark:text-slate-100': preset() === 'serioes',
                  'border-fuchsia-400/70 text-fuchsia-800 dark:border-fuchsia-300/60 dark:text-fuchsia-200': preset() === 'spielerisch',
                }"
              >
                Quiz wählen
              </a>
              <a
                routerLink="/quiz"
                class="inline-flex min-h-11 items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-slate-200 dark:hover:bg-indigo-900/60"
                [ngClass]="{
                  'border-slate-400 text-slate-800 dark:border-indigo-300/40 dark:text-slate-100': preset() === 'serioes',
                  'border-fuchsia-400/70 text-fuchsia-800 dark:border-fuchsia-300/60 dark:text-fuchsia-200': preset() === 'spielerisch',
                }"
              >
                Q&amp;A
              </a>
            </div>
          </section>

          <section
            id="student-entry"
            class="rounded-2xl border p-6 backdrop-blur"
            [ngClass]="panelToneClass()"
          >
            <p class="mb-2 inline-flex items-center gap-1.5 text-sm text-slate-800 dark:text-slate-200">
              <svg [ngClass]="[compactIconClass(), iconToneClass()]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11" />
              </svg>
              Student/in
            </p>
            <h2 class="mb-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Beitreten</h2>
            <div class="mb-2 flex flex-wrap gap-2" aria-hidden="true">
              @for (char of codeSlots(); track $index) {
                <span class="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-slate-400 bg-slate-100/95 text-xl font-semibold uppercase text-slate-900 dark:border-indigo-300/50 dark:bg-indigo-900/75 dark:text-slate-50 sm:h-12 sm:w-12 sm:text-2xl">
                  {{ char || '·' }}
                </span>
              }
            </div>
            <p class="mb-3 text-sm text-slate-800 dark:text-slate-200">A–Z, 0–9 · 6 Zeichen</p>
            <label for="session-code" class="sr-only">Session-Code</label>
            <input
              #sessionCodeInput
              id="session-code"
              type="text"
              maxlength="6"
              [value]="sessionCode()"
              (input)="onSessionCodeInput($event)"
              (keydown.enter)="joinSession()"
              placeholder="A7K9P2"
              class="mb-3 w-full rounded-xl border border-slate-400 bg-white px-4 py-3 text-center text-lg font-mono uppercase tracking-[0.25em] text-slate-900 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-indigo-300/50 dark:bg-indigo-950/75 dark:text-slate-50 sm:text-xl sm:tracking-[0.35em]"
              aria-label="Session-Code eingeben"
              autocapitalize="characters"
              autocomplete="off"
              spellcheck="false"
            />
            <button
              type="button"
              (click)="joinSession()"
              [disabled]="!isValidSessionCode() || isJoining()"
              class="inline-flex min-h-12 w-full items-center justify-center rounded-xl px-4 py-3 text-base font-semibold text-slate-950 transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900"
              [ngClass]="{
                'bg-sky-500 hover:bg-sky-400 focus:ring-sky-400': preset() === 'serioes',
                'bg-gradient-to-r from-amber-300 via-fuchsia-300 to-sky-300 hover:brightness-105 focus:ring-fuchsia-300 shadow-[0_10px_30px_-14px_rgba(56,189,248,1)]': preset() === 'spielerisch',
              }"
              aria-label="Session beitreten"
            >
              @if (isJoining()) {
                @if (preset() === 'serioes') {
                  <svg class="h-4 w-4 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3l7 3v5c0 4.6-2.9 8.6-7 10-4.1-1.4-7-5.4-7-10V6l7-3z" />
                  </svg>
                } @else {
                  <svg class="h-6 w-6 animate-spin text-fuchsia-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                    <circle cx="12" cy="12" r="8" class="opacity-30" />
                    <path stroke-linecap="round" d="M20 12a8 8 0 0 0-8-8" />
                  </svg>
                }
                <span>Beitreten…</span>
              } @else {
                @if (preset() === 'serioes') {
                  <svg class="h-4 w-4 text-slate-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3l7 3v5c0 4.6-2.9 8.6-7 10-4.1-1.4-7-5.4-7-10V6l7-3z" />
                  </svg>
                } @else {
                  <svg class="h-6 w-6 text-fuchsia-900 drop-shadow-[0_0_10px_rgba(217,70,239,0.5)]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2l1.9 4.7L19 8.4l-3.8 3.1L16.4 16 12 13.3 7.6 16l1.2-4.5L5 8.4l5.1-1.7L12 2z" />
                  </svg>
                }
                <span>Beitreten</span>
              }
            </button>
            @if (joinError()) {
              <p class="mt-2 text-sm text-rose-600 dark:text-rose-400" role="alert">{{ joinError() }}</p>
            }
          </section>
        </main>

        <section class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article
            class="rounded-xl border p-4"
            [ngClass]="subCardToneClass()"
          >
            <h3 class="inline-flex items-center gap-1.5 text-lg font-semibold">
              <svg [ngClass]="[compactIconClass(), iconToneClass()]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h13a2 2 0 0 1 2 2v10H6a2 2 0 0 0-2 2V6zM6 18h13M6 6v12" />
              </svg>
              Bibliothek
            </h3>
            <p class="mt-1 text-sm text-slate-800 dark:text-slate-200">Lokal & Vorlagen</p>
          </article>
          <article
            class="rounded-xl border p-4"
            [ngClass]="subCardToneClass()"
          >
            <h3 class="inline-flex items-center gap-1.5 text-lg font-semibold">
              <svg [ngClass]="[compactIconClass(), iconToneClass()]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <circle cx="12" cy="12" r="2.5" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 12a8 8 0 0 1 8-8M20 12a8 8 0 0 0-8-8M4 12a8 8 0 0 0 8 8M20 12a8 8 0 0 1-8 8" />
              </svg>
              Live
            </h3>
            <p class="mt-1 text-sm text-slate-800 dark:text-slate-200">
              @if (apiStatus()) {
                Backend online
              } @else {
                Verbinde…
              }
            </p>
          </article>
          <article
            class="rounded-xl border p-4"
            [ngClass]="subCardToneClass()"
          >
            <h3 class="mb-2 inline-flex items-center gap-1.5 text-lg font-semibold">
              <svg [ngClass]="[compactIconClass(), iconToneClass()]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <rect x="3" y="4" width="18" height="6" rx="1.5" />
                <rect x="3" y="14" width="18" height="6" rx="1.5" />
                <path stroke-linecap="round" d="M7 7h.01M7 17h.01" />
              </svg>
              Status
            </h3>
            <app-server-status-widget />
          </article>
          <article
            class="rounded-xl border p-4"
            [ngClass]="subCardToneClass()"
          >
            <h3 class="inline-flex items-center gap-1.5 text-lg font-semibold">
              <svg [ngClass]="[compactIconClass(), iconToneClass()]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" />
              </svg>
              Start
            </h3>
            <div class="mt-1 space-y-1 text-sm">
              <a routerLink="/quiz" class="block text-sky-700 hover:text-sky-600 hover:underline dark:text-sky-300 dark:hover:text-sky-200">
                @if (preset() === 'serioes') {
                  <svg class="inline-block text-slate-700 dark:text-slate-200" [ngClass]="compactIconClass()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3l7 3v5c0 4.6-2.9 8.6-7 10-4.1-1.4-7-5.4-7-10V6l7-3z" />
                  </svg>
                } @else {
                  <svg class="inline-block text-fuchsia-700 dark:text-fuchsia-300 drop-shadow-[0_0_8px_rgba(217,70,239,0.55)]" [ngClass]="iconClass()" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2l2.1 5.3L20 9.4l-4.5 3.7L16.8 19 12 15.8 7.2 19l1.3-5.9L4 9.4l5.9-2.1L12 2z" />
                  </svg>
                }
                <span class="ml-1">Neues Quiz</span>
              </a>
              <a href="#student-entry" class="block text-sky-700 hover:text-sky-600 hover:underline dark:text-sky-300 dark:hover:text-sky-200">
                @if (preset() === 'serioes') {
                  <svg class="inline-block text-slate-700 dark:text-slate-200" [ngClass]="compactIconClass()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3l7 3v5c0 4.6-2.9 8.6-7 10-4.1-1.4-7-5.4-7-10V6l7-3z" />
                  </svg>
                } @else {
                  <svg class="inline-block text-fuchsia-700 dark:text-fuchsia-300 drop-shadow-[0_0_8px_rgba(217,70,239,0.55)]" [ngClass]="iconClass()" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2l2.4 6 6.2.5-4.7 4 1.5 6-5.4-3.5-5.4 3.5 1.5-6-4.7-4 6.2-.5L12 2z" />
                  </svg>
                }
                <span class="ml-1">Beitreten</span>
              </a>
            </div>
          </article>
        </section>
      </div>
    </div>
  `,
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  @ViewChild('homeHeader') private readonly homeHeader?: ElementRef<HTMLElement>;
  @ViewChild('controlsToggleBtn') private readonly controlsToggleBtn?: ElementRef<HTMLButtonElement>;
  @ViewChild('mobileThemeSelect') private readonly mobileThemeSelect?: ElementRef<HTMLSelectElement>;
  @ViewChild('sessionCodeInput') private readonly sessionCodeInput?: ElementRef<HTMLInputElement>;

  apiStatus = signal<string | null>(null);
  redisStatus = signal<string | null>(null);
  sessionCode = signal('');
  joinError = signal<string | null>(null);
  isJoining = signal(false);

  theme = signal<'system' | 'dark' | 'light'>('system');
  resolvedTheme = signal<'dark' | 'light'>('dark');
  language = signal<'de' | 'en'>('de');
  preset = signal<'serioes' | 'spielerisch'>('serioes');
  controlsMenuOpen = signal(false);
  presetToastVisible = signal(false);
  presetToastTitle = signal('');
  presetToastOn = signal<string[]>([]);
  presetToastOff = signal<string[]>([]);
  presetToastHint = signal('');
  isDarkTheme = computed(() => this.resolvedTheme() === 'dark');
  isPlayful = computed(() => this.preset() === 'spielerisch');
  iconClass = computed(() => (this.isPlayful() ? 'h-6 w-6' : 'h-4 w-4'));
  compactIconClass = computed(() => (this.isPlayful() ? 'h-5 w-5' : 'h-4 w-4'));
  iconToneClass = computed(() =>
    this.isPlayful() ? 'text-fuchsia-700 dark:text-fuchsia-300 drop-shadow-[0_0_8px_rgba(217,70,239,0.55)]' : 'text-slate-700 dark:text-slate-200'
  );
  uiMode = computed(() => `${this.isDarkTheme() ? 'dark' : 'light'}-${this.preset()}`);
  rootToneClass = computed(() => {
    switch (this.uiMode()) {
      case 'light-serioes':
        return 'bg-slate-100';
      case 'dark-serioes':
        return 'bg-indigo-950';
      case 'light-spielerisch':
        return 'bg-gradient-to-br from-fuchsia-100 via-violet-100 to-sky-100';
      default:
        return 'bg-gradient-to-br from-fuchsia-950 via-violet-900 to-sky-900';
    }
  });
  headerToneClass = computed(() => {
    switch (this.uiMode()) {
      case 'light-serioes':
        return 'border-slate-300 bg-white';
      case 'dark-serioes':
        return 'border-indigo-300/40 bg-indigo-900/70';
      case 'light-spielerisch':
        return 'border-fuchsia-300 bg-white shadow-[0_0_24px_-20px_rgba(217,70,239,0.55)]';
      default:
        return 'border-fuchsia-300/50 bg-violet-950/70 shadow-[0_0_36px_-22px_rgba(217,70,239,0.8)]';
    }
  });
  panelToneClass = computed(() => {
    switch (this.uiMode()) {
      case 'light-serioes':
        return 'border-slate-300 bg-white';
      case 'dark-serioes':
        return 'border-indigo-300/40 bg-indigo-900/70';
      case 'light-spielerisch':
        return 'border-fuchsia-300 bg-white';
      default:
        return 'border-fuchsia-300/50 bg-violet-950/70';
    }
  });
  subCardToneClass = computed(() => {
    switch (this.uiMode()) {
      case 'light-serioes':
        return 'border-slate-300 bg-white';
      case 'dark-serioes':
        return 'border-indigo-300/35 bg-indigo-900/65';
      case 'light-spielerisch':
        return 'border-fuchsia-300 bg-white';
      default:
        return 'border-fuchsia-300/45 bg-violet-950/65';
    }
  });
  controlToneClass = computed(() => {
    switch (this.uiMode()) {
      case 'light-serioes':
        return 'border-slate-300 bg-white';
      case 'dark-serioes':
        return 'border-indigo-300/45 bg-indigo-900/70';
      case 'light-spielerisch':
        return 'border-fuchsia-300 bg-white';
      default:
        return 'border-fuchsia-300/45 bg-violet-950/70';
    }
  });
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

  setPreset(nextPreset: 'serioes' | 'spielerisch', closeMenu = false): void {
    if (this.preset() !== nextPreset) {
      this.preset.set(nextPreset);
      this.showPresetToast(nextPreset);
    }
    if (closeMenu) this.closeControlsMenu();
  }

  toggleControlsMenu(): void {
    const nextOpen = !this.controlsMenuOpen();
    this.controlsMenuOpen.set(nextOpen);
    if (nextOpen) {
      setTimeout(() => this.mobileThemeSelect?.nativeElement.focus(), 0);
    }
  }

  closeControlsMenu(restoreFocus = false): void {
    this.controlsMenuOpen.set(false);
    if (restoreFocus) {
      setTimeout(() => this.controlsToggleBtn?.nativeElement.focus(), 0);
    }
  }

  private showPresetToast(preset: 'serioes' | 'spielerisch'): void {
    if (this.presetToastTimer) {
      clearTimeout(this.presetToastTimer);
      this.presetToastTimer = null;
    }
    if (preset === 'serioes') {
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
    const selected = this.theme();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const useDark = selected === 'dark' || (selected === 'system' && prefersDark);
    this.resolvedTheme.set(useDark ? 'dark' : 'light');
    root.classList.toggle('dark', useDark);
  }
}
