import clsx from 'clsx';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { Column } from 'soapbox/components/ui';
import Search from 'soapbox/features/compose/components/search';
import SearchResults from 'soapbox/features/compose/components/search-results';
import { useTheme } from 'soapbox/hooks';
import { useIsMobile } from 'soapbox/hooks/useIsMobile';

const messages = defineMessages({
  heading: { id: 'column.search', defaultMessage: 'Discover' },
});

const SearchPage = () => {
  const intl = useIntl();

  const theme = useTheme();
  const isMobile = useIsMobile();

  return (
    <Column
      label={intl.formatMessage(messages.heading)}
      className={clsx({ '!px-0': isMobile || theme === 'black' })}
    >
      <div className='space-y-4'>
        <div className='px-4 sm:py-0'>
          <Search autoFocus autoSubmit />
        </div>
        <SearchResults />
      </div>
    </Column>
  );
};

export default SearchPage;
