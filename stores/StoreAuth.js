import { defineStore } from "pinia";
import { baseURL } from "@/server/constants";

export const useLoggedInUser = defineStore("auth", {
  state: () => {
    return {
      user: null,
      token: null,
      isAuthed: false,
    };
  },
  actions: {
    login({ nameOrEmail, password }) {
      return new Promise((resolve, reject) => {
        useFetch("/auth/login", {
          baseURL,
          key: `login_${nameOrEmail}`,
          method: "post",
          body: {
            username_or_email: nameOrEmail,
            password,
          },
        })
          .then(({ data }) => {
            this.user = data.value.user.user;
            this.token = data.value.jwt;
            this.isAuthed = true;

            resolve(data.value);
          })
          .catch(({ error }) => {
            this.isAuthed = false;
            reject(error).value;
          });
      });
    },
    fetchUser(authToken) {
      useFetch("/user/me", {
        baseURL,
        key: `get_user_${authToken}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then(({ data }) => {
          this.user = data;
          this.token = authToken;
          this.isAuthed = true;
        })
        .catch(({ error }) => console.error(error));
    },
    logout() {
      this.user = null;
      this.token = null;
      this.isAuthed = false;
    },
  },
});
