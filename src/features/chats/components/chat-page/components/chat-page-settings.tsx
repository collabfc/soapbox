import arrowLeftIcon from '@tabler/icons/outline/arrow-left.svg';
import { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { changeSetting } from 'soapbox/actions/settings.ts';
import List, { ListItem } from 'soapbox/components/list.tsx';
import Button from 'soapbox/components/ui/button.tsx';
import { CardBody, CardTitle } from 'soapbox/components/ui/card.tsx';
import Form from 'soapbox/components/ui/form.tsx';
import HStack from 'soapbox/components/ui/hstack.tsx';
import IconButton from 'soapbox/components/ui/icon-button.tsx';
import Stack from 'soapbox/components/ui/stack.tsx';
import Toggle from 'soapbox/components/ui/toggle.tsx';
import SettingToggle from 'soapbox/features/notifications/components/setting-toggle.tsx';
import { useAppDispatch } from 'soapbox/hooks/useAppDispatch.ts';
import { useOwnAccount } from 'soapbox/hooks/useOwnAccount.ts';
import { useSettings } from 'soapbox/hooks/useSettings.ts';
import { useUpdateCredentials } from 'soapbox/queries/accounts.ts';

type FormData = {
  accepts_chat_messages?: boolean;
  chats_onboarded: boolean;
}

const messages = defineMessages({
  title: { id: 'chat.page_settings.title', defaultMessage: 'Message Settings' },
  preferences: { id: 'chat.page_settings.preferences', defaultMessage: 'Preferences' },
  privacy: { id: 'chat.page_settings.privacy', defaultMessage: 'Privacy' },
  acceptingMessageLabel: { id: 'chat.page_settings.accepting_messages.label', defaultMessage: 'Allow users to start a new chat with you' },
  playSoundsLabel: { id: 'chat.page_settings.play_sounds.label', defaultMessage: 'Play a sound when you receive a message' },
  submit: { id: 'chat.page_settings.submit', defaultMessage: 'Save' },
});

const ChatPageSettings = () => {
  const { account } = useOwnAccount();
  const intl = useIntl();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const settings = useSettings();
  const updateCredentials = useUpdateCredentials();

  const [data, setData] = useState<FormData>({
    chats_onboarded: true,
    accepts_chat_messages: account?.pleroma?.accepts_chat_messages === true,
  });

  const onToggleChange = (key: string[], checked: boolean) => {
    dispatch(changeSetting(key, checked, { showAlert: true }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    updateCredentials.mutate(data);
  };

  return (
    <Stack className='h-full space-y-8 px-4 py-6 sm:p-6'>
      <HStack alignItems='center'>
        <IconButton
          src={arrowLeftIcon}
          className='mr-2 size-7 sm:mr-0 sm:hidden rtl:rotate-180'
          onClick={() => history.push('/chats')}
        />

        <CardTitle title={intl.formatMessage(messages.title)} />
      </HStack>

      <Form onSubmit={handleSubmit}>
        <CardTitle title={intl.formatMessage(messages.preferences)} />

        <List>
          <ListItem
            label={intl.formatMessage(messages.playSoundsLabel)}
          >
            <SettingToggle settings={settings} settingPath={['chats', 'sound']} onChange={onToggleChange} />
          </ListItem>
        </List>

        <CardTitle title={intl.formatMessage(messages.privacy)} />

        <CardBody>
          <List>
            <ListItem
              label={intl.formatMessage(messages.acceptingMessageLabel)}
            >
              <Toggle
                checked={data.accepts_chat_messages}
                onChange={(event) => setData((prevData) => ({ ...prevData, accepts_chat_messages: event.target.checked }))}
              />
            </ListItem>
          </List>
        </CardBody>

        <Button type='submit' theme='primary' disabled={updateCredentials.isPending}>
          {intl.formatMessage(messages.submit)}
        </Button>
      </Form>
    </Stack>
  );
};

export default ChatPageSettings;