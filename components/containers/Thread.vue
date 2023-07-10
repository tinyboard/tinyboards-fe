<template>
  <div class="relative w-full flex flex-col sm:space-y-6">
    <!-- Pinned Banner -->
    <div
      v-if="item.post.is_stickied"
      class="order-2 sm:order-first flex items-center justify-center sm:justify-start mt-2.5 sm:my-0 p-2.5 text-center sm:text-left text-green-900 bg-green-100 border-y sm:border-x border-green-300 sm:rounded-md sm:shadow-inner-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="hidden sm:inline opacity-50 w-5 h-5 ml-1.5 mr-4"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4"></path>
        <line x1="9" y1="15" x2="4.5" y2="19.5"></line>
        <line x1="14.5" y1="4" x2="20" y2="9.5"></line>
      </svg>
      <div>
        <strong>Pinned post</strong>
        <br />
        <p class="text-sm text-green-800">
          This post was pinned by the mods. It is probably important.
        </p>
      </div>
    </div>
    <!-- Deleted/Removed Banner -->
    <div
      v-if="item.post.is_deleted || item.post.is_removed"
      class="order-2 sm:order-first flex items-center justify-center sm:justify-start mt-2.5 sm:my-0 p-2.5 text-center sm:text-left text-red-900 bg-red-100 border-y sm:border-x border-red-300 sm:rounded-md sm:shadow-inner-white"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash hidden sm:inline opacity-50 w-5 h-5 ml-1.5 mr-4" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
         <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
         <path d="M4 7l16 0"></path>
         <path d="M10 11l0 6"></path>
         <path d="M14 11l0 6"></path>
         <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
         <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
      </svg>
      <div>
        <strong>Post {{ item.post.is_removed ? 'removed' : 'deleted' }}</strong>
        <br />
        <p class="text-sm text-red-800">
          This post was {{ item.post.is_removed ? 'removed by the admins' : 'deleted by its author' }}. It is no longer available.
        </p>
      </div>
    </div>
    <!-- Locked Banner -->
    <div
      v-if="item.post.is_locked"
      class="order-2 sm:order-first flex items-center justify-center sm:justify-start mt-2.5 sm:my-0 p-2.5 text-center sm:text-left text-yellow-900 bg-yellow-100 border-y sm:border-x border-yellow-300 sm:rounded-md sm:shadow-inner-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="hidden sm:inline opacity-50 w-5 h-5 ml-1.5 mr-4"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <rect x="5" y="11" width="14" height="10" rx="2"></rect>
        <circle cx="12" cy="16" r="1"></circle>
        <path d="M8 11v-4a4 4 0 0 1 8 0v4"></path>
      </svg>
      <div>
        <strong>Post locked</strong>
        <br />
        <p class="text-sm text-yellow-800">
          This post was locked by the admins. Voting and replying are disabled.
        </p>
      </div>
    </div>
    <!-- Post -->
    <div
      class="sm:order-2 w-full sm:p-4 border-b sm:border sm:shadow-inner-xs sm:rounded-md" :class="isAdmin && item.post.is_removed ? 'bg-red-500 bg-opacity-20' : 'bg-white'"
    >
      <!-- Post Meta Information & Content -->
      <div
        class="flex flex-shrink-0 items-center justify-between p-2.5 sm:p-0 border-b sm:border-0 dark:border-gray-700 dark:border-opacity-70"
      >
        <div class="flex items-center w-full overflow-x-auto">
          <!-- Avatar -->
          <NuxtLink v-if="item.creator" :to="`/@${item.creator.name}`">
            <img
              :src="item.creator.avatar || 'https://placekitten.com/36/36'"
              alt="avatar"
              class="flex-shrink-0 w-9 h-9 object-cover rounded"
            />
          </NuxtLink>
          <!-- Deleted User -->
          <img
            v-else
            src=""
            alt="avatar"
            class="flex-shrink-0 w-9 h-9 object-cover rounded"
          />
          <div class="flex flex-col leading-normal ml-2">
            <NuxtLink
              v-if="item.creator"
              :to="`/@${item.creator.name}`"
              class="flex items-center text-sm"
            >
              <!-- Username -->
              <strong>{{ item.creator.name }}</strong>
              <!-- Role -->
              <span v-if="item.creator.is_admin" class="ml-1 badge badge-blue"
                >Admin</span
              >
            </NuxtLink>
            <span
              v-else
              class="text-sm text-gray-400 dark:text-gray-400 font-bold"
            >
              deleted user
            </span>
            <p class="flex items-center space-x-2 text-sm text-gray-400">
              <!-- Timestamp -->
              <span>{{ formatDate(new Date(item.post.creation_date)) }}</span>
              <span v-if="item.post.edited_date">
                <span class="font-black text-gray-400 dark:text-gray-500"
                  >·</span
                >
                <span class="pl-1 italic">
                  Edited {{ formatDate(new Date(item.post.edited_date)) }}
                </span>
              </span>
              <!-- Ratio -->
              <span>
                <span class="font-black text-gray-400 dark:text-gray-500"
                  >·</span
                >
                <span class="pl-2"> {{ percentUpvoted }}% upvoted </span>
              </span>
              <!-- Report count -->
              <span v-if="item.report_count">
                <span class="font-black text-gray-400 dark:text-gray-500"
                  >·</span
                >
                <span class="pl-2 text-yellow-600 dark:text-yellow-700"> {{ item.report_count }} report(s) </span>
              </span>
              <!-- Tags -->
              <span v-if="item.post.is_nsfw" title="This post is marked 18+">
                <span class="font-black text-gray-400 dark:text-gray-500"
                  >·</span
                >
                <span class="badge badge-red">18+</span>
              </span>
            </p>
          </div>
        </div>
        <div class="hidden md:block">
          <!-- External Link Icon -->
          <a
            v-if="item.post.url && item.post.type === 'link'"
            :href="item.post.url"
            target="_blank"
            class="block"
          >
            <i class="far fa-external-link text-gray-400"></i>
          </a>
        </div>
        <button
          class="flex items-center justify-center md:hidden -mr-1 p-1 text-gray-600 dark:text-gray-400"
        >
          <i class="far fa-ellipsis-h fa-fw fa-lg"></i>
        </button>
      </div>
      <!-- Post Content -->
      <div class="px-2.5 sm:px-0 mt-2.5 sm:mt-4">
        <!-- Title -->
        <NuxtLink :external="!!item.post.url" :to="!!item.post.url ? item.post.url : `/post/${item.post.id}`" :target="item.post.url ? '_blank' : null" class="text-lg md:text-xl font-medium dark:text-gray-100">
          {{ item.post.title }}
        </NuxtLink>
      </div>
      <!-- Post Embed -->
      <div
        class="px-2.5 sm:px-0 mt-2.5 sm:mt-4"
        v-if="item.post.url && item.post.type !== 'image'"
      >
        <!-- <LinkPreview
				:domain="'post.domain placeholder'"
				:title="'post.metaTitle placeholder'"
				:thumbnail="'post.thumbUrl placeholder'"
				:url="item.post.url"
				:preview="'post.metaDescription placeholder'"
				/> -->
      </div>
      <!-- Post Image -->
      <div
        v-if="item.post.image"
        class="mt-2.5 md:mt-4"
      >
        <span class="inline-block p-2.5 bg-white border shadow-polaroid">
          <img
            :src="item.post.image"
            alt="Post image"
            class="sm:max-w-xs object-cover img-expand"
          />
        </span>
      </div>
      <!-- Post Edit Form -->
      <LazyInputsEdit
        v-if="isEditing"
        :id="item.post.id"
        :body="item.post.body"
        @closed="isEditing = false"
        class="mt-4"
      />
      <!-- Post Text Body -->
      <div
        v-if="item.post.body_html"
        v-show="!isEditing"
        class="px-2.5 sm:px-0 mt-3 sm:mt-4 relative overflow-hidden"
      >
        <div
          class="prose prose-sm max-w-none"
          v-html="item.post.body_html"
        ></div>
      </div>
      <!-- Reports -->
      <div v-if="item.report_count" class="mt-3">
        <CardsReports :id="item.post.id" />
      </div>
      <!-- Footer -->
      <div
        v-show="!isEditing"
        class="flex justify-between items-center px-2.5 py-4 sm:px-0 sm:py-0 mt-3 sm:mt-6"
      >
        <!-- Actions -->
        <ul class="flex flex-grow items-center">
          <li class="sm:hidden">
            <NuxtLink
              to="#comments"
              class="text-sm font-medium leading-none text-gray-500 dark:text-gray-400 hover:text-gray-700"
            >
              {{
                item.counts.comments === 1
                  ? "1 reply"
                  : `${item.counts.comments} replies`
              }}
            </NuxtLink>
          </li>
          <li
            class="ml-auto sm:ml-0 group flex items-center space-x-2 leading-none text-sm font-medium"
          >
            <!-- If logged in, allow upvoting -->
            <button
              v-if="isAuthed"
              @click="vote(1)"
              class="upvote"
              :class="voteType === 1 ? 'upvoted text-primary' : 'text-gray-500'"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-4 h-4"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M9 20v-8h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v8a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"
                ></path>
              </svg>
            </button>
            <!-- Else, redirect to login -->
            <NuxtLink v-else to="/login" class="text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-4 h-4"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M9 20v-8h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v8a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"
                ></path>
              </svg>
            </NuxtLink>
            <span
              :class="{
                'text-primary': voteType === 1,
                'text-secondary': voteType === -1,
                'text-gray-900 dark:text-gray-300': voteType === 0,
              }"
            >
              {{ item.counts.score + voteType }}
            </span>
            <!-- If logged in, allow downvoting -->
            <button
              v-if="isAuthed"
              @click="vote(-1)"
              class="downvote"
              :class="
                voteType === -1 ? 'downvoted text-secondary' : 'text-gray-500'
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-4 h-4"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M15 4v8h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-8a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1z"
                ></path>
              </svg>
            </button>
            <!-- Else, redirect to login -->
            <NuxtLink v-else to="/login" class="text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-4 h-4"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M15 4v8h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-8a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1z"
                ></path>
              </svg>
            </NuxtLink>
          </li>
          <li class="ml-6 hidden sm:list-item">
            <NuxtLink
              to="#comments"
              class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-4 h-4 mr-1"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1"></path>
              </svg>
              <span class="text-sm font-medium">{{
                item.counts.comments
              }}</span>
            </NuxtLink>
          </li>
          <li class="ml-6 hidden sm:list-item">
            <button
              class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-4 h-4 mr-1"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"
                ></path>
                <rect x="9" y="3" width="6" height="4" rx="2"></rect>
              </svg>
              <span class="text-sm font-medium">Copy link</span>
            </button>
          </li>
          <li class="ml-6 hidden md:list-item">
            <button
              @click="save"
              class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700"
            >
              <!-- Bookmark Icon -->
              <svg
                v-show="!isSaved"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-4 h-4 mr-1"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M9 4h6a2 2 0 0 1 2 2v14l-5 -3l-5 3v-14a2 2 0 0 1 2 -2"
                ></path>
              </svg>
              <!-- Bookmark Slash Icon -->
              <svg
                v-show="isSaved"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-4 h-4 mr-1"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <line x1="3" y1="3" x2="21" y2="21"></line>
                <path
                  d="M17 17v3l-5 -3l-5 3v-13m1.178 -2.818c.252 -.113 .53 -.176 .822 -.176h6a2 2 0 0 1 2 2v7"
                ></path>
              </svg>
              <span class="text-sm font-medium">{{
                isSaved ? "Unsave" : "Save"
              }}</span>
            </button>
          </li>
          <li v-if="!isAuthor" class="ml-6 hidden md:list-item">
            <button
              class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700"
              @click="confirmReport"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 mr-1"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M5 14h14l-4.5 -4.5l4.5 -4.5h-14v16"></path>
              </svg>
              <span class="text-sm font-medium">Report</span>
            </button>
          </li>
          <li v-if="isAuthor" class="ml-6 hidden sm:list-item">
            <button
              class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-600"
              @click="isEditing = !isEditing"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 mr-1"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"
                ></path>
                <path
                  d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"
                ></path>
                <path d="M16 5l3 3"></path>
              </svg>
              <span class="text-sm font-medium">Edit</span>
            </button>
          </li>
          <li v-if="isAuthor" class="ml-6 hidden sm:list-item">
            <button
              class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-600"
              @click="confirmDelete"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 mr-1"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <line x1="4" y1="7" x2="20" y2="7"></line>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
              </svg>
              <span class="text-sm font-medium">Delete</span>
            </button>
          </li>
          <li v-if="isAdmin" class="ml-6 hidden lg:list-item">
            <button
              class="group flex items-center text-green-500 leading-none dark:text-gray-400 hover:text-green-600"
              @click="confirmSticky"
            >
              <!-- Pin Icon -->
              <svg
                v-show="!item.post.is_stickied"
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 mr-1"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4"
                ></path>
                <line x1="9" y1="15" x2="4.5" y2="19.5"></line>
                <line x1="14.5" y1="4" x2="20" y2="9.5"></line>
              </svg>
              <!-- Pin Off Icon -->
              <svg
                v-show="item.post.is_stickied"
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 mr-1"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <line x1="3" y1="3" x2="21" y2="21"></line>
                <path
                  d="M15 4.5l-3.249 3.249m-2.57 1.433l-2.181 .818l-1.5 1.5l7 7l1.5 -1.5l.82 -2.186m1.43 -2.563l3.25 -3.251"
                ></path>
                <line x1="9" y1="15" x2="4.5" y2="19.5"></line>
                <line x1="14.5" y1="4" x2="20" y2="9.5"></line>
              </svg>
              <span class="text-sm font-medium">{{
                item.post.is_stickied ? "Unpin" : "Pin"
              }}</span>
            </button>
          </li>
          <li v-if="isAdmin" class="ml-6 hidden lg:list-item">
            <button
              class="group flex items-center text-yellow-500 leading-none dark:text-gray-400 hover:text-yellow-600"
              @click="confirmLock"
            >
              <!-- Lock Icon -->
              <svg
                v-show="!item.post.is_locked"
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 mr-1"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <rect x="5" y="11" width="14" height="10" rx="2"></rect>
                <circle cx="12" cy="16" r="1"></circle>
                <path d="M8 11v-4a4 4 0 0 1 8 0v4"></path>
              </svg>
              <!-- Unlock Icon -->
              <svg
                v-show="item.post.is_locked"
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 mr-1"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <rect x="5" y="11" width="14" height="10" rx="2"></rect>
                <circle cx="12" cy="16" r="1"></circle>
                <path d="M8 11v-5a4 4 0 0 1 8 0"></path>
              </svg>
              <span class="text-sm font-medium">{{
                item.post.is_locked ? "Unlock" : "Lock"
              }}</span>
            </button>
          </li>
          <li v-if="isAdmin && (item.post.is_removed || item.report_count)" class="ml-6 hidden lg:list-item">
            <button
              class="group flex items-center text-green-500 leading-none dark:text-gray-400 hover:text-green-600"
              @click="confirmApprove"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-check w-4 h-4 mr-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                 <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                 <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                 <path d="M9 12l2 2l4 -4"></path>
              </svg>
              <span class="text-sm font-medium">Approve</span>
            </button>
          </li>
          <li v-if="isAdmin && !item.post.is_removed" class="ml-6 hidden lg:list-item">
            <button
              class="group flex items-center text-red-500 leading-none dark:text-gray-400 hover:text-red-600"
              @click="confirmRemove"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 mr-1"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M13 10l7.383 7.418c.823 .82 .823 2.148 0 2.967a2.11 2.11 0 0 1 -2.976 0l-7.407 -7.385"
                ></path>
                <path d="M6 9l4 4"></path>
                <path d="M13 10l-4 -4"></path>
                <path d="M3 21h7"></path>
                <path
                  d="M6.793 15.793l-3.586 -3.586a1 1 0 0 1 0 -1.414l2.293 -2.293l.5 .5l3 -3l-.5 -.5l2.293 -2.293a1 1 0 0 1 1.414 0l3.586 3.586a1 1 0 0 1 0 1.414l-2.293 2.293l-.5 -.5l-3 3l.5 .5l-2.293 2.293a1 1 0 0 1 -1.414 0z"
                ></path>
              </svg>
              <span class="text-sm font-medium">Remove</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
    <!-- Comment Section -->
    <div id="comments" class="order-last flex flex-col">
      <!-- Comment Count & Sort Menu -->
      <div
        class="flex items-center sm:mb-4 p-2.5 sm:p-4 bg-gray-100 sm:border sm:shadow-inner-white sm:rounded-md"
      >
        <p>
          <strong class="text-base leading-4 dark:text-gray-100">
            {{
              item.counts.comments === 1
                ? "1 comment"
                : `${item.counts.comments} comments`
            }}
          </strong>
        </p>
        <MenusSort :sorts="sorts" isLeft class="ml-auto" />
      </div>
      <!-- Single Discussion Alert -->
      <div
        v-if="!!route.params.comment"
        class="flex items-center justify-center sm:justify-start mb-2.5 sm:mb-4 p-2.5 text-center sm:text-left text-yellow-900 bg-yellow-100 border-y sm:border-x border-yellow-300 sm:rounded-md sm:shadow-inner-white"
      >
        <p class="text-sm text-yellow-800">
          You are viewing a single conversation.
          <NuxtLink :to="`/post/${item.post.id}`" class="text-yellow-800">
            <strong>View the entire thread &#8594;</strong>
          </NuxtLink>
        </p>
      </div>
      <!-- Comments & States -->
      <div
        id="comments"
        class="bg-white p-2.5 sm:p-4 sm:shadow-inner-xs sm:rounded-md border-y sm:border-x"
        style="scroll-margin-top: 7rem;"
      >
        <!-- Write Form -->
        <div
          v-if="isAuthed && !item.post.is_locked && !route.params.comment"
          class="flex md:space-x-2 mb-2 sm:mb-0"
        >
          <!-- Avatar -->
          <img
            loading="lazy"
            :src="userStore.user.avatar"
            alt="avatar"
            class="hidden md:inline-block flex-shrink-0 w-9 h-9 object-cover rounded"
          />
          <!-- Input -->
          <LazyInputsComment
            :post-id="item.post.id"
            :parent-id="null"
            @comment-published="onCommentPublished"
          />
        </div>
        <!-- Comments -->
        <LazyListsComments
          v-if="comments.length"
          :comments="comments"
          :offset="!!route.params.comment ? 3 : null"
        />
        <!-- Empty -->
        <div
          v-else-if="comments.length === 0"
          class="px-4 py-24 text-center text-gray-400"
        >
          <p>
            <span class="font-medium">No comments</span>
            <br />
            You can be the first to reply...
          </p>
        </div>
        <!-- Error -->
        <div v-else class="px-4 py-24 text-center text-gray-400">
          <p>An unknown error occured.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  comments: {
    type: Array,
    required: true,
  },
});

