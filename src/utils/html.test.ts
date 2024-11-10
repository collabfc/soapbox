import { describe, expect, it } from 'vitest';

import * as html from './html.ts';

describe('html', () => {
  describe('unsecapeHTML', () => {
    it('returns unescaped HTML', () => {
      const output = html.unescapeHTML('<p>lorem</p><p>ipsum</p><br>&lt;br&gt;');
      expect(output).toEqual('lorem\n\nipsum\n<br>');
    });
  });
});
