import { defineStore } from "pinia";
import { baseURL } from "@/server/constants";

export const useLoggedInUser = defineStore("auth", {
  state: {
    user: null,
    token: null,
    isAuthed: false,
  },
  actions: {
    login({ nameOrEmail, password }) {
      return new Promise((resolve, reject) => {
        useFetch("/auth/login", {
          baseURL,
          key: `login_${nameOrEmail}`,
          method: "post",
          body: {
            name_or_email: nameOrEmail,
            password,
          },
        })
          .then(({ data }) => {
            this.user = data.user;
            this.token = data.token;
            this.isAuthed = true;

            resolve(data);
          })
          .catch(({ error }) => {
            this.isAuthed = false;
            reject(error);
          });
      });
    },
    logout() {
      this.user = null;
      this.token = null;
      this.isAuthed = false;
    },
  },
});
