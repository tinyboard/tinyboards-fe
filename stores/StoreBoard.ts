import { defineStore } from "pinia";
//import { useAPIComputedRef } from "@/composables/api";
import type { Board } from "@/types/types";

interface BoardStoreState {
  board: Board | null;
}

export const useBoardStore = defineStore("board", {
  state: (): BoardStoreState => {
    return {
      board: null,
    };
  },
  getters: {
    hasBoard: (state) => !!state.board
  },
  actions: {
    setBoard(board: Board) {
      this.board = board;
    },
    updateBoard(boardUpdate: Partial<Board>) {
      if (this.board) {
        this.board = { ...this.board, ...boardUpdate };
      }
    },
    clear() {
      this.board = null;
    },
  },
});
