import { defineStore } from 'pinia';

interface ModalOptions {
  modal: string | null;
  id: number | null;
  contentType?: string | null;
  isOpen: boolean;
  options?: { [key: string]: any } // additional options that can be passed onto the modal
}

type ModalStore = ModalOptions & { hasInit: boolean };

export const useModalStore = defineStore('modal', {
  // State
  state: (): ModalStore => {
    return {
      hasInit: false,
      modal: null,
      id: null,
      contentType: 'post',
      isOpen: false,
      options: {}
    }
  },
  // Actions
  actions: {
    setModal(modal: ModalOptions) {
      this.hasInit = true;
      this.modal = modal.modal;
      this.id = modal.id;
      this.contentType = modal.contentType;
      this.isOpen = modal.isOpen;
      this.options = modal.options ?? {};
    },
    closeModal() {
      this.isOpen = false;
    }
  }
});