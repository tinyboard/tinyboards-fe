import { useSiteStore } from "@/stores/StoreSite";
import { useApi } from "@/composables/api";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp();
  const siteStore = useSiteStore();

  if (process.server) {
    await useApi("/admin/site_settings")
      .then(({ data, error }) => {
        if (data.value) {
          siteStore.siteMode = data.value.site_mode;
          siteStore.name = data.value.name;
          siteStore.color = data.value.color;
          siteStore.enableDownvotes = data.value.enable_downvotes;
          siteStore.enableNSFW = data.value.enable_nsfw;
          siteStore.applicationQuestion = data.value.application_question;
          siteStore.isPrivate = data.value.private_instance;
          siteStore.requireEmailVerification = data.value.require_email_verification;
        } else {
          console.log(error.value);
        }
    });
  }
});
