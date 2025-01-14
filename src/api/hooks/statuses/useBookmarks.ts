import { Entities } from 'soapbox/entity-store/entities.ts';
import { useEntities } from 'soapbox/entity-store/hooks/index.ts';
import { useApi } from 'soapbox/hooks/useApi.ts';
import { useFeatures } from 'soapbox/hooks/useFeatures.ts';
import { Status as StatusEntity, statusSchema } from 'soapbox/schemas/index.ts';

/**
 * Get all the statuses the user has bookmarked.
 * https://docs.joinmastodon.org/methods/bookmarks/#get
 * GET /api/v1/bookmarks
 * TODO: add 'limit'
 */
function useBookmarks() {
  const api = useApi();
  const features = useFeatures();

  const { entities, ...result } = useEntities<StatusEntity>(
    [Entities.STATUSES, 'bookmarks'],
    () => api.get('/api/v1/bookmarks'),
    { enabled: features.bookmarks, schema: statusSchema },
  );

  const bookmarks = entities;

  return {
    ...result,
    bookmarks,
  };
}

export { useBookmarks };