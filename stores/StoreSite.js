import { defineStore } from 'pinia';

export const useSiteStore = defineStore('site', {
  // State
  state: () => {
    return { 
      name: 'tinyboards',
      color: '60, 105, 145',
      siteMode: 'open',
      enableDownvotes: true,
      enableNSFW: true,
      applicationQuestion: null,
      isPrivate: false,
      requireEmailVerification: false
    };
  },
  // Actions
  actions: {
  },
})
