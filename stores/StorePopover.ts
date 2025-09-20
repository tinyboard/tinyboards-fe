import { defineStore } from 'pinia';

interface PopoverOptions {
  id: number | null;
  isVisible: boolean;
  placement: 'left' | 'right';
  delay: number;
  options: { [key: string]: any } // additional options that can be passed onto the popover
}

export const usePopoverStore = defineStore('popover', {
  // State
  state: (): PopoverOptions => {
    return {
      id: null,
      isVisible: false,
      placement: 'right',
      delay: 1000,
      options: {}
    }
  },
  // Actions
  actions: {
    setPopover(popover: PopoverOptions) {
      this.id = popover.id;
      this.isVisible = !this.isVisible;
      this.options = popover.options;
      this.delay = popover.delay;
      this.options = popover.options;
    },
    closePopover() {
      this.isVisible = false;
    }
  }
});