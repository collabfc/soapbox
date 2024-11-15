import backspaceIcon from '@tabler/icons/outline/backspace.svg';
import clsx from 'clsx';
import { defineMessages, useIntl } from 'react-intl';

import { fetchListSuggestions, clearListSuggestions, changeListSuggestions } from 'soapbox/actions/lists.ts';
import Button from 'soapbox/components/ui/button.tsx';
import Form from 'soapbox/components/ui/form.tsx';
import HStack from 'soapbox/components/ui/hstack.tsx';
import Input from 'soapbox/components/ui/input.tsx';
import SvgIcon from 'soapbox/components/ui/svg-icon.tsx';
import { useAppDispatch } from 'soapbox/hooks/useAppDispatch.ts';
import { useAppSelector } from 'soapbox/hooks/useAppSelector.ts';

const messages = defineMessages({
  search: { id: 'lists.search', defaultMessage: 'Search among people you follow' },
  searchTitle: { id: 'tabs_bar.search', defaultMessage: 'Discover' },
});

const Search = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const value = useAppSelector((state) => state.listEditor.suggestions.value);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    dispatch(changeListSuggestions(e.target.value));
  };

  const handleSubmit = () => {
    dispatch(fetchListSuggestions(value));
  };

  const handleClear = () => {
    dispatch(clearListSuggestions());
  };

  const hasValue = value.length > 0;

  return (
    <Form onSubmit={handleSubmit}>
      <HStack space={2}>
        <label className='relative grow'>
          <span style={{ display: 'none' }}>{intl.formatMessage(messages.search)}</span>

          <Input
            type='text'
            value={value}
            onChange={handleChange}
            placeholder={intl.formatMessage(messages.search)}
          />
          <div role='button' tabIndex={0} className='search__icon' onClick={handleClear}>
            <SvgIcon src={backspaceIcon} aria-label={intl.formatMessage(messages.search)} className={clsx('pointer-events-none absolute right-4 top-1/2 z-20 inline-block size-4.5 -translate-y-1/2 cursor-pointer text-[16px] text-gray-400 opacity-0 rtl:left-4 rtl:right-auto', { 'pointer-events-auto opacity-100': hasValue })} />
          </div>
        </label>

        <Button onClick={handleSubmit}>{intl.formatMessage(messages.searchTitle)}</Button>
      </HStack>
    </Form>
  );
};

export default Search;
