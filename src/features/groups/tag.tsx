import layoutGridIcon from '@tabler/icons/outline/layout-grid.svg';
import layoutListIcon from '@tabler/icons/outline/layout-list.svg';
import clsx from 'clsx';
import { forwardRef, useCallback, useState } from 'react';
import { Components, Virtuoso, VirtuosoGrid } from 'react-virtuoso';

import { useGroupTag, useGroupsFromTag } from 'soapbox/api/hooks/index.ts';
import { Column, HStack, Icon } from 'soapbox/components/ui/index.ts';

import GroupGridItem from './components/discover/group-grid-item.tsx';
import GroupListItem from './components/discover/group-list-item.tsx';

import type { Group } from 'soapbox/schemas/index.ts';

enum Layout {
  LIST = 'LIST',
  GRID = 'GRID'
}

const GridList: Components['List'] = forwardRef((props, ref) => {
  const { context, ...rest } = props;
  return <div ref={ref} {...rest} className='flex flex-wrap' />;
});

interface ITag {
  params: { id: string };
}

const Tag: React.FC<ITag> = (props) => {
  const tagId = props.params.id;

  const [layout, setLayout] = useState<Layout>(Layout.LIST);

  const { tag, isLoading } = useGroupTag(tagId);
  const { groups, hasNextPage, fetchNextPage } = useGroupsFromTag(tagId);

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const renderGroupList = useCallback((group: Group, index: number) => (
    <div
      className={
        clsx({
          'pt-4': index !== 0,
        })
      }
    >
      <GroupListItem group={group} withJoinAction />
    </div>
  ), []);

  const renderGroupGrid = useCallback((group: Group) => (
    <GroupGridItem group={group} />
  ), []);

  if (isLoading || !tag) {
    return null;
  }

  return (
    <Column
      label={`#${tag.name}`}
      action={
        <HStack alignItems='center'>
          <button onClick={() => setLayout(Layout.LIST)}>
            <Icon
              src={layoutListIcon}
              className={
                clsx('size-5 text-gray-600', {
                  'text-primary-600': layout === Layout.LIST,
                })
              }
            />
          </button>

          <button onClick={() => setLayout(Layout.GRID)}>
            <Icon
              src={layoutGridIcon}
              className={
                clsx('size-5 text-gray-600', {
                  'text-primary-600': layout === Layout.GRID,
                })
              }
            />
          </button>
        </HStack>
      }
    >
      {layout === Layout.LIST ? (
        <Virtuoso
          useWindowScroll
          data={groups}
          itemContent={(index, group) => renderGroupList(group, index)}
          endReached={handleLoadMore}
        />
      ) : (
        <VirtuosoGrid
          useWindowScroll
          data={groups}
          itemContent={(_index, group) => renderGroupGrid(group)}
          components={{
            Item: (props) => (
              <div {...props} className='w-1/2 flex-none pb-4 [&:nth-last-of-type(-n+2)]:pb-0' />
            ),
            List: GridList,
          }}
          endReached={handleLoadMore}
        />
      )}
    </Column>
  );
};

export default Tag;
