import { defineStore } from "pinia";
import { baseURL } from "@/server/constants";

export const useLoggedInUser = defineStore("auth", {
  state: () => {
    return {
      user: null,
      token: null,
      isAuthed: false
    };
  },
  actions: {
    login({ nameOrEmail, password }) {
      return new Promise((resolve, reject) => {
        useFetch("/auth/login", {
          baseURL,
          key: `login_${nameOrEmail}_${Date.now()}`,
          method: "post",
          body: {
            username_or_email: nameOrEmail,
            password,
          },
        })
        .then(({ data, error }) => {
          if (data.value) {
            this.user = data.value.user.user;
            this.token = data.value.jwt;
            this.isAuthed = true;

            resolve(data.value);
          } else {
            this.isAuthed = false;
            reject(error.value);
          }
        })
        .catch((error) => {
          this.isAuthed = false;
          reject(error);
        });
      });
    },
    signup({ username, password }) {
      return new Promise((resolve, reject) => {
        useFetch("/auth/signup", {
          baseURL,
          key: `signup_${username}_${Date.now()}`,
          method: "post",
          body: {
            username,
            password,
          },
        })
        .then(({ data }) => {
          if (data.value.jwt) {
            const token = data.value.jwt;
            this.fetchUserPromise(token)
            .then(({ data }) => {
              this.user = data.value;
              this.token = token;
              this.isAuthed = true;
              resolve(token);
            })
            .catch(({ error }) => {
              reject(error.value);
            });
          } else {
            reject("Account creation request submitted, wait for admin approval");
          }
        })
        .catch((error) => reject(error.value));
      });
    },
    fetchUserPromise(authToken) {
      return useFetch("/me", {
        baseURL,
        key: `get_user_${authToken}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    },
    fetchUser(authToken) {
      useFetch("/me", {
        baseURL,
        key: `get_user_${authToken}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        }
      })
      .then(({ data }) => {
        this.user = data.value;
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
