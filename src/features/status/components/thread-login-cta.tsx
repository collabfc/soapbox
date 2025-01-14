import { FormattedMessage } from 'react-intl';

import Button from 'soapbox/components/ui/button.tsx';
import { Card, CardTitle } from 'soapbox/components/ui/card.tsx';
import Stack from 'soapbox/components/ui/stack.tsx';
import Text from 'soapbox/components/ui/text.tsx';
import { useInstance } from 'soapbox/hooks/useInstance.ts';
import { useSoapboxConfig } from 'soapbox/hooks/useSoapboxConfig.ts';

/** Prompts logged-out users to log in when viewing a thread. */
const ThreadLoginCta: React.FC = () => {
  const { instance } = useInstance();
  const { displayCta } = useSoapboxConfig();

  if (!displayCta) return null;

  return (
    <Stack className=''>

      <Card className='mb-6 px-6 py-8 text-start' variant='rounded'>
        <Stack>
          <div className='mb-4'>
            <CardTitle title={<FormattedMessage id='thread_login.pitch' defaultMessage='What is Collab FC? Come and join us!' />} />
          </div>
          <div className='space-y-3'>
            <Text>
              <FormattedMessage
                id='thread_login.intro'
                defaultMessage={`CollabFC is a unique social media platform built around a collection of digital team hubs. This is the {siteTitle} hub.`}
                values={{ siteTitle: instance.title }}
              />
            </Text>
            <Text>
              <FormattedMessage
                id='thread_login.engagement'
                defaultMessage={`Each team hub serves as a dedicated space for a club's supporters, but fans from different clubs can also engage and comment on one another's posts.`}
              />
            </Text>
            <Text>
              <FormattedMessage
                id='thread_login.expansion'
                defaultMessage={`Currently, we have 78 European team hubs, with plans to expand to 200. We are seeking fans to moderate their own club's hub. If you are interested, visit {link} to see the full list of clubs.`}
                values={{  
                  link: (
                    <a href='https://www.collabfc.com' className='underline font-bold'>
                      our main page
                    </a>
                  )
                }}
              />
            </Text>
            <Text>
              <FormattedMessage
                id='thread_login.goal'
                defaultMessage={`By empowering fans to self-moderate, we aim to reduce spam, improve post quality, and create a vibrant global football social platform.`}
              />
            </Text>
          </div>
        </Stack>
      </Card>



      <Card className='space-y-6 px-6 py-12 text-center' variant='rounded'>
        <Stack>
          <div className='mb-4'>
            <CardTitle title={<FormattedMessage id='thread_login.title'  defaultMessage='Continue the conversation' />} />
          </div>
          <Text>
            <FormattedMessage
              id='thread_login.message'
              defaultMessage='Become a part of the {siteTitle} community.'
              values={{ siteTitle: instance.title }}
            />
          </Text>
        </Stack>

        <Stack space={4} className='mx-auto mt-5 max-w-xs'>
          <Button theme='tertiary' to='/login' block>
            <FormattedMessage id='thread_login.login' defaultMessage='Log in' />
          </Button>
          <Button to='/signup' block>
            <FormattedMessage id='thread_login.signup' defaultMessage='Sign up' />
          </Button>
        </Stack>
      </Card>

     
    </Stack>
  );
};

export default ThreadLoginCta;
