import { defineStore } from 'pinia'

export const useSiteStore = defineStore('site', {
  // State
  state: () => {
    return { 
      name: 'tinyboards',
      description: ''
    }
  },
  // Actions
  actions: {
  },
})
