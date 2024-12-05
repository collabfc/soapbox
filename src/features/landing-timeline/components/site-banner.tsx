import Stack from 'soapbox/components/ui/stack.tsx';
import { useInstance } from 'soapbox/hooks/useInstance.ts';
import { getTextDirection } from 'soapbox/utils/rtl.ts';
import { useIntl } from 'react-intl';

import { LogoText } from './logo-text.tsx';

// Custom hook to format the instance title into a suitable filename
const useFormattedFilename = (): string => {
  const { instance } = useInstance();
  const imageName = instance.title.toLowerCase().replace(/ /g, '-');
  const imageUrl = `https://www.collabfc.com/img/og/teams/${imageName}.jpg`;
  return imageUrl;
};

const SiteBanner: React.FC = () => {
  const { instance } = useInstance();
  const intl = useIntl();
  const imageName = useFormattedFilename(); // Using the custom hook here

  return (
    <Stack space={3}>
      <LogoText dir={getTextDirection(instance.title)}>
        {intl.formatMessage(
          { id: 'siteBanner.bannerTitle', defaultMessage: '{title} CollabFC Team Hub.' },
          { title: instance.title }
        )}
      </LogoText>

      <div className='container'>
        <img className='my-3' src={imageName} alt='club logo banner' />
        <h2 className='mt-4 mb-3 overflow-hidden text-ellipsis bg-gradient-to-br from-accent-500 via-primary-500 to-gradient-end bg-clip-text text-3xl font-extrabold !leading-normal text-transparent lg:text-3xl xl:text-3xl'>
          {intl.formatMessage({ id: 'siteBanner.aboutTitle', defaultMessage: 'About CollabFC' })}
        </h2>
        <p className='pt-5'>
          {intl.formatMessage({
            id: 'siteBanner.aboutDescription',
            defaultMessage:
              'CollabFC works a bit differently from most social networks. Each football team has its own dedicated team hub with its own feed and set of users. These are networked together to form the whole platform. You join one team and post under that team hub, but you can also interact with other team hub users.',
          })}
        </p>
        <ul className='list-disc py-4 pl-4'>
          <li className='mb-2'>
            <a
              className='font-bold underline'
              data-preview-title-id='column.home'
              href='/timeline/local'
            >
              {intl.formatMessage(
                { id: 'siteBanner.localTimeline', defaultMessage: 'The {title} Timeline' },
                { title: instance.title }
              )}
            </a>{' '}
            {intl.formatMessage({
              id: 'siteBanner.localTimelineDescription',
              defaultMessage: 'shows you all posts that are created by users of this team hub.',
            })}
          </li>
          <li className='mb-2'>
            <a
              className='font-bold underline'
              data-preview-title-id='column.home'
              href='/timeline/global'
            >
              {intl.formatMessage({
                id: 'siteBanner.leagueTimeline',
                defaultMessage: 'The National Timeline',
              })}
            </a>{' '}
            {intl.formatMessage({
              id: 'siteBanner.leagueTimelineDescription',
              defaultMessage:
                'is where you can read all other posts from all other teams; you can follow these posters and reply to their posts.',
            })}
          </li>
        </ul>
        <p className='py-3'>
          <a href='https://www.collabfc.com/#teams' className='font-bold underline'>
            {intl.formatMessage({ id: 'siteBanner.seeAllTeams', defaultMessage: 'See All Teams' })}
          </a>{' '}
          {intl.formatMessage({ id: 'siteBanner.findOutMore', defaultMessage: 'on our main page and find out more' })}{' '}
          <a href='https://www.collabfc.com/#about' className='font-bold underline'>
            {intl.formatMessage({ id: 'siteBanner.aboutPlatform', defaultMessage: 'about the platform' })}
          </a>.
        </p>
      </div>
    </Stack>
  );
};

export { SiteBanner };
