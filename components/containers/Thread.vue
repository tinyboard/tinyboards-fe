<template>
  <div class="relative w-full flex flex-col sm:space-y-6">
    <!-- Pinned Banner: Site-wide admin pin -->
    <div v-if="post.featuredLocal"
      class="order-2 sm:order-first flex items-center justify-center sm:justify-start mt-2.5 sm:my-0 p-2.5 text-center sm:text-left text-red-900 bg-red-100 border-y sm:border-x border-red-300 sm:rounded-md sm:shadow-inner-white">
      <svg xmlns="http://www.w3.org/2000/svg" class="hidden sm:inline opacity-50 w-5 h-5 ml-1.5 mr-4"
        viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
        stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4"></path>
        <line x1="9" y1="15" x2="4.5" y2="19.5"></line>
        <line x1="14.5" y1="4" x2="20" y2="9.5"></line>
      </svg>
      <div>
        <strong>Pinned to {{ site.name }}</strong>
        <br />
        <p class="text-sm text-red-800">
          This post was pinned to {{ site.name }} by the admins. It might be of importance.
        </p>
      </div>
    </div>
    <!-- Pinned Banner: Board pin -->
    <div v-if="post.featuredBoard"
      class="order-2 sm:order-first flex items-center justify-center sm:justify-start mt-2.5 sm:my-0 p-2.5 text-center sm:text-left text-green-900 bg-green-100 border-y sm:border-x border-green-300 sm:rounded-md sm:shadow-inner-white">
      <svg xmlns="http://www.w3.org/2000/svg" class="hidden sm:inline opacity-50 w-5 h-5 ml-1.5 mr-4"
        viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
        stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4"></path>
        <line x1="9" y1="15" x2="4.5" y2="19.5"></line>
        <line x1="14.5" y1="4" x2="20" y2="9.5"></line>
      </svg>
      <div>
        <strong>Pinned to {{ board?.name || post.board?.name }}</strong>
        <br />
        <p class="text-sm text-green-800">
          This post was pinned to {{ board?.name || post.board?.name }} by the board mods. Maybe you should read it.
        </p>
      </div>
    </div>
    <!-- Deleted/Removed Banner -->
    <div v-if="post.isDeleted || post.isRemoved"
      class="order-2 sm:order-first flex items-center justify-center sm:justify-start mt-2.5 sm:my-0 p-2.5 text-center sm:text-left text-red-900 bg-red-100 border-y sm:border-x border-red-300 sm:rounded-md sm:shadow-inner-white">
      <svg xmlns="http://www.w3.org/2000/svg"
        class="icon icon-tabler icon-tabler-trash hidden sm:inline opacity-50 w-5 h-5 ml-1.5 mr-4" width="24"
        height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
        stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M4 7l16 0"></path>
        <path d="M10 11l0 6"></path>
        <path d="M14 11l0 6"></path>
        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
      </svg>
      <div>
        <strong>This post was {{ post.isDeleted ? 'deleted by its creator' : 'removed by moderators' }}</strong>
        <br />
        <p class="text-sm text-red-800">
          {{
            post.isDeleted
              ? "This post doesn't appear on any feeds and cannot be interacted with."
              : "Moderators have removed this post. It doesn't appear on any feeds, and all interactions with it have been \
          locked."
          }}
        </p>
      </div>
    </div>
    <!-- Locked Banner -->
    <div v-if="post.isLocked"
      class="order-2 sm:order-first flex items-center justify-center sm:justify-start mt-2.5 sm:my-0 p-2.5 text-center sm:text-left text-yellow-900 bg-yellow-100 border-y sm:border-x border-yellow-300 sm:rounded-md sm:shadow-inner-white">
      <svg xmlns="http://www.w3.org/2000/svg" class="hidden sm:inline opacity-50 w-5 h-5 ml-1.5 mr-4"
        viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round"
        stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <rect x="5" y="11" width="14" height="10" rx="2"></rect>
        <circle cx="12" cy="16" r="1"></circle>
        <path d="M8 11v-4a4 4 0 0 1 8 0v4"></path>
      </svg>
      <div>
        <strong>Post locked</strong>
        <br />
        <p class="text-sm text-yellow-800">
          This post was locked by the mods. Replying is disabled.
        </p>
      </div>
    </div>
    <!-- Post -->
    <div class="sm:order-2 w-full sm:p-4 border-b sm:border sm:shadow-inner-xs sm:rounded-md"
      :class="post.isRemoved ? 'bg-red-500 bg-opacity-20' : 'bg-white'">
      <!-- Post Meta Information & Content -->
      <div
        class="flex flex-shrink-0 items-center justify-between p-2.5 sm:p-0 border-b sm:border-0 dark:border-gray-700 dark:border-opacity-70">
        <div class="flex items-center w-full overflow-x-auto">
          <!-- Avatar -->
          <NuxtLink v-if="post.creator" :to="`/@${post.creator.name}`">
            <CardsAvatar :src="post.creator.avatar" alt="avatar" size="sm" class="!w-9 !h-9" />
          </NuxtLink>
          <!-- Deleted User -->
          <CardsAvatar v-else :src="null" alt="avatar" size="sm" class="!w-9 !h-9" />
          <div class="flex flex-col leading-normal ml-2">
            <NuxtLink v-if="post.creator"
              :to="`/@${post.creator.name}${post.creator.instance ? '@' + post.creator.instance : ''}`"
              class="flex items-center text-sm">
              <!-- Username -->
              <strong>{{ post.creator.displayName ?? post.creator.name }}</strong>
              <span v-if="post.creator.instance">@{{ post.creator.instance }}</span>
              <!-- User Flairs -->
              <FlairDisplayUserFlair
                v-if="post.creator"
                :user="post.creator"
                :board-id="post.boardId"
                :size="'xs'"
                class="ml-1"
              />
              <!-- Role -->
              <svg v-if="post.creator.isAdmin" xmlns="http://www.w3.org/2000/svg" class="inline-block w-4 h-4 ml-1 text-red-600" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" title="Admin">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
              </svg>
            </NuxtLink>
            <span v-else class="text-sm text-gray-400 dark:text-gray-400 font-bold">
              deleted user
            </span>
            <p class="flex items-center space-x-2 text-sm text-gray-400">
              <!-- Timestamp -->
              <span>{{ formatDate(new Date(post.creationDate)) }}</span>
              <span v-if="post.edited_date">
                <span class="font-black text-gray-400 dark:text-gray-500">·</span>
                <span class="pl-1 italic">
                  Edited {{ formatDate(new Date(post.updated)) }}
                </span>
              </span>
              <!-- Ratio -->
              <span>
                <span class="font-black text-gray-400 dark:text-gray-500">·</span>
                <span class="pl-2"> {{ percentUpvoted }}% upvoted </span>
              </span>
              <!-- Report count -->
              <span v-if="post.reportCount">
                <span class="font-black text-gray-400 dark:text-gray-500">·</span>
                <span class="pl-2 text-yellow-600 dark:text-yellow-700"> {{ post.reportCount }} report(s) </span>
              </span>
              <!-- Tags -->
              <span v-if="post.isNSFW" title="This post is marked 18+">
                <span class="font-black text-gray-400 dark:text-gray-500">·</span>
                <span class="badge badge-red">18+</span>
              </span>
            </p>
          </div>
        </div>
        <div class="hidden md:block">
          <!-- External Link Icon -->
          <a v-if="post.url && post.type === 'link'" :href="post.url" target="_blank" class="block">
            <i class="far fa-external-link text-gray-400"></i>
          </a>
        </div>
        <button class="flex items-center justify-center md:hidden -mr-1 p-1 text-gray-600 dark:text-gray-400">
          <i class="far fa-ellipsis-h fa-fw fa-lg"></i>
        </button>
      </div>
      <!-- Post Content -->
      <div class="px-2.5 sm:px-0 mt-2.5 sm:mt-4">
        <!-- Title -->
        <div class="flex flex-wrap items-center gap-2">
          <NuxtLink :external="!!post.url"
            :to="!!post.url ? post.url : (post.urlPath || `${site.enableBoards ? '/b/' + (post.board?.name || '') + '/p' : '/p'}/${post.id}/${post.slug || post.titleChunk || 'post'}`)"
            :target="post.url ? '_blank' : null" class="text-lg md:text-xl font-medium dark:text-gray-100">
            {{ post.title }}
          </NuxtLink>
          <!-- Post Flair Display -->
          <FlairDisplayPostFlair
            v-if="post.flairs && post.flairs.length > 0"
            :post="post"
            size="md"
            :clickable="true"
            :editable="true"
          />
        </div>
      </div>
      <!-- Post Embed -->
      <div class="px-2.5 sm:px-0 mt-2.5 sm:mt-4" v-if="post.url && post.type !== 'image'">
        <!-- <LinkPreview
				:domain="'post.domain placeholder'"
				:title="'post.metaTitle placeholder'"
				:thumbnail="'post.thumbUrl placeholder'"
				:url="post.url"
				:preview="'post.metaDescription placeholder'"
				/> -->
      </div>
      <!-- Post Image -->
      <div v-if="hasImage || hasUploadedImage" class="mt-2.5 md:mt-4">
        <span class="inline-block p-2.5 bg-white border shadow-polaroid">
          <img :src="post.url || post.image" alt="Post image" class="sm:max-w-xs object-cover img-expand" />
        </span>
      </div>
      <!-- Uploaded Video -->
      <div v-if="hasUploadedVideo && !!post.image" class="mt-2.5 md:mt-4">
        <video :src="post.image" controls class="w-full max-w-2xl rounded shadow-lg bg-black">
          Your browser does not support the video tag.
        </video>
      </div>
      <!-- Embedded Video (YouTube, Vimeo, etc) -->
      <div v-else-if="hasVideo && !!post.url && videoEmbedProps" class="mt-2.5 md:mt-4">
        <!-- YouTube -->
        <lite-youtube
          v-if="videoEmbedProps.component === 'lite-youtube'"
          :videoid="videoEmbedProps.props.videoid"
          :playlabel="videoEmbedProps.props.playlabel"
          class="max-w-full"
        />
        <!-- Vimeo/Twitch -->
        <iframe
          v-else-if="videoEmbedProps.component === 'iframe'"
          :src="videoEmbedProps.props.src"
          :frameborder="videoEmbedProps.props.frameborder"
          :allow="videoEmbedProps.props.allow"
          :allowfullscreen="videoEmbedProps.props.allowfullscreen"
          :scrolling="videoEmbedProps.props.scrolling"
          class="w-full max-w-2xl aspect-video rounded"
        />
        <!-- Link to original -->
        <div class="mt-2 text-sm">
          <a :href="post.url" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            {{ post.url }}
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 inline ml-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5"></path>
              <line x1="10" y1="14" x2="20" y2="4"></line>
              <polyline points="15,4 20,4 20,9"></polyline>
            </svg>
          </a>
        </div>
      </div>
      <!-- Post Edit Form -->
      <LazyInputsEdit v-if="isEditing" :id="post.id" :body="post.body" @closed="isEditing = false" @has-edited="(editResp) => {
        post.bodyHTML = editResp.bodyHTML;
        post.body = editResp.body;
      }" class="mt-4" />
      <!-- Post Text Body -->
      <div v-if="post.bodyHTML" v-show="!isEditing" class="px-2.5 sm:px-0 mt-3 sm:mt-4 relative overflow-hidden">
        <div class="prose prose-sm max-w-none" v-html="post.bodyHTML"></div>
      </div>
      <!-- Reports -->
      <div v-if="post.reportCount" class="mt-3">
        <CardsReports :id="post.id" />
      </div>
      <!-- Footer -->
      <div v-show="!isEditing" class="flex justify-between items-center px-2.5 py-4 sm:px-0 sm:py-0 mt-3 sm:mt-6">
        <!-- Actions -->
        <ul class="flex flex-grow items-center">
          <li class="group flex items-center space-x-2 leading-none text-sm font-medium">
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
              {{ displayScore }}
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
          <li class="ml-3 sm:ml-6">
            <NuxtLink to="#"
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
                class="w-6 h-6 sm:w-4 sm:h-4 mr-1"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"
                ></path>
                <rect x="9" y="3" width="6" height="4" rx="2"></rect>
              </svg>
              <span class="hidden sm:inline text-sm font-medium">Copy link</span>
            </button>
          </li>-->
          <li v-if="isAuthed && !isAuthor" class="ml-3 sm:ml-6">
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
          <li v-if="isAuthed && !isAuthor && !canMod" class="hidden sm:list-item">
            <button class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-700"
              @click="confirmReport">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 sm:w-4 sm:h-4 mr-1" viewBox="0 0 24 24"
                stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M5 14h14l-4.5 -4.5l4.5 -4.5h-14v16"></path>
              </svg>
              <span class="hidden sm:inline text-sm font-medium">Report</span>
            </button>
          </li>
          <li v-if="isAuthor" class="ml-3 sm:ml-6">
            <button class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-600"
              @click="isEditing = !isEditing">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 sm:w-4 sm:h-4 mr-1" viewBox="0 0 24 24"
                stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
                <path d="M16 5l3 3"></path>
              </svg>
              <span class="hidden sm:inline text-sm font-medium">Edit</span>
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
          <li v-if="isAuthor" class="hidden sm:list-item ml-6">
            <button class="group flex items-center text-gray-500 leading-none dark:text-gray-400 hover:text-gray-600"
              @click="confirmDelete">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 sm:w-4 sm:h-4 mr-1" viewBox="0 0 24 24"
                stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <line x1="4" y1="7" x2="20" y2="7"></line>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
              </svg>
              <span class="hidden sm:inline text-sm font-medium">Delete</span>
            </button>
          </li>
          <li v-if="(isMod && !post.featuredLocal) || isAdmin" class="hidden sm:list-item ml-6">
            <button class="group flex items-center leading-none"
              :class="[isMod ? 'text-green-500 dark:text-green-400 hover:text-green-600' : 'text-red-500 dark:text-red-400 hover:text-red-600']"
              @click="confirmSticky">
              <!-- Pin Icon -->
              <svg v-show="!(post.featuredLocal || post.featuredBoard)" xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 sm:w-4 sm:h-4 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4"></path>
                <line x1="9" y1="15" x2="4.5" y2="19.5"></line>
                <line x1="14.5" y1="4" x2="20" y2="9.5"></line>
              </svg>
              <!-- Pin Off Icon -->
              <svg v-show="post.featuredLocal || post.featuredBoard" xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 mr-1" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                stroke-linecap="round" stroke-linejoin="round">
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
          <li v-if="canMod" class="hidden sm:list-item ml-6">
            <button
              class="group flex items-center text-yellow-500 leading-none dark:text-gray-400 hover:text-yellow-600"
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
          <li v-if="canMod && (post.isRemoved || post.reportCount)" class="hidden sm:list-item ml-6">
            <button class="group flex items-center text-green-500 leading-none dark:text-gray-400 hover:text-green-600"
              @click="confirmApprove">
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
          <li v-if="canMod && !post.isRemoved" class="hidden sm:list-item ml-6">
            <button class="group flex items-center text-red-500 leading-none dark:text-gray-400 hover:text-red-600"
              @click="confirmRemove">
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
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  comments: {
    type: Array,
    required: true,
  },
});

