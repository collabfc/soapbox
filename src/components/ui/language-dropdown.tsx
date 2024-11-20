import worldIcon from '@tabler/icons/outline/world.svg';

import { openDropdownMenu } from 'soapbox/actions/dropdown-menu.ts';
import DropdownMenu, { MenuItem } from 'soapbox/components/dropdown-menu/index.ts';
import SvgIcon from 'soapbox/components/ui/svg-icon.tsx';
import { languages } from 'soapbox/features/preferences/index.tsx';
import { useAppDispatch } from 'soapbox/hooks/useAppDispatch.ts';

function formatLanguages(languageMap: Record<string, string>) {
  const langCodes = Object.keys(languageMap).sort().map((sig) => {
    return sig.substring(0, 2);
  });

  return [...new Set(langCodes)];
}

interface ILanguageDropdown {
  language: string;
  setLanguage(language: string): void;
}

/**
 * A dropdown menu component for selecting the display language of the public timeline.
 */
const LanguageDropdown: React.FC<ILanguageDropdown> = ({ language, setLanguage }) => {
  const dispatch = useAppDispatch();
  const formattedLanguages = formatLanguages(languages);

  const newMenu: MenuItem[] = [{ icon: worldIcon, text: 'Default', action: () => {
    setLanguage('');
  } }];

  formattedLanguages.map((lang: string) => {
    const languageName = languages[lang as keyof typeof languages];

    if (languageName) {
      newMenu.push({
        text: `${lang.toUpperCase()} - ${languageName}`,
        action: () => {
          setLanguage(lang);
        },
      });
    }
  });


  return (
    <DropdownMenu items={newMenu} modal>
      {language ? (
        <button type='button' className='flex h-full rounded-lg border-2 border-gray-700 px-1 text-gray-700 hover:cursor-pointer hover:border-gray-500 hover:text-gray-500 dark:border-white dark:text-white dark:hover:border-gray-700 sm:mr-4' onClick={() => dispatch(openDropdownMenu())}>
          {language.toUpperCase()}
        </button>
      ) : (
        <SvgIcon src={worldIcon} className='text-gray-700 hover:cursor-pointer hover:text-gray-500 black:absolute black:right-0 black:top-4 black:text-white black:hover:text-gray-600 dark:text-white sm:mr-4' />
      )}
    </DropdownMenu>
  );
};


export { LanguageDropdown };