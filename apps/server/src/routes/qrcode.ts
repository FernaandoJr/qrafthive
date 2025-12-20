import { Elysia, t } from 'elysia';
import QRCode from 'qrcode';
import sharp from 'sharp';
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
  // How the background is applied:
  // "box"  -> forma geométrica
  // "alpha" -> máscara por pixel (render vetorial)
  // "alphaCell" -> decisão por célula do QR usando alpha da logo
  logoMaskMode: t.Optional(t.Union([t.Literal('box'), t.Literal('alpha'), t.Literal('alphaCell')])),
  // Borda/halo na cor de fundo ao redor da logo (default: lightColor)
  logoBorderColor: t.Optional(t.String()),
  // Espessura relativa da borda (0–0.2) aplicada no modo alpha/alphaCell
  logoBorderMargin: t.Optional(t.Number({ minimum: 0, maximum: 0.2 })),
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
      // Default: slightly larger margin to avoid modules encostando na logo
      logoClearMargin = 0.12,
      logoBackgroundColor,
      logoClearRadius = 0.12,
      logoClearShape = 'rect',
      logoMaskMode = 'alphaCell',
      logoBorderColor,
      logoBorderMargin = 0.02,
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
      logoBorderColor,
      logoBorderMargin,
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
  logoMaskMode: 'box' | 'alpha' | 'alphaCell';
  logoBorderColor?: string;
  logoBorderMargin: number;
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
    logoBorderColor,
    logoBorderMargin,
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

  // Precompute alpha-based cell mask if needed
  let shouldSkipCell: ((px: number, py: number) => boolean) | null = null;

  // Fetch logo early if alphaCell mode; reuse buffer later
  let logoBuffer: Buffer | null = null;
  let logoMime: string | null = null;
  if (logoUrl) {
    const res = await fetch(logoUrl);
    if (!res.ok) {
      throw new Error(`Failed to fetch logo: ${res.status} ${res.statusText}`);
    }
    logoBuffer = Buffer.from(await res.arrayBuffer());
    logoMime = res.headers.get('content-type') ?? 'image/png';
  }

  if (logoUrl && logoMaskMode === 'alphaCell' && logoBuffer) {
    const logoSizePx = Math.max(16, Math.floor(canvasSize * logoScale));
    const logoX = (canvasSize - logoSizePx) / 2;
    const logoY = (canvasSize - logoSizePx) / 2;

    const rendered = await sharp(logoBuffer)
      .resize(logoSizePx, logoSizePx, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { data: raw, info } = rendered;
    const stride = info.width * 4;
    const alphaThreshold = 32; // 0-255

    // Optional small halo using clearMargin (applied as pixel dilation)
    const haloPx = Math.max(0, Math.floor(logoSizePx * logoClearMargin));

    // Bounding box of opaque pixels (alpha >= threshold) in logo space
    let minAx = info.width;
    let maxAx = -1;
    let minAy = info.height;
    let maxAy = -1;
    for (let iy = 0; iy < info.height; iy++) {
      for (let ix = 0; ix < info.width; ix++) {
        const alpha = raw[iy * stride + ix * 4 + 3];
        if (alpha >= alphaThreshold) {
          if (ix < minAx) minAx = ix;
          if (ix > maxAx) maxAx = ix;
          if (iy < minAy) minAy = iy;
          if (iy > maxAy) maxAy = iy;
        }
      }
    }

    // Fallback if fully transparent (avoid degenerate bounds)
    if (maxAx < 0 || maxAy < 0) {
      minAx = 0;
      minAy = 0;
      maxAx = info.width - 1;
      maxAy = info.height - 1;
    }

    const scaleX = logoSizePx / info.width;
    const scaleY = logoSizePx / info.height;
    const maskMinX = logoX + minAx * scaleX - haloPx;
    const maskMaxX = logoX + (maxAx + 1) * scaleX + haloPx;
    const maskMinY = logoY + minAy * scaleY - haloPx;
    const maskMaxY = logoY + (maxAy + 1) * scaleY + haloPx;

    shouldSkipCell = (px: number, py: number) => {
      const cellMinX = px;
      const cellMaxX = px + cellSize;
      const cellMinY = py;
      const cellMaxY = py + cellSize;

      // quick reject if the cell box is fully outside opaque-mask+halo box
      if (cellMaxX < maskMinX || cellMinX > maskMaxX) return false;
      if (cellMaxY < maskMinY || cellMinY > maskMaxY) return false;

      const samples = Math.max(3, Math.min(6, Math.floor(cellSize / 2)));
      let covered = 0;
      let total = 0;
      let maxAlpha = 0;

      for (let sy = 0; sy < samples; sy++) {
        for (let sx = 0; sx < samples; sx++) {
          const spx = cellMinX + (sx + 0.5) * (cellSize / samples);
          const spy = cellMinY + (sy + 0.5) * (cellSize / samples);
          total++;

          // outside opaque-mask+halo
          if (spx < maskMinX || spx > maskMaxX || spy < maskMinY || spy > maskMaxY) continue;

          const ix = Math.floor((spx - logoX) * (info.width / logoSizePx));
          const iy = Math.floor((spy - logoY) * (info.height / logoSizePx));

          if (ix >= 0 && iy >= 0 && ix < info.width && iy < info.height) {
            const alpha = raw[iy * stride + ix * 4 + 3];
            if (alpha >= alphaThreshold) covered++;
            if (alpha > maxAlpha) maxAlpha = alpha;
          }
        }
      }

      const coverage = covered / total;
      // Drop cell if any strong alpha or sufficient coverage
      return maxAlpha >= alphaThreshold || coverage >= 0.35;
    };
  }

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

      // Skip cells in box mode or alphaCell mask
      if (logoUrl) {
        if (logoMaskMode === 'box') {
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
        } else if (logoMaskMode === 'alphaCell' && shouldSkipCell && shouldSkipCell(px, py)) {
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
  if (logoUrl && logoBuffer && logoMime) {
    const logoSize = Math.max(16, Math.floor(canvasSize * logoScale));
    const logoX = (canvasSize - logoSize) / 2;
    const logoY = (canvasSize - logoSize) / 2;

    // Carve out a light background under the logo
    const clearMarginPx = Math.max(0, Math.floor(logoSize * logoClearMargin));
    const clearX = logoX - clearMarginPx;
    const clearY = logoY - clearMarginPx;
    const clearSize = logoSize + clearMarginPx * 2;
    const base64 = logoBuffer.toString('base64');
    const dataHref = `data:${logoMime};base64,${base64}`;

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
    } else if (logoMaskMode === 'alphaCell') {
      // Desenhe uma borda fina na cor de fundo usando a máscara alpha com dilatação pequena
      const borderHaloPx = Math.max(0, Math.floor(logoSize * logoBorderMargin));
      if (borderHaloPx > 0 || logoBorderColor) {
        const filterId = `logo-dilate-${Math.random().toString(36).slice(2, 8)}`;
        const maskId = `logo-mask-${Math.random().toString(36).slice(2, 8)}`;
        defsFragment += `<defs>
          <filter id="${filterId}" x="0" y="0" width="200%" height="200%" filterUnits="userSpaceOnUse">
            <feMorphology in="SourceGraphic" operator="dilate" radius="${borderHaloPx}" result="dilate" />
          </filter>
          <mask id="${maskId}" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" style="mask-type:alpha">
            <image href="${dataHref}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid meet" filter="url(#${filterId})" />
          </mask>
        </defs>`;
        const borderFill =
          logoBorderColor === 'transparent'
            ? 'none'
            : logoBorderColor || logoBackgroundColor || lightColor;
        clearFragment += `<rect x="0" y="0" width="${canvasSize}" height="${canvasSize}" fill="${borderFill}" mask="url(#${maskId})" />`;
      }
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
