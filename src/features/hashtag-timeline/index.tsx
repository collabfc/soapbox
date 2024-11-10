import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { fetchHashtag, followHashtag, unfollowHashtag } from 'soapbox/actions/tags.ts';
import { expandHashtagTimeline, clearTimeline } from 'soapbox/actions/timelines.ts';
import { useHashtagStream } from 'soapbox/api/hooks/index.ts';
import List, { ListItem } from 'soapbox/components/list.tsx';
import { Column, Toggle } from 'soapbox/components/ui/index.ts';
import Timeline from 'soapbox/features/ui/components/timeline.tsx';
import { useAppDispatch, useAppSelector, useFeatures, useLoggedIn, useTheme } from 'soapbox/hooks/index.ts';
import { useIsMobile } from 'soapbox/hooks/useIsMobile.ts';

interface IHashtagTimeline {
  params?: {
    id?: string;
  };
}

export const HashtagTimeline: React.FC<IHashtagTimeline> = ({ params }) => {
  const id = params?.id || '';

  const features = useFeatures();
  const dispatch = useAppDispatch();
  const tag = useAppSelector((state) => state.tags.get(id));
  const next = useAppSelector(state => state.timelines.get(`hashtag:${id}`)?.next);
  const { isLoggedIn } = useLoggedIn();
  const theme = useTheme();
  const isMobile = useIsMobile();

  const handleLoadMore = (maxId: string) => {
    dispatch(expandHashtagTimeline(id, { url: next, maxId }));
  };

  const handleFollow = () => {
    if (tag?.following) {
      dispatch(unfollowHashtag(id));
    } else {
      dispatch(followHashtag(id));
    }
  };

  useHashtagStream(id);

  useEffect(() => {
    dispatch(expandHashtagTimeline(id));
    dispatch(fetchHashtag(id));
  }, [id]);

  useEffect(() => {
    dispatch(clearTimeline(`hashtag:${id}`));
    dispatch(expandHashtagTimeline(id));
  }, [id]);

  return (
    <Column label={`#${id}`} transparent={!isMobile}>
      {features.followHashtags && isLoggedIn && (
        <List>
          <ListItem
            label={<FormattedMessage id='hashtag.follow' defaultMessage='Follow hashtag' />}
          >
            <Toggle
              checked={tag?.following}
              onChange={handleFollow}
            />
          </ListItem>
        </List>
      )}
      <Timeline
        className='black:p-0 black:sm:p-5'
        scrollKey='hashtag_timeline'
        timelineId={`hashtag:${id}`}
        onLoadMore={handleLoadMore}
        emptyMessage={<FormattedMessage id='empty_column.hashtag' defaultMessage='There is nothing in this hashtag yet.' />}
        divideType={(theme === 'black' || isMobile) ? 'border' : 'space'}
      />
    </Column>
  );
};

export default HashtagTimeline;
