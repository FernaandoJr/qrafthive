import { t } from 'elysia';
import { ErrorCorrectionLevel } from '../../types/qrcode';

export const qrcodeSchema = t.Object({
  data: t.String({ minLength: 1 }),
  errorCorrectionLevel: t.Optional(t.Enum(ErrorCorrectionLevel)),
  width: t.Optional(t.Number({ minimum: 64, maximum: 1024 })),
  margin: t.Optional(t.Number({ minimum: 0, maximum: 32 })),
  darkColor: t.Optional(t.String()),
  lightColor: t.Optional(t.String()),
  cornerColor: t.Optional(t.String()),
  cornerInnerColor: t.Optional(t.String()),
  logoUrl: t.Optional(t.String({ format: 'url' })),
  logoScale: t.Optional(t.Number({ minimum: 0, maximum: 10 })),
  logoMinDistance: t.Optional(t.Number({ minimum: 0, maximum: 10 })),
  logoBackgroundColor: t.Optional(t.String()),
  logoMaskMode: t.Optional(t.Union([t.Literal('box'), t.Literal('alpha'), t.Literal('alphaCell')])),
  logoBorderMargin: t.Optional(t.Number({ minimum: 0, maximum: 10 })),
});
