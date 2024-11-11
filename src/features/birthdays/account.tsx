import balloonIcon from '@tabler/icons/outline/balloon.svg';
import { defineMessages, useIntl } from 'react-intl';

import { useAccount } from 'soapbox/api/hooks/index.ts';
import AccountComponent from 'soapbox/components/account.tsx';
import Icon from 'soapbox/components/icon.tsx';
import HStack from 'soapbox/components/ui/hstack.tsx';

const messages = defineMessages({
  birthday: { id: 'account.birthday', defaultMessage: 'Born {date}' },
});

interface IAccount {
  accountId: string;
}

const Account: React.FC<IAccount> = ({ accountId }) => {
  const intl = useIntl();
  const { account } = useAccount(accountId);

  if (!account) return null;

  const birthday = account.pleroma?.birthday;
  if (!birthday) return null;

  const formattedBirthday = intl.formatDate(birthday, { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <HStack space={1} alignItems='center' justifyContent='between' className='p-2.5'>
      <div className='w-full'>
        <AccountComponent account={account} withRelationship={false} />
      </div>
      <div
        className='flex items-center gap-0.5'
        title={intl.formatMessage(messages.birthday, {
          date: formattedBirthday,
        })}
      >
        <Icon src={balloonIcon} />
        {formattedBirthday}
      </div>
    </HStack>
  );
};

export default Account;
