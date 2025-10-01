import { defineStore } from "pinia";

interface SiteStore {
  name: string;
  description: string;
  icon: string;
  defaultAvatar: string | null;
  primaryColor: string;
  secondaryColor: string;
  hoverColor: string;
  siteMode: 'open' | 'private'; // TODO: make this the same as on the BE
  enableDownvotes: boolean;
  enableNSFW: boolean;
  applicationQuestion: string | null;
  isPrivate: boolean;
  requireEmailVerification: boolean;
  enableBoards: boolean;
  boardCreationAdminOnly: boolean;
  inviteOnly: boolean;
  requireApplication: boolean;
}

export const useSiteStore = defineStore("site", {
  // State
  state: (): SiteStore => {
    return {
      name: "tinyboards",
      description: "",
      icon: "",
      defaultAvatar: null,
      primaryColor: "60, 105, 145",
      secondaryColor: "96, 128, 63",
      hoverColor: "54, 94, 129",
      siteMode: "open",
      registrationMode: "Open",
      enableDownvotes: true,
      enableNSFW: true,
      applicationQuestion: null,
      isPrivate: false,
      requireEmailVerification: false,
      enableBoards: false,
      boardCreationAdminOnly: true,
      inviteOnly: false,
      requireApplication: false
    };
  },
  /*actions: {
    init: $patch,
    },*/
});
