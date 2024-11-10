import { defineMessages, useIntl } from 'react-intl';

import { changeListEditorTitle, submitListEditor } from 'soapbox/actions/lists.ts';
import { Button, Form, HStack, Input } from 'soapbox/components/ui/index.ts';
import { useAppDispatch, useAppSelector } from 'soapbox/hooks/index.ts';

const messages = defineMessages({
  title: { id: 'lists.edit.submit', defaultMessage: 'Change title' },
  save: { id: 'lists.new.save_title', defaultMessage: 'Save Title' },
});

const ListForm = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();

  const value = useAppSelector((state) => state.listEditor.title);
  const disabled = useAppSelector((state) => !state.listEditor.isChanged);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    dispatch(changeListEditorTitle(e.target.value));
  };

  const handleSubmit: React.FormEventHandler<Element> = e => {
    e.preventDefault();
    dispatch(submitListEditor(false));
  };

  const handleClick = () => {
    dispatch(submitListEditor(false));
  };

  const save = intl.formatMessage(messages.save);

  return (
    <Form onSubmit={handleSubmit}>
      <HStack space={2}>
        <Input
          outerClassName='grow'
          type='text'
          value={value}
          onChange={handleChange}
        />

        <Button onClick={handleClick} disabled={disabled}>
          {save}
        </Button>
      </HStack>
    </Form>
  );
};

export default ListForm;
