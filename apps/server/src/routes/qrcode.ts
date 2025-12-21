import { Elysia } from 'elysia';
import { ErrorCorrectionLevel, type IQrcodeRequest } from '../types/qrcode';
import { qrcodeSchema, renderQrSvg } from '../utils/qrcode';

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
      logoScale = 5.5,
      logoMinDistance = 2, // equivale a ~0.1 após normalização
      logoBackgroundColor = 'transparent',
      logoMaskMode = 'alphaCell',
      logoBorderMargin = 1, // equivale a ~0.02 após normalização
      moduleShape = 'square',
    } = body;

    const svg = await renderQrSvg({
      data,
      ecLevel: errorCorrectionLevel,
      size: width,
      margin,
      darkColor,
      lightColor,
      cornerColor: cornerColor ?? darkColor,
      cornerInnerColor: cornerInnerColor ?? darkColor,
      logoUrl,
      logoScale,
      logoMinDistance,
      logoBackgroundColor,
      logoMaskMode,
      logoBorderMargin,
      moduleShape,
    });

    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Content-Length': Buffer.byteLength(svg, 'utf-8').toString(),
      },
    });
  },
  { body: qrcodeSchema },
);
