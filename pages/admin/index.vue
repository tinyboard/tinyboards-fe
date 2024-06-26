<template>
  <NuxtLayout name="admin">
    <div class="flex flex-col overflow-hidden">
      <!-- Page Heading & Description -->
      <div class="p-4">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Overview</h3>
        <p class="mt-1 text-sm text-gray-600">
          The most important stats live here.
        </p>
      </div>
      <!-- Stats Grid -->
      <div class="flex flex-col bg-white p-4 shadow-inner-xs sm:border sm:rounded-md">
        <!-- Primary Stats -->
        <div class="relative grid grid-cols-4 gap-4">
          <div class="col-span-2 lg:col-span-1 text-center">
            <div class="p-4 sm:p-6 border bg-gray-100 rounded-md shadow-inner-white">
              <strong class="text-3xl md:text-4xl text-gray-700">328</strong>
              <p class="mt-2 text-gray-500 text-sm font-medium uppercase">
                Members
              </p>
            </div>
          </div>
          <div class="col-span-2 lg:col-span-1 text-center">
            <div class="p-4 sm:p-6 border bg-gray-100 rounded-md shadow-inner-white">
              <strong class="text-3xl md:text-4xl text-gray-700">957</strong>
              <p class="mt-2 text-gray-500 text-sm font-medium uppercase">
                Posts
              </p>
            </div>
          </div>
          <div class="col-span-2 lg:col-span-1 text-center">
            <div class="p-4 sm:p-6 border bg-gray-100 rounded-md shadow-inner-white">
              <strong class="text-3xl md:text-4xl text-gray-700">4,830</strong>
              <p class="mt-2 text-gray-500 text-sm font-medium uppercase">
                Comments
              </p>
            </div>
          </div>
          <div class="col-span-2 lg:col-span-1 text-center">
            <div class="p-4 sm:p-6 border bg-gray-100 rounded-md shadow-inner-white">
              <strong class="text-3xl md:text-4xl text-gray-700">57,023</strong>
              <p class="mt-2 text-gray-500 text-sm font-medium uppercase">
                Votes
              </p>
            </div>
          </div>
        </div>
        <!-- Divider -->
        <hr class="mt-6 mb-4" />
        <!-- Secondary Stats -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Top 5 Members -->
          <div class="col-span-full md:col-span-1">
            <h3 class="mb-2 text-gray-500 text-sm font-medium uppercase">
              Top Scoring Members
            </h3>
            <ul class="flex flex-col border rounded-md overflow-hidden shadow-inner-white">
              <li v-for="(member, i) in members.members.slice(0, 5)" :key="member.person.id"
                class="bg-white odd:bg-gray-50 border-b last:border-0">
                <div class="flex items-center px-3 py-1">
                  <p class="font-bold text-lg text-gray-300 text-right">
                    #{{ i + 1 }}
                  </p>
                  <NuxtLink :to="`/@${member.person.name}`" class="ml-3 w-3/4 flex flex-shrink-0 items-center">
                    <img class="p-0.5 w-7 h-7 object-cover" :src="member.person.avatar" />
                    <strong class="ml-2 text-gray-900 text-sm truncate">{{
                      member.person.name
                    }}</strong>
                    <!-- Role -->
                    <span v-if="member.person.is_admin" class="ml-1 badge badge-red">Admin</span>
                  </NuxtLink>
                  <div class="ml-auto flex items-center">
                    <p class="font-bold text-lg text-secondary text-right">
                      {{
                        member.counts.post_score + member.counts.comment_score
                      }}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- Most Active -->
          <div class="col-span-full md:col-span-1">
            <h3 class="mb-2 text-gray-500 text-sm font-medium uppercase">
              Top Posting Members
            </h3>
            <ul class="flex flex-col border rounded-md overflow-hidden shadow-inner-white">
              <li v-for="(member, i) in membersPosts.members.slice(0, 5)" :key="member.person.id"
                class="bg-white odd:bg-gray-50 border-b last:border-0">
                <div class="flex items-center px-3 py-1">
                  <p class="font-bold text-lg text-gray-300 text-right">
                    #{{ i + 1 }}
                  </p>
                  <NuxtLink :to="`/@${member.person.name}`" class="ml-3 w-3/4 flex flex-shrink-0 items-center">
                    <img class="p-0.5 w-7 h-7 object-cover" :src="member.person.avatar" />
                    <strong class="ml-2 text-gray-900 text-sm truncate">{{
                      member.person.name
                    }}</strong>
                    <!-- Role -->
                    <span v-if="member.person.is_admin" class="ml-1 badge badge-red">Admin</span>
                  </NuxtLink>
                  <div class="ml-auto flex items-center">
                    <p class="font-bold text-lg text-secondary text-right">
                      {{ member.counts.post_count }}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <!-- Divider -->
        <hr class="mt-6 mb-4" />
        <!-- Tertiary Stats -->
        <div class="grid-cols-2">
          <!-- Newest Members -->
          <div class="col-span-full md:col-span-1">
            <h3 class="mb-2 text-gray-500 text-sm font-medium uppercase">
              Newest Members
            </h3>
            <ul class="flex flex-col border rounded-md overflow-hidden shadow-inner-white">
              <li v-for="(member, i) in members.members.slice(0, 5)" :key="member.person.id"
                class="bg-white odd:bg-gray-50 border-b last:border-0">
                <div class="flex items-center px-3 py-1">
                  <p class="font-bold text-lg text-gray-300 text-right">
                    #{{ i + 1 }}
                  </p>
                  <NuxtLink :to="`/@${member.person.name}`" class="ml-3 w-2/4 flex flex-shrink-0 items-center">
                    <img class="p-0.5 w-7 h-7 object-cover" :src="member.person.avatar" />
                    <strong class="ml-2 text-gray-900 text-sm truncate">{{
                      member.person.name
                    }}</strong>
                    <!-- Role -->
                    <span v-if="member.person.is_admin" class="ml-1 badge badge-red">
                      Admin
                    </span>
                  </NuxtLink>
                  <div class="ml-auto flex flex-shrink-0 items-center">
                    <p class="text-gray-400 text-sm font-medium uppercase">
                      {{
                        format(
                          parseISO(member.person.creation_date),
                          "MMM dd, yyyy"
                        )
                      }}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref } from "vue";
// import { baseURL } from "@/server/constants";
import { useApi } from "@/composables/api";
import { format, parseISO } from "date-fns";

definePageMeta({
  //middleware: ["admin"],
  hasAuthRequired: true,
  isAdminRequired: true,
  isFooterDisabled: true,
  isScrollDisabled: true,
  alias: "/admin/overview",
  title: "Overview",
    'isLeftNavbarDisabled': true
});

// Settings
// Fetch members by sort
const {
  data: members,
  pending,
  error,
  refresh,
} = await useApi("/members", {
  query: { sort: "mostrep" },
  limit: 5,
});

const {
  data: membersNew,
  membersNewPending,
  membersNewError,
  membersNewRefresh,
} = await useApi("/members", {
  query: { sort: "new" },
  limit: 5,
});

const {
  data: membersPosts,
  membersPostsPending,
  membersPostsError,
  membersPostsRefresh,
} = await useApi("/members", {
  query: { sort: "mostposts" },
  limit: 5,
});
</script>
