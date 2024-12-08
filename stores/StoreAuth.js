import { defineStore } from "pinia";
// import { baseURL } from "@/server/constants";
import { useApi } from "@/composables/api";
//import { LOGIN_QUERY } from "@/graphql/mutations/Auth";
//import { ME_QUERY } from "@/graphql/queries/Me";
import Cookies from 'js-cookie';

export const useLoggedInUser = defineStore("auth", {
  state: () => {
    return {
      user: null,
      counts: null,
      unread: null,
      token: null,
      /*permissions: {
        appearance: false,
        config: false,
        content: false,
        users: false,
        boards: false,
        full: false,
        owner: false,
      },*/
      adminLevel: null,
      joinedBoards: [],
      moddedBoards: [],
      isAuthed: false,
    };
  },
  actions: {
    /*login({ nameOrEmail, password }) {
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
              //console.log(JSON.stringify(data.value.user, null, 4));
              this.user = data.value.user.person;
              this.counts = data.value.user.counts;
              this.unread = data.value.user.unread_notifications;
              console.log(data.value.user.subscribed_boards);
              this.joinedBoards = data.value.user.subscribed_boards;
              this.moddedBoards = data.value.user.moderated_boards;
              this.adminLevel = data.value.user.admin_level;

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
    },*/
    login({ nameOrEmail, password }) {
      //const { useMutation } = useApollo();
      return new Promise((resolve, reject) => {
        // Obtain auth token
        GqlSubmitLogin({ usernameOrEmail: nameOrEmail, password })
          .then((data) => {
            console.log("Hi! the request was successful");
            console.log(JSON.stringify(data, null, 4));
            Cookies.set('token', data.login.token);
            this.token = data.login.token;

            // Login successful - fetch user
            const me = useAsyncGql({ operation: 'getLoggedInUser' })
              .then((resp) => {
                const data = resp.data.value;

                const moderates = data.me.moderates.map((m) => m.board);
                const joined = data.me.joined;

                const user = data.me;
                delete user.moderates;
                delete user.joined;

                this.user = user;
                this.joinedBoards = joined;
                this.moddedBoards = moderates;
                this.adminLevel = this.user.adminLevel;
                this.isAuthed = true;
                this.unread = data.unreadMentionsCount + data.unreadRepliesCount;

                resolve(this.user);
              })
              .catch((err) => {
                // Fetching user failed - remove token and reject promise
                this.logout();
                Cookies.remove('token');

                reject(err);
              })
          })
          .catch((err) => reject(err));
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
                  this.adminLevel = data.value.admin_level;
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
      return useApi(
        "/me",
        {
          key: `get_user_${authToken}`,
        },
        {
          Authorization: "Bearer " + authToken,
        }
      );
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
          this.adminLevel = data.value.admin_level;
          console.log(data.value.subscribed_boards);
          this.joinedBoards = data.value.subscribed_boards;
          this.moddedBoards = data.value.moderated_boards;

          /*let adminLevel = data.value.user.admin_level;

          let keys = [];
          for (let key in this.permissions) {
            if (this.permissions.hasOwnProperty(key)) {
              keys.push(key);
            }
          }

          console.log("hi from store");

          for (let i = 1; i < keys.length; i++) {
            console.log(2 ** i);
            this.permissions[keys[i]] = (adminLevel & (2 ** i)) > 0;
          }*/
        })
        .catch(({ error }) => console.error(error));
    },
    addJoinedBoard(boardView) {
      this.joinedBoards.push(boardView);
    },
    removeJoinedBoard(id) {
      this.joinedBoards = this.joinedBoards.filter((boardView) => boardView.board.id !== id);
    },
    addModdedBoard(boardView) {
      this.moddedBoards.push(boardView);
    },
    removeModdedBoard(id) {
      this.moddedBoards = this.moddedBoards.filter((boardView) => boardView.board.id !== id);
    },
    logout() {
      this.user = null;
      this.token = null;
      this.isAuthed = false;
      this.adminLevel = null;
      this.joinedBoards = [];
      this.moddedBoards = [];
    },
  },
});
