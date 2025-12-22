import { ThemeProvider } from '@/contexts/theme';
import i18n, { I18nextProvider } from '@repo/i18n';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='dark'
      enableSystem={false}
      disableTransitionOnChange
      storageKey='theme'
    >
      <I18nextProvider i18n={i18n}>
        <NuqsAdapter>{children}</NuqsAdapter>
      </I18nextProvider>
    </ThemeProvider>
  );
}
