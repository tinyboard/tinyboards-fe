<template>
  <main id="page-feed" class="flex flex-col pt-12 sm:pt-14">
    <!-- Sub Navigation & Banner -->
    <section class="flex-col" :class="route.params.board ? 'flex' : 'hidden md:flex'">
      <NavigationNavbarSub :links="links" class="sm:order-first" />
      <div class="order-first sm:order-last container mx-auto max-w-8xl grid grid-cols-12 sm:mt-16 sm:px-4 md:px-6">
        <!-- Banner -->
        <LazyCardsBoardBanner v-if="route.params.board" :board-view="boardView" class="col-span-full" />
        <LazyCardsBanner v-else title="Feed" sub-title="Welcome to the awesome and exciting front page." image-url="/img/artwork/front-page.jpeg" class="col-span-full" />
      </div>
    </section>
    <!-- Main Content -->
    <section class="container mx-auto max-w-8xl grid grid-cols-12 sm:my-6 sm:px-4 md:px-6">
      <div class="col-span-full flex gap-6">
        <div class="w-full">
          <!-- Submission Form -->
          <!-- Welcome Message -->
          <div v-if="welcome" class="bg-white flex justify-center p-8 border rounded-md border-gray-300">
            <div class="text-center flex flex-col items-center">
              <img :src="board.icon" class="bg-white p-[2px] border border-gray-300 w-32 h-32" />
              <h1 class="text-3xl text-gray-700 font-bold mt-4">Welcome to +{{ board.name }}</h1>
              <p class="text-md text-gray-500">Right now it's empty here. Let's get started with making the first post!</p>
              <!-- Create Post -->
              <NuxtLink v-if="!submitPage" :to="`/+${board.name}/submit`" class="flex items-center button primary mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
                  <line x1="13.5" y1="6.5" x2="17.5" y2="10.5"></line>
                </svg>
                Create post
              </NuxtLink>
              <!-- Dismiss welcome -->
              <button class="border-none text-center text-sm text-gray-500 font-semibold mt-4 hover:underline" @click="welcome = false">Dismiss</button>
            </div>
          </div>
          <div v-else>
            <!-- Sorts & View Options -->
            <div class="flex items-center mb-4 p-2.5 sm:px-4 sm:py-3 bg-gray-100 dark:bg-gray-950 border-b sm:border sm:shadow-inner-white sm:rounded-md dark:border-gray-800 dark:shadow-none">
              <MenusSort />
              <div class="ml-auto flex space-x-2">
                <button class="ml-auto" @click="preferCardView = true">
                  <!-- Rows Icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" :class="preferCardView ? 'text-primary' : 'text-gray-500'" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <rect x="4" y="4" width="16" height="6" rx="2"></rect>
                    <rect x="4" y="14" width="16" height="6" rx="2"></rect>
                  </svg>
                </button>
                <button class="ml-auto" @click="preferCardView = false">
                  <!-- Cards Icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" :class="preferCardView ? 'text-gray-500' : 'text-primary'" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <rect x="4" y="4" width="16" height="16" rx="2"></rect>
                    <line x1="4" y1="12" x2="20" y2="12"></line>
                  </svg>
                </button>
              </div>
            </div>
            <!-- Posts -->
            <LazyListsPosts v-if="posts?.length" :posts="posts" :isCompact="!preferCardView" :isLoading="pending" :hasError="error" />
            <!-- Empty State -->
            <div v-else class="px-4 py-24 text-center text-gray-500 bg-white dark:bg-gray-950 border-y sm:border sm:rounded-md sm:shadow-inner-xs dark:border-gray-800">
              <p>
                <span class="font-medium"> There are no posts </span>
                <br />
                but you can be the first...
              </p>
            </div>
            <!-- Pagination -->
            <div v-if="totalPages > 1" class="w-full mt-4 px-2.5 sm:px-0">
              <LazyNavigationPaginate :total-pages="totalPages" :per-page="limit" :current-page="page" />
            </div>
          </div>
        </div>
        <!-- Sidebar -->
        <component :is="route.params.board ? SidebarBoard : Sidebar" :board="route.params.board ? board : null" />
      </div>
    </section>
  </main>
</template>
<script setup>
import { usePostsStore } from "@/stores/StorePosts";
import { getListing } from "@/composables/listing";
// import { getBoard } from "@/composables/board";
import { useBoardStore } from "@/stores/StoreBoard";
import { useLoggedInUser } from "@/stores/StoreAuth";

// Import sidebar components
const Sidebar = defineAsyncComponent(() =>
  import("@/components/containers/Sidebar")
);
const SidebarBoard = defineAsyncComponent(() =>
  import("@/components/containers/SidebarBoard")
);

const router = useRouter();
const route = useRoute();
const userStore = useLoggedInUser();
const boardStore = useBoardStore();
const v = userStore.user;
const boardView = boardStore.boardView;
const board = boardView.board;
const boardCounts = boardView.counts;
const moderators = boardStore.mods;

console.log("stores have been set up");

definePageMeta({
  alias: ["/+:board", "/+:board?/:sort?"],
  key: (route) => route.fullPath,
});

const preferCardView = useCookie("preferCardView") ?? false;

// Pagination
const page = computed(() => Number.parseInt(route.query.page) || 1);
const limit = computed(() => Number.parseInt(route.query.limit) || 25);

// Welcome message
const welcome = ref(route.query.hasOwnProperty("welcome"));


/*const {
    board_view,
    site,
    moderators,
    discussion_languages,
    _pending,
    _error,
    _refresh,
} = await getBoard({
    name: route.params.board,
   });*/

/*const board = {
  name: board_view.board.name,
  title: board_view.board.title,
  description: board_view.board.description,
  followers_count: board_view.counts.subscribers,
  posts_count: board_view.counts.posts,
  comments_count: board_view.counts.comments,
  created_at: board_view.board.creation_date,
  icon_url: board_view.board.icon,
  banner_url: board_view.board.banner,
};*/

// Posts
const postsStore = usePostsStore();
console.log("using posts store");

const sorts = [
  "hot",
  "new",
  "topall",
  "topmonth",
  "topweek",
  "topday",
  "mostcomments",
  "newcomments",
];
const sort = computed(() => {
  return sorts.includes(route.params.sort) ? route.params.sort : "hot";
});

const { items, totalCount, paginate, pending, error, refresh } =
await getListing({
    board_name: route.params.board,
    sort: sort.value,
    limit: limit.value,
    page: page.value,
  },
  "posts"
);

if (error.value && error.value.response) {
  throw createError({
    statusCode: 404,
    statusMessage: "We could not find the page you were looking for. Try better next time.",
    fatal: true,
  });
}

postsStore.posts = items;
const posts = postsStore.posts;

const totalPages = computed(() => {
  return Math.ceil(totalCount.value / limit.value || 1);
});

// Links for sub navbar
const links = [
  { name: "New Thread", href: "/submit" },
  { name: "House Rules", href: "/help/rules", target: "_blank" },
];
</script>