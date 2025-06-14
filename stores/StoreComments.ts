import { defineStore } from 'pinia';
import type { Comment } from '@/types/types';

interface CommentStore {
  comments: Comment[]
}

export const useCommentsStore = defineStore('comments', {
  // State
  state: (): CommentStore => {
    return {
      comments: [] as Comment[]
    }
  },
  // Getters
  getters: {
    /** A function that looks up a comment based on its ID */
    getComment: (state) => {
      return (id: number): Comment => state.comments.filter((comment: Comment) => comment.id === id);
    }
  },
  // Actions
  actions: {
    setComments(comments: Comment[]) {
      this.comments = comments;
    },
    updateComment(id: number, options: { [key: string]: any }) {
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