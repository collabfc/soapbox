import { beforeEach, describe, expect, it } from 'vitest';

import { __stub } from 'soapbox/api/index.ts';
import { buildGroup } from 'soapbox/jest/factory.ts';
import { renderHook, rootState, waitFor } from 'soapbox/jest/test-helpers.tsx';

import { useGroupLookup } from './useGroupLookup.ts';

const group = buildGroup({ id: '1', slug: 'soapbox' });
const state = {
  ...rootState,
  instance: {
    ...rootState.instance,
    version: '3.4.1 (compatible; TruthSocial 1.0.0)',
  },
};

describe('useGroupLookup hook', () => {
  describe('with a successful request', () => {
    beforeEach(() => {
      __stub((mock) => {
        mock.onGet(`/api/v1/groups/lookup?name=${group.slug}`).reply(200, group);
      });
    });

    it('is successful', async () => {
      const { result } = renderHook(() => useGroupLookup(group.slug), undefined, state);

      await waitFor(() => expect(result.current.isFetching).toBe(false));

      expect(result.current.entity?.id).toBe(group.id);
    });
  });

  describe('with an unsuccessful query', () => {
    beforeEach(() => {
      __stub((mock) => {
        mock.onGet(`/api/v1/groups/lookup?name=${group.slug}`).networkError();
      });
    });

    it('is has error state', async() => {
      const { result } = renderHook(() => useGroupLookup(group.slug), undefined, state);

      await waitFor(() => expect(result.current.isFetching).toBe(false));

      expect(result.current.entity).toBeUndefined();
    });
  });
});