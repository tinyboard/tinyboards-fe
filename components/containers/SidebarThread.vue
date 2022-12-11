<template>
      <div v-if="item" class="w-[290px] hidden xl:flex flex-col flex-shrink-0 space-y-6 text-base">
            <!-- Author Details -->
            <div v-if="!item.post.deleted" class="p-4 border rounded-md shadow-inner-white">
                  <NuxtLink :to="`/user/${item.creator.name}`" class="group flex items-center mb-4 text-sm">
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
                        <span v-if="item.creator.admin" class="ml-1 badge badge-blue">Admin</span>
                  </NuxtLink>
                  <div class="flex flex-wrap -m-2">
                        <div class="w-2/4 p-2 leading-normal">
                              <strong>120</strong>
                              <p class="text-sm text-gray-500">Posts</p>
                        </div>
                        <div class="w-2/4 p-2">
                              <strong>45</strong>
                              <p class="text-sm text-gray-500">Comments</p>
                        </div>
                        <div class="w-2/4 p-2">
                              <strong>120</strong>
                              <p class="text-sm text-gray-500">Reputation</p>
                        </div>
                        <div class="w-2/4 p-2">
                              <strong>12K</strong>
                              <p class="text-sm text-gray-500">Hours lurking</p>
                        </div>
                  </div>
            </div>
            <!-- Stats -->
            <div>
                  <h2 class="font-bold leading-5 text-base mb-3 pb-1 border-b">
                        Stats
                  </h2>
                  <ul class="flex flex-col flex-grow space-y-2 text-sm text-gray-500">
                        <li>
                              <dl class="flex justify-between">
                                    <dt>Published</dt>
                                    <dd class="font-medium">{{ format(parseISO(item.counts.published), "MMM dd, yyyy") }}</dd>
                              </dl>
                        </li>
                        <li>
                              <dl class="flex justify-between">
                                    <dt>Upvotes</dt>
                                    <dd class="text-green-600 font-medium">+{{ item.counts.upvotes }}</dd>
                              </dl>
                        </li>
                        <li>
                              <dl class="flex justify-between">
                                    <dt>Downvotes</dt>
                                    <dd class="text-red-600 font-medium">-{{ item.counts.downvotes }}</dd>
                              </dl>
                        </li>
                  </ul>
            </div>
            <!-- Share -->
            <div>
                  <h2 class="font-bold leading-5 text-base mb-3 pb-1 border-b">
                        Share
                  </h2>
                  <input :value="`https://tinyboards.net/p/${item.post.id}`" class="w-full p-1 text-sm mb-4" @focus="$event.target.select()"/>
            </div>
    </div>
</template>

<script setup>
import { format, parseISO } from "date-fns";

// Define author
const props = defineProps({
      item: Object
});
</script>