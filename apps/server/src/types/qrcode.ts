export enum ErrorCorrectionLevel {
  L = 'L',
  M = 'M',
  Q = 'Q',
  H = 'H',
}

export interface IQrcodeRequest {
  data: string;
  errorCorrectionLevel?: ErrorCorrectionLevel;
  width?: number;
  margin?: number;
  darkColor?: string;
  lightColor?: string;
  cornerColor?: string;
  cornerInnerColor?: string;
  logoUrl?: string;
  logoScale?: number;
}
