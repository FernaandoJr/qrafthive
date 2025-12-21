export enum ErrorCorrectionLevel {
  L = 'L',
  M = 'M',
  Q = 'Q',
  H = 'H',
}

export enum ModuleShapeEnum {
  square = 'square',
  circle = 'circle',
  diamond = 'diamond',
  rounded = 'rounded',
  outlined = 'outlined',
}

export enum LogoMaskModeEnum {
  box = 'box',
  alphaCell = 'alphaCell',
}

export interface IQrcodeRequest {
  data: string;
  errorCorrectionLevel: ErrorCorrectionLevel;
  width: number;
  margin: number;
  darkColor: string;
  lightColor: string;
  cornerColor: string;
  cornerInnerColor: string;
  moduleShape: ModuleShapeEnum;
  logo?: {
    url: string;
    scale: number;
    maskMode: LogoMaskModeEnum;
    borderMargin: number;
  };
}
