import { Elysia, ValidationError } from 'elysia';

type ErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    path?: string;
  };
};

const statusByCode: Record<string, number> = {
  VALIDATION: 400,
  NOT_FOUND: 404,
  PARSE: 400,
  INTERNAL_SERVER_ERROR: 500,
  UNKNOWN: 500,
};

export const errorPlugin = new Elysia({ name: 'error-plugin' }).onError(
  ({ code, error, set, path }): ErrorResponse => {
    const codeKey: string = typeof code === 'string' ? code : String(code);
    set.status = statusByCode[codeKey] ?? 500;

    const isValidation = error instanceof ValidationError;
    const details = isValidation ? (error.all ?? error.validator ?? error.message) : undefined;

    return {
      success: false,
      error: {
        code: codeKey,
        message: isValidation
          ? 'Validation failed'
          : error instanceof Error
            ? error.message
            : 'Internal Server Error',
        details,
        path,
      },
    };
  },
);
