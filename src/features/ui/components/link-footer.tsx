import clsx from 'clsx';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { logOut } from 'soapbox/actions/auth.ts';
import Text from 'soapbox/components/ui/text.tsx';
import { useAppDispatch } from 'soapbox/hooks/useAppDispatch.ts';
import { useFeatures } from 'soapbox/hooks/useFeatures.ts';
import { useOwnAccount } from 'soapbox/hooks/useOwnAccount.ts';
import { useSoapboxConfig } from 'soapbox/hooks/useSoapboxConfig.ts';
import sourceCode from 'soapbox/utils/code.ts';

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
          <FooterLink to='/logout' onClick={onClickLogOut}><FormattedMessage id='navigation_bar.logout' defaultMessage='Logout' /></FooterLink>
          <div><a className='text-gray-700 hover:text-gray-800 hover:underline dark:text-gray-600 dark:hover:text-gray-500' href='https://www.collabfc.com/privacy'>Privacy Policy</a></div>
          <div><a className='text-gray-700 hover:text-gray-800 hover:underline dark:text-gray-600 dark:hover:text-gray-500' href='https://www.collabfc.com/#about'>About</a></div>
          <div><a className='text-gray-700 hover:text-gray-800 hover:underline dark:text-gray-600 dark:hover:text-gray-500' href='https://github.com/collabfc/soapbox'>Source</a></div>
          <FooterLink to='/logout' onClick={onClickLogOut}><FormattedMessage id='navigation_bar.logout' defaultMessage='Logout' /></FooterLink>   
        </>}
        
      </div>

      <Text theme='muted' size='sm'>
        {soapboxConfig.linkFooterMessage ? (
          <span className='inline-block align-middle'>
            {soapboxConfig.linkFooterMessage}
          </span>
        ) : (
          <FormattedMessage
            id='getting_started.open_source_notice'
            defaultMessage='{code_name} is open source software. You can contribute or report issues at {code_link} (v{code_version}).'
            values={{
              code_name: sourceCode.displayName,
              code_link: <Text theme='subtle' tag='span'><a className='underline' href={sourceCode.url} rel='noopener' target='_blank'>{sourceCode.repository}</a></Text>,
              code_version: sourceCode.version,
            }}
          />
        )}
      </Text>
    </div>
  );
};

export default LinkFooter;