import { Elysia, t } from 'elysia';
import QRCode from 'qrcode';
import { ErrorCorrectionLevel, OutputType } from '../types/qrcode';

const schema = t.Object({
  data: t.String({ minLength: 1 }),
  errorCorrectionLevel: t.Optional(
    t.Enum(ErrorCorrectionLevel, { default: ErrorCorrectionLevel.M }),
  ),
  width: t.Optional(t.Number({ minimum: 64, maximum: 1024 })),
  output: t.Optional(t.Enum(OutputType, { default: OutputType.PNG })),
});

export const qrcodeRoutes = new Elysia({ prefix: '/qrcode' }).post(
  '/',
  async ({ body }) => {
    const { data, errorCorrectionLevel, width, output } = body;

    if (output === OutputType.DATA_URL) {
      const dataUrl = await QRCode.toDataURL(data, {
        errorCorrectionLevel,
        width,
      });
      return { success: true, data: { dataUrl } };
    }

    const buffer = await QRCode.toBuffer(data, {
      type: OutputType.PNG,
      errorCorrectionLevel,
      width,
    });

    const pngBytes = new Uint8Array(buffer);

    return new Response(pngBytes, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': pngBytes.byteLength.toString(),
        'Content-Disposition': 'inline; filename="qrcode.png"',
      },
    });
  },
  { body: schema },
);
