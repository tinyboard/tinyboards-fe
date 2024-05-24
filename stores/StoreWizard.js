import { defineStore } from "pinia";

export const useWizardStore = defineStore("wizard", {
  state: () => {
    return {
      name: null,
      displayName: "",
      desc: "",
      primaryColor: "",
      secondaryColor: "",
      hoverColor: "",
      privacy: 0,
      boarding: {
        canProceed: false,
      },
    };
  },
});
