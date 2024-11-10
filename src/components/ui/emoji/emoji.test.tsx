import { describe, expect, it } from 'vitest';

import { render, screen } from 'soapbox/jest/test-helpers.tsx';

import Emoji from './emoji.tsx';

describe('<Emoji />', () => {
  it('renders a simple emoji', () => {
    render(<Emoji emoji='😀' />);

    const img = screen.getByRole('img');
    expect(img.getAttribute('src')).toBe('/packs/emoji/1f600.svg');
    expect(img.getAttribute('alt')).toBe('😀');
  });

  // https://emojipedia.org/emoji-flag-sequence/
  it('renders a sequence emoji', () => {
    render(<Emoji emoji='🇺🇸' />);

    const img = screen.getByRole('img');
    expect(img.getAttribute('src')).toBe('/packs/emoji/1f1fa-1f1f8.svg');
    expect(img.getAttribute('alt')).toBe('🇺🇸');
  });
});
