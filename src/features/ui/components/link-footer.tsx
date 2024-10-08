import clsx from 'clsx';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { logOut } from 'soapbox/actions/auth';
import { Text } from 'soapbox/components/ui';
import emojify from 'soapbox/features/emoji';
import { useSoapboxConfig, useOwnAccount, useFeatures, useAppDispatch } from 'soapbox/hooks';
import sourceCode from 'soapbox/utils/code';

interface IFooterLink {
  to: string;
  className?: string;
  onClick?: React.EventHandler<React.MouseEvent>;
  children: React.ReactNode;
}

const FooterLink: React.FC<IFooterLink> = ({ children, className, ...rest }): JSX.Element => {
  return (
    <div>
      <Link className={clsx('text-gray-700 hover:text-gray-800 hover:underline dark:text-gray-600 dark:hover:text-gray-500', className)} {...rest}>{children}</Link>
    </div>
  );
};

const LinkFooter: React.FC = (): JSX.Element => {
  const { account } = useOwnAccount();
  const features = useFeatures();
  const soapboxConfig = useSoapboxConfig();

  const dispatch = useAppDispatch();

  const onClickLogOut: React.EventHandler<React.MouseEvent> = (e) => {
    dispatch(logOut());
    e.preventDefault();
  };

  return (
    <div className='space-y-2'>
      <div className='divide-x-dot flex flex-wrap items-center text-gray-600'>
        {account && <>
          {features.profileDirectory && (
            <FooterLink to='/directory'><FormattedMessage id='navigation_bar.profile_directory' defaultMessage='Profile directory' /></FooterLink>
          )}
          {features.blocks && (
            <FooterLink to='/blocks'><FormattedMessage id='navigation_bar.blocks' defaultMessage='Blocks' /></FooterLink>
          )}
          <FooterLink to='/mutes'><FormattedMessage id='navigation_bar.mutes' defaultMessage='Mutes' /></FooterLink>
          {(features.filters || features.filtersV2) && (
            <FooterLink to='/filters'><FormattedMessage id='navigation_bar.filters' defaultMessage='Filters' /></FooterLink>
          )}
          {features.followedHashtagsList && (
            <FooterLink to='/followed_tags'><FormattedMessage id='navigation_bar.followed_tags' defaultMessage='Followed hashtags' /></FooterLink>
          )}
          {features.domainBlocks && (
            <FooterLink to='/domain_blocks'><FormattedMessage id='navigation_bar.domain_blocks' defaultMessage='Domain blocks' /></FooterLink>
          )}
          {account.admin && (
            <FooterLink to='/soapbox/config'><FormattedMessage id='navigation_bar.soapbox_config' defaultMessage='Soapbox config' /></FooterLink>
          )}
          {account.locked && (
            <FooterLink to='/follow_requests'><FormattedMessage id='navigation_bar.follow_requests' defaultMessage='Follow requests' /></FooterLink>
          )}
          <div><a className='text-gray-700 hover:text-gray-800 hover:underline dark:text-gray-600 dark:hover:text-gray-500' href='https://www.collabfc.com/privacy'>Privacy Policy</a></div>
          <div><a className='text-gray-700 hover:text-gray-800 hover:underline dark:text-gray-600 dark:hover:text-gray-500' href='https://www.collabfc.com/#about'>About</a></div>
          <div><a className='text-gray-700 hover:text-gray-800 hover:underline dark:text-gray-600 dark:hover:text-gray-500' href='https://github.com/collabfc/soapbox'>Source</a></div>
          <FooterLink to='/logout' onClick={onClickLogOut}><FormattedMessage id='navigation_bar.logout' defaultMessage='Logout' /></FooterLink>
        </>}
      </div>
    </div>
  );
};

export default LinkFooter;
