'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import i18nInstance from '@repo/i18n';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const languages = [
  { name: 'en', label: 'english', image: '/languages/enUS.png' },
  { name: 'pt', label: 'portuguese', image: '/languages/ptBR.png' },
];

export default function SelectLanguage() {
  const { t } = useTranslation();
  const currentLang = i18nInstance.language;
  const selectedLang = languages.find((l) => l.name === currentLang) ?? languages[0];

  const handleChangeLanguage = (lang: string) => {
    i18nInstance.changeLanguage(lang);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <div className='cursor-pointer p-2'>
          <Image src={selectedLang.image} alt={selectedLang.label} width={20} height={14} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{t('common.languages')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((lang) => (
          <DropdownMenuItem key={lang.label} onClick={() => handleChangeLanguage(lang.name)}>
            <Image src={lang.image} alt={lang.label} width={16} height={12} />
            {t(`common.${lang.label}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
