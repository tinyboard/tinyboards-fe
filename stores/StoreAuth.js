import { defineStore } from "pinia";
// import { baseURL } from "@/server/constants";
import { useApi } from "@/composables/api";

export const useLoggedInUser = defineStore("auth", {
  state: () => {
    return {
      user: null,
      counts: null,
      unread: null,
      token: null,
      isAuthed: false,
    };
  },
  actions: {
    login({ nameOrEmail, password }) {
      return new Promise((resolve, reject) => {
        useApi("/auth/login", {
          key: `login_${nameOrEmail}_${Date.now()}`,
          method: "post",
          body: {
            username_or_email: nameOrEmail,
            password,
          },
        })
          .then(({ data, error }) => {
            if (data.value) {
              this.user = data.value.user.person;
              this.counts = data.value.user.counts;
              this.unread = data.value.user.unread_notifications;
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
    signup({ username, email, password, invite_token, answer }) {
      return new Promise((resolve, reject) => {
        useApi("/auth/signup", {
          key: `signup_${username}_${Date.now()}`,
          method: "post",
          body: {
            username,
            email,
            password,
            invite_token,
            answer,
          },
        })
          .then(({ data }) => {
            if (data.value.jwt) {
              const token = data.value.jwt;
              this.fetchUserPromise(token)
                .then(({ data }) => {
                  this.user = data.value.person;
                  this.counts = data.value.counts;
                  this.unread = data.value.unread_notifications;
                  this.token = token;
                  this.isAuthed = true;
                  resolve(token);
                })
                .catch(({ error }) => {
                  reject(error.value);
                });
            } else {
              reject(
                "Account creation request submitted, wait for admin approval"
              );
            }
          })
          .catch((error) => reject(error.value));
      });
    },
    fetchUserPromise(authToken) {
      return useApi("/me", {
        key: `get_user_${authToken}`,
      }, {
        Authorization: "Bearer " + authToken
      });
    },
    fetchUser(authToken) {
      useApi("/me", {
        key: `get_user_${authToken}`,
      })
        .then(({ data }) => {
          this.user = data.value.user;
          this.counts = data.value.counts;
          this.unread = data.value.unread_notifications;
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
