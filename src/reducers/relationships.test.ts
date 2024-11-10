import { Map as ImmutableMap } from 'immutable';
import { describe, expect, it } from 'vitest';

import lain from 'soapbox/__fixtures__/lain.json';
import { ACCOUNT_IMPORT } from 'soapbox/actions/importer/index.ts';

import reducer from './relationships.ts';

describe('relationships reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as any)).toEqual(ImmutableMap());
  });

  describe('ACCOUNT_IMPORT', () => {
    it('should import the relationship', () => {
      const action = {
        type: ACCOUNT_IMPORT,
        account: lain,
      };
      const state = ImmutableMap<string, any>();
      expect(reducer(state, action).toJS()).toEqual({
        '9v5bqYwY2jfmvPNhTM': {
          blocked_by: false,
          blocking: false,
          domain_blocking: false,
          endorsed: false,
          followed_by: true,
          following: true,
          id: '9v5bqYwY2jfmvPNhTM',
          muting: false,
          muting_notifications: false,
          note: '',
          notifying: false,
          requested: false,
          showing_reblogs: true,
          subscribing: false,
        },
      });
    });
  });
});
