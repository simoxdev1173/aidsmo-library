import 'dotenv/config';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { generalAssemblyMembers, generalAssemblySourcePage } from '../lib/general-assembly-data';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../lib/generated/prisma/client';

type Portrait = { localPath: string; sourceUrl: string; profileUrl: string; profileName: string };
const manifest: Record<string, Portrait> = {};
const failures: string[] = [];
const normalize = (text: string) => text.replace(/<[^>]+>/g, '').replace(/[\u064B-\u065F\u0640]/g, '').replace(/[أإآ]/g, 'ا').replace(/\s+/g, '').trim();
const attribute = (tag: string, name: string) => tag.match(new RegExp(`${name}=["']([^"']+)["']`, 'i'))?.[1]?.replace(/&amp;/g, '&');

async function fetchChecked(url: string) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response;
}

async function main() {
  const listing = await (await fetchChecked(generalAssemblySourcePage)).text();
  const links = [...listing.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gi)].map(([tag]) => ({ href: attribute(tag, 'href'), name: normalize(tag) }));
  await mkdir(path.join(process.cwd(), 'public/images/general-assembly'), { recursive: true });
  // Batches limit simultaneous requests to the source website.
  for (let offset = 0; offset < generalAssemblyMembers.length; offset += 4) {
    await Promise.all(generalAssemblyMembers.slice(offset, offset + 4).map(async (member) => {
      try {
        const linked = links.find((link) => link.name === normalize(member.name) && link.href?.includes('ministerial-board-ar/'));
        const profileUrl = linked?.href ? new URL(linked.href, generalAssemblySourcePage).href : member.websiteUrl;
        if (profileUrl === generalAssemblySourcePage) throw new Error('No individual profile link');
        const html = await (await fetchChecked(profileUrl)).text();
        const image = [...html.matchAll(/<img\b[^>]*>/gi)].map(([tag]) => tag).find((tag) => attribute(tag, 'itemprop') === 'image');
        if (!image) throw new Error('No profile portrait');
        const src = attribute(image, 'src');
        const profileName = attribute(image, 'alt') ?? '';
        const expected = member.sourceProfileName ?? member.name;
        if (!src || !profileName || normalize(profileName) !== normalize(expected)) throw new Error(`Profile name needs review: ${profileName}`);
        const sourceUrl = new URL(src, profileUrl).href;
        const response = await fetchChecked(sourceUrl);
        const bytes = Buffer.from(await response.arrayBuffer());
        const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8;
        const png = bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
        const webp = bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP';
        if ((!jpeg && !png && !webp) || bytes.length > 10 * 1024 * 1024) throw new Error('Unsupported portrait image');
        const extension = jpeg ? 'jpg' : png ? 'png' : 'webp';
        const localPath = `/images/general-assembly/${member.slug}.${extension}`;
        await writeFile(path.join(process.cwd(), 'public', localPath), bytes);
        manifest[member.slug] = { localPath, sourceUrl, profileUrl, profileName };
        console.log(`${member.slug}: portrait imported`);
      } catch (error) {
        failures.push(`${member.slug}: ${error instanceof Error ? error.message : 'Import failed'}`);
      }
    }));
  }
  await writeFile(path.join(process.cwd(), 'lib/general-assembly-portraits.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(`Downloaded ${Object.keys(manifest).length} portraits. ${failures.length} need review.`);
  failures.forEach((failure) => console.log(failure));
  if (process.argv.includes('--apply')) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error('DATABASE_URL is required');
    const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
    try {
      let updated = 0;
      for (const member of generalAssemblyMembers) {
        const portrait = manifest[member.slug];
        const result = await prisma.generalAssemblyMember.updateMany({
          where: { slug: member.slug, OR: [{ imageUrl: null }, { imageUrl: { startsWith: 'https://aidsmo.org/images/flags/' } }, ...(portrait ? [{ imageUrl: portrait.localPath }] : [])] },
          data: { imageUrl: portrait?.localPath ?? null },
        });
        updated += result.count;
      }
      console.log(`Updated ${updated} database records; custom dashboard images were preserved.`);
    } finally { await prisma.$disconnect(); }
  }
}
main().catch((error) => { console.error(error instanceof Error ? error.message : 'Portrait import failed'); process.exitCode = 1; });
