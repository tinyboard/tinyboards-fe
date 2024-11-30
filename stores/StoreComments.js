import { defineStore } from 'pinia';

export const useCommentsStore = defineStore('comments', {
  // State
  state: () => {
    return { 
      comments: []
    }
  },
  // Getters
  getters: {
    getComment: (state) => {
      id = Number(id);
      for (let i = 0; i < state.comments.length; i++) {
        if (state.comments[i].comment.id === id) {
          return state.comments[i]
        }
      }
    }
  },
  // Actions
  actions: {
    setComments(comments) {
      this.comments = comments;
    },
    updateComment(id, options) {
      for (let i = 0; i < this.comments.length; i++) {
        if (this.comments[i].comment.id === id) {
          this.comments[i].comment = {
            ...this.comments[i].comment,
            ...options
          };
        }
      }
    }
  }
});