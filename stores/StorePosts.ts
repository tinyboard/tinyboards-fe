import { defineStore } from 'pinia';

export const usePostsStore = defineStore('posts', {
  // State
  state: () => {
    return { 
      posts: []
    }
  },
  // Getters
  getters: {
    getPost: (state) => (id: number | string): number => {
      id = Number(id);
      for (let i = 0; i < state.posts.length; i++) {
        if (state.posts[i].post.id === id) {
          return state.posts[i]
        }
      }
    }
  },
  // Actions
  actions: {
    updateRoot(id, options) {
      for (let i = 0; i < this.posts.length; i++) {
        if (this.posts[i].post.id === id) {
          this.posts[i] = {
            ...this.posts[i],
            ...options
          };
        }
      }
    },
    updatePost(id, options) {
      for (let i = 0; i < this.posts.length; i++) {
        if (this.posts[i].post.id === id) {
          this.posts[i].post = {
            ...this.posts[i].post,
            ...options
          };
        }
      }
    }
  }
});