import { computed } from "vue";
// import { baseURL } from "@/server/constants";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useAPI } from "@/composables/api";
import { useBoardStore } from "@/stores/StoreBoard";
import { useModalStore } from "@/stores/StoreModal";
import { useToastStore } from "@/stores/StoreToast";
import { formatDate } from "@/utils/formatDate";
import { toPercent } from "@/utils/percent";
import { canEmbedImage } from "@/composables/images";
import { canEmbedVideo, getVideoEmbedProps } from "@/composables/videos";
import { requirePermission } from "@/composables/admin";
import { requireModPermission } from "@/composables/mod";
import { useSiteStore } from "@/stores/StoreSite";
import { useGraphQLMutation } from '@/composables/useGraphQL';

const modalStore = useModalStore();
const toast = useToastStore();

const route = useRoute();
const userStore = useLoggedInUser();
const boardStore = useBoardStore();
const site = useSiteStore();
const board = boardStore.board;
const modPermissions = board?.myModPermissions || 0;

const isAuthed = userStore.isAuthed;

// Vote
const voteType = ref(props.post.myVote);
const vote = async (type = 0) => {
  const previousVote = voteType.value;
  voteType.value = voteType.value === type ? 0 : type;

  try {
    const { data: result } = await useGraphQLMutation(`
      mutation voteOnPost($id: Int!, $voteType: Int!) {
        voteOnPost(id: $id, voteType: $voteType) {
          score
          upvotes
          downvotes
          myVote
          creatorVote
        }
      }
    `, {
      variables: {
        id: props.post.id,
        voteType: voteType.value
      }
    });

    if (result.value?.voteOnPost) {
      // Update post score from response
      if (props.post.score !== undefined) {
        props.post.score = result.value.voteOnPost.score;
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
    console.error(error);
  }
};

// Save
const isSaved = ref(props.post.isSaved || props.post.saved);
const isSaveLoading = ref(false);
const save = async () => {
  const previousSaveState = isSaved.value;
  isSaved.value = !isSaved.value;
  isSaveLoading.value = true;

  try {
    const { data: result } = await useGraphQLMutation(`
      mutation savePost($postId: Int!, $save: Boolean!) {
        savePost(postId: $postId, save: $save) {
          isSaved
        }
      }
    `, {
      variables: {
        postId: props.post.id,
        save: isSaved.value
      }
    });

    if (result.value?.savePost) {
      // Update the post's save status from the response
      isSaved.value = result.value.savePost.isSaved;
    }
  } catch (error) {
    // Revert failed save & show error toast
    isSaved.value = previousSaveState;
    toast.addNotification({
      header: "Save failed",
      message: error.message || "Failed to save the post. Please try again.",
      type: "error",
    });
    console.error(error);
  } finally {
    isSaveLoading.value = false;
  }
};

// Comments
const onCommentPublished = (comment: Comment) => {
  props.comments.unshift(comment);
};

// Display score with conditional author vote
const displayScore = computed(() => {
  const baseScore = props.post.score ?? 0;
  if (isAuthor.value) {
    // Author viewing their own post - add their current vote to base score
    return baseScore + voteType.value;
  }
  // Non-author viewing post - add author's actual vote from creatorVote field
  return baseScore + (props.post.creatorVote ?? 1);
});

// Utils
const percentUpvoted = computed(() => {
  const upvotes = props.post.upvotes ?? 0;
  const downvotes = props.post.downvotes ?? 0;
  const total = upvotes + downvotes;
  if (total === 0) return 0;
  return toPercent(upvotes / total);
});

const hasImage = computed(() => props.post.url && canEmbedImage(props.post.url));
const hasUploadedImage = computed(() => {
  if (!props.post.image) return false;
  return /\.(jpe?g|png|gif|webp)$/i.test(props.post.image);
});

// Video
const hasVideo = computed(() => props.post.url && canEmbedVideo(props.post.url));
const hasUploadedVideo = computed(() => {
  if (!props.post.image) return false;
  return /\.(mp4|webm|mov|3gp|m4v|mpeg|mpg|ogv|avi|mkv)$/i.test(props.post.image);
});
const videoEmbedProps = computed(() => hasVideo.value ? getVideoEmbedProps(props.post.url) : null);

// Author
const isAuthor = computed(() => {
  if (userStore.user && props.post.creator) {
    return userStore.user.name === props.post.creator.name;
  } else {
    return false;
  }
});

// Admin
const isMod = requireModPermission(modPermissions, "content");
const isAdmin = requirePermission("content");
const canMod = isAdmin || isMod;

// Edit
const isEditing = ref(false);

// Delete
const confirmDelete = () => {
  modalStore.setModal({
    modal: "ModalDelete",
    id: props.post.id,
    contentType: "post",
    isOpen: true,
  });
};

// Report
const confirmReport = () => {
  modalStore.setModal({
    modal: "ModalReport",
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
    options: {
      isSitePinned: props.post.featuredLocal,
      isBoardPinned: props.post.featuredBoard,
      board: props.post.board,
      isMod
    },
  });
};

// Lock
const confirmLock = () => {
  modalStore.setModal({
    modal: "ModalLock",
    id: props.post.id,
    isOpen: true,
    options: {
      isLocked: props.post.isLocked,
    },
  });
};

// Remove
const confirmRemove = () => {
  modalStore.setModal({
    modal: "ModalRemoveOrApprove",
    id: props.post.id,
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
    id: props.post.id,
    isOpen: true,
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

/* Preserve emoji styling within prose content */
.prose :deep(img.emoji) {
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  max-width: 1.5em;
  vertical-align: text-bottom;
  margin: 0 0.1em;
  object-fit: contain;
  background: transparent;
  aspect-ratio: 1;
}
</style>
