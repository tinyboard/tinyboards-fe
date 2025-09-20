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
        <!-- Moderation Stats -->
        <div v-if="moderationStats?.getModerationStats" class="mb-6">
          <h3 class="mb-2 text-gray-500 text-sm font-medium uppercase">
            Moderation Statistics
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="p-3 border bg-red-50 rounded-md shadow-inner-white">
                <strong class="text-2xl text-red-600">{{ moderationStats.getModerationStats.pendingReports }}</strong>
                <p class="mt-1 text-red-500 text-xs font-medium uppercase">Pending Reports</p>
              </div>
            </div>
            <div class="text-center">
              <div class="p-3 border bg-yellow-50 rounded-md shadow-inner-white">
                <strong class="text-2xl text-yellow-600">{{ moderationStats.getModerationStats.bannedUsers }}</strong>
                <p class="mt-1 text-yellow-500 text-xs font-medium uppercase">Banned Users</p>
              </div>
            </div>
            <div class="text-center">
              <div class="p-3 border bg-blue-50 rounded-md shadow-inner-white">
                <strong class="text-2xl text-blue-600">{{ moderationStats.getModerationStats.removedPosts }}</strong>
                <p class="mt-1 text-blue-500 text-xs font-medium uppercase">Removed Posts</p>
              </div>
            </div>
            <div class="text-center">
              <div class="p-3 border bg-green-50 rounded-md shadow-inner-white">
                <strong class="text-2xl text-green-600">{{ moderationStats.getModerationStats.totalModerationActions }}</strong>
                <p class="mt-1 text-green-500 text-xs font-medium uppercase">Total Actions</p>
              </div>
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
              <li v-for="(member, i) in members?.listMembers?.members?.slice(0, 5)" :key="member.id"
                class="bg-white odd:bg-gray-50 border-b last:border-0">
                <div class="flex items-center px-3 py-1">
                  <p class="font-bold text-lg text-gray-300 text-right">
                    #{{ i + 1 }}
                  </p>
                  <NuxtLink :to="`/@${member.name}`" class="ml-3 w-3/4 flex flex-shrink-0 items-center">
                    <img class="p-0.5 w-7 h-7 object-cover" :src="member.avatar" />
                    <strong class="ml-2 text-gray-900 text-sm truncate">{{
                      member.name
                    }}</strong>
                    <!-- Role -->
                    <span v-if="member.admin_level > 0" class="ml-1 badge badge-red">Admin</span>
                  </NuxtLink>
                  <div class="ml-auto flex items-center">
                    <p class="font-bold text-lg text-secondary text-right">
                      {{
                        (member.post_score || 0) + (member.comment_score || 0)
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
              <li v-for="(member, i) in membersPosts?.listMembers?.members?.slice(0, 5)" :key="member.id"
                class="bg-white odd:bg-gray-50 border-b last:border-0">
                <div class="flex items-center px-3 py-1">
                  <p class="font-bold text-lg text-gray-300 text-right">
                    #{{ i + 1 }}
                  </p>
                  <NuxtLink :to="`/@${member.name}`" class="ml-3 w-3/4 flex flex-shrink-0 items-center">
                    <img class="p-0.5 w-7 h-7 object-cover" :src="member.avatar" />
                    <strong class="ml-2 text-gray-900 text-sm truncate">{{
                      member.name
                    }}</strong>
                    <!-- Role -->
                    <span v-if="member.admin_level > 0" class="ml-1 badge badge-red">Admin</span>
                  </NuxtLink>
                  <div class="ml-auto flex items-center">
                    <p class="font-bold text-lg text-secondary text-right">
                      {{ member.post_count || 0 }}
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
              <li v-for="(member, i) in membersNew?.listMembers?.members?.slice(0, 5)" :key="member.id"
                class="bg-white odd:bg-gray-50 border-b last:border-0">
                <div class="flex items-center px-3 py-1">
                  <p class="font-bold text-lg text-gray-300 text-right">
                    #{{ i + 1 }}
                  </p>
                  <NuxtLink :to="`/@${member.name}`" class="ml-3 w-2/4 flex flex-shrink-0 items-center">
                    <img class="p-0.5 w-7 h-7 object-cover" :src="member.avatar" />
                    <strong class="ml-2 text-gray-900 text-sm truncate">{{
                      member.name
                    }}</strong>
                    <!-- Role -->
                    <span v-if="member.admin_level > 0" class="ml-1 badge badge-red">
                      Admin
                    </span>
                  </NuxtLink>
                  <div class="ml-auto flex flex-shrink-0 items-center">
                    <p class="text-gray-400 text-sm font-medium uppercase">
                      {{
                        format(
                          parseISO(member.creation_date),
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

// Fetch members using GraphQL
const {
  data: members,
  pending,
  error,
  refresh,
} = await useAsyncGql({
  operation: 'listMembers',
  variables: {
    limit: 5,
    sort: 'mostRep'
  }
});

const {
  data: membersNew,
  pending: membersNewPending,
  error: membersNewError,
  refresh: membersNewRefresh,
} = await useAsyncGql({
  operation: 'listMembers',
  variables: {
    limit: 5,
    sort: 'new'
  }
});

const {
  data: membersPosts,
  pending: membersPostsPending,
  error: membersPostsError,
  refresh: membersPostsRefresh,
} = await useAsyncGql({
  operation: 'listMembers',
  variables: {
    limit: 5,
    sort: 'mostPosts'
  }
});

// Fetch moderation statistics
const {
  data: moderationStats,
  pending: moderationStatsPending,
  error: moderationStatsError,
  refresh: moderationStatsRefresh,
} = await useAsyncGql({
  operation: 'getModerationStats'
});
</script>
