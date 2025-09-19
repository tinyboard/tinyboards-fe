<template>
  <div class="group flex flex-row-reverse sm:gap-4" :class="[
    { 'first:sm:rounded-t-md last:sm:rounded-b-md': isCompact },
    status,
  ]">
    <div class="relative flex-grow p-2.5 sm:p-4 shadow-inner-white hover:bg-gray-50 card" :class="[
      isCompact
        ? 'flex border-inherit'
        : 'border-y sm:border-x sm:rounded dark:border-gray-800',
      status ? `${status}` : 'bg-white dark:bg-gray-800',
      isCompact && isExpanded ? 'items-start' : 'items-center'
    ]">
      <NuxtLink v-if="!!post.creator" v-show="isCompact"
        :to="`/@${post.creator.name}${post.creator.instance ? '@' + post.creator.instance : ''}`"
        class="hidden sm:flex flex-shrink-0">
        <img loading="lazy" :src="post.creator.avatar || 'https://placekitten.com/36/36'" alt="avatar"
          class="w-10 h-10 object-cover rounded" />
      </NuxtLink>
      <!-- TODO: "avatar" for deleted users / put some ghost here :P -->
      <div v-else class="hidden sm:flex flex-shrink-0">
        <img loading="lazy" src="https://placekitten.com/36/36" alt="avatar" class="w-10 h-10 object-cover rounded" />
      </div>
      <div class="w-full" :class="{ 'sm:w-3/6': isCompact && !isExpanded, 'sm:ml-4': isCompact }">
        <!-- Author & Post Meta -->
        <div v-if="post.creator" scope="row" class="z-10 relative flex items-center text-gray-900 dark:text-white">
          <div class="flex flex-col flex-shrink-0 sm:truncate">
            <p class="flex items-center font-normal text-sm text-gray-400 leading-normal">
              <NuxtLink :to="`/@${post.creator.name}${post.creator.instance ? '@' + post.creator.instance : ''}`"
                class="flex items-center">
                <!-- Avatar (mobile only) -->
                <img loading="lazy" :src="post.creator.avatar || 'https://placekitten.com/24/24'" alt="avatar"
                  class="sm:hidden flex-shrink-0 w-6 h-6 object-cover rounded" />
                <!-- Username -->
                <strong class="ml-2 sm:ml-0">{{ post.creator.displayName ?? post.creator.name }}</strong>
                <span v-if="post.creator.instance">@{{ post.creator.instance }}</span>
                <!-- Role -->
                <span v-if="creatorIsAdmin" class="ml-1 badge badge-red">Admin</span>
              </NuxtLink>
              <!-- User Title -->
              <!-- <span v-if="post.creator && post.creator.title"
                class="ml-2 px-1 inline-flex leading-4 rounded-sm text-blue-700 shadow-inner-white bg-blue-100 border border-blue-200">
                {{ post.creator.title }}
              </span> -->
              <!-- Post Timestamps -->
              <span :title="post.creationDate" class="ml-2">
                <span>{{ formatDate(new Date(post.creationDate)) }}</span>
              </span>
              <span class="ml-2" v-if="post.updated">
                <span class="font-black text-gray-400 dark:text-gray-500">·</span>
                <span class="italic pl-1">
                  Edited {{ formatDate(new Date(post.updated)) }}</span>
              </span>
              <!-- Tags -->
              <span class="ml-2" v-if="post.isNSFW" title="This post is marked 18+">
                <span class="font-black text-gray-400 dark:text-gray-500">·</span>
                <span class="badge badge-red">18+</span>
              </span>
              <!-- Report count -->
              <span class="ml-2 text-orange-400 font-bold text-xs" v-if="/*post.report_count*/ false"
                :title="`??? report(s)`">
                <span class="font-black text-gray-400 dark:text-gray-500">·</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="inline ml-1" width="24" height="24" viewBox="0 0 24 24"
                  stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 14h14l-4.5 -4.5l4.5 -4.5h-14v16"></path>
                </svg>
                ???
              </span>
            </p>
          </div>
          <div class="flex flex-wrap space-x-1 items-center" :class="isCompact ? 'ml-2' : 'ml-auto'">
            <!-- Board -->
            <NuxtLink v-if="site.enableBoards && !boardPage && post.board" :to="`/b/${post.board.name}`" class="font-bold"
              :style="{ 'color': post.board.primaryColor ? 'rgb(' + post.board.primaryColor + ')' : '' }">
              <div class="hidden md:flex space-x-2 items-center">
                <img v-if="post.board.icon" :src="post.board.icon" class="bg-white border p-[0.5px]"
                  :class="isCompact ? 'w-5 h-5' : 'w-8 h-8'" />
                <p>{{ post.board?.title || post.board?.name || 'Unknown Board' }}</p>
              </div>
              <div class="block md:hidden">
                <p>+{{ post.board?.name || 'unknown' }}</p>
              </div>
            </NuxtLink>
            <!-- Admin Pin Icon -->
            <span v-if="post.featuredLocal" title="Post pinned by the admins">
              <svg xmlns="http://www.w3.org/2000/svg" class="text-red-500 w-4 h-4" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4"></path>
                <line x1="9" y1="15" x2="4.5" y2="19.5"></line>
                <line x1="14.5" y1="4" x2="20" y2="9.5"></line>
              </svg>
            </span>
            <!-- Mod Pin Icon -->
            <span v-if="post.featuredBoard" title="Post pinned by the mods">
              <svg xmlns="http://www.w3.org/2000/svg" class="text-green-500 w-4 h-4" viewBox="0 0 24 24"
                stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4"></path>
                <line x1="9" y1="15" x2="4.5" y2="19.5"></line>
                <line x1="14.5" y1="4" x2="20" y2="9.5"></line>
              </svg>
            </span>
            <!-- Lock Icon -->
            <span v-if="post.isLocked" title="Post locked by the mods">
              <svg xmlns="http://www.w3.org/2000/svg" class="text-yellow-500 w-4 h-4" viewBox="0 0 24 24"
                stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <rect x="5" y="11" width="14" height="10" rx="2"></rect>
                <circle cx="12" cy="16" r="1"></circle>
                <path d="M8 11v-4a4 4 0 0 1 8 0v4"></path>
              </svg>
            </span>
            <!-- Link Icon -->
            <span v-if="!!post.url" title="Post contains a link">
              <svg xmlns="http://www.w3.org/2000/svg" class="text-gray-500 w-4 h-4" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5"></path>
                <path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5"></path>
              </svg>
            </span>
            <!-- Text Icon -->
            <span v-else title="Post contains text">
              <svg xmlns="http://www.w3.org/2000/svg" class="text-gray-500 w-4 h-4" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M10 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 2.667 -1.333 4.333 -4 5">
                </path>
                <path d="M19 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 2.667 -1.333 4.333 -4 5">
                </path>
              </svg>
            </span>
          </div>
        </div>
        <!-- Post Title & Content -->
        <div class="mt-2.5" :class="{ 'sm:mt-0': isCompact }">
          <NuxtLink class="z-10 relative sm:text-lg sm:overflow-hidden sm:text-ellipsis" :class="titleStyle"
            :to="`${site.enableBoards && post.board ? '/b/' + post.board.name + '/p' : '/p'}/${post.id}/${post.titleChunk}`">
            {{ post.title }}
          </NuxtLink>
          <div v-if="(!isCompact || isExpanded) && post.bodyHTML" class="mt-2 relative overflow-hidden" :class="{
            'max-h-56 overlay': !isExpanded && (post.bodyHTML.length > 800 || post.bodyHTML.includes('<img'))
          }">
            <!-- Post Image -->
            <div v-if="hasImage && !!post.url" class="mt-2.5 md:mt-4">
              <span class="inline-block p-2.5 bg-white border shadow-polaroid">
                <img loading="lazy" :src="post.url" :alt="post.altText || 'Post image'" class="sm:max-w-xs object-cover img-expand" />
              </span>
            </div>
            <!-- Post Body -->
            <div class="prose prose-sm max-w-none dark:text-gray-400" v-html="post.bodyHTML"></div>
          </div>
        </div>
        <!-- Reports -->
        <!-- <div v-if="post.report_count && !isCompact" class="z-10 relative mt-3">
          <CardsReports :id="post.id" />
        </div> -->
        <!-- Actions -->
        <ul class="z-10 relative mt-4 flex flex-grow items-center" :class="{ 'sm:hidden': isCompact && !isExpanded }">
          <li class="ml-0 group flex items-center space-x-2 leading-none text-sm font-medium">
            <!-- If logged in, allow upvoting -->
            <button v-if="isAuthed" @click="vote(1)" class="upvote"
              :class="voteType === 1 ? 'upvoted text-primary' : 'text-gray-500'">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                fill="none" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 sm:w-4 sm:h-4">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M9 20v-8h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v8a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z">
                </path>
              </svg>
            </button>
            <!-- Else, redirect to login -->
            <NuxtLink v-else to="/login" class="text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                fill="none" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 sm:w-4 sm:h-4">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M9 20v-8h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v8a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z">
                </path>
              </svg>
            </NuxtLink>
            <span :class="{
              'text-primary': voteType === 1,
              'text-secondary': voteType === -1,
              'text-gray-900 dark:text-gray-300': voteType === 0,
            }">
              {{ post.score + voteType }}
            </span>
            <!-- If logged in, allow downvoting -->
            <button v-if="isAuthed" @click="vote(-1)" class="downvote" :class="voteType === -1 ? 'downvoted text-secondary' : 'text-gray-500'
              ">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                fill="none" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 sm:w-4 sm:h-4">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M15 4v8h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-8a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1z">
                </path>
              </svg>
            </button>
            <!-- Else, redirect to login -->
            <NuxtLink v-else to="/login" class="text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                fill="none" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 sm:w-4 sm:h-4">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M15 4v8h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-8a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1z">
                </path>
              </svg>
            </NuxtLink>
          </li>
          <li v-if="post.bodyHTML && (post.bodyHTML.length > 800 || post.bodyHTML.includes('<img'))"
            class="ml-6 hidden sm:list-item">
            <button class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700"
              @click="isExpanded = !isExpanded">
              <!-- Arrows In Icon -->
              <svg v-show="isExpanded" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 sm:w-4 sm:h-4 mr-1"
                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M18 10h-4v-4"></path>
                <path d="M20 4l-6 6"></path>
                <path d="M6 14h4v4"></path>
                <path d="M10 14l-6 6"></path>
              </svg>
              <!-- Arrows Out Icon -->
              <svg v-show="!isExpanded" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 sm:w-4 sm:h-4 mr-1"
                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <polyline points="16 4 20 4 20 8"></polyline>
                <line x1="14" y1="10" x2="20" y2="4"></line>
                <polyline points="8 20 4 20 4 16"></polyline>
                <line x1="4" y1="20" x2="10" y2="14"></line>
              </svg>
              <span class="text-sm font-medium w-12">
                {{ isExpanded ? "Collapse" : "Expand" }}
              </span>
            </button>
          </li>
          <li class="ml-3 sm:ml-6 list-item">
            <NuxtLink :to="`${site.enableBoards && post.board ? '/b/' + post.board.name + '/p' : '/p'}/${post.id}/${post.titleChunk}`"
              class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                fill="none" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 sm:w-4 sm:h-4 mr-1">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1"></path>
              </svg>
              <span class="text-sm font-medium">{{
                post.commentCount
                }}</span>
            </NuxtLink>
          </li>
          <!--<li class="ml-3 sm:ml-6">
            <button class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                fill="none" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 sm:w-4 sm:h-4 mr-1">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
                <rect x="9" y="3" width="6" height="4" rx="2"></rect>
              </svg>
              <span class="hidden sm:inline text-sm font-medium">Copy link</span>
            </button>
          </li>-->
          <li v-if="isAuthed" class="ml-3 sm:ml-6">
            <button @click="save" :disabled="isSaveLoading"
              class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700 disabled:opacity-50">
              <!-- Bookmark Icon -->
              <svg v-show="!isSaved && !isSaveLoading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"
                class="w-6 h-6 sm:w-4 sm:h-4 mr-1">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M9 4h6a2 2 0 0 1 2 2v14l-5 -3l-5 3v-14a2 2 0 0 1 2 -2"></path>
              </svg>
              <!-- Bookmark Slash Icon -->
              <svg v-show="isSaved && !isSaveLoading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"
                class="w-6 h-6 sm:w-4 sm:h-4 mr-1">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <line x1="3" y1="3" x2="21" y2="21"></line>
                <path d="M17 17v3l-5 -3l-5 3v-13m1.178 -2.818c.252 -.113 .53 -.176 .822 -.176h6a2 2 0 0 1 2 2v7"></path>
              </svg>
              <!-- Loading Icon -->
              <svg v-show="isSaveLoading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"
                class="w-6 h-6 sm:w-4 sm:h-4 mr-1 animate-spin">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M12 3a9 9 0 1 0 9 9"></path>
              </svg>
              <span class="hidden sm:inline text-sm font-medium">{{
                isSaveLoading ? "..." : (isSaved ? "Unsave" : "Save")
                }}</span>
            </button>
          </li>
          <li class="sm:hidden ml-3">
            <button @click="openOptions"
              class="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" width="24" height="24" viewBox="0 0 24 24"
                stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
              </svg>
            </button>
          </li>
          <li v-if="isAuthed && !isAuthor" class="hidden sm:list-item ml-6">
            <button @click="confirmReport"
              class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                fill="none" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 sm:w-4 sm:h-4 mr-1">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M5 14h14l-4.5 -4.5l4.5 -4.5h-14v16"></path>
              </svg>
              <span class="hidden sm:inline text-sm font-medium">Report</span>
            </button>
          </li>
          <li v-if="isAuthor" class="hidden sm:list-item ml-6">
            <button @click="confirmDelete"
              class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 sm:w-4 sm:h-4 mr-1" viewBox="0 0 24 24"
                stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <line x1="4" y1="7" x2="20" y2="7"></line>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
              </svg>
              <span class="hidden sm:inline text-sm font-medium">{{
                post.isDeleted ? "Deleted" : "Delete"
                }}</span>
            </button>
          </li>
          <li v-if="(isMod && !post.featuredLocal) || isAdmin" class="hidden sm:list-item ml-6">
            <button @click="confirmSticky" class="group flex items-center leading-none"
              :class="[isMod ? 'text-green-500 dark:text-green-400 hover:text-green-600' : 'text-red-500 dark:text-red-400 hover:text-red-600']">
              <!-- Pin Icon -->
              <svg v-if="!(post.featuredLocal || post.featuredBoard)" xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 sm:w-4 sm:h-4 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4"></path>
                <line x1="9" y1="15" x2="4.5" y2="19.5"></line>
                <line x1="14.5" y1="4" x2="20" y2="9.5"></line>
              </svg>
              <!-- Pin Off Icon -->
              <svg v-else-if="post.featuredLocal || post.featuredBoard" xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 sm:w-4 sm:h-4 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <line x1="3" y1="3" x2="21" y2="21"></line>
                <path
                  d="M15 4.5l-3.249 3.249m-2.57 1.433l-2.181 .818l-1.5 1.5l7 7l1.5 -1.5l.82 -2.186m1.43 -2.563l3.25 -3.251">
                </path>
                <line x1="9" y1="15" x2="4.5" y2="19.5"></line>
                <line x1="14.5" y1="4" x2="20" y2="9.5"></line>
              </svg>
              <span class="hidden sm:inline text-sm font-medium">{{
                post.featuredLocal || post.featuredBoard ? "Unpin" : "Pin"
                }}</span>
            </button>
          </li>
          <li v-if="canMod && !post.isRemoved" class="hidden sm:list-item ml-6">
            <button @click="confirmRemove"
              class="group flex items-center text-red-500 leading-none dark:text-red-400 hover:text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 sm:w-4 sm:h-4 mr-1" width="24" height="24"
                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                <path d="M5.7 5.7l12.6 12.6"></path>
              </svg>
              <span class="hidden sm:inline text-sm font-medium">Remove</span>
            </button>
          </li>
          <li v-if="canMod" class="hidden sm:list-item ml-6">
            <button
              class="group flex items-center text-yellow-500 leading-none dark:text-yellow-400 hover:text-yellow-600"
              @click="confirmLock">
              <!-- Lock Icon -->
              <svg v-show="!post.isLocked" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 sm:w-4 sm:h-4 mr-1"
                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <rect x="5" y="11" width="14" height="10" rx="2"></rect>
                <circle cx="12" cy="16" r="1"></circle>
                <path d="M8 11v-4a4 4 0 0 1 8 0v4"></path>
              </svg>
              <!-- Unlock Icon -->
              <svg v-show="post.isLocked" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 sm:w-4 sm:h-4 mr-1"
                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <rect x="5" y="11" width="14" height="10" rx="2"></rect>
                <circle cx="12" cy="16" r="1"></circle>
                <path d="M8 11v-5a4 4 0 0 1 8 0"></path>
              </svg>
              <span class="hidden sm:inline text-sm font-medium">{{
                post.isLocked ? "Unlock" : "Lock"
              }}</span>
            </button>
          </li>
          <li v-if="canMod && post.isRemoved" class="hidden sm:list-item ml-6">
            <button @click="confirmApprove"
              class="group flex items-center text-green-500 leading-none dark:text-green-400 hover:text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 sm:w-4 sm:h-4 mr-1" width="24" height="24"
                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                <path d="M9 12l2 2l4 -4"></path>
              </svg>
              <span class="hidden sm:inline text-sm font-medium">Approve</span>
            </button>
          </li>
          <li v-if="isCompact && isExpanded" class="ml-3 sm:ml-6">
            <button @click="isExpanded = !isExpanded"
              class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 sm:w-4 sm:h-4 mr-1" width="24" height="24"
                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
                stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M18 10h-4v-4"></path>
                <path d="M20 4l-6 6"></path>
                <path d="M6 14h4v4"></path>
                <path d="M10 14l-6 6"></path>
              </svg>
              <span class="hidden sm:inline text-sm font-medium">Collapse</span>
            </button>
          </li>
        </ul>
      </div>
      <!-- Post Details (compact mode only) -->
      <div v-show="isCompact && !isExpanded" class="ml-auto w-1/6 hidden sm:flex items-center justify-between">
        <div class="flex flex-col flex-grow space-y-2 text-sm text-gray-500">
          <dl class="flex justify-between">
            <dt>Score&nbsp;</dt>
            <dd class="font-medium">{{ post.score + voteType }}</dd>
          </dl>
          <dl class="flex justify-between">
            <dt>Replies&nbsp;</dt>
            <dd class="font-medium">{{ post.commentCount }}</dd>
          </dl>
        </div>
      </div>
      <!-- Last Activity (compact mode only) -->
      <div v-show="isCompact" class="ml-auto w-1/6 hidden sm:flex items-center justify-end"></div>
      <!-- Expand/Collapse button (compact mode only) -->
      <!--<button v-show="isCompact && !isExpanded" @click="isExpanded = !isExpanded" class="mx-3 text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="" width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
          stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M16 4l4 0l0 4"></path>
          <path d="M14 10l6 -6"></path>
          <path d="M8 20l-4 0l0 -4"></path>
          <path d="M4 20l6 -6"></path>
        </svg>
      </button>-->
      <!-- Stretched link (card mode only) -->
      <NuxtLink :to="`${site.enableBoards && post.board ? '/b/' + post.board.name + '/p' : '/p'}/${post.id}/${post.titleChunk}`"
        class="absolute inset-0" :class="{ 'sm:hidden': isCompact }"></NuxtLink>
    </div>
    <!-- Avatar - Desktop Only -->
    <NuxtLink v-if="!!post.creator" v-show="!isCompact"
      :to="`/@${post.creator.name}${post.creator.instance ? '@' + post.creator.instance : ''}`"
      class="z-10 sticky top-28 hidden sm:inline flex-shrink-0 h-full arrow__right">
      <img loading="lazy" :src="post.creator.avatar || 'https://placekitten.com/64/64'" alt="avatar"
        class="w-16 h-16 object-cover rounded" />
    </NuxtLink>
    <div v-else-if="!post.creator" v-show="!isCompact">
      <!-- TODO: Placeholder for deleted accounts here -->
    </div>
  </div>
