<template>
      <NuxtLayout name="debug">
            {{ JSON.stringify(v) }}
      </NuxtLayout>
</template>

<script setup>
      import { useLoggedInUser } from '@/stores/StoreAuth';

      const userStore = useLoggedInUser();

      const v = userStore.user;
</script>