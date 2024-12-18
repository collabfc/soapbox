import dotsVerticalIcon from '@tabler/icons/outline/dots-vertical.svg';
import hourglassEmptyIcon from '@tabler/icons/outline/hourglass-empty.svg';
import trashIcon from '@tabler/icons/outline/trash.svg';
import { useCallback, useState } from 'react';
import { useIntl, FormattedMessage, defineMessages } from 'react-intl';
import { Link } from 'react-router-dom';

import { closeReports } from 'soapbox/actions/admin.ts';
import { deactivateUserModal, deleteUserModal } from 'soapbox/actions/moderation.tsx';
import DropdownMenu from 'soapbox/components/dropdown-menu/index.ts';
import HoverRefWrapper from 'soapbox/components/hover-ref-wrapper.tsx';
import Accordion from 'soapbox/components/ui/accordion.tsx';
import Avatar from 'soapbox/components/ui/avatar.tsx';
import Button from 'soapbox/components/ui/button.tsx';
import HStack from 'soapbox/components/ui/hstack.tsx';
import Stack from 'soapbox/components/ui/stack.tsx';
import Text from 'soapbox/components/ui/text.tsx';
import { useAppDispatch } from 'soapbox/hooks/useAppDispatch.ts';
import { useAppSelector } from 'soapbox/hooks/useAppSelector.ts';
import { makeGetReport } from 'soapbox/selectors/index.ts';
import toast from 'soapbox/toast.tsx';

import ReportStatus from './report-status.tsx';

import type { List as ImmutableList } from 'immutable';
import type { Account, AdminReport, Status } from 'soapbox/types/entities.ts';

const messages = defineMessages({
  reportClosed: { id: 'admin.reports.report_closed_message', defaultMessage: 'Report on @{name} was closed' },
  deactivateUser: { id: 'admin.users.actions.deactivate_user', defaultMessage: 'Deactivate @{name}' },
  deleteUser: { id: 'admin.users.actions.delete_user', defaultMessage: 'Delete @{name}' },
});

interface IReport {
  id: string;
}

const Report: React.FC<IReport> = ({ id }) => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const getReport = useCallback(makeGetReport(), []);

  const report = useAppSelector((state) => getReport(state, id) as AdminReport | undefined);

  const [accordionExpanded, setAccordionExpanded] = useState(false);

  if (!report) return null;

  const account = report.account as Account;
  const targetAccount = report.target_account as Account;

  const makeMenu = () => {
    return [{
      text: intl.formatMessage(messages.deactivateUser, { name: targetAccount.username }),
      action: handleDeactivateUser,
      icon: hourglassEmptyIcon,
    }, {
      text: intl.formatMessage(messages.deleteUser, { name: targetAccount.username }),
      action: handleDeleteUser,
      icon: trashIcon,
      destructive: true,
    }];
  };

  const handleCloseReport = () => {
    dispatch(closeReports([report.id])).then(() => {
      const message = intl.formatMessage(messages.reportClosed, { name: targetAccount.username as string });
      toast.success(message);
    }).catch(() => {});
  };

  const handleDeactivateUser = () => {
    const accountId = targetAccount.id;
    dispatch(deactivateUserModal(intl, accountId, () => handleCloseReport()));
  };

  const handleDeleteUser = () => {
    const accountId = targetAccount.id as string;
    dispatch(deleteUserModal(intl, accountId, () => handleCloseReport()));
  };

  const handleAccordionToggle = (setting: boolean) => {
    setAccordionExpanded(setting);
  };

  const menu = makeMenu();
  const statuses = report.statuses as ImmutableList<Status>;
  const statusCount = statuses.count();
  const acct = targetAccount.acct as string;
  const reporterAcct = account.acct as string;

  return (
    <HStack space={3} className='p-3' key={report.id}>
      <HoverRefWrapper accountId={targetAccount.id} inline>
        <Link to={`/@${acct}`} title={acct}>
          <Avatar src={targetAccount.avatar} size={32} className='overflow-hidden' />
        </Link>
      </HoverRefWrapper>

      <Stack space={3} className='overflow-hidden' grow>
        <Text tag='h4' weight='bold'>
          <FormattedMessage
            id='admin.reports.report_title'
            defaultMessage='Report on {acct}'
            values={{ acct: (
              <HoverRefWrapper accountId={targetAccount.id} inline>
                <Link to={`/@${acct}`} title={acct}>@{acct}</Link> {/* eslint-disable-line formatjs/no-literal-string-in-jsx */}
              </HoverRefWrapper>
            ) }}
          />
        </Text>

        {statusCount > 0 && (
          <Accordion
            headline={`Reported posts (${statusCount})`}
            expanded={accordionExpanded}
            onToggle={handleAccordionToggle}
          >
            <Stack space={4}>
              {statuses.map(status => (
                <ReportStatus
                  key={status.id}
                  report={report}
                  status={status}
                />
              ))}
            </Stack>
          </Accordion>
        )}

        <Stack>
          {(report.comment || '').length > 0 && (
            <Text
              tag='blockquote'
              dangerouslySetInnerHTML={{ __html: report.comment }}
            />
          )}

          <HStack space={1}>
            <Text theme='muted' tag='span'>&mdash;</Text> {/* eslint-disable-line formatjs/no-literal-string-in-jsx */}

            <HoverRefWrapper accountId={account.id} inline>
              <Link
                to={`/@${reporterAcct}`}
                title={reporterAcct}
                className='text-primary-600 hover:underline dark:text-accent-blue'
              > {/* eslint-disable-line formatjs/no-literal-string-in-jsx */}
                @{reporterAcct}
              </Link>
            </HoverRefWrapper>
          </HStack>
        </Stack>
      </Stack>

      <HStack space={2} alignItems='start' className='flex-none'>
        <Button onClick={handleCloseReport}>
          <FormattedMessage id='admin.reports.actions.close' defaultMessage='Close' />
        </Button>

        <DropdownMenu items={menu} src={dotsVerticalIcon} />
      </HStack>
    </HStack>
  );
};

export default Report;
