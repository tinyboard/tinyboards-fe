<template>
  <div
    v-if="item"
    class="w-[290px] hidden xl:flex flex-col flex-shrink-0 space-y-6 text-base"
  >
    <!-- Author Details -->
    <div
      v-if="!item.post.is_deleted"
    >
      <NuxtLink
        :to="`/user/${item.creator.name}`"
        class="group flex items-center mb-4 text-sm"
      >
        <!-- Avatar -->
        <img
          loading="lazy"
          :src="item.creator.avatar"
          alt="avatar"
          class="flex-shrink-0 w-9 h-9 object-cover rounded-sm rounded-none p-0.5 border bg-white hover:bg-gray-200 hover:border-transparent"
        />
        <!-- Username -->
        <strong class="ml-2">
          {{ item.creator.name }}
        </strong>
        <!-- Role -->
        <span v-if="item.creator.is_admin" class="ml-1 badge badge-blue"
          >Admin</span
        >
      </NuxtLink>
      <div v-if="stats" class="flex flex-wrap -m-1">
        <div class="w-2/4 p-1 text-sm">
          <strong>{{ stats.post_count }}</strong>
          <p class="text-sm text-gray-500">Posts</p>
        </div>
        <div class="w-2/4 p-1 text-sm">
          <strong>{{ stats.comment_count }}</strong>
          <p class="text-sm text-gray-500">Comments</p>
        </div>
        <div class="w-2/4 p-1 text-sm">
          <strong>{{ stats.rep }}</strong>
          <p class="text-sm text-gray-500">Reputation</p>
        </div>
        <div class="w-2/4 p-1 text-sm">
          <strong>{{ format(parseISO(item.creator.creation_date), "MMM dd, yyyy") }}</strong>
          <p class="text-gray-500">Joined</p>
        </div>
      </div>
    </div>
    <!-- Stats -->
    <div>
      <h2 class="font-bold leading-5 text-base mb-3 pb-1 border-b">Stats</h2>
      <ul class="flex flex-col flex-grow space-y-2 text-sm text-gray-500">
        <li>
          <dl class="flex justify-between">
            <dt>Published</dt>
            <dd class="font-medium">
              {{ format(parseISO(item.counts.creation_date), "MMM dd, yyyy") }}
            </dd>
          </dl>
        </li>
        <li>
          <dl class="flex justify-between">
            <dt>Upvotes</dt>
            <dd class="text-green-600 font-medium">
              +{{ item.counts.upvotes }}
            </dd>
          </dl>
        </li>
        <li>
          <dl class="flex justify-between">
            <dt>Downvotes</dt>
            <dd class="text-red-600 font-medium">
              -{{ item.counts.downvotes }}
            </dd>
          </dl>
        </li>
      </ul>
    </div>
    <!-- Share -->
    <div>
      <h2 class="font-bold leading-5 text-base mb-3 pb-1 border-b">Share</h2>
      <input
        :value="`https://forum.porpl.net/p/${item.post.id}`"
        class="w-full p-1 text-sm mb-4"
        @focus="$event.target.select()"
      />
    </div>
  </div>
</template>

<script setup>
  import { format, parseISO } from "date-fns";

  // Define author
  const props = defineProps({
    item: {
      type: Object,
      required: true
    },
    stats: {
      type: Object,
      required: false
    }
  });
</script>