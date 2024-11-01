import { List as ImmutableList } from 'immutable';

import { selectAccount, selectOwnAccount } from 'soapbox/selectors';

import type { RootState } from 'soapbox/store';

export const validId = (id: any) => typeof id === 'string' && id !== 'null' && id !== 'undefined';

export const isURL = (url?: string | null) => {
  if (typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const parseBaseURL = (url: any) => {
  try {
    return new URL(url).origin;
  } catch {
    return '';
  }
};

export const getLoggedInAccount = (state: RootState) => selectOwnAccount(state);

export const isLoggedIn = (getState: () => RootState) => {
  return validId(getState().me);
};

export const getAppToken = (state: RootState) => state.auth.app?.access_token;

export const getUserToken = (state: RootState, accountId?: string | false | null) => {
  if (!accountId) return;
  const accountUrl = selectAccount(state, accountId)?.url;
  if (!accountUrl) return;
  return state.auth.users[accountUrl]?.access_token;
};

export const getAccessToken = (state: RootState) => {
  const me = state.me;
  return getUserToken(state, me);
};

export const getAuthUserId = (state: RootState) => {
  const me = state.auth.me;

  return ImmutableList([
    state.auth.users[me!]?.id,
    me,
  ].filter(id => id)).find(validId);
};

export const getAuthUserUrl = (state: RootState) => {
  const me = state.auth.me;

  return ImmutableList([
    state.auth.users[me!]?.url,
    me,
  ].filter(url => url)).find(isURL);
};

export const getMeUrl = (state: RootState) => selectOwnAccount(state)?.url;