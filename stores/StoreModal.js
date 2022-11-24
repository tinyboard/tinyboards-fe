import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  // State
  state: () => {
    return { 
      modal: null,
      id: null,
      contentType: 'post',
      isOpen: false
    }
  },
  // Actions
  actions: {
    setModal(modal) {
      this.modal = modal.modal;
      this.id = modal.id;
      this.contentType = modal.contentType;
      this.isOpen = modal.isOpen;
    },
    closeModal() {
      this.isOpen = false;
    }
  }
});