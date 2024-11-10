import { OrderedSet as ImmutableOrderedSet } from 'immutable';
import { describe, expect, it } from 'vitest';

import reducer from './user-lists.ts';

describe('user_lists reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as any)).toMatchObject({
      followers: {},
      following: {},
      reblogged_by: {},
      favourited_by: {},
      reactions: {},
      follow_requests: { next: null, items: ImmutableOrderedSet(), isLoading: false },
      blocks: { next: null, items: ImmutableOrderedSet(), isLoading: false },
      mutes: { next: null, items: ImmutableOrderedSet(), isLoading: false },
      directory: { next: null, items: ImmutableOrderedSet(), isLoading: true },
      pinned: {},
      birthday_reminders: {},
      familiar_followers: {},
    });
  });
});
