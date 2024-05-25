import { defineStore } from "pinia";
import { useSiteStore } from "./StoreSite";

const site = useSiteStore();

// Convert colors from rgb to hex
const toHexCode = (rgb) => {
  const values = rgb
    .replace(" ", "")
    .split(",")
    .map((x) => Number(x));

  // add a 0 if the value in hex is only one digit
  return (
    "#" +
    values
      .map((x) => (x >= 15 ? x.toString(16) : `0${x.toString(16)}`))
      .join("")
  );
};

export const useWizardStore = defineStore("wizard", {
  state: () => {
    return {
      name: null,
      displayName: "",
      description: "",
      primaryColor: toHexCode(site.primaryColor),
      secondaryColor: toHexCode(site.secondaryColor),
      hoverColor: toHexCode(site.hoverColor),
      privacy: 0,
      boarding: {
        canProceed: false,
      },
    };
  },
});