</template>
<script lang="ts" setup>
// Props
import type { Post } from "@/types/types";
const props = defineProps<{
  post: Post;
  isCompact: boolean;
  boardPage: boolean;
}>();

import { computed } from "vue";
// import { baseURL } from "@/server/constants";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useModalStore } from "@/stores/StoreModal";
import { useToastStore } from "@/stores/StoreToast";
import { formatDate } from "@/utils/formatDate";
import { toPercent } from "@/utils/percent";
import { canEmbedImage } from "@/composables/images";
import { requirePermission } from "@/composables/admin";
import { requireModPermission } from "@/composables/mod";
import { useSiteStore } from "@/stores/StoreSite";
//import { toHexCode } from "@/composables/colors";

// Modals & Toasts
const modalStore = useModalStore();
const toast = useToastStore();

// Authentication
const userStore = useLoggedInUser();
const isAuthed = userStore.isAuthed;
// const authCookie = useCookie("token").value;
const theme = useCookie("theme") || "light";
const site = useSiteStore();

const darkTheme = computed(() => theme.value === 'dark');

// Expand & Collapse
const isExpanded = ref(false);

// Title style
const TITLE_STYLE = {
  default: "font-medium text-gray-900 dark:text-gray-200 visited:text-gray-400 hover:text-secondary",
  pinnedSite: "font-bold text-red-700 dark:text-red-800 visited:text-red-500 hover:text-red-900",
  pinnedBoard: "font-semibold text-green-600 dark:text-green-800 visited:text-green-500 hover:text-green-900"
};

