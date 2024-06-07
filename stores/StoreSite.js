import { defineStore } from 'pinia';

export const useSiteStore = defineStore('site', {
  // State
  state: () => {
    return {
      name: 'tinyboards',
      description: '',
      icon: '',
      primaryColor: '60, 105, 145',
      secondaryColor: '96, 128, 63',
      hoverColor: '54, 94, 129',
      siteMode: 'open',
      enableDownvotes: true,
      enableNSFW: true,
      applicationQuestion: null,
      isPrivate: false,
      requireEmailVerification: false,
      enableBoards: false,
      boardCreationAdminOnly: true
    };
  },
  // Actions
  // actions: {
  // },
})