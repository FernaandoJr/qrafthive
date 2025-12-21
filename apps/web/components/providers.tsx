import i18n, { I18nextProvider } from '@repo/i18n';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ThemeProvider } from './darkMode';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <NuqsAdapter>
        <ThemeProvider>{children}</ThemeProvider>
      </NuqsAdapter>
    </I18nextProvider>
  );
}
