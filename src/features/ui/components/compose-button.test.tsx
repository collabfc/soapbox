import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { MODAL_CLOSE, MODAL_OPEN } from 'soapbox/actions/modals.ts';
import { mockStore, rootState } from 'soapbox/jest/test-helpers.tsx';

import ComposeButton from './compose-button.tsx';

const store = mockStore(rootState);
const renderComposeButton = () => {
  render(
    <Provider store={store}>
      <IntlProvider locale='en'>
        <MemoryRouter>
          <ComposeButton />
        </MemoryRouter>
      </IntlProvider>
    </Provider>,
  );
};

describe('<ComposeButton />', () => {
  it('renders a button element', () => {
    renderComposeButton();

    expect(screen.getByRole('button')).toHaveTextContent('Compose');
  });

  it('dispatches the MODAL_OPEN action', () => {
    renderComposeButton();

    expect(store.getActions().length).toEqual(0);
    fireEvent.click(screen.getByRole('button'));
    expect(store.getActions()[0].type).toEqual(MODAL_CLOSE);
    expect(store.getActions()[1].type).toEqual(MODAL_OPEN);
  });
});