const titleStyle = computed(() => {
  const p = props.post;
  if (p.featuredLocal) {
    return TITLE_STYLE.pinnedSite;
  } else if (p.featuredBoard) {
    return TITLE_STYLE.pinnedBoard;
  } else {
    return TITLE_STYLE.default;
  }
});

// Author
const isAuthor = computed(() => {
  if (!!userStore.user && props.post.creator) {
    return userStore.user.id === props.post.creator.id;
  } else {
    return false;
  }
});

const creatorIsAdmin = (props.post.creator?.adminLevel ?? 0) > 0;

// Admin
/*const isAdmin = computed(() => {
  return !!userStore.user && userStore.user.isAdmin;
});*/

// Can moderate posts
const isMod = requireModPermission(props.post.myModPermissions, "content");
//const isMod = false;
const isAdmin = requirePermission("content");
const canMod = isAdmin || isMod;

// Status
const status = computed(() => {
  if (props.post.isRemoved) {
    return "removed";
  } else if (props.post.isDeleted) {
    return "deleted";
  }
});

// Image
const hasImage = computed(() => props.post.url && canEmbedImage(props.post.url));

// Vote
const voteType = ref(props.post.myVote);
const vote = async (type = 0) => {
  const previousVote = voteType.value;
  voteType.value = voteType.value === type ? 0 : type;
  
  try {
    const { mutate } = useMutation('voteOnPost');
    const result = await mutate({
      id: props.post.id,
      voteType: voteType.value
    });
    
    if (result.data?.voteOnPost) {
      // Update post score from response
      if (props.post.score !== undefined) {
        props.post.score = result.data.voteOnPost.score;
      }
    }
  } catch (error) {
    // Revert failed vote & show error toast
    voteType.value = previousVote;
    toast.addNotification({
      header: "Vote failed",
      message: error.message || "Your vote failed to cast. Please try again.",
      type: "error",
    });
    if (process.dev) console.error(error);
  }
};

