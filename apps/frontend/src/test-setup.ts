import '@analogjs/vitest-angular/setup-zone';

import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// jsdom cannot parse Angular Material's generated CSS and logs noisy
// "Could not parse CSS stylesheet" errors. Patch stderr to suppress them.
const _origStderrWrite = process.stderr.write.bind(process.stderr);
process.stderr.write = ((chunk: unknown, ...rest: unknown[]) => {
  if (typeof chunk === 'string' && chunk.includes('Could not parse CSS stylesheet')) return true;
  return (_origStderrWrite as (...a: unknown[]) => boolean)(chunk, ...rest);
}) as typeof process.stderr.write;

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
