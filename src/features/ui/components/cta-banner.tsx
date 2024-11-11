import { FormattedMessage } from 'react-intl';

import Banner from 'soapbox/components/ui/banner.tsx';
import Button from 'soapbox/components/ui/button.tsx';
import HStack from 'soapbox/components/ui/hstack.tsx';
import Stack from 'soapbox/components/ui/stack.tsx';
import Text from 'soapbox/components/ui/text.tsx';
import { useAppSelector } from 'soapbox/hooks/useAppSelector.ts';
import { useInstance } from 'soapbox/hooks/useInstance.ts';
import { useRegistrationStatus } from 'soapbox/hooks/useRegistrationStatus.ts';
import { useSoapboxConfig } from 'soapbox/hooks/useSoapboxConfig.ts';

const CtaBanner = () => {
  const { instance } = useInstance();
  const { isOpen } = useRegistrationStatus();
  const { displayCta } = useSoapboxConfig();
  const me = useAppSelector((state) => state.me);

  if (me || !displayCta || !isOpen) return null;

  return (
    <div data-testid='cta-banner' className='hidden lg:block'>
      <Banner theme='frosted'>
        <HStack alignItems='center' justifyContent='between'>
          <Stack>
            <Text theme='white' size='xl' weight='bold'>
              <FormattedMessage id='signup_panel.title' defaultMessage='New to {site_title}?' values={{ site_title: instance.title }} />
            </Text>

            <Text theme='white' weight='medium' className='opacity-90'>
              <FormattedMessage id='signup_panel.subtitle' defaultMessage="Sign up now to discuss what's happening." />
            </Text>
          </Stack>

          <HStack space={2} alignItems='center'>
            <Button theme='secondary' to='/login'>
              <FormattedMessage id='account.login' defaultMessage='Log in' />
            </Button>

            <Button theme='accent' to='/signup'>
              <FormattedMessage id='account.register' defaultMessage='Sign up' />
            </Button>
          </HStack>
        </HStack>
      </Banner>
    </div>
  );
};

export default CtaBanner;