// Save
const isSaved = ref(props.post.isSaved);
const isSaveLoading = ref(false);
const save = async () => {
  const previousSaveState = isSaved.value;
  isSaved.value = !isSaved.value;
  isSaveLoading.value = true;

  try {
    const { mutate } = useMutation('savePost');
    const result = await mutate({
      postId: props.post.id,
      save: isSaved.value
    });

    if (result.data?.savePost) {
      // Update the post's save status from the response
      isSaved.value = result.data.savePost.isSaved;
    }
  } catch (error) {
    // Revert failed save & show error toast
    isSaved.value = previousSaveState;
    toast.addNotification({
      header: "Save failed",
      message: error.message || "Failed to save the post. Please try again.",
      type: "error",
    });
    if (process.dev) console.error(error);
  } finally {
    isSaveLoading.value = false;
  }
};

// Delete
const confirmDelete = () => {
  modalStore.setModal({
    modal: "ModalDelete",
    id: props.post.id,
    contentType: "post",
    isOpen: true,
  });
};


// Sticky
const confirmSticky = () => {
  modalStore.setModal({
    modal: "ModalSticky",
    id: props.post.id,
    isOpen: true,
    contentType: "post",
    options: {
      isSitePinned: props.post.featuredLocal,
      isBoardPinned: props.post.featuredBoard,
      board: props.post.board,
      isMod
    },
  });
};

