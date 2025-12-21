import QRCode from 'qrcode';
import sharp from 'sharp';
import { IQrcodeRequest, LogoMaskModeEnum, ModuleShapeEnum } from '../../types/qrcode';
import { buildRoundedPath } from './buildRoundedPath';
import { hashId } from './hashId';
import { makeBoxForLogo } from './makeBoxForLogo';

export async function renderQrSvg(options: IQrcodeRequest) {
  const {
    data,
    errorCorrectionLevel,
    width,
    margin,
    darkColor,
    lightColor,
    cornerColor,
    cornerInnerColor,
    logo,
    moduleShape,
  } = options;

  // Clamp logo scale so it never covers the whole canvas (35% max)
  const normalizedLogoScale = Math.min(0.35, Math.max(0, logo?.scale ?? 0) * 0.04);
  const normalizedLogoBorderMargin = Math.max(0, Math.min(logo?.borderMargin ?? 0, 10)) * 0.02;
  const qr = QRCode.create(data, { errorCorrectionLevel });
  const modules = qr.modules;
  const count = modules.size;
  const cellSize = Math.max(1, Math.floor(width / (count + margin * 2)));
  const canvasSize = cellSize * (count + margin * 2);
  const rects: string[] = [];
  const finderEnd = count - 7;
  let shouldSkipCell: ((px: number, py: number) => boolean) | null = null;
  let logoBuffer: Buffer | null = null;
  let logoMime: string | null = null;

  if (logo) {
    const res = await fetch(logo.url);
    if (!res.ok) {
      throw new Error(`Failed to fetch logo: ${res.status} ${res.statusText}`);
    }
    logoBuffer = Buffer.from(await res.arrayBuffer());
    logoMime = res.headers.get('content-type') ?? 'image/png';
  }

  let logoWidthPx: number | null = null;
  let logoHeightPx: number | null = null;
  if (logo) {
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
  const extraGapPx = 0;
  const logoX = logoWidthPx !== null ? (canvasSize - logoWidthPx) / 2 : null;
  const logoY = logoHeightPx !== null ? (canvasSize - logoHeightPx) / 2 : null;
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
    logo &&
    logo.maskMode === LogoMaskModeEnum.alphaCell &&
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
    const alphaThreshold = 8;
    const haloPx = 0;
    let minAx = info.width;
    let maxAx = -1;
    let minAy = info.height;
    let maxAy = -1;

    for (let iy = 0; iy < info.height; iy++) {
      for (let ix = 0; ix < info.width; ix++) {
        const alpha = raw[iy * stride + ix * 4 + 3];
        if (alpha && alpha >= alphaThreshold) {
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
            if (alpha && alpha > maxAlpha) maxAlpha = alpha;
            if (maxAlpha >= alphaThreshold) return true; // drop cell as soon as we see opacity
          }
        }
      }

      return false;
    };

    clearBox = null;
  }

  // background
  rects.push(`<rect width="${canvasSize}" height="${canvasSize}" fill="${lightColor}" />`);

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
      if (logo) {
        if (logo.maskMode === LogoMaskModeEnum.box) {
          if (makeBoxForLogo(px, py, cellSize, canvasSize, normalizedLogoScale)) {
            continue;
          }
        } else if (
          logo.maskMode === LogoMaskModeEnum.alphaCell &&
          shouldSkipCell &&
          shouldSkipCell(px, py)
        ) {
          continue;
        }
      }

      // circle
      if (moduleShape === ModuleShapeEnum.circle) {
        const r = cellSize / 2;
        rects.push(`<circle cx="${cellCx}" cy="${cellCy}" r="${r}" fill="${fill}" />`);
      }

      // diamond
      if (moduleShape === ModuleShapeEnum.diamond) {
        const r = cellSize / 2;
        rects.push(
          `<path d="M ${cellCx} ${cellCy - r} L ${cellCx + r} ${cellCy} L ${cellCx} ${cellCy + r} L ${cellCx - r} ${cellCy} Z" fill="${fill}" />`,
        );
      }

      // rounded
      if (moduleShape === ModuleShapeEnum.rounded) {
        const n = y > 0 && modules.get(x, y - 1);
        const s = y + 1 < count && modules.get(x, y + 1);
        const w = x > 0 && modules.get(x - 1, y);
        const e = x + 1 < count && modules.get(x + 1, y);
        const r = Math.min(cellSize / 2, Math.floor(cellSize * 0.45));

        const tl = !n && !w ? r : 0;
        const tr = !n && !e ? r : 0;
        const br = !s && !e ? r : 0;
        const bl = !s && !w ? r : 0;

        const d = buildRoundedPath(px, py, cellSize, { tl, tr, br, bl });
        rects.push(`<path d="${d}" fill="${fill}" />`);
      }

      // outlined
      if (moduleShape === ModuleShapeEnum.outlined) {
        const strokeWidth = Math.max(1, Math.floor(cellSize * 0.18));
        rects.push(
          `<rect x="${px}" y="${py}" width="${cellSize}" height="${cellSize}" fill="${fill}" stroke="${lightColor}" stroke-width="${strokeWidth}" />`,
        );
      }

      // square
      if (moduleShape === ModuleShapeEnum.square) {
        rects.push(
          `<rect x="${px}" y="${py}" width="${cellSize}" height="${cellSize}" fill="${fill}" />`,
        );
      }
    }
  }

  let logoFragment = '';
  let clearFragment = '';
  let defsFragment = '';
  if (logo && logoBuffer && logoMime) {
    const logoWidth = logoWidthPx ?? Math.max(16, Math.floor(canvasSize * normalizedLogoScale));
    const logoHeight = logoHeightPx ?? logoWidth;
    const logoX = (canvasSize - logoWidth) / 2;
    const logoY = (canvasSize - logoHeight) / 2;

    const base64 = logoBuffer.toString('base64');
    const dataHref = `data:${logoMime};base64,${base64}`;

    if (logo.maskMode === LogoMaskModeEnum.box) {
      const borderHaloPx = Math.max(
        0,
        Math.floor(Math.max(logoWidth, logoHeight) * normalizedLogoBorderMargin),
      );
      const boxX = logoX - borderHaloPx;
      const boxY = logoY - borderHaloPx;
      const boxW = logoWidth + borderHaloPx * 2;
      const boxH = logoHeight + borderHaloPx * 2;
      const clearFill = lightColor;
      clearFragment = `<rect x="${boxX}" y="${boxY}" width="${boxW}" height="${boxH}" fill="${clearFill}" />`;
    }

    if (logo.maskMode === LogoMaskModeEnum.alphaCell) {
      const borderHaloPx = Math.max(
        0,
        Math.floor(Math.max(logoWidth, logoHeight) * normalizedLogoBorderMargin),
      );
      if (borderHaloPx > 0) {
        const logoIdBase = hashId(
          `${logo.url}-${canvasSize}-${logoWidth}-${logoHeight}-alphaCell-${borderHaloPx}`,
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
    }

    logoFragment = `<image href="${dataHref}" x="${logoX}" y="${logoY}" width="${logoWidth}" height="${logoHeight}" preserveAspectRatio="xMidYMid meet" />`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasSize}" height="${canvasSize}" viewBox="0 0 ${canvasSize} ${canvasSize}" shape-rendering="crispEdges" role="img">${rects.join(
    '',
  )}${defsFragment}${clearFragment}${logoFragment}</svg>`;
}
