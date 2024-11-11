import alertTriangleIcon from '@tabler/icons/outline/alert-triangle.svg';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';


import { openModal } from 'soapbox/actions/modals.ts';
import { nostrExtensionLogIn } from 'soapbox/actions/nostr.ts';
import EmojiGraphic from 'soapbox/components/emoji-graphic.tsx';
import Button from 'soapbox/components/ui/button.tsx';
import Divider from 'soapbox/components/ui/divider.tsx';
import HStack from 'soapbox/components/ui/hstack.tsx';
import Modal from 'soapbox/components/ui/modal.tsx';
import Stack from 'soapbox/components/ui/stack.tsx';
import Text from 'soapbox/components/ui/text.tsx';
import { useNostr } from 'soapbox/contexts/nostr-context.tsx';
import { useAppDispatch } from 'soapbox/hooks/useAppDispatch.ts';
import { useInstance } from 'soapbox/hooks/useInstance.ts';
import { useSoapboxConfig } from 'soapbox/hooks/useSoapboxConfig.ts';

interface IExtensionStep {
  isLogin?: boolean;
  onClickAlt: () => void;
  onClose(): void;
}

const ExtensionStep: React.FC<IExtensionStep> = ({ isLogin, onClickAlt, onClose }) => {
  const dispatch = useAppDispatch();
  const { instance } = useInstance();
  const { logo } = useSoapboxConfig();
  const { relay } = useNostr();

  const handleClose = () => {
    onClose();
    dispatch(openModal('NOSTR_SIGNUP'));
  };

  const onClick = () => {
    if (relay) {
      dispatch(nostrExtensionLogIn(relay));
      onClose();
    }
  };

  return (
    <Modal
      title={isLogin ?
        <FormattedMessage id='nostr_login.siwe.title' defaultMessage='Log in' /> :  <FormattedMessage id='nostr_signup.siwe.title' defaultMessage='Sign up' />
      }
      width='sm'
      onClose={onClose}
    >
      <Stack space={6} justifyContent='center' alignItems='center' className='pb-6'>

        <Text weight='semibold'>
          <FormattedMessage id='nostr_signin.siwe.welcome' defaultMessage='Welcome to {site_title}' values={{ site_title: instance.title }} />
        </Text>

        {logo ?
          <div className='size-36'>
            <img src={logo} alt='' />
          </div>
          :
          <EmojiGraphic emoji='🔐' />
        }

        <Stack space={3}>
          <Button theme='accent' size='lg' onClick={onClick}>
            {isLogin ? <FormattedMessage id='nostr_login.siwe.action' defaultMessage='Log in with extension' /> : <FormattedMessage id='nostr_signup.siwe.action' defaultMessage='Sign up with extension' /> }
          </Button>

          <Divider text='or' />

          <Button theme={isLogin ? 'muted' : 'transparent'} onClick={onClickAlt} icon={alertTriangleIcon}>
            {isLogin ? <FormattedMessage id='nostr_login.siwe.alt' defaultMessage='Log in with key' /> : <FormattedMessage id='nostr_signup.siwe.alt' defaultMessage={'Don\'t have an extension?'} /> }
          </Button>

          {isLogin && <HStack space={2} justifyContent='center'>
            <Text size='xs'>
              <FormattedMessage id='nostr_signup.siwe.new_user' defaultMessage='New on {site_title}?' values={{ site_title: instance.title }} />
            </Text>
            <Link to={'/'} className='text-xs text-blue-500' onClick={handleClose}>
              <FormattedMessage id='nostr_login.siwe.sign_up' defaultMessage='Sign Up' />

            </Link>
          </HStack>}

        </Stack>
      </Stack>
    </Modal>
  );
};

export default ExtensionStep;
