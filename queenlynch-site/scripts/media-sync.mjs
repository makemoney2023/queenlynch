#!/usr/bin/env node
/**
 * media-sync.mjs
 * Syncs assets from ../assets/ to public/media/
 * Usage: node scripts/media-sync.mjs
 */

import { copyFile, mkdir, readdir, stat } from 'fs/promises';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SOURCE_DIR = join(__dirname, '../../assets');
const DEST_DIR = join(__dirname, '../public/media');

async function copyRecursive(src, dest) {
  const stats = await stat(src);
  
  if (stats.isDirectory()) {
    await mkdir(dest, { recursive: true });
    const entries = await readdir(src);
    
    for (const entry of entries) {
      await copyRecursive(join(src, entry), join(dest, entry));
    }
  } else {
    await mkdir(dirname(dest), { recursive: true });
    await copyFile(src, dest);
    console.log(`✓ ${relative(join(__dirname, '..'), dest)}`);
  }
}

async function main() {
  console.log('🔄 Syncing media assets...\n');
  
  try {
    await copyRecursive(SOURCE_DIR, DEST_DIR);
    console.log('\n✨ Media sync complete!');
  } catch (error) {
    console.error('❌ Error syncing media:', error.message);
    process.exit(1);
  }
}

main();