import { reactive, computed } from "vue";
import { baseURL } from "@/server/constants";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { usePost } from "@/composables/post";
import { usePostComments } from "@/composables/comments";
import { useModalStore } from "@/stores/StoreModal";
import { useToastStore } from "@/stores/StoreToast";
import { formatDate } from "@/utils/formatDate";
import { toPercent } from "@/utils/percent";

const modalStore = useModalStore();
const toast = useToastStore();

const route = useRoute();
const userStore = useLoggedInUser();

const isAuthed = userStore.isAuthed;
const authCookie = useCookie("token").value;

// Vote
const voteType = ref(props.item.my_vote);
const vote = async (type = 0) => {
  voteType.value = voteType.value === type ? 0 : type;

  await useFetch(`/posts/${props.item.post.id}/vote`, {
    baseURL,
    method: "post",
    body: {
      score: voteType,
    },
    headers: {
      Authorization: authCookie ? `Bearer ${authCookie}` : "",
    },
  }).then(({ data, error }) => {
    if (data.value) {
      data = JSON.parse(JSON.stringify(data.value));
      console.log(data);
    } else {
      // Revert failed vote & show error toast.
      setTimeout(() => {
        voteType.value = 0;
        toast.addNotification({
          header: "Vote failed",
          message: "Your vote failed to cast. Please try again.",
          type: "error",
        });
      }, 400);
      // Log the error.
      console.log(error.value);
    }
  });
};

