import { FormattedMessage } from 'react-intl';

import { openModal } from 'soapbox/actions/modals.ts';
import Button from 'soapbox/components/ui/button.tsx';
import Stack from 'soapbox/components/ui/stack.tsx';
import Text from 'soapbox/components/ui/text.tsx';
import { useAppDispatch } from 'soapbox/hooks/useAppDispatch.ts';
import { useAppSelector } from 'soapbox/hooks/useAppSelector.ts';
import { PERMISSION_CREATE_GROUPS, hasPermission } from 'soapbox/utils/permissions.ts';

const NewGroupPanel = () => {
  const dispatch = useAppDispatch();

  const canCreateGroup = useAppSelector((state) => hasPermission(state, PERMISSION_CREATE_GROUPS));

  const createGroup = () => {
    dispatch(openModal('CREATE_GROUP'));
  };

  if (!canCreateGroup) return null;

  return (
    <Stack space={2}>
      <Stack>
        <Text size='lg' weight='bold'>
          <FormattedMessage id='new_group_panel.title' defaultMessage='Create Group' />
        </Text>

        <Text theme='muted' size='sm'>
          <FormattedMessage id='new_group_panel.subtitle' defaultMessage="Can't find what you're looking for? Start your own private or public group." />
        </Text>
      </Stack>

      <Button
        onClick={createGroup}
        theme='secondary'
        block
      >
        <FormattedMessage id='new_group_panel.action' defaultMessage='Create Group' />
      </Button>
    </Stack>
  );
};

export default NewGroupPanel;
