import { useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';

import { changeSettingImmediate } from 'soapbox/actions/settings.ts';
import Button from 'soapbox/components/ui/button.tsx';
import { Column } from 'soapbox/components/ui/column.tsx';
import FormActions from 'soapbox/components/ui/form-actions.tsx';
import FormGroup from 'soapbox/components/ui/form-group.tsx';
import Form from 'soapbox/components/ui/form.tsx';
import Input from 'soapbox/components/ui/input.tsx';
import Text from 'soapbox/components/ui/text.tsx';
import { useAppDispatch } from 'soapbox/hooks/useAppDispatch.ts';
import toast from 'soapbox/toast.tsx';

const messages = defineMessages({
  heading: { id: 'column.developers', defaultMessage: 'Developers' },
  answerLabel: { id: 'developers.challenge.answer_label', defaultMessage: 'Answer' },
  answerPlaceholder: { id: 'developers.challenge.answer_placeholder', defaultMessage: 'Your answer' },
  success: { id: 'developers.challenge.success', defaultMessage: 'You are now a developer' },
  fail: { id: 'developers.challenge.fail', defaultMessage: 'Wrong answer' },
});

const DevelopersChallenge = () => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const [answer, setAnswer] = useState('');

  const handleChangeAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = () => {
    if (answer === 'boxsoap') {
      dispatch(changeSettingImmediate(['isDeveloper'], true));
      toast.success(intl.formatMessage(messages.success));
    } else {
      toast.error(intl.formatMessage(messages.fail));
    }
  };

  const challenge = `function soapbox() {
  return 'soap|box'.split('|').reverse().join('');
}`;

  return (
    <Column label={intl.formatMessage(messages.heading)}>
      <Form onSubmit={handleSubmit}>
        <Text>
          {/* eslint-disable formatjs/no-literal-string-in-jsx */}
          <FormattedMessage
            id='developers.challenge.message'
            defaultMessage='What is the result of calling {function}?'
            values={{ function: <span className='font-mono'>soapbox()</span> }}
          />
          {/* eslint-enable formatjs/no-literal-string-in-jsx */}
        </Text>

        <Text tag='pre' className='font-mono' theme='muted'>
          {challenge}
        </Text>

        <FormGroup
          labelText={intl.formatMessage(messages.answerLabel)}
        >
          <Input
            name='answer'
            placeholder={intl.formatMessage(messages.answerPlaceholder)}
            onChange={handleChangeAnswer}
            value={answer}
            type='text'
          />
        </FormGroup>

        <FormActions>
          <Button theme='primary' type='submit'>
            <FormattedMessage id='developers.challenge.submit' defaultMessage='Become a developer' />
          </Button>
        </FormActions>
      </Form>
    </Column>
  );
};

export default DevelopersChallenge;