// Save
const isSaved = ref(props.item.saved);
const save = async () => {
  isSaved.value = !isSaved.value;
  await useFetch(`/posts/${props.item.post.id}/save`, {
    baseURL,
    method: "post",
    body: {
      save: !isSaved.value,
    },
    headers: {
      Authorization: authCookie ? `Bearer ${authCookie}` : "",
    },
  }).then(({ data, error }) => {
    if (data.value) {
      //data = JSON.parse(JSON.stringify(data.value));
    } else {
      // Revert failed save & show error toast.
      setTimeout(() => {
        isSaved.value = false;
        toast.addNotification({
          header: "Saving failed",
          message: "Failed to save the post. Please try again.",
          type: "error",
        });
      }, 400);
      // Log the error.
      console.error(error.value);
    }
  });
};

// Comments
const onCommentPublished = (comment) => {
  props.comments.unshift(comment);
};

// Utils
const percentUpvoted = computed(() => {
  const num = 1 - props.item.counts.downvotes / props.item.counts.upvotes;
  if (!isFinite(num)) return 0;
  return toPercent(num);
});

// Author
const isAuthor = computed(() => {
  if (userStore.user && props.item.creator) {
    return userStore.user.name === props.item.creator.name;
  } else {
    return false;
  }
});

// Admin
const isAdmin = computed(() => {
  return !!userStore.user && userStore.user.is_admin;
});

