import {
  ModalState,
  modalfy,
  ModalfyParams,
  ModalStackItem,
} from 'react-native-modalfy';

const {openModal, closeModals, closeAllModals} = modalfy();

const isModalOpened = (modalName: string) => {
  const openedItems: ModalStackItem<ModalfyParams>[] = Array.from(
    ModalState.getState().stack.openedItems,
  );
  if (
    openedItems.some(
      (item: ModalStackItem<ModalfyParams>) => item.name === modalName,
    )
  ) {
    return true;
  }
  return false;
};

export default {
  open: openModal,
  close: closeModals,
  currentModal: () => ModalState.getState(),
  closeAll: closeAllModals,
  isModalOpened,
};
