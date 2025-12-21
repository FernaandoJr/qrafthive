import QRCode from 'qrcode';
import sharp from 'sharp';
import { ErrorCorrectionLevel, ModuleShape } from '../../types/qrcode';

export type RenderOptions = {
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
  logoMinDistance: number;
  logoBackgroundColor?: string;
  logoMaskMode: 'box' | 'alpha' | 'alphaCell';
  logoBorderMargin: number;
  moduleShape?: ModuleShape;
};

export async function renderQrSvg(options: RenderOptions) {
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
    logoMinDistance,
    logoBackgroundColor,
    logoMaskMode,
    logoBorderMargin,
    moduleShape = 'square',
  } = options;

  const normalizedLogoScale = Math.max(0, logoScale) * 0.04;
  const normalizedLogoMinDistance = Math.max(0, Math.min(logoMinDistance, 10)) * 0.05;
  const normalizedLogoBorderMargin = Math.max(0, Math.min(logoBorderMargin, 10)) * 0.02;

  const hasLogo = Boolean(logoUrl);
  const useBoxMask = logoMaskMode === 'box';
  const useAlphaMask = logoMaskMode === 'alpha';
  const useAlphaCellMask = logoMaskMode === 'alphaCell';
  const logoUrlValue = logoUrl ?? '';
  const isCircleShape = moduleShape === 'circle';
  const isDiamondShape = moduleShape === 'diamond';
  const isRoundedShape = moduleShape === 'rounded';
  const isOutlinedShape = moduleShape === 'outlined';

  const qr = QRCode.create(data, { errorCorrectionLevel: ecLevel });
  const modules = qr.modules;
  const count = modules.size;

  const cellSize = Math.max(1, Math.floor(size / (count + margin * 2)));
  const canvasSize = cellSize * (count + margin * 2);

  const rects: string[] = [];

  // Background
  rects.push(`<rect width="${canvasSize}" height="${canvasSize}" fill="${lightColor}" />`);

  const finderEnd = count - 7;

  // Precompute alpha-based cell mask if needed
  let shouldSkipCell: ((px: number, py: number) => boolean) | null = null;

  // Fetch logo early if alphaCell mode; reuse buffer later
  let logoBuffer: Buffer | null = null;
  let logoMime: string | null = null;
  if (hasLogo) {
    const res = await fetch(logoUrlValue);
    if (!res.ok) {
      throw new Error(`Failed to fetch logo: ${res.status} ${res.statusText}`);
    }
    logoBuffer = Buffer.from(await res.arrayBuffer());
    logoMime = res.headers.get('content-type') ?? 'image/png';
  }

  // Logo sizing with aspect ratio preserved (after logoBuffer is available)
  let logoWidthPx: number | null = null;
  let logoHeightPx: number | null = null;
  if (hasLogo) {
    const base = Math.max(16, Math.floor(canvasSize * normalizedLogoScale));
    const meta = logoBuffer ? await sharp(logoBuffer).metadata() : null;
    const mw = meta?.width;
    const mh = meta?.height;
    if (mw && mh) {
      const ratio = mw / mh;
      if (ratio >= 1) {
        logoWidthPx = base;
        logoHeightPx = Math.max(16, Math.floor(base / ratio));
      } else {
        logoHeightPx = base;
        logoWidthPx = Math.max(16, Math.floor(base * ratio));
      }
    } else {
      logoWidthPx = base;
      logoHeightPx = base;
    }
  }
  const extraGapPx =
    logoWidthPx !== null && logoHeightPx !== null && normalizedLogoMinDistance > 0
      ? Math.max(0, Math.floor(Math.min(logoWidthPx, logoHeightPx) * normalizedLogoMinDistance))
      : 0;
  const logoX = logoWidthPx !== null ? (canvasSize - logoWidthPx) / 2 : null;
  const logoY = logoHeightPx !== null ? (canvasSize - logoHeightPx) / 2 : null;

  // Knockout box (will be refined with alpha bounds when available)
  let clearBox: { x: number; y: number; w: number; h: number } | null = null;
  if (logoX !== null && logoY !== null && logoWidthPx !== null && logoHeightPx !== null) {
    clearBox = {
      x: logoX - extraGapPx,
      y: logoY - extraGapPx,
      w: logoWidthPx + extraGapPx * 2,
      h: logoHeightPx + extraGapPx * 2,
    };
  }

  if (
    hasLogo &&
    useAlphaCellMask &&
    logoBuffer &&
    logoWidthPx &&
    logoHeightPx &&
    logoX !== null &&
    logoY !== null
  ) {
    const rendered = await sharp(logoBuffer)
      .resize(logoWidthPx, logoHeightPx, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { data: raw, info } = rendered;
    const stride = info.width * 4;
    // Minimal threshold: drop only where logo has real opacity
    const alphaThreshold = 8; // 0-255

    const haloPx = 0;

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

    const scaleX = logoWidthPx / info.width;
    const scaleY = logoHeightPx / info.height;
    const maskMinX = logoX + minAx * scaleX - haloPx;
    const maskMaxX = logoX + (maxAx + 1) * scaleX + haloPx;
    const maskMinY = logoY + minAy * scaleY - haloPx;
    const maskMaxY = logoY + (maxAy + 1) * scaleY + haloPx;

    // Ajusta clearBox para usar apenas a área opaca (sem padding transparente da logo)
    const opaqueW = (maxAx - minAx + 1) * scaleX;
    const opaqueH = (maxAy - minAy + 1) * scaleY;
    clearBox = {
      x: maskMinX - extraGapPx,
      y: maskMinY - extraGapPx,
      w: opaqueW + extraGapPx * 2,
      h: opaqueH + extraGapPx * 2,
    };

    const alphaSamples = Math.max(3, Math.min(6, Math.floor(cellSize / 2)));
    const alphaStep = cellSize / alphaSamples;
    const alphaHalfStep = alphaStep / 2;

    shouldSkipCell = (px: number, py: number) => {
      const cellMinX = px;
      const cellMaxX = px + cellSize;
      const cellMinY = py;
      const cellMaxY = py + cellSize;

      // quick reject if the cell box is fully outside opaque-mask+halo box
      if (cellMaxX < maskMinX || cellMinX > maskMaxX) return false;
      if (cellMaxY < maskMinY || cellMinY > maskMaxY) return false;

      let maxAlpha = 0;

      for (let sy = 0; sy < alphaSamples; sy++) {
        const spy = cellMinY + sy * alphaStep + alphaHalfStep;
        for (let sx = 0; sx < alphaSamples; sx++) {
          const spx = cellMinX + sx * alphaStep + alphaHalfStep;

          // outside opaque-mask+halo
          if (spx < maskMinX || spx > maskMaxX || spy < maskMinY || spy > maskMaxY) continue;

          const ix = Math.floor((spx - logoX) * (info.width / logoWidthPx));
          const iy = Math.floor((spy - logoY) * (info.height / logoHeightPx));

          if (ix >= 0 && iy >= 0 && ix < info.width && iy < info.height) {
            const alpha = raw[iy * stride + ix * 4 + 3];
            if (alpha > maxAlpha) maxAlpha = alpha;
            if (maxAlpha >= alphaThreshold) return true; // drop cell as soon as we see opacity
          }
        }
      }

      return false;
    };

    // Para alphaCell não fazemos knockout retangular global; apenas célula a célula.
    clearBox = null;
  }

  for (let y = 0; y < count; y++) {
    const inTopBand = y < 7;
    const inBottomBand = y >= finderEnd;
    for (let x = 0; x < count; x++) {
      if (!modules.get(x, y)) continue;

      let fill = darkColor;

      const inLeftBand = x < 7;
      const inRightBand = x >= finderEnd;
      const inTopLeft = inLeftBand && inTopBand;
      const inTopRight = inRightBand && inTopBand;
      const inBottomLeft = inLeftBand && inBottomBand;

      if (inTopLeft || inTopRight || inBottomLeft) {
        const innerRangeStartX = inLeftBand ? 2 : finderEnd + 2;
        const innerRangeEndX = inLeftBand ? 4 : finderEnd + 4;
        const innerRangeStartY = inTopBand ? 2 : finderEnd + 2;
        const innerRangeEndY = inTopBand ? 4 : finderEnd + 4;

        const isInner =
          x >= innerRangeStartX &&
          x <= innerRangeEndX &&
          y >= innerRangeStartY &&
          y <= innerRangeEndY;

        if (isInner && cornerInnerColor) {
          fill = cornerInnerColor;
        } else if (cornerColor) {
          fill = cornerColor;
        }
      }

      const px = (x + margin) * cellSize;
      const py = (y + margin) * cellSize;
      const cellCx = px + cellSize / 2;
      const cellCy = py + cellSize / 2;

      // Hard knockout using logo bounding box + clearMargin
      if (clearBox) {
        if (
          cellCx >= clearBox.x &&
          cellCx <= clearBox.x + clearBox.w &&
          cellCy >= clearBox.y &&
          cellCy <= clearBox.y + clearBox.h
        ) {
          continue;
        }
      }

      // Skip cells in box mode or alphaCell mask
      if (hasLogo) {
        if (useBoxMask) {
          if (shouldClearForLogo(px, py, cellSize, size, normalizedLogoScale)) {
            continue;
          }
        } else if (useAlphaCellMask && shouldSkipCell && shouldSkipCell(px, py)) {
          continue;
        }
      }

      if (isCircleShape) {
        const r = cellSize / 2;
        rects.push(`<circle cx="${cellCx}" cy="${cellCy}" r="${r}" fill="${fill}" />`);
      } else if (isDiamondShape) {
        const r = cellSize / 2;
        rects.push(
          `<path d="M ${cellCx} ${cellCy - r} L ${cellCx + r} ${cellCy} L ${cellCx} ${cellCy + r} L ${cellCx - r} ${cellCy} Z" fill="${fill}" />`,
        );
      } else if (isRoundedShape) {
        const n = y > 0 && modules.get(x, y - 1);
        const s = y + 1 < count && modules.get(x, y + 1);
        const w = x > 0 && modules.get(x - 1, y);
        const e = x + 1 < count && modules.get(x + 1, y);
        const r = Math.min(cellSize / 2, Math.floor(cellSize * 0.45));

        const tl = !n && !w ? r : 0;
        const tr = !n && !e ? r : 0;
        const br = !s && !e ? r : 0;
        const bl = !s && !w ? r : 0;

        const d = buildRoundedRectPath(px, py, cellSize, { tl, tr, br, bl });
        rects.push(`<path d="${d}" fill="${fill}" />`);
      } else if (isOutlinedShape) {
        const strokeWidth = Math.max(1, Math.floor(cellSize * 0.18));
        rects.push(
          `<rect x="${px}" y="${py}" width="${cellSize}" height="${cellSize}" fill="${fill}" stroke="${lightColor}" stroke-width="${strokeWidth}" />`,
        );
      } else {
        rects.push(
          `<rect x="${px}" y="${py}" width="${cellSize}" height="${cellSize}" fill="${fill}" />`,
        );
      }
    }
  }

  let logoFragment = '';
  let clearFragment = '';
  let defsFragment = '';
  if (hasLogo && logoBuffer && logoMime) {
    const logoWidth = logoWidthPx ?? Math.max(16, Math.floor(canvasSize * normalizedLogoScale));
    const logoHeight = logoHeightPx ?? logoWidth;
    const logoX = (canvasSize - logoWidth) / 2;
    const logoY = (canvasSize - logoHeight) / 2;

    // Carve out a light background under the logo
    const clearMarginPx = 0;
    const clearX = logoX - clearMarginPx;
    const clearY = logoY - clearMarginPx;
    const clearW = logoWidth + clearMarginPx * 2;
    const clearH = logoHeight + clearMarginPx * 2;
    const base64 = logoBuffer.toString('base64');
    const dataHref = `data:${logoMime};base64,${base64}`;

    if (useAlphaMask) {
      const logoIdBase = hashId(`${logoUrlValue}-${canvasSize}-${logoWidth}-${logoHeight}`);
      const haloPx = 0;
      const filterId = `logo-dilate-${logoIdBase}`;
      const maskId = `logo-mask-${logoIdBase}`;
      defsFragment = `<defs>
        <filter id="${filterId}" x="0" y="0" width="200%" height="200%" filterUnits="userSpaceOnUse">
          <feMorphology in="SourceGraphic" operator="dilate" radius="${haloPx}" result="dilate" />
        </filter>
        <mask id="${maskId}" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" style="mask-type:alpha">
          <image href="${dataHref}" x="${logoX}" y="${logoY}" width="${logoWidth}" height="${logoHeight}" preserveAspectRatio="xMidYMid meet" filter="url(#${filterId})" />
        </mask>
      </defs>`;

      const clearFill =
        logoBackgroundColor === 'transparent' ? 'none' : logoBackgroundColor || lightColor;
      clearFragment = `<rect x="0" y="0" width="${canvasSize}" height="${canvasSize}" fill="${clearFill}" mask="url(#${maskId})" />`;
    } else if (useAlphaCellMask) {
      // Desenhe uma borda fina na cor de fundo usando a máscara alpha com dilatação pequena
      const borderHaloPx = Math.max(
        0,
        Math.floor(Math.max(logoWidth, logoHeight) * normalizedLogoBorderMargin),
      );
      if (borderHaloPx > 0) {
        const logoIdBase = hashId(
          `${logoUrlValue}-${canvasSize}-${logoWidth}-${logoHeight}-alphaCell-${borderHaloPx}`,
        );
        const filterId = `logo-dilate-${logoIdBase}`;
        const maskId = `logo-mask-${logoIdBase}`;
        defsFragment += `<defs>
          <filter id="${filterId}" x="0" y="0" width="200%" height="200%" filterUnits="userSpaceOnUse">
            <feMorphology in="SourceGraphic" operator="dilate" radius="${borderHaloPx}" result="dilate" />
          </filter>
          <mask id="${maskId}" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" style="mask-type:alpha">
            <image href="${dataHref}" x="${logoX}" y="${logoY}" width="${logoWidth}" height="${logoHeight}" preserveAspectRatio="xMidYMid meet" filter="url(#${filterId})" />
          </mask>
        </defs>`;
        const borderFill = lightColor;
        clearFragment += `<rect x="0" y="0" width="${canvasSize}" height="${canvasSize}" fill="${borderFill}" mask="url(#${maskId})" />`;
      }
    } else {
      const clearFill =
        logoBackgroundColor === 'transparent' ? 'none' : logoBackgroundColor || lightColor;
      clearFragment = `<rect x="${clearX}" y="${clearY}" width="${clearW}" height="${clearH}" fill="${clearFill}" />`;
    }

    logoFragment = `<image href="${dataHref}" x="${logoX}" y="${logoY}" width="${logoWidth}" height="${logoHeight}" preserveAspectRatio="xMidYMid meet" />`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasSize}" height="${canvasSize}" viewBox="0 0 ${canvasSize} ${canvasSize}" shape-rendering="crispEdges" role="img">${rects.join(
    '',
  )}${defsFragment}${clearFragment}${logoFragment}</svg>`;
}

function hashId(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0; // keep 32-bit
  }
  return Math.abs(hash).toString(36);
}

function buildRoundedRectPath(
  x: number,
  y: number,
  size: number,
  radii: { tl: number; tr: number; br: number; bl: number },
) {
  const { tl, tr, br, bl } = radii;
  const x2 = x + size;
  const y2 = y + size;
  return [
    `M ${x + tl} ${y}`,
    `L ${x2 - tr} ${y}`,
    tr ? `Q ${x2} ${y} ${x2} ${y + tr}` : `L ${x2} ${y}`,
    `L ${x2} ${y2 - br}`,
    br ? `Q ${x2} ${y2} ${x2 - br} ${y2}` : `L ${x2} ${y2}`,
    `L ${x + bl} ${y2}`,
    bl ? `Q ${x} ${y2} ${x} ${y2 - bl}` : `L ${x} ${y2}`,
    `L ${x} ${y + tl}`,
    tl ? `Q ${x} ${y} ${x + tl} ${y}` : `L ${x} ${y}`,
    'Z',
  ].join(' ');
}

function shouldClearForLogo(
  px: number,
  py: number,
  cellSize: number,
  canvasSize: number,
  logoScale: number,
) {
  const logoSize = Math.max(16, Math.floor(canvasSize * logoScale));
  const logoX = (canvasSize - logoSize) / 2;
  const logoY = (canvasSize - logoSize) / 2;
  const clearMarginPx = 0;
  const clearSize = logoSize + clearMarginPx * 2;
  const clearX = logoX - clearMarginPx;
  const clearY = logoY - clearMarginPx;

  // Rect (bounding-box check; radius not needed for exclusion)
  const cellX2 = px + cellSize;
  const cellY2 = py + cellSize;
  const clearX2 = clearX + clearSize;
  const clearY2 = clearY + clearSize;

  const intersects = px < clearX2 && cellX2 > clearX && py < clearY2 && cellY2 > clearY;

  return intersects;
}
