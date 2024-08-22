import clsx from 'clsx';
import throttle from 'lodash/throttle';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Helmet from 'soapbox/components/helmet';
import { useSoapboxConfig, useInstance } from 'soapbox/hooks';

import { Card, CardBody, CardHeader, CardTitle, type CardSizes } from '../card/card';

type IColumnHeader = Pick<IColumn, 'label' | 'backHref' | 'className' | 'action'>;

/** Contains the column title with optional back button. */
const ColumnHeader: React.FC<IColumnHeader> = ({ label, backHref, className, action }) => {
  const history = useHistory();

  const handleBackClick = () => {
    if (backHref) {
      history.push(backHref);
      return;
    }

    if (history.length === 1) {
      history.push('/');
    } else {
      history.goBack();
    }
  };

  return (
    <CardHeader className={className} onBackClick={handleBackClick}>
      <CardTitle title={label} />

      {action && (
        <div className='flex grow justify-end'>
          {action}
        </div>
      )}
    </CardHeader>
  );
};

export interface IColumn {
  /** Route the back button goes to. */
  backHref?: string;
  /** Column title text. */
  label?: string;
  /** Whether this column should have a transparent background. */
  transparent?: boolean;
  /** Whether this column should have a title and back button. */
  withHeader?: boolean;
  /** Extra class name for top <div> element. */
  className?: string;
  /** Extra class name for the <CardBody> element. */
  bodyClassName?: string;
  /** Ref forwarded to column. */
  ref?: React.Ref<HTMLDivElement>;
  /** Children to display in the column. */
  children?: React.ReactNode;
  /** Action for the ColumnHeader, displayed at the end. */
  action?: React.ReactNode;
  /** Column size, inherited from Card. */
  size?: CardSizes;
}

// Utility to format the instance title into a suitable filename
const formatFilename = (title: string): string => {
  return title.toLowerCase().replace(/ /g, '');
};

/** A backdrop for the main section of the UI. */
const Column: React.FC<IColumn> = React.forwardRef((props, ref: React.ForwardedRef<HTMLDivElement>): JSX.Element => {
  const { backHref, children, label, transparent = false, withHeader = true, className, bodyClassName, action, size } = props;
  const soapboxConfig = useSoapboxConfig();
  const [isScrolled, setIsScrolled] = useState(false);
  const instance = useInstance();

  interface InstanceType {
    title: string;
  }
  
  const useMetaTags = (instance: InstanceType): { title: string; metaTags: JSX.Element[] } => {
    let title: string, description: string;
    const metaTags: JSX.Element[] = [];

    // Format the instance title to use as a filename
    const imageName = formatFilename(instance.title) + '.jpg';
    const imageUrl = `https://www.collabfc.com/img/og/teams/${imageName}`;
  
    switch (window.location.pathname) {
      case '/':
        title = 'CollabFC Team Hub Home';
        description = `Join ${instance.title}'s fediverse fan community on CollabFC. Connect with other supporters, explore team-specific hubs, and engage in real-time football discussions.`;
        break;
      case '/timeline/local':
        title = 'CollabFC Local Timeline';
        description = `Explore the latest local posts and discussions from ${instance.title} fans on CollabFC. Stay connected with the community's thoughts, insights, and updates about ${instance.title}.`;
        break;
      case '/timeline/global':
        title = 'CollabFC Global Timeline';
        description = 'Explore posts from all over the CollabFC network. Discover global perspectives and news from different fanbases around the world.';
        break;
      default:
        title = instance.title;
        description = '';
    }
  
    const titleAppend = title + ` | ${instance.title}`;
  
    if (description) {
      metaTags.push(
        <meta key='description' name='description' content={description} />,
        <meta key='og:title' property='og:title' content={titleAppend} />,
        <meta key='og:description' property='og:description' content={description} />,
        <meta key='og:image' property='og:image' content={imageUrl} />,
        <meta key='twitter:title' name='twitter:title' content={titleAppend} />,
        <meta key='twitter:description' name='twitter:description' content={description} />,
        <meta key='twitter:image' name='twitter:image' content={imageUrl} />,
      );
  
      if (window.location.pathname === '/') {
        const schemaOrgJSON = {
          '@context': 'http://schema.org',
          '@type': 'WebSite',
          'name': titleAppend,
          'description': description,
          'sameAs': [
            'https://x.com/collabfc',
            'https://www.threads.net/@thecollabfc',
          ],
        };
        metaTags.push(
          <script key='schema-org' type='application/ld+json'>{JSON.stringify(schemaOrgJSON)}</script>,
        );
      }
    }
  
    return { title: title, metaTags };
  };
  

  const { title, metaTags } = useMetaTags(instance);

  const handleScroll = useCallback(throttle(() => {
    setIsScrolled(window.pageYOffset > 32);
  }, 50), []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div role='region' className='relative' ref={ref} aria-label={label} column-type={transparent ? 'transparent' : 'filled'}>
      <Helmet>
        <link rel='apple-touch-icon' sizes='180x180' href='https://www.collabfc.com/img/icons/favicon/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='https://www.collabfc.com/img/icons/favicon/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='https://www.collabfc.com/img/icons/favicon/favicon-16x16.png' />
        <link rel='manifest' href='https://www.collabfc.com/img/icons/favicon/site.webmanifest' />

        {metaTags}

        <title>{title}</title>

        {soapboxConfig.appleAppId && (
          <meta
            data-react-helmet='true'
            name='apple-itunes-app'
            content={`app-id=${soapboxConfig.appleAppId}, app-argument=${location.href}`}
          />
        )}
      </Helmet>



      <Card size={size} variant={transparent ? undefined : 'rounded'} className={className}>
        {withHeader && (
          <ColumnHeader
            label={label}
            backHref={backHref}
            className={clsx({
              'rounded-t-3xl': !isScrolled && !transparent,
              'sticky top-12 z-10 bg-white/90 dark:bg-primary-900/90 black:bg-black/90 backdrop-blur lg:top-16': !transparent,
              'p-4 sm:p-0 sm:pb-4 black:p-4': transparent,
              '-mt-4 -mx-4 p-4': size !== 'lg' && !transparent,
              '-mt-4 -mx-4 p-4 sm:-mt-6 sm:-mx-6 sm:p-6': size === 'lg' && !transparent,
            })}
            action={action}
          />
        )}

        <CardBody className={bodyClassName}>
          {children}
        </CardBody>
      </Card>
    </div>
  );
});

export {
  Column,
  ColumnHeader,
};
