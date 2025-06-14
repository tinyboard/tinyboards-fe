import { defineStore } from "pinia";
// import { baseURL } from "@/server/constants";
import { useAPI } from "@/composables/api";
//import { LOGIN_QUERY } from "@/graphql/mutations/Auth";
//import { ME_QUERY } from "@/graphql/queries/Me";
import Cookies from 'js-cookie';
import type { BoardFragment, Person } from "@/types/types";

interface UserStore {
  user: Person | null,
  unread: number | null,
  token: string | null,
  adminLevel: number | null,
  joinedBoards: BoardFragment[] | null,
  moddedBoards: BoardFragment[] | null,
  isAuthed: boolean
}

export const useLoggedInUser = defineStore("auth", {
  state: (): UserStore => {
    return {
      user: null,
      //counts: null,
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
    login({ nameOrEmail, password }: {
      nameOrEmail: string;
      password: string;
    }) {
      const { $client } = useNuxtApp();
      return new Promise((resolve, reject) => {
        // Obtain auth token
        GqlSubmitLogin({ usernameOrEmail: nameOrEmail, password })
          .then((data) => {
            Cookies.set('token', data.login.token);
            this.token = data.login.token;

            // Login successful - fetch user
            const me = useAsyncGql({ operation: 'getLoggedInUser' })
              .then((resp) => {
                const data = resp.data.value;

                const moderates: BoardFragment[] = data.me.moderates.map((m) => m.board);
                const joined: BoardFragment[] = data.me.joinedBoards;

                const user = data.me;
                //delete user.moderates;
                //delete user.joined;

                this.user = user;
                this.joinedBoards = joined;
                this.moddedBoards = moderates;
                this.adminLevel = this.user!.adminLevel;
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
    signup({
      username,
      email,
      password,
      inviteCode,
      answer
    }: {
      username: string,
      email: string | null,
      password: string,
      inviteCode?: string,
      answer?: string
    }): Promise<{
      accountCreated: boolean;
      applicationSubmitted: boolean;
    }> {
      return new Promise((resolve, reject) => {
        GqlRegister({ username, email, password, inviteCode, applicationAnswer: answer })
          .then((resp) => {
            const { token, accountCreated, applicationSubmitted } = resp.register;

            if (accountCreated) {
              // Account created = no approval required => fetch the user we just created
              Cookies.set('token', token);
              this.token = token!; // token exists because accountCreated is true => safe !

              // Login successful - fetch user
              const me = useAsyncGql({ operation: 'getLoggedInUser' })
                .then((resp) => {
                  console.log("user fetched!");
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

                  resolve({
                    accountCreated,
                    applicationSubmitted
                  });
                })
                .catch((err) => {
                  // Fetching user failed - remove token and reject promise
                  this.logout();
                  Cookies.remove('token');

                  reject(err);
                });
            } else {
              // Application submitted, admin approval required => resolve with success, display message on signup page
              resolve({
                accountCreated,
                applicationSubmitted
              });
            }
          })
          .catch(reject)
      });
    },
    addJoinedBoard(board: BoardFragment) {
      this.joinedBoards!.push(board);
    },
    removeJoinedBoard(id: number) {
      this.joinedBoards = this.joinedBoards!.filter((board) => board.id !== id);
    },
    addModdedBoard(board: BoardFragment) {
      this.moddedBoards!.push(board);
    },
    removeModdedBoard(id: number) {
      this.moddedBoards = this.moddedBoards!.filter((boardView) => boardView.board.id !== id);
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
