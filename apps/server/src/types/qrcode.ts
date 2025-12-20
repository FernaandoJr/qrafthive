export enum ErrorCorrectionLevel {
  L = 'L',
  M = 'M',
  Q = 'Q',
  H = 'H',
}

export enum OutputType {
  PNG = 'png',
  DATA_URL = 'data_url',
}

export interface IQrcodeRequest {
  data: string;
  errorCorrectionLevel?: ErrorCorrectionLevel;
  width?: number;
  output?: OutputType;
}
