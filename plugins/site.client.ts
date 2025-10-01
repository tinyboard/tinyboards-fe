import { useSiteStore } from '@/stores/StoreSite';
import { useDirectGraphQLRequest } from '@/composables/useGraphQL';

export default defineNuxtPlugin(async () => {
  const siteStore = useSiteStore();

  // Fetch site configuration on app init
  if (process.client) {
    try {
      const { data, error } = await useDirectGraphQLRequest(`
        query GetSiteConfig {
          site {
            name
            description
            icon
            defaultAvatar
            primaryColor
            secondaryColor
            hoverColor
            enableDownvotes
            enableNSFW
            applicationQuestion
            privateInstance
            requireEmailVerification
            boardsEnabled
            boardCreationAdminOnly
            inviteOnly
            requireApplication
          }
        }
      `);

      if (data.value?.site && !error.value) {
        const site = data.value.site;

        // Update site store with fetched data
        siteStore.$patch({
          name: site.name || 'tinyboards',
          description: site.description || '',
          icon: site.icon || '',
          defaultAvatar: site.defaultAvatar || null,
          primaryColor: site.primaryColor || '60, 105, 145',
          secondaryColor: site.secondaryColor || '96, 128, 63',
          hoverColor: site.hoverColor || '54, 94, 129',
          enableDownvotes: site.enableDownvotes ?? true,
          enableNSFW: site.enableNSFW ?? true,
          applicationQuestion: site.applicationQuestion || null,
          isPrivate: site.privateInstance ?? false,
          requireEmailVerification: site.requireEmailVerification ?? false,
          enableBoards: site.boardsEnabled ?? false,
          boardCreationAdminOnly: site.boardCreationAdminOnly ?? true,
          inviteOnly: site.inviteOnly ?? false,
          requireApplication: site.requireApplication ?? false,
        });
      }
    } catch (error) {
      console.error('Site initialization error:', error);
    }
  }
});
