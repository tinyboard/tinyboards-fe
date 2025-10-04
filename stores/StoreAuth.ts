import { defineStore } from "pinia";
// import { baseURL } from "@/server/constants";
import { useAPI } from "@/composables/api";
import { useDirectGraphQLRequest } from "@/composables/useGraphQL";
//import { LOGIN_QUERY } from "@/graphql/mutations/Auth";
//import { ME_QUERY } from "@/graphql/queries/Me";
import Cookies from 'js-cookie';
import type { BoardFragment, User } from "@/types/types";

// Cookie configuration for secure token storage
const TOKEN_COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  expires: 7, // 7 days
  httpOnly: false // Must be false for client-side access
};

interface UserStore {
  user: User | null,
  unread: number | null,
  token: string | null,
  adminLevel: number | null,
  joinedBoards: BoardFragment[] | null,
  moddedBoards: BoardFragment[] | null,
  isAuthed: boolean
}

export const useLoggedInUser = defineStore("auth", {
  state: (): UserStore => {
    // Check for token cookie to initialize auth state
    const tokenCookie = process.client ? Cookies.get('token') : null;
    const hasToken = !!tokenCookie;

    return {
      user: null,
      //counts: null,
      unread: null,
      token: tokenCookie || null,
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
      // Initialize as authed if token exists (will be validated by plugin)
      isAuthed: hasToken,
    };
  },
  actions: {
    login({ nameOrEmail, password }: {
      nameOrEmail: string;
      password: string;
    }) {
      const { $client } = useNuxtApp();
      return new Promise((resolve, reject) => {
        // Obtain auth token using direct GraphQL request to ensure correct endpoint
        useDirectGraphQLRequest(`
          mutation Login($usernameOrEmail: String!, $password: String!) {
            login(usernameOrEmail: $usernameOrEmail, password: $password) {
              token
            }
          }
        `, { usernameOrEmail: nameOrEmail, password })
          .then((response) => {
            const data = response.data.value;
            if (!data.login.token) {
              throw new Error('No token received from login');
            }
            Cookies.set('token', data.login.token, TOKEN_COOKIE_OPTIONS);
            this.token = data.login.token;

            // Login successful - fetch user
            const me = useDirectGraphQLRequest(`
              query GetLoggedInUser {
                me {
                  id
                  name
                  displayName
                  avatar
                  moderates {
                    board {
                      id
                      name
                    }
                  }
                  isAdmin
                }
              }
            `)
              .then((resp) => {
                const data = resp.data.value;

                const moderates: BoardFragment[] = data?.me?.moderates?.map((m) => m.board) ?? [];
                const joined: BoardFragment[] = data?.me?.joinedBoards ?? [];

                const user = data?.me;
                //delete user.moderates;
                //delete user.joined;

                this.user = user;
                this.joinedBoards = joined;
                this.moddedBoards = moderates;
                this.adminLevel = this.user?.adminLevel ?? null;
                this.isAuthed = true;
                this.unread = (data?.unreadMentionsCount ?? 0) + (data?.unreadRepliesCount ?? 0);

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
        useDirectGraphQLRequest(`
          mutation Register($username: String!, $email: String!, $password: String!, $inviteCode: String, $applicationAnswer: String) {
            register(username: $username, email: $email, password: $password, inviteCode: $inviteCode, applicationAnswer: $applicationAnswer) {
              token
              accountCreated
              applicationSubmitted
            }
          }
        `, { username, email, password, inviteCode, applicationAnswer: answer })
          .then((response) => {
            const resp = response.data.value;
            const { token, accountCreated, applicationSubmitted } = resp.register;

            if (accountCreated) {
              // Account created = no approval required => fetch the user we just created
              if (!token) {
                throw new Error('No token received from registration');
              }
              Cookies.set('token', token, TOKEN_COOKIE_OPTIONS);
              this.token = token;

              // Login successful - fetch user
              const me = useDirectGraphQLRequest(`
              query GetLoggedInUser {
                me {
                  id
                  name
                  displayName
                  avatar
                  moderates {
                    board {
                      id
                      name
                    }
                  }
                  isAdmin
                }
              }
            `)
                .then((resp) => {
                  if (process.dev) console.log("user fetched!");
                  const data = resp.data.value;

                  const moderates = data?.me?.moderates?.map((m) => m.board) ?? [];
                  const joined = data?.me?.joinedBoards ?? [];

                  const user = data?.me;

                  this.user = user;
                  this.joinedBoards = joined;
                  this.moddedBoards = moderates;
                  this.adminLevel = this.user?.adminLevel ?? null;
                  this.isAuthed = true;
                  this.unread = (data?.unreadMentionsCount ?? 0) + (data?.unreadRepliesCount ?? 0);

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
      if (this.joinedBoards) {
        this.joinedBoards.push(board);
      }
    },
    removeJoinedBoard(id: number) {
      this.joinedBoards = (this.joinedBoards ?? []).filter((board) => board.id !== id);
    },
    addModdedBoard(board: BoardFragment) {
      if (this.moddedBoards) {
        this.moddedBoards.push(board);
      }
    },
    removeModdedBoard(id: number) {
      this.moddedBoards = (this.moddedBoards ?? []).filter((board) => board.id !== id);
    },
    logout() {
      this.user = null;
      this.token = null;
      this.isAuthed = false;
      this.adminLevel = null;
      this.joinedBoards = [];
      this.moddedBoards = [];
      // Ensure cookie is properly removed (only on client)
      if (process.client) {
        Cookies.remove('token', { path: '/', domain: window.location.hostname });
      } else {
        // Server-side fallback
        Cookies.remove('token', { path: '/' });
      }
    },
  },
});
