import clsx from 'clsx';
import React, { useRef, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { Link, NavLink , Redirect } from 'react-router-dom';

import { logIn, verifyCredentials } from 'soapbox/actions/auth';
import { fetchInstance } from 'soapbox/actions/instance';
import { openModal } from 'soapbox/actions/modals';
import { openSidebar } from 'soapbox/actions/sidebar';
import SiteLogo from 'soapbox/components/site-logo';
import { Avatar, Button, Form, HStack, IconButton, Input, Tooltip } from 'soapbox/components/ui';
import Search from 'soapbox/features/compose/components/search';
import { useAppDispatch, useInstance ,useAppSelector, useFeatures, useOwnAccount, useRegistrationStatus } from 'soapbox/hooks';
import { useIsMobile } from 'soapbox/hooks/useIsMobile';
import { isStandalone } from 'soapbox/utils/state';

import ProfileDropdown from './profile-dropdown';

import type { AxiosError } from 'axios';

const messages = defineMessages({
  login: { id: 'navbar.login.action', defaultMessage: 'Log in' },
  username: { id: 'navbar.login.username.placeholder', defaultMessage: 'Email or username' },
  email: { id: 'navbar.login.email.placeholder', defaultMessage: 'E-mail address' },
  password: { id: 'navbar.login.password.label', defaultMessage: 'Password' },
  forgotPassword: { id: 'navbar.login.forgot_password', defaultMessage: 'Forgot password?' },
});

const Navbar = () => {
  const instance = useInstance();
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const features = useFeatures();
  const standalone = useAppSelector(isStandalone);
  const { isOpen } = useRegistrationStatus();
  const { account } = useOwnAccount();
  const node = useRef(null);
  const isMobile = useIsMobile();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [mfaToken, setMfaToken] = useState<boolean>(false);

  const onOpenSidebar = () => dispatch(openSidebar());

  const handleNostrLogin = async () => {
    dispatch(openModal('NOSTR_LOGIN'));
  };

  const handleSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();
    setLoading(true);

    dispatch(logIn(username, password) as any)
      .then(({ access_token }: { access_token: string }) => {
        setLoading(false);

        return (
          dispatch(verifyCredentials(access_token) as any)
            // Refetch the instance for authenticated fetch
            .then(() => dispatch(fetchInstance()))
        );
      })
      .catch((error: AxiosError) => {
        setLoading(false);

        const data: any = error.response?.data;
        if (data?.error === 'mfa_required') {
          setMfaToken(data.mfa_token);
        }
      });
  };

  if (mfaToken) return <Redirect to={`/login?token=${encodeURIComponent(mfaToken)}`} />;

  return (
    <nav
      className={clsx(
        'sticky top-0 z-50 border-gray-200 bg-white shadow black:border-b black:border-b-gray-800 black:bg-black dark:border-gray-800 dark:bg-primary-900',
        { 'border-b': isMobile },
      )}
      ref={node}
      data-testid='navbar'
    >
      <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
        <div className='relative flex h-12 justify-between lg:h-16'>
          {account && (
            <div className='absolute inset-y-0 left-0 flex items-center lg:hidden rtl:left-auto rtl:right-0'>
              <button onClick={onOpenSidebar}>
                <Avatar src={account.avatar} size={34} />
              </button>
            </div>
          )}

          <HStack
            space={4}
            alignItems='center'
            className={clsx('flex-1 lg:items-stretch', {
              'justify-center lg:justify-start': account,
              'justify-start': !account,
            })}
          >

            <h1 className='pt-3'>
              <a key='logo' href='https://www.collabfc.com' data-preview-title-id='column.home' className='ml-4 flex shrink-0 items-center'>
                <SiteLogo alt='Logo' className='h-10 w-auto cursor-pointer'  />
                <span className='hidden'><FormattedMessage id='tabs_bar.home' defaultMessage='Home' /></span>
              </a>
            </h1>

            {account && (
              <div className='hidden flex-1 items-center justify-center px-2 lg:ml-6 lg:flex lg:justify-start'>
                <div className='hidden w-full max-w-xl lg:block lg:max-w-xs'>
                  <Search openInRoute autosuggest />
                </div>
              </div>
            )}
          </HStack>

          {!standalone && (
            <HStack space={3} alignItems='center' className='absolute inset-y-0 right-0 pr-2 lg:static lg:inset-auto lg:ml-6 lg:pr-0'>
              {account ? (
                <div className='relative hidden items-center lg:flex'>
                  <ProfileDropdown account={account}>
                    <Avatar src={account.avatar} size={34} />
                  </ProfileDropdown>
                </div>
              ) : (
                <>
                  {features.nostrSignup ? (
                    <div className='hidden items-center xl:flex'>
                      <Button
                        theme='primary'
                        onClick={handleNostrLogin}
                        disabled={isLoading}
                      >
                        {intl.formatMessage(messages.login)}
                      </Button>
                    </div>
                  ) : (
                    <Form className='hidden items-center space-x-2 xl:flex rtl:space-x-reverse' onSubmit={handleSubmit}>
                      <Input
                        required
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        type='text'
                        placeholder={intl.formatMessage(features.logInWithUsername ? messages.username : messages.email)}
                        className='max-w-[200px]'
                      />

                      <Input
                        required
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        type='password'
                        placeholder={intl.formatMessage(messages.password)}
                        className='max-w-[200px]'
                      />

                      <Link to='/reset-password'>
                        <Tooltip text={intl.formatMessage(messages.forgotPassword)}>
                          <IconButton
                            src={require('@tabler/icons/outline/help.svg')}
                            className='cursor-pointer bg-transparent text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200'
                            iconClassName='h-5 w-5'
                          />
                        </Tooltip>
                      </Link>

                      <Button
                        theme='primary'
                        type='submit'
                        disabled={isLoading}
                      >
                        {intl.formatMessage(messages.login)}
                      </Button>
                    </Form>
                  )}

                  <div className='space-x-1.5 xl:hidden'>
                    <Button
                      theme='tertiary'
                      size='sm'
                      {...(features.nostrSignup ? { onClick: handleNostrLogin } : { to: '/login' })}
                    >
                      <FormattedMessage id='account.login' defaultMessage='Log in' />
                    </Button>

                    {(isOpen) && (
                      <Button theme='primary' to='/signup' size='sm'>
                        <FormattedMessage id='account.register' defaultMessage='Sign up' />
                      </Button>
                    )}
                  </div>
                </>
              )}
            </HStack>
          )}
        </div>
      </div>
      <div className='mx-auto mt-3 max-w-7xl px-4 sm:px-8 md:px-10 lg:px-12 file:dark:border-gray-800'>
        <div className='relative flex h-8 justify-between'>
          <HStack space={3} alignItems='center' className=''>
            <div className='relative flex items-center'>
              {account && (
                <NavLink 
                  to='/' 
                  exact
                  data-preview-title-id='column.home' 
                  className='mr-5 pb-2 font-normal dark:text-gray-100'
                  activeClassName='border-b-4 border-primary-500' 
                >
                  <FormattedMessage id='tabs_bar.home' defaultMessage='Home' />
                </NavLink>
              )}
              <NavLink 
                to='/timeline/local' 
                data-preview-title-id='column.local' 
                className='mr-5 pb-2 font-normal dark:text-gray-100'
                activeClassName='border-b-4 border-primary-500' 
              >
                <FormattedMessage id='team_tab' defaultMessage='{site_title}' values={{ site_title: instance.title }} />
              </NavLink>
              <NavLink 
                to='/timeline/fediverse' 
                data-preview-title-id='column.fediverse' 
                className='mr-5 pb-2 font-normal dark:text-gray-100'
                activeClassName='border-b-4 border-primary-500' 
              >
                <FormattedMessage id='tabs_bar.fediverse' defaultMessage='Fediverse' />
              </NavLink>
              <a href='https://www.collabfc.com/#teams' className='mr-5 pb-2 font-normal dark:text-gray-100'>Teams</a>
            </div>
          </HStack>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
