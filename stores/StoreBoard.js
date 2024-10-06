import { defineStore } from "pinia";
import { useApi } from "@/composables/api";

export const useBoardStore = defineStore("board", {
  state: () => {
    return {
      board: {},
    };
  },
  getters: {
    hasBoard: (state) => Object.keys(state.board).length !== 0,
  },
  actions: {
    setBoard(board) {
      this.board = board;
    },
    clear() {
      this.board = {};
    },
  },
});
