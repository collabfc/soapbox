import arrowLeftIcon from '@tabler/icons/outline/arrow-left.svg';
import searchIcon from '@tabler/icons/outline/search.svg';
import xIcon from '@tabler/icons/outline/x.svg';
import { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import HStack from 'soapbox/components/ui/hstack.tsx';
import IconButton from 'soapbox/components/ui/icon-button.tsx';
import Icon from 'soapbox/components/ui/icon.tsx';
import Input from 'soapbox/components/ui/input.tsx';
import Stack from 'soapbox/components/ui/stack.tsx';

import PopularGroups from './components/discover/popular-groups.tsx';
import PopularTags from './components/discover/popular-tags.tsx';
import Search from './components/discover/search/search.tsx';
import SuggestedGroups from './components/discover/suggested-groups.tsx';
import TabBar, { TabItems } from './components/tab-bar.tsx';

const messages = defineMessages({
  placeholder: { id: 'groups.discover.search.placeholder', defaultMessage: 'Search' },
});

const Discover: React.FC = () => {
  const intl = useIntl();

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');

  const hasSearchValue = value && value.length > 0;

  const cancelSearch = () => {
    clearValue();
    setIsSearching(false);
  };

  const clearValue = () => setValue('');

  return (
    <Stack space={4}>
      <TabBar activeTab={TabItems.FIND_GROUPS} />

      <Stack space={6}>
        <HStack alignItems='center'>
          {isSearching ? (
            <IconButton
              src={arrowLeftIcon}
              iconClassName='mr-2 h-5 w-5 fill-current text-gray-600 rtl:rotate-180'
              onClick={cancelSearch}
              data-testid='group-search-icon'
            />
          ) : null}

          <Input
            data-testid='search'
            type='text'
            placeholder={intl.formatMessage(messages.placeholder)}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onFocus={() => setIsSearching(true)}
            outerClassName='mt-0 w-full'
            theme='search'
            append={
              <button onClick={clearValue}>
                <Icon
                  src={hasSearchValue ? xIcon : searchIcon}
                  className='size-4 text-gray-700 dark:text-gray-600'
                  aria-hidden='true'
                />
              </button>
            }
          />
        </HStack>

        {isSearching ? (
          <Search
            searchValue={value}
            onSelect={(newValue) => setValue(newValue)}
          />
        ) : (
          <>
            <PopularGroups />
            <SuggestedGroups />
            <PopularTags />
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default Discover;
