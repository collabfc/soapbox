import xIcon from '@tabler/icons/outline/x.svg';
import { useEffect } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { fetchAliases, removeFromAliases } from 'soapbox/actions/aliases.ts';
import Icon from 'soapbox/components/icon.tsx';
import ScrollableList from 'soapbox/components/scrollable-list.tsx';
import { CardHeader, CardTitle } from 'soapbox/components/ui/card.tsx';
import { Column } from 'soapbox/components/ui/column.tsx';
import HStack from 'soapbox/components/ui/hstack.tsx';
import Text from 'soapbox/components/ui/text.tsx';
import { useAppDispatch } from 'soapbox/hooks/useAppDispatch.ts';
import { useAppSelector } from 'soapbox/hooks/useAppSelector.ts';
import { useFeatures } from 'soapbox/hooks/useFeatures.ts';
import { useOwnAccount } from 'soapbox/hooks/useOwnAccount.ts';

import Account from './components/account.tsx';
import Search from './components/search.tsx';

const messages = defineMessages({
  heading: { id: 'column.aliases', defaultMessage: 'Account aliases' },
  subheading_add_new: { id: 'column.aliases.subheading_add_new', defaultMessage: 'Add New Alias' },
  create_error: { id: 'column.aliases.create_error', defaultMessage: 'Error creating alias' },
  delete_error: { id: 'column.aliases.delete_error', defaultMessage: 'Error deleting alias' },
  subheading_aliases: { id: 'column.aliases.subheading_aliases', defaultMessage: 'Current aliases' },
  delete: { id: 'column.aliases.delete', defaultMessage: 'Delete' },
});

const Aliases = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const features = useFeatures();
  const { account } = useOwnAccount();

  const aliases = useAppSelector((state) => {
    if (features.accountMoving) {
      return [...state.aliases.aliases.items];
    } else {
      return account?.pleroma?.also_known_as ?? [];
    }
  });

  const searchAccountIds = useAppSelector((state) => state.aliases.suggestions.items);
  const loaded = useAppSelector((state) => state.aliases.suggestions.loaded);

  useEffect(() => {
    dispatch(fetchAliases);
  }, []);

  const handleFilterDelete: React.MouseEventHandler<HTMLDivElement> = e => {
    dispatch(removeFromAliases(e.currentTarget.dataset.value as string));
  };

  const emptyMessage = <FormattedMessage id='empty_column.aliases' defaultMessage="You haven't created any account alias yet." />;

  return (
    <Column className='aliases-settings-panel' label={intl.formatMessage(messages.heading)}>
      <CardHeader>
        <CardTitle title={intl.formatMessage(messages.subheading_add_new)} />
      </CardHeader>
      <Search />
      {
        loaded && searchAccountIds.size === 0 ? (
          <div className='aliases__accounts empty-column-indicator'>
            <FormattedMessage id='empty_column.aliases.suggestions' defaultMessage='There are no account suggestions available for the provided term.' />
          </div>
        ) : (
          <div className='aliases__accounts mb-4'>
            {searchAccountIds.map(accountId => <Account key={accountId} accountId={accountId} aliases={aliases} />)}
          </div>
        )
      }
      <CardHeader>
        <CardTitle title={intl.formatMessage(messages.subheading_aliases)} />
      </CardHeader>
      <div className='aliases-settings-panel'>
        <ScrollableList
          scrollKey='aliases'
          emptyMessage={emptyMessage}
        >
          {aliases.map((alias, i) => (
            <HStack alignItems='center' justifyContent='between' space={1} key={i} className='p-2'>
              <div>
                <Text tag='span' theme='muted'><FormattedMessage id='aliases.account_label' defaultMessage='Old account:' /></Text>
                {' '} {/* eslint-disable-line formatjs/no-literal-string-in-jsx */}
                <Text tag='span'>{alias}</Text>
              </div>
              <div className='flex items-center' role='button' tabIndex={0} onClick={handleFilterDelete} data-value={alias} aria-label={intl.formatMessage(messages.delete)}>
                <Icon className='mr-1.5' src={xIcon} />
                <Text weight='bold' theme='muted'><FormattedMessage id='aliases.aliases_list_delete' defaultMessage='Unlink alias' /></Text>
              </div>
            </HStack>
          ))}
        </ScrollableList>
      </div>
    </Column>
  );
};

export default Aliases;
