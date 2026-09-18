#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '../../../..');
const skill = join(repo, '.cursor/skills/scroll-craft/plugins/nateherk-design/skills/scrollcraft');
const assets = join(repo, 'assets');
const raw = join(here, '../raw');
const out = join(here, '../assets');
const publicWorld = join(repo, 'queenlynch-site/public/world');

mkdirSync(raw, { recursive: true });
mkdirSync(out, { recursive: true });
mkdirSync(publicWorld, { recursive: true });

const GRADE = [
  "eq=contrast=1.05:saturation=0.9:gamma=1.02",
  "colorbalance=rs=0.02:gs=0.02:bs=-0.03",
  "unsharp=5:5:0.35",
].join(',');

const legs = [
  {
    id: '01',
    src: join(assets, 'interiors/a1TxdQS5.webp'),
    seconds: 8,
    vf: `scale=2100:1400,crop=1920:1080:x='(iw-ow)*0.55+(iw-ow)*0.35*t/8':y='(ih-oh)*0.32',${GRADE}`,
  },
  {
    id: '02',
    src: join(assets, 'interiors/ByUvCogb.webp'),
    seconds: 8,
    vf: `scale=2304:1536,crop=1920:1080:x='(iw-ow)*0.05+(iw-ow)*0.7*t/8':y='(ih-oh)*0.4',${GRADE}`,
  },
  {
    id: '03',
    src: join(assets, 'interiors/BeE0h5JC.webp'),
    seconds: 8,
    vf: `scale=2200:1467,crop=1920:1080:x='(iw-ow)*0.35':y='(ih-oh)*0.2+(ih-oh)*0.45*t/8',${GRADE}`,
  },
  {
    id: '04',
    src: join(assets, 'staff/DPsZ9mdv.webp'),
    seconds: 12,
    vf: `scale=1920:-2,crop=1920:1080:x=0:y='200+720*t/12',${GRADE}`,
  },
  {
    id: '05',
    src: join(assets, 'interiors/a1TxdQS5.webp'),
    seconds: 8,
    vf: `scale=2100:1400,crop=1920:1080:x='(iw-ow)*0.4+(iw-ow)*0.2*t/8':y='(ih-oh)*0.28',${GRADE}`,
  },
];

function run(cmd, args) {
  const result = spawnSync(cmd, args, { stdio: 'inherit' });
  if (result.status !== 0) {
    throw new Error(`${cmd} failed`);
  }
}

for (const leg of legs) {
  const master = join(raw, `${leg.id}.mp4`);
  console.log(`\n— filming ${leg.id} (${leg.seconds}s)`);
  run('ffmpeg', [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-loop', '1', '-i', leg.src,
    '-t', String(leg.seconds),
    '-r', '30',
    '-vf', `${leg.vf},format=yuv420p`,
    '-an',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
    '-pix_fmt', 'yuv420p',
    master,
  ]);

  run('bash', [join(skill, 'scripts/encode.sh'), master, join(out, `${leg.id}.mp4`), 'desktop']);
  run('bash', [join(skill, 'scripts/encode.sh'), master, join(out, `${leg.id}-m.mp4`), 'mobile']);

  run('ffmpeg', [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-i', join(out, `${leg.id}.mp4`),
    '-frames:v', '1', '-q:v', '3',
    join(out, `p${leg.id}.webp`),
  ]);
}

run('rsync', ['-a', `${out}/`, `${publicWorld}/`]);
console.log('\nLegs encoded and copied to public/world');
