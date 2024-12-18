import { Entities } from 'soapbox/entity-store/entities.ts';
import { useEntities } from 'soapbox/entity-store/hooks/index.ts';
import { useApi } from 'soapbox/hooks/useApi.ts';
import { Account, accountSchema } from 'soapbox/schemas/index.ts';

import { useRelationships } from './useRelationships.ts';

import type { EntityFn } from 'soapbox/entity-store/hooks/types.ts';

interface useAccountListOpts {
  enabled?: boolean;
}

function useAccountList(listKey: string[], entityFn: EntityFn<void>, opts: useAccountListOpts = {}) {
  const { entities, ...rest } = useEntities(
    [Entities.ACCOUNTS, ...listKey],
    entityFn,
    { schema: accountSchema, enabled: opts.enabled },
  );

  const { relationships } = useRelationships(
    listKey,
    entities.map(({ id }) => id),
  );

  const accounts: Account[] = entities.map((account) => ({
    ...account,
    relationship: relationships[account.id],
  }));

  return { accounts, ...rest };
}

function useBlocks() {
  const api = useApi();
  return useAccountList(['blocks'], () => api.get('/api/v1/blocks'));
}

function useMutes() {
  const api = useApi();
  return useAccountList(['mutes'], () => api.get('/api/v1/mutes'));
}

function useFollowing(accountId: string | undefined) {
  const api = useApi();

  return useAccountList(
    [accountId!, 'following'],
    () => api.get(`/api/v1/accounts/${accountId}/following`),
    { enabled: !!accountId },
  );
}

function useFollowers(accountId: string | undefined) {
  const api = useApi();

  return useAccountList(
    [accountId!, 'followers'],
    () => api.get(`/api/v1/accounts/${accountId}/followers`),
    { enabled: !!accountId },
  );
}

export {
  useAccountList,
  useBlocks,
  useMutes,
  useFollowing,
  useFollowers,
};