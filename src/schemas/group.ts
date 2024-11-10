import escapeTextContentForBrowser from 'escape-html';
import z from 'zod';

import avatarMissing from 'soapbox/assets/images/avatar-missing.png';
import headerMissing from 'soapbox/assets/images/header-missing.png';
import emojify from 'soapbox/features/emoji/index.ts';
import { unescapeHTML } from 'soapbox/utils/html.ts';

import { customEmojiSchema } from './custom-emoji.ts';
import { groupRelationshipSchema } from './group-relationship.ts';
import { groupTagSchema } from './group-tag.ts';
import { filteredArray, makeCustomEmojiMap } from './utils.ts';

const groupSchema = z.object({
  avatar: z.string().catch(avatarMissing),
  avatar_static: z.string().catch(''),
  created_at: z.string().datetime().catch(new Date().toUTCString()),
  deleted_at: z.string().datetime().or(z.null()).catch(null),
  display_name: z.string().catch(''),
  domain: z.string().catch(''),
  emojis: filteredArray(customEmojiSchema),
  group_visibility: z.string().catch(''), // TruthSocial
  header: z.string().catch(headerMissing),
  header_static: z.string().catch(''),
  id: z.coerce.string(),
  locked: z.boolean().catch(false),
  membership_required: z.boolean().catch(false),
  members_count: z.number().catch(0),
  owner: z.object({ id: z.string() }),
  note: z.string().transform(note => note === '<p></p>' ? '' : note).catch(''),
  relationship: groupRelationshipSchema.nullable().catch(null), // Dummy field to be overwritten later
  slug: z.string().catch(''), // TruthSocial
  source: z.object({
    note: z.string(),
  }).optional(), // TruthSocial
  statuses_visibility: z.string().catch('public'),
  tags: z.array(groupTagSchema).catch([]),
  uri: z.string().catch(''),
  url: z.string().catch(''),
}).transform(group => {
  group.avatar_static = group.avatar_static || group.avatar;
  group.header_static = group.header_static || group.header;
  group.locked = group.locked || group.group_visibility === 'members_only'; // TruthSocial

  const customEmojiMap = makeCustomEmojiMap(group.emojis);
  return {
    ...group,
    display_name_html: emojify(escapeTextContentForBrowser(group.display_name), customEmojiMap),
    note_emojified: emojify(group.note, customEmojiMap),
    note_plain: group.source?.note || unescapeHTML(group.note),
  };
});

type Group = z.infer<typeof groupSchema>;

export { groupSchema, type Group };
