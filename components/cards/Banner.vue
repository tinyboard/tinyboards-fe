<template>
  <div id="banner"
    class="relative flex items-center justify-between p-4 sm:px-12 sm:py-10 bg-gray-200/50 sm:rounded-md overflow-hidden"
    :class="iconType ? '' : 'bg-cover bg-center'"
    :style="iconType ? {} : { backgroundImage: `url(${imageUrl})` }">
    <!-- Gradient background for icon mode -->
    <div v-if="iconType" class="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary to-primary-hover"></div>

    <!-- SVG Icon -->
    <div v-if="iconType" class="relative z-10 flex-shrink-0 mr-6 text-white/30">
      <!-- Posts Icon -->
      <svg v-if="iconType === 'posts'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 sm:w-20 sm:h-20">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>

      <!-- Comments Icon -->
      <svg v-else-if="iconType === 'comments'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 sm:w-20 sm:h-20">
        <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>

      <!-- Users Icon -->
      <svg v-else-if="iconType === 'users'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 sm:w-20 sm:h-20">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>

      <!-- Boards Icon -->
      <svg v-else-if="iconType === 'boards'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 sm:w-20 sm:h-20">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
      </svg>
    </div>

    <div class="relative overflow-hidden" :class="iconType ? 'z-10' : ''">
      <h1 class="text-2xl sm:text-3xl text-gray-100 font-bold">
        {{ title }}
      </h1>
      <p class="mt-2 text-base text-gray-200 truncate text-ellipsis max-w-md sm:max-w-2xl">
        {{ subTitle }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    default: "Feed",
  },
  subTitle: {
    type: String,
    default: "Welcome to the awesome and exciting front page.",
  },
  imageUrl: {
    type: String,
    default: "./img/artwork/front-page.jpeg",
  },
  iconType: {
    type: String as () => 'posts' | 'comments' | 'users' | 'boards' | undefined,
    default: undefined,
  },
});
</script>

<style scoped>
#banner::before {
  content: "";
  background: rgba(0, 0, 0, 0.9);
  background: linear-gradient(180deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(0, 0, 0, 0.7) 80%);
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

/* add this class to the banner during Christmas season :3 */
.lights::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 57px;
  width: 100%;
  background: url(https://i.imgur.com/BdGY6tH.png);
  animation: lights 1s infinite steps(2);
  pointer-events: none;
}

@keyframes lights {
  0% {
    /*Two zeros, not one !!*/
    /*[0] is equivalent to [0 50%] and will create a different animation */
    background-position: 0 0;
  }

  100% {
    background-position: 0 -138px;
  }
}
</style>
