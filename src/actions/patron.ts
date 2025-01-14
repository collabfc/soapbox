import api from '../api/index.ts';

import type { AppDispatch, RootState } from 'soapbox/store.ts';
import type { APIEntity } from 'soapbox/types/entities.ts';

const PATRON_INSTANCE_FETCH_REQUEST = 'PATRON_INSTANCE_FETCH_REQUEST';
const PATRON_INSTANCE_FETCH_SUCCESS = 'PATRON_INSTANCE_FETCH_SUCCESS';
const PATRON_INSTANCE_FETCH_FAIL    = 'PATRON_INSTANCE_FETCH_FAIL';

const PATRON_ACCOUNT_FETCH_REQUEST  = 'PATRON_ACCOUNT_FETCH_REQUEST';
const PATRON_ACCOUNT_FETCH_SUCCESS  = 'PATRON_ACCOUNT_FETCH_SUCCESS';
const PATRON_ACCOUNT_FETCH_FAIL     = 'PATRON_ACCOUNT_FETCH_FAIL';

const fetchPatronInstance = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch({ type: PATRON_INSTANCE_FETCH_REQUEST });
    return api(getState).get('/api/patron/v1/instance').then((response) => response.json()).then((data) => {
      dispatch(importFetchedInstance(data));
    }).catch(error => {
      dispatch(fetchInstanceFail(error));
    });
  };

const fetchPatronAccount = (apId: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    apId = encodeURIComponent(apId);
    dispatch({ type: PATRON_ACCOUNT_FETCH_REQUEST });
    api(getState).get(`/api/patron/v1/accounts/${apId}`).then((response) => response.json()).then((data) => {
      dispatch(importFetchedAccount(data));
    }).catch(error => {
      dispatch(fetchAccountFail(error));
    });
  };

const importFetchedInstance = (instance: APIEntity) => ({
  type: PATRON_INSTANCE_FETCH_SUCCESS,
  instance,
});

const fetchInstanceFail = (error: unknown) => ({
  type: PATRON_INSTANCE_FETCH_FAIL,
  error,
  skipAlert: true,
});

const importFetchedAccount = (account: APIEntity) => ({
  type: PATRON_ACCOUNT_FETCH_SUCCESS,
  account,
});

const fetchAccountFail = (error: unknown) => ({
  type: PATRON_ACCOUNT_FETCH_FAIL,
  error,
  skipAlert: true,
});

export {
  PATRON_INSTANCE_FETCH_REQUEST,
  PATRON_INSTANCE_FETCH_SUCCESS,
  PATRON_INSTANCE_FETCH_FAIL,
  PATRON_ACCOUNT_FETCH_REQUEST,
  PATRON_ACCOUNT_FETCH_SUCCESS,
  PATRON_ACCOUNT_FETCH_FAIL,
  fetchPatronInstance,
  fetchPatronAccount,
  importFetchedInstance,
  fetchInstanceFail,
  importFetchedAccount,
  fetchAccountFail,
};
