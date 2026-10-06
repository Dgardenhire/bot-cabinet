import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const root = new URL('../../', import.meta.url);
const collection = JSON.parse(readFileSync(new URL('public/downloads/specialists/collection.json', root), 'utf8'));
const index = JSON.parse(readFileSync(new URL('src/data/specialist-index.json', root), 'utf8'));
const starters = readFileSync(new URL('src/data/starter-bots.ts', root), 'utf8');
const crews = readFileSync(new URL('src/data/crew-kits.ts', root), 'utf8');
const hasSlug = (source, slug) => new RegExp(`(?:"slug"|slug):\\s*"${slug}"`).test(source);

test('18 original specialists, six new crews, four extensions; no duplicate starters', () => {
  assert.equal(collection.bots.length, 18);
  assert.equal(collection.crews.filter(c => !c.extends).length, 6);
  assert.equal(collection.crews.filter(c => c.extends).length, 4);
  assert.equal(new Set(collection.bots.map(b => b.slug)).size, 18);
  for (const bot of collection.bots) assert.ok(!hasSlug(starters, bot.slug));
  assert.deepEqual(index, collection.bots.map(({ slug, name, summary, category }) => ({ slug, name, summary, category })));
});

test('instructions have usable tasks and honest, preserved exercise evidence', () => {
  assert.ok(!JSON.stringify(collection).includes('/Users/'));
  for (const bot of collection.bots) {
    assert.ok(bot.instructions.startsWith(`You are ${bot.name}.`));
    assert.ok(bot.inputs && bot.task && bot.checklist.length >= 4);
    assert.equal(bot.evidence.nativeAppTest, false);
    assert.equal(bot.evidence.task, bot.task);
    assert.ok(bot.evidence.actualAnswer);
    assert.ok(bot.evidence.checks.every(c => ['pass', 'fail', 'not-checked'].includes(c.status)));
  }
  const deal = collection.bots.find(b => b.slug === 'deal-reviewer');
  assert.ok(deal.evidence.checks.some(c => c.status === 'fail'));
  assert.ok(deal.evidence.revisedAttempt);
});

test('crew roles resolve and setup retains limits, originals, and manual handoffs', () => {
  for (const crew of collection.crews) {
    if (crew.extends) assert.ok(hasSlug(crews, crew.extends));
    assert.ok(crew.roles.length >= 3 && crew.handoffs && crew.task && crew.limits);
    assert.ok(crew.checklist.length >= 4);
    for (const role of crew.roles) assert.ok(collection.bots.some(b => b.slug === role.slug) || hasSlug(starters, role.slug), role.slug);
    assert.ok(crew.setup.length >= 4);
    assert.ok(crew.source.startsWith('https://'));
  }
});
