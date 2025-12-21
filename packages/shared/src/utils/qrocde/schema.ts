import { t } from 'elysia';
import { ErrorCorrectionLevel, LogoMaskModeEnum, ModuleShapeEnum } from '../../types/qrcode';

export const qrcodeSchema = t.Object({
  data: t.String({ minLength: 1 }),
  errorCorrectionLevel: t.Enum(ErrorCorrectionLevel, { default: ErrorCorrectionLevel.M }),
  width: t.Number({ minimum: 64, maximum: 1024, default: 256 }),
  margin: t.Number({ minimum: 0, maximum: 32, default: 4 }),
  darkColor: t.String({ default: '#000000' }),
  lightColor: t.String({ default: '#ffffff' }),
  cornerColor: t.String({ default: '#000000' }),
  cornerInnerColor: t.String({ default: '#000000' }),
  moduleShape: t.Enum(ModuleShapeEnum, { default: ModuleShapeEnum.square }),
  logo: t.Optional(
    t.Object({
      url: t.String({ format: 'url' }),
      scale: t.Number({ minimum: 0 }),
      maskMode: t.Enum(LogoMaskModeEnum),
      borderMargin: t.Number({ minimum: 0, maximum: 10 }),
    }),
  ),
});
