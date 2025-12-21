'use client';
import i18n, { t } from 'i18next';
import { initReactI18next } from 'react-i18next';

// PT-BR
import commonPtBR from './locales/ptBR/common.json';
import errorPtBR from './locales/ptBR/error.json';
import warningPtBR from './locales/ptBR/warning.json';

// EN-US
import commonEnUS from './locales/enUS/common.json';
import errorEnUS from './locales/enUS/error.json';
import warningEnUS from './locales/enUS/warning.json';
// IT-IT
import commonItIT from './locales/itIT/common.json';
import errorItIT from './locales/itIT/error.json';
import warningItIT from './locales/itIT/warning.json';

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
  itIT: {
    common: { ...commonItIT },
    error: errorItIT,
    warning: warningItIT,
  },
};

// Ler idioma do cookie se existir
const getInitialLanguage = (): string => {
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    const localeCookie = cookies.find((c) => c.trim().startsWith('NEXT_LOCALE='));
    if (localeCookie) {
      return localeCookie.split('=')[1].trim();
    }
  }
  return 'ptBR';
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
