import Stack from 'soapbox/components/ui/stack.tsx';
import Text from 'soapbox/components/ui/text.tsx';

interface Props {
  title: React.ReactNode | string;
  subtitle: React.ReactNode | string;
}

export default ({ title, subtitle }: Props) => (
  <Stack space={2} className='px-4 py-2' data-testid='no-results'>
    <Text weight='bold' size='lg'>
      {title}
    </Text>

    <Text theme='muted'>
      {subtitle}
    </Text>
  </Stack>
);