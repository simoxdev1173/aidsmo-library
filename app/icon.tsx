import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const size = { width: 96, height: 96 };
export const contentType = 'image/png';

export default async function Icon() {
  const logo = await readFile(join(process.cwd(), 'public/logo-4.png'));

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`data:image/png;base64,${logo.toString('base64')}`}
        alt=""
        style={{ height: 126, left: -21, position: 'absolute', top: -6, width: 126 }}
      />
    </div>,
    size,
  );
}
