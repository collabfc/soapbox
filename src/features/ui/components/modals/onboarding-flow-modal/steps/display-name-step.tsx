import React from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';

import { patchMe } from 'soapbox/actions/me';
import { Button, Stack, Text, FormGroup, Input } from 'soapbox/components/ui';
import IconButton from 'soapbox/components/ui/icon-button/icon-button';
import { useAppDispatch, useOwnAccount } from 'soapbox/hooks';
import toast from 'soapbox/toast';

import type { AxiosError } from 'axios';

const closeIcon = require('@tabler/icons/outline/x.svg');

const messages = defineMessages({
  usernamePlaceholder: { id: 'onboarding.display_name.placeholder', defaultMessage: 'Eg. John Smith' },
  error: { id: 'onboarding.error', defaultMessage: 'An unexpected error occurred. Please try again or skip this step.' },
});

interface IDisplayNameStep {
  onClose?(): void;
  onNext: () => void;
}

const DisplayNameStep: React.FC<IDisplayNameStep> = ({ onClose, onNext }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const { account } = useOwnAccount();
  const [value, setValue] = React.useState<string>(account?.display_name || '');
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<string[]>([]);

  const trimmedValue = value.trim();
  const isValid = trimmedValue.length > 0;
  const isDisabled = !isValid || value.length > 30;

  const hintText = React.useMemo(() => {
    const charsLeft = 30 - value.length;
    const suffix = charsLeft === 1 ? 'character remaining' : 'characters remaining';

    return `${charsLeft} ${suffix}`;
  }, [value]);

  const handleSubmit = () => {
    setSubmitting(true);

    const credentials = dispatch(patchMe({ display_name: value }));

    Promise.all([credentials])
      .then(() => {
        setSubmitting(false);
        onNext();
      }).catch((error: AxiosError) => {
        setSubmitting(false);

        if (error.response?.status === 422) {
          setErrors([(error.response.data as any).error.replace('Validation failed: ', '')]);
        } else {
          toast.error(messages.error);
        }
      });
  };

  return (

    <Stack space={10} justifyContent='center' alignItems='center' className='w-full rounded-3xl bg-white px-4 py-8 text-gray-900 shadow-lg black:bg-black sm:p-10 dark:bg-primary-900 dark:text-gray-100 dark:shadow-none'>

      <div className='relative w-full'>
        <IconButton src={closeIcon} onClick={onClose} className='absolute -top-[6%] right-[2%] text-gray-500 hover:text-gray-700 rtl:rotate-180 dark:text-gray-300 dark:hover:text-gray-200' />
        <Stack space={2} justifyContent='center' alignItems='center' className='bg-grey-500 border-grey-200 -mx-4 mb-4 border-b border-solid pb-4 sm:-mx-10 sm:pb-10 dark:border-gray-800'>
          <Text size='2xl' align='center' weight='bold'>
            <FormattedMessage id='onboarding.display_name.title' defaultMessage='Choose a display name' />
          </Text>
          <Text theme='muted' align='center'>
            <FormattedMessage id='onboarding.display_name.subtitle' defaultMessage='You can always edit this later.' />
          </Text>
        </Stack>
      </div>

      <Stack space={5} justifyContent='center' alignItems='center' className='w-full'>
        <div className='w-2/3'>
          <FormGroup
            hintText={hintText}
            labelText={<FormattedMessage id='onboarding.display_name.label' defaultMessage='Display name' />}
            errors={errors}
          >
            <Input
              onChange={(event) => setValue(event.target.value)}
              placeholder={intl.formatMessage(messages.usernamePlaceholder)}
              type='text'
              value={value}
              maxLength={30}
            />
          </FormGroup>
        </div>

        <Stack justifyContent='center' space={2} className='w-2/3'>
          <Button block theme='primary' type='button' onClick={handleSubmit} disabled={isDisabled || isSubmitting}>
            {isSubmitting ? (
              <FormattedMessage id='onboarding.saving' defaultMessage='Saving…' />
            ) : (
              <FormattedMessage id='onboarding.next' defaultMessage='Next' />
            )}
          </Button>

          <Button block theme='tertiary' type='button' onClick={onNext}>
            <FormattedMessage id='onboarding.skip' defaultMessage='Skip for now' />
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};


export default DisplayNameStep;