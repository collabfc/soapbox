import { FormattedMessage } from 'react-intl';

import { usePopularTags } from 'soapbox/api/hooks/index.ts';
import Link from 'soapbox/components/link.tsx';
import HStack from 'soapbox/components/ui/hstack.tsx';
import Stack from 'soapbox/components/ui/stack.tsx';
import Text from 'soapbox/components/ui/text.tsx';

import TagListItem from './tag-list-item.tsx';

const PopularTags = () => {
  const { tags, isFetched, isError } = usePopularTags();
  const isEmpty = (isFetched && tags.length === 0) || isError;

  return (
    <Stack space={4} data-testid='popular-tags'>
      <HStack alignItems='center' justifyContent='between'>
        <Text size='xl' weight='bold'>
          <FormattedMessage
            id='groups.discover.tags.title'
            defaultMessage='Browse Topics'
          />
        </Text>

        <Link to='/groups/tags'>
          <Text tag='span' weight='medium' size='sm' theme='inherit'>
            <FormattedMessage
              id='groups.discover.tags.show_more'
              defaultMessage='Show More'
            />
          </Text>
        </Link>
      </HStack>

      {isEmpty ? (
        <Text theme='muted'>
          <FormattedMessage
            id='groups.discover.tags.empty'
            defaultMessage='Unable to fetch popular topics at this time. Please check back later.'
          />
        </Text>
      ) : (
        <Stack space={4}>
          {tags.slice(0, 10).map((tag) => (
            <TagListItem key={tag.id} tag={tag} />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export default PopularTags;