// Edit
const isEditing = ref(false);

// Delete
const confirmDelete = () => {
  modalStore.setModal({
    modal: "ModalDelete",
    id: props.item.post.id,
    contentType: "post",
    isOpen: true,
  });
};

// Report
const confirmReport = () => {
  modalStore.setModal({
    modal: "ModalReport",
    id: props.item.post.id,
    contentType: "post",
    isOpen: true,
  });
};

// Sticky
const confirmSticky = () => {
  modalStore.setModal({
    modal: "ModalSticky",
    id: props.item.post.id,
    isOpen: true,
    options: {
      isStickied: props.item.post.is_stickied,
    },
  });
};

// Lock
const confirmLock = () => {
  modalStore.setModal({
    modal: "ModalLock",
    id: props.item.post.id,
    isOpen: true,
    options: {
      isLocked: props.item.post.is_locked,
    },
  });
};

// Remove
const confirmRemove = () => {
  modalStore.setModal({
    modal: "ModalRemoveOrApprove",
    id: props.item.post.id,
    isOpen: true,
    options: {
      approve: false
    }
  });
};

// Approve
const confirmApprove = () => {
  modalStore.setModal({
    modal: "ModalRemoveOrApprove",
    id: props.item.post.id,
    isOpen: true,
    options: {
      approve: true
    }
  });
};

// Comment sort options.
const sorts = [
  {
    name: "Hot",
    key: "hot",
    href: { path: route.fullPath, query: { ...route.query, sort: "hot" } },
  },
  {
    name: "Latest",
    key: "new",
    href: { path: route.fullPath, query: { ...route.query, sort: "new" } },
  },
  {
    name: "Oldest",
    key: "old",
    href: { path: route.fullPath, query: { ...route.query, sort: "old" } },
  },
  {
    name: "Top All",
    key: "top",
    href: { path: route.fullPath, query: { ...route.query, sort: "top" } },
  },
];
</script>

<style scoped>
.prose :deep(img) {
  max-width: 100px;
  aspect-ratio: auto;
}
@media (min-width: 768px) {
  .prose :deep(img) {
    max-width: 240px;
  }
}
</style>