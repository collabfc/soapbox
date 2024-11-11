import Modal from 'soapbox/components/ui/modal.tsx';

interface IComponentModal {
  onClose: (type?: string) => void;
  component: React.ComponentType<{
    onClose: (type?: string) => void;
  }>;
  componentProps: Record<any, any>;
}

const ComponentModal: React.FC<IComponentModal> = ({ onClose, component: Component, componentProps = {} }) => (
  <Modal onClose={onClose} title=''>
    <Component onClose={onClose} {...componentProps} />
  </Modal>
);

export default ComponentModal;
