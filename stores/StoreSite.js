import { defineStore } from 'pinia'

export const useSiteStore = defineStore('site', {
  // State
  state: () => {
    return { 
      name: 'foruhm',
      description: ''
    }
  },
  // Actions
  actions: {
  },
})
