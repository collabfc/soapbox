import { useState, useEffect } from 'react';
import { useIntl, FormattedMessage, defineMessages } from 'react-intl';

import { patchMe } from 'soapbox/actions/me.ts';
import { FE_NAME, SETTINGS_UPDATE, changeSetting } from 'soapbox/actions/settings.ts';
import List, { ListItem } from 'soapbox/components/list.tsx';
import { Button } from 'soapbox/components/ui/button.tsx';
import { CardHeader, CardTitle } from 'soapbox/components/ui/card.tsx';
import { Column } from 'soapbox/components/ui/column.tsx';
import FormActions from 'soapbox/components/ui/form-actions.tsx';
import FormGroup from 'soapbox/components/ui/form-group.tsx';
import Form from 'soapbox/components/ui/form.tsx';
import Textarea from 'soapbox/components/ui/textarea.tsx';
import SettingToggle from 'soapbox/features/notifications/components/setting-toggle.tsx';
import { useAppDispatch } from 'soapbox/hooks/useAppDispatch.ts';
import { useAppSelector } from 'soapbox/hooks/useAppSelector.ts';
import { useSettings } from 'soapbox/hooks/useSettings.ts';
import toast from 'soapbox/toast.tsx';

const isJSONValid = (text: any): boolean => {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
};

const messages = defineMessages({
  heading: { id: 'column.settings_store', defaultMessage: 'Settings store' },
  advanced: { id: 'developers.settings_store.advanced', defaultMessage: 'Advanced settings' },
  hint: { id: 'developers.settings_store.hint', defaultMessage: 'It is possible to directly edit your user settings here. BE CAREFUL! Editing this section can break your account, and you will only be able to recover through the API.' },
});

const SettingsStore: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const settings = useSettings();
  const settingsStore = useAppSelector(state => state.settings);

  const [rawJSON, setRawJSON] = useState<string>(JSON.stringify(settingsStore, null, 2));
  const [jsonValid, setJsonValid] = useState(true);
  const [isLoading, setLoading] = useState(false);

  const handleEditJSON: React.ChangeEventHandler<HTMLTextAreaElement> = ({ target }) => {
    const rawJSON = target.value;
    setRawJSON(rawJSON);
    setJsonValid(isJSONValid(rawJSON));
  };

  const onToggleChange = (key: string[], checked: boolean) => {
    dispatch(changeSetting(key, checked, { showAlert: true }));
  };

  const handleSubmit: React.FormEventHandler = e => {
    const settings = JSON.parse(rawJSON);

    setLoading(true);
    dispatch(patchMe({
      pleroma_settings_store: {
        [FE_NAME]: settings,
      },
    })).then(() => {
      dispatch({ type: SETTINGS_UPDATE, settings });
      setLoading(false);
    }).catch(error => {
      toast.showAlertForError(error);
      setLoading(false);
    });
  };

  useEffect(() => {
    setRawJSON(JSON.stringify(settingsStore, null, 2));
    setJsonValid(true);
  }, [settingsStore]);

  return (
    <Column label={intl.formatMessage(messages.heading)} backHref='/developers'>
      <Form onSubmit={handleSubmit}>
        <FormGroup
          hintText={intl.formatMessage(messages.hint)}
          errors={jsonValid ? [] : ['is invalid']}
        >
          <Textarea
            value={rawJSON}
            onChange={handleEditJSON}
            disabled={isLoading}
            rows={12}
            isCodeEditor
          />
        </FormGroup>

        <FormActions>
          <Button theme='primary' type='submit' disabled={!jsonValid || isLoading}>
            <FormattedMessage id='soapbox_config.save' defaultMessage='Save' />
          </Button>
        </FormActions>
      </Form>

      <CardHeader className='mb-4'>
        <CardTitle title={intl.formatMessage(messages.advanced)} />
      </CardHeader>

      <List>
        <ListItem
          label={<FormattedMessage id='preferences.fields.demo_label' defaultMessage='Demo mode' />}
          hint={<FormattedMessage id='preferences.fields.demo_hint' defaultMessage='Use the default Soapbox logo and color scheme. Useful for taking screenshots.' />}
        >
          <SettingToggle settings={settings} settingPath={['demo']} onChange={onToggleChange} />
        </ListItem>

        <ListItem label={<FormattedMessage id='preferences.notifications.advanced' defaultMessage='Show all notification categories' />}>
          <SettingToggle settings={settings} settingPath={['notifications', 'quickFilter', 'advanced']} onChange={onToggleChange} />
        </ListItem>

        <ListItem label={<FormattedMessage id='preferences.fields.unfollow_modal_label' defaultMessage='Show confirmation dialog before unfollowing someone' />}>
          <SettingToggle settings={settings} settingPath={['unfollowModal']} onChange={onToggleChange} />
        </ListItem>

        <ListItem label={<FormattedMessage id='preferences.fields.missing_description_modal_label' defaultMessage='Show confirmation dialog before sending a post without media descriptions' />}>
          <SettingToggle settings={settings} settingPath={['missingDescriptionModal']} onChange={onToggleChange} />
        </ListItem>

        <ListItem label={<FormattedMessage id='preferences.fields.reduce_motion_label' defaultMessage='Reduce motion in animations' />}>
          <SettingToggle settings={settings} settingPath={['reduceMotion']} onChange={onToggleChange} />
        </ListItem>

        <ListItem label={<FormattedMessage id='preferences.fields.underline_links_label' defaultMessage='Always underline links in posts' />}>
          <SettingToggle settings={settings} settingPath={['underlineLinks']} onChange={onToggleChange} />
        </ListItem>

        <ListItem label={<FormattedMessage id='preferences.fields.system_font_label' defaultMessage="Use system's default font" />}>
          <SettingToggle settings={settings} settingPath={['systemFont']} onChange={onToggleChange} />
        </ListItem>

        <ListItem
          label={<FormattedMessage id='preferences.fields.demetricator_label' defaultMessage='Use Demetricator' />}
          hint={<FormattedMessage id='preferences.hints.demetricator' defaultMessage='Decrease social media anxiety by hiding all numbers from the site.' />}
        >
          <SettingToggle settings={settings} settingPath={['demetricator']} onChange={onToggleChange} />
        </ListItem>
      </List>
    </Column>
  );
};

export default SettingsStore;
