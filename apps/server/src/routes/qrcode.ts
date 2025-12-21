import { IQrcodeRequest, qrcodeSchema, renderQrSvg } from '@repo/shared';
import { Elysia } from 'elysia';

export const qrcodeRoutes = new Elysia({ prefix: '/qrcode' }).post(
  '/',
  async ({ body }: { body: IQrcodeRequest }) => {
    const {
      data,
      errorCorrectionLevel,
      width,
      margin,
      darkColor,
      lightColor,
      cornerColor,
      cornerInnerColor,
      moduleShape,
      logo,
    } = body;

    const svg = await renderQrSvg({
      data,
      errorCorrectionLevel,
      width,
      margin,
      darkColor,
      lightColor,
      cornerColor: cornerColor ?? darkColor,
      cornerInnerColor: cornerInnerColor ?? darkColor,
      moduleShape,
      logo,
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