// Report
const confirmReport = () => {
  modalStore.setModal({
    modal: "ModalReport",
    id: props.post.id,
    isOpen: true,
    contentType: "post"
  });
};

// Remove
const confirmRemove = () => {
  modalStore.setModal({
    modal: "ModalRemoveOrApprove",
    id: props.post.id,
    isOpen: true,
    contentType: "post",
    options: {
      approve: false
    }
  });
};

// Lock
const confirmLock = () => {
  modalStore.setModal({
    modal: "ModalLock",
    id: props.post.id,
    isOpen: true,
    contentType: "post",
    options: {
      isLocked: props.post.isLocked,
    },
  });
};

// Remove
const confirmApprove = () => {
  modalStore.setModal({
    modal: "ModalRemoveOrApprove",
    id: props.post.id,
    isOpen: true,
    contentType: "post",
    options: {
      approve: true
    }
  });
};

// Options
const openOptions = () => {
  modalStore.setModal({
    modal: "ModalOptions",
    id: props.post.id,
    contentType: "post",
    isOpen: true,
    options: {
      object: props.post
    }
  });
};

// Utils
const percentUpvoted = computed(() => {
  const num = 1 - props.post.downvotes / props.post.upvotes;
  if (!isFinite(num)) return 0;
  return toPercent(num);
});
</script>
<style scoped>
.border-inherit {
  border-radius: inherit;
}

.arrow__right::before {
  content: "";
  position: absolute;
  top: 26px;
  right: -23px;
  display: block;
  width: 12px;
  height: 12px;
  background-color: #ffffff;
  transform: rotate(45deg);
  @apply border-l border-b;
}

.card:hover+.arrow__right::before {
  @apply bg-gray-50
}

.removed>div,
.removed .arrow__right::before {
  @apply bg-red-100 border-red-300;
}

.deleted>div,
.deleted .arrow__right::before {
  @apply bg-yellow-100 border-yellow-300 opacity-70 pointer-events-none;
}

.overlay {
  -webkit-mask-image: linear-gradient(180deg, #000 65%, transparent);
  mask-image: linear-gradient(180deg, #000 65%, transparent);
}

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
