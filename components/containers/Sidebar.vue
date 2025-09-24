<template>
  <div
    id="sidebar"
    class="w-[290px] hidden xl:flex flex-col flex-shrink-0 space-y-6 text-base"
  >
    <div class="flex flex-col space-y-2" v-if="isAuthed">
      <NuxtLink :to="`/submit`" class="flex items-center button primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
           <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
           <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
           <line x1="13.5" y1="6.5" x2="17.5" y2="10.5"></line>
        </svg>
        Create post
      </NuxtLink>

      <NuxtLink v-if="site.enableBoards && canCreateBoard" :to="`/boards/wizard`" class="flex items-center button gray">
        <svg  xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
        Create board
      </NuxtLink>
    </div>
    <div
      class="p-2.5 bg-white dark:bg-gray-900 border dark:border-gray-800 shadow-polaroid"
    >
      <img
        loading="lazy"
        class="w-full h-64 aspect-auto object-cover img-expand"
        :src="selectedImage"
      />
      <small class="mt-4 block leading-none text-gray-400">
        Art submission by community members
      </small>
    </div>
    <div class="prose prose-sm dark:prose-invert">
      <h2
        class="font-bold leading-5 text-base mb-3 pb-1 border-b dark:border-gray-800"
      >
        About <span class="text-gray-500">{{ site.name }}</span>
      </h2>
      <div>
        <p>
          {{ site.description }}
        </p>
      </div>
    </div>
    <div v-if="users">
      <div class="flex items-end mb-3 pb-1 border-b">
        <h2 class="font-bold leading-5 text-base">Newest Members</h2>
        <NuxtLink
          to="/members"
          class="ml-auto text-sm font-normal hover:underline"
        >
          View all &#8594;
        </NuxtLink>
      </div>
      <ul class="flex flex-col space-y-2 divide-y divide-gray-200/50">
        <li
          v-for="person in users.members"
          :key="person.id"
          class="pt-2 first:pt-0"
        >
          <NuxtLink :to="`/@${person.person.name}`" class="flex space-x-2">
            <img
              loading="lazy"
              class="p-0.5 w-9 h-9 object-cover bg-white border hover:bg-gray-200"
              :src="person.person.avatar ?? 'https://placekitten.com/36/36'"
            />
            <div class="flex flex-col justify-center leading-normal">
              <div class="flex">
                <strong class="text-sm">{{ person.person.name }}</strong>
                <!-- Role -->
                <span v-if="person.person.is_admin" class="ml-1 badge badge-red"
                  >Admin</span
                >
              </div>
              <small class="text-gray-400 block">
                Since
                <span class="font-medium">
                  {{
                    format(parseISO(person.person.creation_date), "MMM dd, yyyy")
                  }}
                </span>
              </small>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// import { baseURL } from "@/server/constants";
import { format, parseISO } from "date-fns";
import { shuffle } from "@/utils/shuffleArray";
import { useAPI } from "@/composables/api";
import { useSiteStore } from "@/stores/StoreSite";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { requirePermission } from "@/composables/admin";
import { useGraphQLQuery } from "@/composables/useGraphQL";

const site = useSiteStore();
const userStore = useLoggedInUser();
const isAuthed = userStore.isAuthed;

const canCreateBoard = (!site.boardCreationAdminOnly && isAuthed) || (site.boardCreationAdminOnly && requirePermission("boards"));

// Define spotlight users
// Use GraphQL query instead of REST API
const query_str = `
  query ListMembers($page: Int!, $limit: Int!, $sort: String!, $listingType: String!) {
    listMembers(page: $page, limit: $limit, sort: $sort, listingType: $listingType) {
      members {
        id
        name
        displayName
        avatar
        bio
        creationDate
        reputation
      }
    }
  }
`;

const { data: usersData, error } = await useGraphQLQuery(query_str, {
  variables: {
    page: 1,
    limit: 8,
    sort: 'new',
    listingType: 'all'
  }
});

const pending = ref(false);
const refresh = () => Promise.resolve();

// Transform GraphQL response to match expected format
const users = computed(() => {
  if (!usersData.value?.listMembers?.members) return { members: [] };

  return {
    members: usersData.value.listMembers.members.map(user => ({
      person: {
        name: user.name,
        displayName: user.displayName,
        avatar: user.avatar,
        banner: user.banner || user.profileBackground,
        bio: user.bio,
        creation_date: user.creationDate,
        is_admin: user.adminLevel > 0
      }
    }))
  };
});

// TO-DO
// Refactor with proper `/img/sidebar-art` folder
// https://nuxtjs.org/docs/directory-structure/assets/#images
const images = ["/img/artwork/sidebar.jpeg"];

const selectedImage = shuffle(images)[0] ?? `/img/artwork/sidebar.jpeg`;
</script>
