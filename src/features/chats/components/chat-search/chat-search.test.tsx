import userEvent from '@testing-library/user-event';
import { VirtuosoMockContext } from 'react-virtuoso';
import { beforeEach, describe, expect, it } from 'vitest';

import { __stub } from 'soapbox/api/index.ts';
import { ChatProvider } from 'soapbox/contexts/chat-context.tsx';
import { render, screen, waitFor } from 'soapbox/jest/test-helpers.tsx';

import ChatSearch from './chat-search.tsx';

const renderComponent = () => render(
  <VirtuosoMockContext.Provider value={{ viewportHeight: 300, itemHeight: 100 }}>
    <ChatProvider>
      <ChatSearch />
    </ChatProvider>, {/* eslint-disable-line formatjs/no-literal-string-in-jsx */}
  </VirtuosoMockContext.Provider>,
);

describe('<ChatSearch />', () => {
  beforeEach(async() => {
    renderComponent();
  });

  it('renders the search input', () => {
    expect(screen.getByTestId('search')).toBeInTheDocument();
  });

  describe('when searching', () => {
    describe('with results', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet('/api/v1/accounts/search').reply(200, [{
            id: '1',
            avatar: 'url',
            verified: false,
            display_name: 'steve',
            acct: 'sjobs',
          }]);
        });
      });

      it('renders accounts', async() => {
        const user = userEvent.setup();
        await user.type(screen.getByTestId('search'), 'ste');

        await waitFor(() => {
          expect(screen.queryAllByTestId('account')).toHaveLength(1);
        });
      });
    });

    describe('without results', () => {
      beforeEach(() => {
        __stub((mock) => {
          mock.onGet('/api/v1/accounts/search').reply(200, []);
        });
      });

      it('renders accounts', async() => {
        const user = userEvent.setup();
        await user.type(screen.getByTestId('search'), 'ste');

        await waitFor(() => {
          expect(screen.getByTestId('no-results')).toBeInTheDocument();
        });
      });
    });
  });
});
