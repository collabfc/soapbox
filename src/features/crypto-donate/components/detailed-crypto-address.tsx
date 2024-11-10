import externalLinkIcon from '@tabler/icons/outline/external-link.svg';
import { QRCodeCanvas as QRCode } from 'qrcode.react';

import CopyableInput from 'soapbox/components/copyable-input.tsx';
import Icon from 'soapbox/components/icon.tsx';

import { getExplorerUrl } from '../utils/block-explorer.ts';
import { getTitle } from '../utils/coin-db.ts';

import CryptoIcon from './crypto-icon.tsx';

interface IDetailedCryptoAddress {
  address: string;
  ticker: string;
  note?: string;
}

const DetailedCryptoAddress: React.FC<IDetailedCryptoAddress> = ({ address, ticker, note }): JSX.Element => {
  const title = getTitle(ticker);
  const explorerUrl = getExplorerUrl(ticker, address);

  return (
    <div className='crypto-address'>
      <div className='crypto-address__head'>
        <CryptoIcon
          className='crypto-address__icon'
          ticker={ticker}
          title={title}
        />
        <div className='crypto-address__title'>{title || ticker.toUpperCase()}</div>
        <div className='crypto-address__actions'>
          {explorerUrl && <a href={explorerUrl} target='_blank'>
            <Icon src={externalLinkIcon} />
          </a>}
        </div>
      </div>
      {note && <div className='crypto-address__note'>{note}</div>}
      <div className='crypto-address__qrcode'>
        <QRCode className='rounded-lg' value={address} includeMargin />
      </div>

      <CopyableInput value={address} />
    </div>
  );
};

export default DetailedCryptoAddress;
