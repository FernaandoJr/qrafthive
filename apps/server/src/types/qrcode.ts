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
  // Extra margin (0–0.3) around the logo to clear QR modules
  logoClearMargin?: number;
  // Background behind the logo; use "transparent" to avoid a solid box
  logoBackgroundColor?: string;
  // Corner radius factor (0–0.5) for the knockout box
  logoClearRadius?: number;
  // Knockout shape: "rect" (default) or "circle"
  logoClearShape?: 'rect' | 'circle';
  // Background application: "box" (shape) or "alpha" (mask by logo alpha)
  logoMaskMode?: 'box' | 'alpha';
}
