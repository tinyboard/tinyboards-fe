import { defineStore } from 'pinia';

export const useModalStore = defineStore('modal', {
  // State
  state: () => {
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
    setModal(modal) {
      this.hasInit = true;
      this.modal = modal.modal;
      this.id = modal.id;
      this.contentType = modal.contentType;
      this.isOpen = modal.isOpen;
      this.options = modal.options;
    },
    closeModal() {
      this.isOpen = false;
    }
  }
});