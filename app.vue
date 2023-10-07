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
  document.addEventListener('paste', function (event) {
    const isNothingFocused = document.activeElement === document.body;

    if (isNothingFocused) {
      const board = route.params.board;
      const clipText = event.clipboardData.getData('Text');
      const url = new RegExp('^(?:[a-z]+:)?//', 'i');

      if (url.test(clipText) && route.name !== 'submit' && !board) {
        console.log('pasted')
        router.push(`/submit?url=${clipText}`)
      }
      else if (url.test(clipText) && route.name !== 'submit' && !!board) {
        console.log('pasted')
        router.push(`/+${board}/submit?url=${clipText}`)
      }
    }
  });
});
</script>
