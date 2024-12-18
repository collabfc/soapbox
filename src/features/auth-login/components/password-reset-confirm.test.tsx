import { Route, Switch } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { __stub } from 'soapbox/api/index.ts';
import { fireEvent, render, screen, waitFor } from 'soapbox/jest/test-helpers.tsx';

import PasswordResetConfirm from './password-reset-confirm.tsx';

const TestableComponent = () => (
  <Switch>
    <Route path='/edit' exact><PasswordResetConfirm /></Route>
    <Route path='/' exact><span data-testid='home'>Homepage</span></Route> {/* eslint-disable-line formatjs/no-literal-string-in-jsx */}
  </Switch>
);

describe('<PasswordResetConfirm />', () => {
  it('handles successful responses from the API', async() => {
    __stub(mock => {
      mock.onPost('/api/v1/truth/password_reset/confirm')
        .reply(200, {});
    });

    render(
      <TestableComponent />,
      {},
      null,
      { initialEntries: ['/edit'] },
    );

    fireEvent.submit(
      screen.getByTestId('form'), {
        preventDefault: () => {},
      },
    );

    await waitFor(() => {
      expect(screen.getByTestId('home')).toHaveTextContent('Homepage');
      expect(screen.queryByTestId('form-group-error')).not.toBeInTheDocument();
    });
  });

  it('handles failed responses from the API', async() => {
    __stub(mock => {
      mock.onPost('/api/v1/truth/password_reset/confirm')
        .reply(403, {});
    });

    render(
      <TestableComponent />,
      {},
      null,
      { initialEntries: ['/edit'] },
    );

    await fireEvent.submit(
      screen.getByTestId('form'), {
        preventDefault: () => {},
      },
    );

    await waitFor(() => {
      expect(screen.queryByTestId('home')).not.toBeInTheDocument();
      expect(screen.queryByTestId('form-group-error')).toBeInTheDocument();
    });
  });
});
