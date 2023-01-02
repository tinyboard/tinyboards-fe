<template>
  <main class="flex flex-col pt-12 sm:pt-14">
    <!-- Sub Navigation & Banner -->
    <section class="flex flex-col">
      <NavigationNavbarSub :links="links" class="sm:order-first" />
      <div
        class="order-first sm:order-last container mx-auto max-w-8xl grid grid-cols-12 sm:mt-16 sm:px-4 md:px-6"
      >
        <!-- Banner -->
        <CardsBanner
          title="Members"
          :sub-title="`Showing ${members.members.length} members`"
          image-url="https://i.imgur.com/TV07zoE.jpeg"
          class="col-span-full"
        />
      </div>
    </section>
    <!-- Main Content -->
    <section
      class="container mx-auto max-w-8xl grid grid-cols-12 my-4 sm:my-6 sm:px-4 md:px-6"
    >
      <div class="col-span-full">
        <ul
          v-if="members.members.length"
          class="w-full grid grid-cols-4 gap-2 sm:gap-4 overflow-hidden"
        >
          <li
            v-for="(member, i) in members.members"
            :key="i"
            class="w-full col-span-full md:col-span-2 lg:col-span-1"
          >
            <NuxtLink
              :to="`/user/${member.user.name}`"
              class="relative flex flex-col p-2.5 sm:rounded-md bg-white hover:bg-gray-50 border-y sm:border shadow-inner-white"
            >
              <span
                class="absolute top-1 right-3 font-bold text-lg text-gray-300"
              >
                #{{ i + 1 }}
              </span>
              <div class="flex items-center space-x-2">
                <img
                  class="p-0.5 w-9 h-9 object-cover bg-white border hover:bg-gray-200"
                  :src="member.user.avatar"
                />
                <div class="flex flex-col justify-center">
                  <div class="flex">
                    <strong class="text-gray-900 text-sm">{{
                      member.user.name
                    }}</strong>
                    <!-- Role -->
                    <span v-if="member.user.is_admin" class="ml-1 badge badge-blue"
                      >Admin</span
                    >
                  </div>
                  <!-- New or Old -->
                  <small
                    v-if="sort === 'new' || sort === 'old'"
                    class="text-gray-400 block"
                  >
                    Since
                    <span class="font-medium">{{
                      format(
                        parseISO(member.user.creation_date),
                        "MMM dd, yyyy"
                      )
                    }}</span>
                  </small>
                  <!-- Post Count -->
                  <small
                    v-else-if="sort === 'mostcomments'"
                    class="text-gray-400 block"
                  >
                    <span class="font-medium">
                      {{ member.counts.post_count }}
                    </span>
                    {{ member.counts.post_count === 1 ? "post" : "posts" }}
                  </small>
                  <!-- Commnent Count -->
                  <small
                    v-else-if="sort === 'mostcomments'"
                    class="text-gray-400 block"
                  >
                    <span class="font-medium">
                      {{ member.counts.comment_count }}
                    </span>
                    {{
                      member.counts.comment_count === 1 ? "comment" : "comments"
                    }}
                  </small>
                  <!-- Reputation -->
                  <small v-else class="text-gray-400 block">
                    <span class="font-medium">
                      {{ member.counts.rep }}
                    </span>
                    reputation
                  </small>
                </div>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </div>
      <div v-if="totalPages > 1" class="col-span-full mt-4 px-2.5 sm:px-0">
        <NavigationPaginate
          :total-pages="totalPages"
          :per-page="limit"
          :current-page="page"
        />
      </div>
    </section>
  </main>
</template>

<script setup>
useHead({
  title: "Tinyboards | Members",
  meta: [
    {
      property: "og:title",
      content: "Tinyboards | Members",
    },
  ],
});

import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { baseURL } from "@/server/constants";
import { format, parseISO } from "date-fns";

const router = useRouter();
const route = useRoute();

// Pagination
const page = computed(() => Number.parseInt(route.query.page) || 1);
const limit = computed(() => Number.parseInt(route.query.limit) || 24);

// Members
const sorts = ["new", "old", "mostcomments", "mostposts", "mostrep"];

const sort = computed(() => {
  return sorts.includes(route.params.sort) ? route.params.sort : "new";
});

const {
  data: members,
  pending,
  error,
  refresh,
} = await useFetch("/members", {
  query: {
    sort: sort.value,
    limit: limit.value,
    page: page.value,
  },
  baseURL
});

if (error.value && error.value.response) {
  throw createError({
    statusCode: 404,
    statusMessage:
      "We could not find the page you were looking for. Try better next time.",
    fatal: true,
  });
}

const totalPages = computed(() => {
  return Math.ceil(members.value.total_count / limit.value || 1);
});

// Links for sub navigation bar.
const links = [
  { name: "Newest", href: `/members` },
  { name: "Oldest", href: `/members/old` },
  { name: "Most Posts", href: `/members/mostposts` },
  { name: "Most Comments", href: `/members/mostcomments` },
  { name: "Most Reputation", href: `/members/mostrep` },
];
</script>
