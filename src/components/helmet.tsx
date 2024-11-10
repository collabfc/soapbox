import { useMemo, useEffect } from 'react';
import { Helmet as ReactHelmet } from 'react-helmet';

import { useStatContext } from 'soapbox/contexts/stat-context.tsx';
import { useAppSelector, useInstance, useSettings } from 'soapbox/hooks/index.ts';
import { RootState } from 'soapbox/store.ts';
import FaviconService from 'soapbox/utils/favicon-service.ts';

FaviconService.initFaviconService();

const getNotifTotals = (state: RootState): number => {
  const notifications = state.notifications.unread || 0;
  const reports = state.admin.openReports.count();
  const approvals = state.admin.awaitingApproval.count();
  return notifications + reports + approvals;
};

interface IHelmet {
  children: React.ReactNode;
}

const Helmet: React.FC<IHelmet> = ({ children }) => {
  const { instance } = useInstance();
  const { unreadChatsCount } = useStatContext();
  const unreadCount = useAppSelector((state) => getNotifTotals(state) + unreadChatsCount);
  const { demetricator } = useSettings();

  const hasUnreadNotifications = useMemo(() => !(unreadCount < 1 || demetricator), [unreadCount, demetricator]);

  const addCounter = (string: string) => {
    return hasUnreadNotifications ? `(${unreadCount}) ${string}` : string;
  };

  const updateFaviconBadge = () => {
    if (hasUnreadNotifications) {
      FaviconService.drawFaviconBadge();
    } else {
      FaviconService.clearFaviconBadge();
    }
  };

  useEffect(() => {
    updateFaviconBadge();
  }, [unreadCount, demetricator]);

  return (
    <ReactHelmet
      titleTemplate={addCounter(`%s | ${instance.title}`)}
      defaultTitle={addCounter(instance.title)}
      defer={false}
    >
      {children}
    </ReactHelmet>
  );
};

export default Helmet;
