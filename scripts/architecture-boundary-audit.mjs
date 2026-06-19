#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src');

const dangerousClientImports = [
  '@/lib/supabase/server',
  '@/server/auth',
  '@/lib/auth/require-member',
  'next/headers',
  'next/cache',
  'server-only',
];

const serverOnlyGlobs = [
  'src/lib/supabase/server.ts',
  'src/lib/auth/require-member.ts',
  'src/server/auth.ts',
];

const serverActionDir = path.join(SRC_DIR, 'server', 'actions');

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git'].includes(entry.name)) return [];
      return walk(full);
    }
    if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry.name)) return [full];
    return [];
  });
}

function rel(file) {
  return path.relative(ROOT, file).replaceAll(path.sep, '/');
}

function firstMeaningfulStatement(source) {
  return source
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('//'))[0] ?? '';
}

function isClientComponent(source) {
  const first = firstMeaningfulStatement(source).replace(/;$/, '');
  return first === "'use client'" || first === '"use client"';
}

function hasServerActionDirective(source) {
  const first = firstMeaningfulStatement(source).replace(/;$/, '');
  return first === "'use server'" || first === '"use server"';
}

const files = walk(SRC_DIR);
const failures = [];

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const relative = rel(file);

  if (isClientComponent(source)) {
    for (const importPath of dangerousClientImports) {
      if (source.includes(importPath)) {
        failures.push(`${relative}: client component imports server-only dependency (${importPath})`);
      }
    }
  }

  if (serverOnlyGlobs.includes(relative) && isClientComponent(source)) {
    failures.push(`${relative}: server-only module must not be marked as a client component`);
  }

  if (relative.startsWith('src/server/actions/') && !hasServerActionDirective(source)) {
    failures.push(`${relative}: server action module must start with 'use server'`);
  }
}

if (fs.existsSync(serverActionDir)) {
  for (const file of fs.readdirSync(serverActionDir)) {
    if (!/\.(ts|tsx)$/.test(file)) continue;
    const full = path.join(serverActionDir, file);
    const source = fs.readFileSync(full, 'utf8');
    if (source.includes('createBrowserClient') || source.includes('@/lib/supabase/client')) {
      failures.push(`${rel(full)}: server action must not use browser Supabase client`);
    }
  }
}

if (failures.length > 0) {
  console.error('Architecture boundary audit failed.');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Architecture boundary audit passed.');
