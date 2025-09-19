<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const route = useRoute();
const router = useRouter();

console.log(`Hi from ${route.path}`);

onMounted(() => {
  // Redirect to submit page when pasting URL
  if (process.client && typeof document !== 'undefined') {
    document.addEventListener('paste', async function (event) {
      const isNothingFocused = document.activeElement === document.body;

      if (isNothingFocused) {
        const board = route.params?.board;
        const clipText = event.clipboardData?.getData('Text');
        const url = new RegExp('^(?:[a-z]+:)?//', 'i');

        if (clipText && url.test(clipText) && route.name !== 'submit' && !board) {
          await navigateTo(`/submit?url=${encodeURIComponent(clipText)}`)
        }
        else if (clipText && url.test(clipText) && route.name !== 'submit' && !!board) {
          await navigateTo(`/submit?url=${encodeURIComponent(clipText)}&board=${board}`)
        }
      }
    });
  }
});
</script>
