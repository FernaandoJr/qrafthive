'use client';
import i18n, { t } from 'i18next';
import { initReactI18next } from 'react-i18next';

// PT-BR
import commonPtBR from './locales/ptBR/common.json' with { type: 'json' };
import errorPtBR from './locales/ptBR/error.json' with { type: 'json' };
import warningPtBR from './locales/ptBR/warning.json' with { type: 'json' };

// EN-US
import commonEnUS from './locales/enUS/common.json' with { type: 'json' };
import errorEnUS from './locales/enUS/error.json' with { type: 'json' };
import warningEnUS from './locales/enUS/warning.json' with { type: 'json' };

const resources = {
  ptBR: {
    common: { ...commonPtBR },
    error: errorPtBR,
    warning: warningPtBR,
  },
  enUS: {
    common: commonEnUS,
    error: errorEnUS,
    warning: warningEnUS,
  },
};

// Ler idioma do cookie se existir
const getInitialLanguage = (): string => {
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    const localeCookie = cookies.find((c) => c.trim().startsWith('NEXT_LOCALE='));
    if (localeCookie) {
      return localeCookie.split('=')[1]?.trim() ?? 'enUS';
    }
  }
  return 'enUS';
};

i18n.use(initReactI18next).init({
  resources,
  ns: ['common', 'error', 'warning', 'metadata'],
  lng: getInitialLanguage(),
  defaultNS: 'common',
  nsSeparator: '.',
  appendNamespaceToMissingKey: true,
  parseMissingKeyHandler: (key) => {
    return key;
  },
});

export default i18n;
export { I18nextProvider, useTranslation } from 'react-i18next';
export { t };
