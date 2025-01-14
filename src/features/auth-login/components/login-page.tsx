import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Redirect } from 'react-router-dom';

import { logIn, verifyCredentials, switchAccount, MfaRequiredError } from 'soapbox/actions/auth.ts';
import { fetchInstance } from 'soapbox/actions/instance.ts';
import { closeModal, openModal } from 'soapbox/actions/modals.ts';
import { BigCard } from 'soapbox/components/big-card.tsx';
import { useAppDispatch } from 'soapbox/hooks/useAppDispatch.ts';
import { useAppSelector } from 'soapbox/hooks/useAppSelector.ts';
import { useFeatures } from 'soapbox/hooks/useFeatures.ts';
import { useInstance } from 'soapbox/hooks/useInstance.ts';
import { getRedirectUrl } from 'soapbox/utils/redirect.ts';

import ConsumersList from './consumers-list.tsx';
import LoginForm from './login-form.tsx';
import OtpAuthForm from './otp-auth-form.tsx';

const LoginPage = () => {
  const dispatch = useAppDispatch();

  const me = useAppSelector((state) => state.me);
  const instance = useInstance();
  const { nostrSignup } = useFeatures();

  const token = new URLSearchParams(window.location.search).get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [mfaAuthNeeded, setMfaAuthNeeded] = useState(!!token);
  const [mfaToken, setMfaToken] = useState(token || '');
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const getFormData = (form: HTMLFormElement) =>
    Object.fromEntries(
      Array.from(form).map((i: any) => [i.name, i.value]),
    );

  const handleSubmit: React.FormEventHandler = (event) => {
    const { username, password } = getFormData(event.target as HTMLFormElement);
    dispatch(logIn(username, password))
      .then(({ access_token }) => dispatch(verifyCredentials(access_token as string)))
      // Refetch the instance for authenticated fetch
      .then(async (account) => {
        await dispatch(fetchInstance());
        return account;
      })
      .then((account: { id: string }) => {
        dispatch(closeModal());
        if (typeof me === 'string') {
          dispatch(switchAccount(account.id));
        } else {
          setShouldRedirect(true);
        }
      }).catch((error) => {
        if (error instanceof MfaRequiredError) {
          setMfaAuthNeeded(true);
          setMfaToken(error.token);
        }
        setIsLoading(false);
      });
    setIsLoading(true);
    event.preventDefault();
  };

  if (nostrSignup) {
    setTimeout(() => dispatch(openModal('NOSTR_LOGIN')), 100);
    return <Redirect to='/' />;
  }

  if (instance.isNotFound) {
    return <Redirect to='/login/external' />;
  }

  if (shouldRedirect) {
    const redirectUri = getRedirectUrl();
    return <Redirect to={redirectUri} />;
  }

  if (mfaAuthNeeded) return <OtpAuthForm mfa_token={mfaToken} />;

  return (
    <BigCard title={<FormattedMessage id='login_form.header' defaultMessage='Sign In' />}>
      <LoginForm handleSubmit={handleSubmit} isLoading={isLoading} />
      <ConsumersList />
    </BigCard>
  );
};

export default LoginPage;
