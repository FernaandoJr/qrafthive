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
  // Extra breathing room around the logo so QR modules are "carved out"
  logoClearMargin: t.Optional(t.Number({ minimum: 0, maximum: 0.3 })),
  // Background color behind the logo; set "transparent" to keep holes unfilled
  logoBackgroundColor: t.Optional(t.String()),
  // Corner radius factor (0–0.5) for the knockout box to avoid hard square edges
  logoClearRadius: t.Optional(t.Number({ minimum: 0, maximum: 0.5 })),
  // Shape of the knockout: "rect" (default) or "circle"
  logoClearShape: t.Optional(t.Union([t.Literal('rect'), t.Literal('circle')])),
  // How the background is applied: "box" (bounding shape) or "alpha" (use logo alpha mask)
  logoMaskMode: t.Optional(t.Union([t.Literal('box'), t.Literal('alpha')])),
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
      logoClearMargin = 0.08,
      logoBackgroundColor,
      logoClearRadius = 0.12,
      logoClearShape = 'rect',
      logoMaskMode = 'alpha',
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
      logoClearMargin,
      logoBackgroundColor,
      logoClearRadius,
      logoClearShape,
      logoMaskMode,
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
  logoClearMargin: number;
  logoBackgroundColor?: string;
  logoClearRadius: number;
  logoClearShape: 'rect' | 'circle';
  logoMaskMode: 'box' | 'alpha';
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
    logoClearMargin,
    logoBackgroundColor,
    logoClearRadius,
    logoClearShape,
    logoMaskMode,
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

      // Skip cells only when using box mode (alpha mode keeps modules and masks them later)
      if (logoUrl && logoMaskMode === 'box') {
        if (
          shouldClearForLogo(
            px,
            py,
            cellSize,
            logoClearMargin,
            size,
            margin,
            logoScale,
            logoClearShape,
            logoClearRadius,
          )
        ) {
          continue;
        }
      }

      rects.push(
        `<rect x="${px}" y="${py}" width="${cellSize}" height="${cellSize}" fill="${fill}" />`,
      );
    }
  }

  let logoFragment = '';
  let clearFragment = '';
  let defsFragment = '';
  if (logoUrl) {
    const logoSize = Math.max(16, Math.floor(canvasSize * logoScale));
    const logoX = (canvasSize - logoSize) / 2;
    const logoY = (canvasSize - logoSize) / 2;

    // Carve out a light background under the logo
    const clearMarginPx = Math.max(0, Math.floor(logoSize * logoClearMargin));
    const clearX = logoX - clearMarginPx;
    const clearY = logoY - clearMarginPx;
    const clearSize = logoSize + clearMarginPx * 2;
    const res = await fetch(logoUrl);
    if (!res.ok) {
      throw new Error(`Failed to fetch logo: ${res.status} ${res.statusText}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const mime = res.headers.get('content-type') ?? 'image/png';
    const base64 = buf.toString('base64');
    const dataHref = `data:${mime};base64,${base64}`;

    if (logoMaskMode === 'alpha') {
      const haloPx = Math.max(0, Math.floor(logoSize * logoClearMargin));
      const filterId = `logo-dilate-${Math.random().toString(36).slice(2, 8)}`;
      const maskId = `logo-mask-${Math.random().toString(36).slice(2, 8)}`;
      defsFragment = `<defs>
        <filter id="${filterId}" x="0" y="0" width="200%" height="200%" filterUnits="userSpaceOnUse">
          <feMorphology in="SourceGraphic" operator="dilate" radius="${haloPx}" result="dilate" />
        </filter>
        <mask id="${maskId}" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" style="mask-type:alpha">
          <image href="${dataHref}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid meet" filter="url(#${filterId})" />
        </mask>
      </defs>`;

      const clearFill =
        logoBackgroundColor === 'transparent' ? 'none' : logoBackgroundColor || lightColor;
      clearFragment = `<rect x="0" y="0" width="${canvasSize}" height="${canvasSize}" fill="${clearFill}" mask="url(#${maskId})" />`;
    } else {
      const clearRadius = Math.max(0, Math.floor(clearSize * logoClearRadius));
      const clearFill =
        logoBackgroundColor === 'transparent' ? 'none' : logoBackgroundColor || lightColor;
      if (logoClearShape === 'circle') {
        const clearR = clearSize / 2;
        const clearCx = clearX + clearR;
        const clearCy = clearY + clearR;
        clearFragment = `<circle cx="${clearCx}" cy="${clearCy}" r="${clearR}" fill="${clearFill}" />`;
      } else {
        clearFragment = `<rect x="${clearX}" y="${clearY}" width="${clearSize}" height="${clearSize}" fill="${clearFill}" rx="${clearRadius}" ry="${clearRadius}" />`;
      }
    }

    logoFragment = `<image href="${dataHref}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid meet" />`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasSize}" height="${canvasSize}" viewBox="0 0 ${canvasSize} ${canvasSize}" shape-rendering="crispEdges" role="img">${rects.join(
    '',
  )}${defsFragment}${clearFragment}${logoFragment}</svg>`;
}

function shouldClearForLogo(
  px: number,
  py: number,
  cellSize: number,
  logoClearMargin: number,
  canvasSize: number,
  margin: number,
  logoScale: number,
  logoClearShape: 'rect' | 'circle',
  logoClearRadius: number,
) {
  const logoSize = Math.max(16, Math.floor(canvasSize * logoScale));
  const logoX = (canvasSize - logoSize) / 2;
  const logoY = (canvasSize - logoSize) / 2;
  const clearMarginPx = Math.max(0, Math.floor(logoSize * logoClearMargin));
  const clearSize = logoSize + clearMarginPx * 2;
  const clearX = logoX - clearMarginPx;
  const clearY = logoY - clearMarginPx;

  const cellCenterX = px + cellSize / 2;
  const cellCenterY = py + cellSize / 2;

  if (logoClearShape === 'circle') {
    const clearR = clearSize / 2;
    const clearCx = clearX + clearR;
    const clearCy = clearY + clearR;
    const dx = cellCenterX - clearCx;
    const dy = cellCenterY - clearCy;
    return dx * dx + dy * dy <= clearR * clearR;
  }

  // Rect (bounding-box check; radius not needed for exclusion)
  const cellX2 = px + cellSize;
  const cellY2 = py + cellSize;
  const clearX2 = clearX + clearSize;
  const clearY2 = clearY + clearSize;

  const intersects = px < clearX2 && cellX2 > clearX && py < clearY2 && cellY2 > clearY;

  return intersects;
}
