import { Elysia, t } from 'elysia';
import QRCode from 'qrcode';
import { ErrorCorrectionLevel, type IQrcodeRequest } from '../types/qrcode';

const schema = t.Object({
  data: t.String({ minLength: 1 }),
  errorCorrectionLevel: t.Optional(t.Enum(ErrorCorrectionLevel)),
  width: t.Optional(t.Number({ minimum: 64, maximum: 1024 })),
  margin: t.Optional(t.Number({ minimum: 0, maximum: 32 })),
  darkColor: t.Optional(t.String()),
  lightColor: t.Optional(t.String()),
  cornerColor: t.Optional(t.String()),
  cornerInnerColor: t.Optional(t.String()),
  logoUrl: t.Optional(t.String({ format: 'url' })),
  logoScale: t.Optional(t.Number({ minimum: 0.05, maximum: 0.4 })),
});

export const qrcodeRoutes = new Elysia({ prefix: '/qrcode' }).post(
  '/',
  async ({ body }: { body: IQrcodeRequest }) => {
    const {
      data,
      errorCorrectionLevel = ErrorCorrectionLevel.M,
      width = 256,
      margin = 4,
      darkColor = '#000000',
      lightColor = '#ffffff',
      cornerColor,
      cornerInnerColor,
      logoUrl,
      logoScale = 0.22,
    } = body;

    const svg = await renderQrSvg({
      data,
      ecLevel: errorCorrectionLevel,
      size: width,
      margin,
      darkColor,
      lightColor,
      cornerColor,
      cornerInnerColor,
      logoUrl,
      logoScale,
    });

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Length': Buffer.byteLength(svg, 'utf-8').toString(),
      },
    });
  },
  { body: schema },
);

type RenderOptions = {
  data: string;
  ecLevel: ErrorCorrectionLevel;
  size: number;
  margin: number;
  darkColor: string;
  lightColor: string;
  cornerColor?: string;
  cornerInnerColor?: string;
  logoUrl?: string;
  logoScale: number;
};

async function renderQrSvg(options: RenderOptions) {
  const {
    data,
    ecLevel,
    size,
    margin,
    darkColor,
    lightColor,
    cornerColor,
    cornerInnerColor,
    logoUrl,
    logoScale,
  } = options;

  const qr = QRCode.create(data, { errorCorrectionLevel: ecLevel });
  const modules = qr.modules;
  const count = modules.size;

  const cellSize = Math.max(1, Math.floor(size / (count + margin * 2)));
  const canvasSize = cellSize * (count + margin * 2);

  const rects: string[] = [];

  // Background
  rects.push(`<rect width="${canvasSize}" height="${canvasSize}" fill="${lightColor}" />`);

  // Finder origins
  const finderTopLeft = [
    { fx: 0, fy: 0 },
    { fx: count - 7, fy: 0 },
    { fx: 0, fy: count - 7 },
  ];

  for (let y = 0; y < count; y++) {
    for (let x = 0; x < count; x++) {
      if (!modules.get(x, y)) continue;

      let fill = darkColor;

      const finder = finderTopLeft.find(
        ({ fx, fy }) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7,
      );

      if (finder) {
        const isInner =
          x >= finder.fx + 2 && x <= finder.fx + 4 && y >= finder.fy + 2 && y <= finder.fy + 4;

        if (isInner && cornerInnerColor) {
          fill = cornerInnerColor;
        } else if (cornerColor) {
          fill = cornerColor;
        }
      }

      const px = (x + margin) * cellSize;
      const py = (y + margin) * cellSize;

      rects.push(
        `<rect x="${px}" y="${py}" width="${cellSize}" height="${cellSize}" fill="${fill}" />`,
      );
    }
  }

  let logoFragment = '';
  if (logoUrl) {
    const logoSize = Math.max(16, Math.floor(canvasSize * logoScale));
    const logoX = (canvasSize - logoSize) / 2;
    const logoY = (canvasSize - logoSize) / 2;

    const res = await fetch(logoUrl);
    if (!res.ok) {
      throw new Error(`Failed to fetch logo: ${res.status} ${res.statusText}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const mime = res.headers.get('content-type') ?? 'image/png';
    const base64 = buf.toString('base64');
    const dataHref = `data:${mime};base64,${base64}`;

    logoFragment = `<image href="${dataHref}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid meet" />`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasSize}" height="${canvasSize}" viewBox="0 0 ${canvasSize} ${canvasSize}" shape-rendering="crispEdges" role="img">${rects.join(
    '',
  )}${logoFragment}</svg>`;
}
