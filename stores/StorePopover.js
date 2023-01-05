import { defineStore } from 'pinia';

export const usePopoverStore = defineStore('popover', {
  // State
  state: () => {
    return { 
      popover: null,
      id: null,
      isVisible: false,
      placement: 'right',
      e: {},
      delay: 1000
    }
  },
  // Actions
  actions: {
    setPopover(popover) {
      this.id = popover.id;
      this.isVisible = !this.isVisible;
      this.options = popover.options;
      this.e = popover.e;
      this.delay = popover.delay;
    },
    closePopover() {
      this.isVisible = false;
    }
  }
});