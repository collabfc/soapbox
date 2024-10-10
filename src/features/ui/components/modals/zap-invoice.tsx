import { QRCodeCanvas } from 'qrcode.react';
import React  from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';

import { closeModal, openModal } from 'soapbox/actions/modals';
import { SplitValue } from 'soapbox/api/hooks/zap-split/useZapSplit';
import CopyableInput from 'soapbox/components/copyable-input';
import { Modal, Button, Stack, Avatar, HStack } from 'soapbox/components/ui';
import IconButton from 'soapbox/components/ui/icon-button/icon-button';
import { useAppDispatch } from 'soapbox/hooks';
import { ZapSplitData } from 'soapbox/schemas/zap-split';

import type { Account as AccountEntity } from 'soapbox/types/entities';

const closeIcon = require('@tabler/icons/outline/x.svg');

const messages = defineMessages({
  zap_open_wallet: { id: 'zap.open_wallet', defaultMessage: 'Open Wallet' },
  zap_next: { id: 'zap.next', defaultMessage: 'Next' },
});

interface ISplitData {
  hasZapSplit: boolean;
  zapSplitAccounts: ZapSplitData[];
  splitValues: SplitValue[];
}

interface IZapInvoice{
  account: AccountEntity;
  invoice: string;
  splitData: ISplitData;
  onClose:(type?: string) => void;
}

const ZapInvoiceModal: React.FC<IZapInvoice> = ({ account, invoice, splitData, onClose }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const { hasZapSplit, zapSplitAccounts, splitValues } = splitData;
  const onClickClose = () => {
    onClose('ZAP_INVOICE');
    dispatch(closeModal('ZAP_PAY_REQUEST'));
  };

  const renderTitle = () => {
    return <FormattedMessage id='zap.send_to' defaultMessage='Send zaps to {target}' values={{ target: account.display_name }} />;
  };

  const handleNext = () => {
    onClose('ZAP_INVOICE');
    dispatch(openModal('ZAP_SPLIT', { zapSplitAccounts, splitValues }));
  };

  return (
    <Modal width='sm'>
      <Stack space={6} className='relative m-auto' alignItems='center' >
        <Avatar src={account.avatar} size={64} />
        <h3 className='text-xl font-bold'>
          {renderTitle()}
        </h3>
        <IconButton src={closeIcon} onClick={onClickClose} className='absolute -top-[8%] right-[2%] text-gray-500 hover:text-gray-700 rtl:rotate-180 dark:text-gray-300 dark:hover:text-gray-200' />
        <QRCodeCanvas value={invoice} />
        <div className='w-full'>
          <CopyableInput value={invoice} />
        </div>
        <HStack space={2}>
          <a href={'lightning:' + invoice}>
            <Button type='submit' theme='primary' icon={require('@tabler/icons/outline/folder-open.svg')} text={intl.formatMessage(messages.zap_open_wallet)} />
          </a>
          {hasZapSplit && <Button type='button' theme='muted' onClick={handleNext} text={intl.formatMessage(messages.zap_next)} />}
        </HStack>
      </Stack>
    </Modal>
  );
};

export default ZapInvoiceModal;
