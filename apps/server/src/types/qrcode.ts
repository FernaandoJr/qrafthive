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
  // Escala 0–10 (10 equivale à escala antiga 0.4 do canvas)
  logoScale?: number;
  // Gap radial: 0–10 (10 equivale ao antigo 0.5)
  logoMinDistance?: number;
  // Background behind the logo; use "transparent" to avoid a solid box
  logoBackgroundColor?: string;
  // Background application: "box" (shape), "alpha" (mask vector), "alphaCell" (por célula do QR)
  logoMaskMode?: 'box' | 'alpha' | 'alphaCell';
  // Borda: 0–10 (10 equivale ao antigo 0.2)
  logoBorderMargin?: number;
}
