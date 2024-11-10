import { describe, expect, it } from 'vitest';

import reducer from './sidebar.ts';

describe('sidebar reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {} as any)).toEqual({ sidebarOpen: false });
  });
});
