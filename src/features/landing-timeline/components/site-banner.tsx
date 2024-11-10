import DOMPurify from 'isomorphic-dompurify';

import Markup from 'soapbox/components/markup.tsx';
import { Stack } from 'soapbox/components/ui/index.ts';
import { useInstance } from 'soapbox/hooks/index.ts';
import { getTextDirection } from 'soapbox/utils/rtl.ts';

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
  const description = DOMPurify.sanitize(instance.description);
  const imageName = useFormattedFilename();  // Using the custom hook here

  return (
    <Stack space={3}>
      <LogoText dir={getTextDirection(instance.title)}>
        {instance.title}'s CollabFC Team Hub.
      </LogoText>

      <Markup
        size='md'
        dangerouslySetInnerHTML={{ __html: description }}
        direction={getTextDirection(description)}
      />

      <div className='container mx-auto'>
        <img className='my-3' src={imageName} alt='club logo banner' />
        <h2 className='my-3 overflow-hidden text-ellipsis bg-gradient-to-br from-accent-500 via-primary-500 to-gradient-end bg-clip-text text-3xl font-extrabold !leading-normal text-transparent lg:text-3xl xl:text-3xl'>About CollabFC</h2>
        <p className='py-5'>CollabFC works a bit differently from most social networks. Each football team has its own dedicated team hub with its own feed and set of users. These are networked together to form the whole platform. You join one team and post under that team hub, but you can also interact with other team hub users.</p>
        <ul className='list-disc py-4 pl-4'>
          <li className='mb-2'><a className='font-bold underline' data-preview-title-id='column.home' href='/timeline/local'>The {instance.title} Timeline</a> shows you all posts that are created by users of this team hub.</li>
          <li className='mb-2'><a className='font-bold underline' data-preview-title-id='column.home' href='/timeline/global'>The League Timeline</a> is where you can read all other posts from all other teams; you can follow these posters and reply to their posts.</li>
        </ul>
        <p className='py-3'>We want to recreate the moderated team space that forums used to have, free of spam and bots. But with the technology of modern social networks at a global level.</p>
        <p className='py-3'><a href='https://www.collabfc.com/#teams' className='font-bold underline'>See All Teams</a> on our main page and read about our plans for growing the platform.</p>
      </div>
    </Stack>
  );
};

export { SiteBanner };
