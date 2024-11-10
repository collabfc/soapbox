import clsx from 'clsx';

import soapboxLogoWhiteSrc from 'soapbox/assets/images/soapbox-logo-white.svg';
import soapboxLogoSrc from 'soapbox/assets/images/soapbox-logo.svg';
import { useSoapboxConfig, useSettings, useTheme } from 'soapbox/hooks/index.ts';

interface ISiteLogo extends React.ComponentProps<'img'> {
  /** Extra class names for the <img> element. */
  className?: string;
  /** Override theme setting for <SitePreview /> */
  theme?: 'dark' | 'light';
}

/** Display the most appropriate site logo based on the theme and configuration. */
const SiteLogo: React.FC<ISiteLogo> = ({ className, theme, ...rest }) => {
  const { logo, logoDarkMode } = useSoapboxConfig();
  const { demo } = useSettings();

  let darkMode = ['dark', 'black'].includes(useTheme());
  if (theme === 'dark') darkMode = true;

  /** Soapbox logo. */
  const soapboxLogo = darkMode ? soapboxLogoWhiteSrc : soapboxLogoSrc;

  // Use the right logo if provided, then use fallbacks.
  const getSrc = () => {
    // In demo mode, use the Soapbox logo.
    if (demo) return soapboxLogo;

    return (darkMode && logoDarkMode)
      ? logoDarkMode
      : logo || logoDarkMode || soapboxLogo;
  };

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img
      className={clsx('object-contain', className)}
      src={getSrc()}
      {...rest}
    />
  );
};

export default SiteLogo;
