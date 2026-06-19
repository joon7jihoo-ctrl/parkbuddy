#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src');
const errors = [];
const warnings = [];

function exists(relPath) {
  return fs.existsSync(path.join(ROOT, relPath));
}

function read(relPath) {
  const fullPath = path.join(ROOT, relPath);
  return fs.existsSync(fullPath) ? fs.readFileSync(fullPath, 'utf8') : '';
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
      files.push(...walk(full));
    } else if (/\.(tsx|ts|css)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function hasAny(content, patterns) {
  return patterns.some((pattern) => content.includes(pattern));
}

const INTENTIONAL_FORM_PAGE_EXCEPTIONS = new Map([
  [
    'src/app/(app)/admin/rounds/deleted/page.tsx',
    'Deleted round restore controls use multiple per-item actions, not a single submit CTA.',
  ],
  [
    'src/app/(app)/admin/rounds/[id]/pairings/page.tsx',
    'Pairing management already has a custom sticky save flow and multiple assignment controls.',
  ],
  [
    'src/app/(app)/admin/rounds/[id]/participants/page.tsx',
    'Participant management already has a custom sticky save flow and selection controls.',
  ],
  [
    'src/app/(app)/board/page.tsx',
    'Board forms are search/filter controls, not save forms.',
  ],
  [
    'src/app/(app)/schedule/page.tsx',
    'Schedule contains poll and round creation actions that should not be collapsed into one submit CTA.',
  ],
  [
    'src/app/(auth)/login/page.tsx',
    'Login contains multiple authentication methods and should keep separate action buttons.',
  ],
]);

function assertFile(relPath, reason) {
  if (!exists(relPath)) errors.push(`${relPath} is missing. ${reason}`);
}

function assertContains(relPath, tokens, reason) {
  const content = read(relPath);
  for (const token of tokens) {
    if (!content.includes(token)) errors.push(`${relPath} does not contain ${token}. ${reason}`);
  }
}

assertFile('src/components/AppShell.tsx', 'Global app shell is required for consistent mobile UX.');
assertFile('src/components/PageQuickActions.tsx', 'Shared quick actions are required for consistent bottom CTA behavior.');
assertFile('src/components/SubmitButton.tsx', 'Shared submit button is required for sticky form actions.');
assertFile('src/components/TopBar.tsx', 'Shared top bar is required for sticky header behavior.');
assertFile('src/app/globals.css', 'Global dense/sticky CSS is required.');

assertContains('src/components/AppShell.tsx', ['PageQuickActions'], 'AppShell must include quick actions.');
assertContains('src/components/SubmitButton.tsx', ['parkbuddy-sticky-cta', 'data-parkbuddy-sticky-cta'], 'SubmitButton must use the standard sticky CTA wrapper.');
assertContains('src/components/PageQuickActions.tsx', ['parkbuddy-sticky-cta', 'data-parkbuddy-quick-actions'], 'Quick actions must use the standard sticky CTA wrapper.');
assertContains('src/components/TopBar.tsx', ['pb-sticky-top'], 'TopBar must use the shared sticky top class.');
assertContains('src/app/globals.css', ['.pb-sticky-top', 'position: sticky'], 'Global CSS must define the sticky top behavior.');
assertContains('src/app/globals.css', ['parkbuddy-sticky-cta','parkbuddy-sticky-cta__inner','safe-area-inset-bottom','pb-dense-card','min-height: 44px'], 'Global CSS must keep sticky CTA, safe-area, dense card, and touch target rules.');

const appLayout = read('src/app/(app)/layout.tsx');
if (appLayout && !appLayout.includes('AppShell')) {
  errors.push('src/app/(app)/layout.tsx must render AppShell so dense/sticky UX is applied consistently.');
}

const files = walk(SRC_DIR);
const tsxFiles = files.filter((file) => file.endsWith('.tsx'));
const pageFiles = tsxFiles.filter((file) => rel(file).includes('/page.tsx'));

for (const file of tsxFiles) {
  const text = fs.readFileSync(file, 'utf8');
  const relative = rel(file);
  const isClient = /^["']use client["'];?/.test(text.trim());
  if (!isClient && /\b(window|document|localStorage|sessionStorage)\b/.test(text)) {
    errors.push(`${relative} uses browser globals without 'use client'. Move browser-only logic into a client component.`);
  }
  if (relative.includes('/page.tsx') && isClient) {
    warnings.push(`${relative} is a Client page. Prefer a Server page with smaller client components when practical.`);
  }
  if (/<img\s/i.test(text) && !text.includes('next/image')) {
    warnings.push(`${relative} uses a raw <img>. Consider next/image for user-uploaded or large images.`);
  }
}

const formPages = pageFiles.filter((file) => {
  const text = fs.readFileSync(file, 'utf8');
  return /<form\b|action=\{|<SubmitButton\b/.test(text);
});
for (const file of formPages) {
  const text = fs.readFileSync(file, 'utf8');
  const relative = rel(file);
  if (INTENTIONAL_FORM_PAGE_EXCEPTIONS.has(relative)) continue;

  if (!hasAny(text, ['<SubmitButton', 'parkbuddy-sticky-cta', 'data-parkbuddy-sticky-cta'])) {
    warnings.push(`${relative} contains a form but does not use the shared sticky SubmitButton/CTA wrapper.`);
  }
}

const routeLikePages = pageFiles.filter((file) => !rel(file).includes('/print/'));
let pagesWithVisibleTitle = 0;
for (const file of routeLikePages) {
  const text = fs.readFileSync(file, 'utf8');
  if (/<h1\b|<h2\b|title=|aria-label=/.test(text)) pagesWithVisibleTitle += 1;
}
if (routeLikePages.length > 0 && pagesWithVisibleTitle / routeLikePages.length < 0.8) {
  warnings.push('Less than 80% of pages expose an obvious title/label. Review mobile sticky header context.');
}

const clientComponentCount = tsxFiles.filter((file) => /^["']use client["'];?/.test(fs.readFileSync(file, 'utf8').trim())).length;
const clientRatio = tsxFiles.length === 0 ? 0 : clientComponentCount / tsxFiles.length;
if (clientRatio > 0.45) {
  warnings.push(`Client component ratio is ${(clientRatio * 100).toFixed(1)}%. Keep pages/server data fetching server-first when adding features.`);
}

if (warnings.length) {
  console.log('Performance/Dense UX audit warnings:');
  for (const warning of warnings) console.log(`- ${warning}`);
  console.log('');
}

if (errors.length) {
  console.error('Performance/Dense UX audit failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Performance/Dense UX audit passed.');
