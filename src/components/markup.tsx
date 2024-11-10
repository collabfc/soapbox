import { forwardRef } from 'react';

import Text, { IText } from './ui/text/text.tsx';
import './markup.css';

interface IMarkup extends IText {
}

/** Styles HTML markup returned by the API, such as in account bios and statuses. */
const Markup = forwardRef<any, IMarkup>((props, ref) => {
  return (
    <Text ref={ref} {...props} data-markup />
  );
});

export default Markup;