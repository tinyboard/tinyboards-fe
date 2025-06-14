<template>
  <div id="banner"
    class="relative flex items-center justify-between p-4 sm:px-12 sm:py-10 bg-gray-200/50 sm:rounded-md bg-cover bg-center overflow-hidden"
    :style="{ backgroundImage: `url(${imageUrl})` }">
    <div class="relative overflow-hidden">
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
