import type { RouterConfig } from "@nuxt/schema";

// WATCH THIS PR - https://github.com/nuxt/framework/pull/3851

// https://github.com/nuxt/framework/discussions/3338
// https://router.vuejs.org/api/#routeroptions
export default <RouterConfig>{
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return {
        el: to.hash,
      };
    }
    return { top: 0 };
  }
};