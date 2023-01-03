<template>
      <div class="py-24">
            {{ text }}
      </div>
</template>

<script setup>
      const text = ref(null);

      useFetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(({ data, error }) => {
            if (data.value) {
                  text.value = data.value
            }
      });
</script>