import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const world = readFileSync(join(root, 'src/components/PharmacyWorld.tsx'), 'utf8');
const styles = readFileSync(join(root, 'src/components/PharmacyWorld.css'), 'utf8');
const page = readFileSync(join(root, 'src/app/page.tsx'), 'utf8');

test('homepage uses a varied editorial scroll grammar', () => {
  assert.match(world, /data-scroll-grammar=["']editorial-journey["']/);
  assert.match(world, /className=["']ql-hero["']/);
  assert.match(world, /className=["']ql-care-rail["']/);
  assert.match(world, /className=["']ql-story-grid["']/);
  assert.match(world, /className=["']ql-visit["']/);
  assert.doesNotMatch(world, /data-sc-mode=["']worldflight["']/);
  assert.doesNotMatch(page, /<Header/);
});

test('primary navigation and calls to action expose the pharmacy essentials', () => {
  assert.match(world, /aria-label=["']Primary navigation["']/);
  assert.match(world, /href=["']#services["']/);
  assert.match(world, /href=["']#minor-ailments["']/);
  assert.match(world, /href=["']#visit["']/);
  assert.match(world, /const PHONE_HREF = `tel:/);
  assert.match(world, /href=\{`mailto:/);
});

test('optimized media and scoped GSAP drive meaningful scroll motion', () => {
  assert.match(world, /from ['"]next\/image['"]/);
  assert.match(world, /from ['"]@gsap\/react['"]/);
  assert.match(world, /ScrollTrigger/);
  assert.match(world, /prefers-reduced-motion: no-preference/);
  assert.match(world, /scope: root/);
});

test('service rail converts vertical scroll to horizontal motion on mobile', () => {
  assert.match(
    world,
    /media\.add\('\(prefers-reduced-motion: no-preference\)',[\s\S]*?const rail = document\.querySelector<HTMLElement>\('\.ql-care-rail'\)/,
  );
  assert.doesNotMatch(world, /media\.add\('\(min-width: 801px\)[\s\S]*?\.ql-care-rail/);
  assert.match(
    styles,
    /@media \(max-width: 800px\)[\s\S]*?\.ql-care-rail\s*\{[\s\S]*?width:\s*max-content;[\s\S]*?overflow-x:\s*visible;/,
  );
});

test('signature move is a full-scale care label, not tiny fixed chrome', () => {
  assert.match(world, /className=["']ql-care-label/);
  assert.match(world, /className=["']ql-care-field/);
  assert.match(world, /care-label-progress/);
  assert.doesNotMatch(styles, /\.care-card\s*\{\s*position:\s*fixed/);
});

test('responsive and accessible interaction rules are present', () => {
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /min-height:\s*44px/);
  assert.match(styles, /@media \(max-width:\s*800px\)/);
  assert.match(styles, /@media \(prefers-reduced-motion:\s*reduce\)/);
  assert.match(world, /onClick=\{closeMobileMenu\}/);
  assert.match(world, /details\.open = false/);
  assert.doesNotMatch(world, /scroll to explore/i);
});

test('deep links are restored after ScrollTrigger creates pin spacing', () => {
  assert.match(world, /window\.location\.hash/);
  assert.match(world, /scrollIntoView/);
});
