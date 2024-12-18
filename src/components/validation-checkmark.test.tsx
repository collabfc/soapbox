import { describe, expect, it } from 'vitest';

import { render, screen } from 'soapbox/jest/test-helpers.tsx';

import ValidationCheckmark from './validation-checkmark.tsx';

describe('<ValidationCheckmark />', () => {
  it('renders text', () => {
    const text = 'some validation';
    render(<ValidationCheckmark text={text} isValid />);

    expect(screen.getByTestId('validation-checkmark')).toHaveTextContent(text);
  });

  it('uses a green check when valid', () => {
    const text = 'some validation';
    render(<ValidationCheckmark text={text} isValid />);

    expect(screen.getByTestId('svg-icon-loader')).toHaveClass('text-success-500');
    expect(screen.getByTestId('svg-icon-loader')).not.toHaveClass('text-gray-400');
  });

  it('uses a gray check when valid', () => {
    const text = 'some validation';
    render(<ValidationCheckmark text={text} isValid={false} />);

    expect(screen.getByTestId('svg-icon-loader')).toHaveClass('text-gray-400');
    expect(screen.getByTestId('svg-icon-loader')).not.toHaveClass('text-success-500');
  });
});
