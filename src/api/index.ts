/**
 * API: HTTP client and utilities.
 * @see {@link https://github.com/axios/axios}
 * @module soapbox/api
 */

import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import LinkHeader from 'http-link-header';
import { createSelector } from 'reselect';

import * as BuildConfig from 'soapbox/build-config.ts';
import { selectAccount } from 'soapbox/selectors/index.ts';
import { RootState } from 'soapbox/store.ts';
import { getAccessToken, getAppToken, isURL, parseBaseURL } from 'soapbox/utils/auth.ts';

import type MockAdapter from 'axios-mock-adapter';

/**
  Parse Link headers, mostly for pagination.
  @see {@link https://www.npmjs.com/package/http-link-header}
  @param {object} response - Axios response object
  @returns {object} Link object
  */
export const getLinks = (response: AxiosResponse): LinkHeader => {
  return new LinkHeader(response.headers?.link);
};

export const getNextLink = (response: AxiosResponse): string | undefined => {
  return getLinks(response).refs.find(link => link.rel === 'next')?.uri;
};

export const getPrevLink = (response: AxiosResponse): string | undefined => {
  return getLinks(response).refs.find(link => link.rel === 'prev')?.uri;
};

const getToken = (state: RootState, authType: string) => {
  return authType === 'app' ? getAppToken(state) : getAccessToken(state);
};

const maybeParseJSON = (data: string) => {
  try {
    return JSON.parse(data);
  } catch (Exception) {
    return data;
  }
};

const getAuthBaseURL = createSelector([
  (state: RootState, me: string | false | null) => me ? selectAccount(state, me)?.url : undefined,
  (state: RootState, _me: string | false | null) => state.auth.me,
], (accountUrl, authUserUrl) => {
  const baseURL = parseBaseURL(accountUrl) || parseBaseURL(authUserUrl);
  return baseURL !== window.location.origin ? baseURL : '';
});

/**
  * Base client for HTTP requests.
  * @param {string} accessToken
  * @param {string} baseURL
  * @returns {object} Axios instance
  */
export const baseClient = (
  accessToken?: string | null,
  baseURL: string = '',
  nostrSign = false,
): AxiosInstance => {
  const headers: Record<string, string> = {};

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  if (nostrSign) {
    headers['X-Nostr-Sign'] = 'true';
  }

  return axios.create({
    // When BACKEND_URL is set, always use it.
    baseURL: isURL(BuildConfig.BACKEND_URL) ? BuildConfig.BACKEND_URL : baseURL,
    headers,
    transformResponse: [maybeParseJSON],
  });
};

/**
  * Stateful API client.
  * Uses credentials from the Redux store if available.
  * @param {function} getState - Must return the Redux state
  * @param {string} authType - Either 'user' or 'app'
  * @returns {object} Axios instance
  */
export default (getState: () => RootState, authType: string = 'user'): AxiosInstance => {
  const state = getState();
  const accessToken = getToken(state, authType);
  const me = state.me;
  const baseURL = me ? getAuthBaseURL(state, me) : '';

  const relayUrl = state.instance?.nostr?.relay;
  const pubkey = state.instance?.nostr?.pubkey;
  const nostrSign = Boolean(relayUrl && pubkey);

  return baseClient(accessToken, baseURL, nostrSign);
};

// The Jest mock exports these, so they're needed for TypeScript.
export const __stub = (_func: (mock: MockAdapter) => void) => 0;
export const __clear = (): Function[] => [];
