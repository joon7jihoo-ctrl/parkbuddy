#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const migrationsDir = join(root, 'supabase', 'migrations');

const expectedTables = [
  'members',
  'member_action_logs',
  'rounds',
  'round_participants',
  'round_pairings',
  'round_scores',
  'round_hole_scores',
  'events',
  'event_votes',
  'posts',
  'post_attachments',
];

function walkSqlFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkSqlFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.sql')) {
      files.push(fullPath);
    }
  }
  return files;
}

function normalize(sql) {
  return sql
    .replace(/--.*$/gm, ' ')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function hasRlsEnabled(sql, tableName) {
  const escaped = tableName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`alter\\s+table(?:\\s+if\\s+exists)?\\s+(?:public\\.)?${escaped}\\s+enable\\s+row\\s+level\\s+security`).test(sql);
}

function hasPolicy(sql, tableName) {
  const escaped = tableName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`create\\s+policy[\\s\\S]{0,500}?on\\s+(?:public\\.)?${escaped}(?:\\s|;)`).test(sql);
}

function hasTableMention(sql, tableName) {
  const escaped = tableName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?:create|alter)\\s+table(?:\\s+if\\s+not\\s+exists|\\s+if\\s+exists)?\\s+(?:public\\.)?${escaped}(?:\\s|\\()`).test(sql);
}

if (!statSync(migrationsDir, { throwIfNoEntry: false })?.isDirectory()) {
  console.error('RLS audit failed: supabase/migrations directory was not found.');
  process.exit(1);
}

const sql = walkSqlFiles(migrationsDir)
  .map((file) => readFileSync(file, 'utf8'))
  .join('\n\n');
const normalized = normalize(sql);

const rows = expectedTables.map((tableName) => ({
  tableName,
  present: hasTableMention(normalized, tableName),
  rls: hasRlsEnabled(normalized, tableName),
  policy: hasPolicy(normalized, tableName),
}));

const missing = rows.filter((row) => row.present && (!row.rls || !row.policy));
const securityDefinerFunctions = [...normalized.matchAll(/create\s+(?:or\s+replace\s+)?function\s+([a-z0-9_."]+)/g)].map((match) => match[1]);
const securityDefinerCount = (normalized.match(/security\s+definer/g) ?? []).length;
const riskyGrants = [...normalized.matchAll(/grant\s+(?:all|insert|update|delete)\s+on\s+(?:table\s+)?(?:public\.)?([a-z0-9_"]+)\s+to\s+(public|anon)/g)].map(
  (match) => `${match[1]} -> ${match[2]}`,
);

console.log('ParkBuddy RLS/RPC migration audit');
console.log('--------------------------------');
for (const row of rows) {
  const status = !row.present ? 'not-found' : row.rls && row.policy ? 'ok' : 'check';
  console.log(`${status.padEnd(9)} ${row.tableName.padEnd(24)} rls=${row.rls ? 'yes' : 'no'} policy=${row.policy ? 'yes' : 'no'}`);
}
console.log('--------------------------------');
console.log(`security definer occurrences: ${securityDefinerCount}`);
console.log(`function declarations scanned: ${securityDefinerFunctions.length}`);

if (riskyGrants.length > 0) {
  console.error('Potentially risky grants to public/anon were found:');
  for (const grant of riskyGrants) console.error(`- ${grant}`);
  process.exit(1);
}

if (missing.length > 0) {
  console.error('Tables present in migrations without both RLS and at least one policy:');
  for (const row of missing) {
    console.error(`- ${row.tableName}: rls=${row.rls ? 'yes' : 'no'}, policy=${row.policy ? 'yes' : 'no'}`);
  }
  process.exit(1);
}

console.log('RLS/RPC migration audit passed.');
