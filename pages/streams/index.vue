<template>
  <StreamDashboard :current-user-id="currentUser?.id" />
</template>

<script setup lang="ts">
import StreamDashboard from '@/components/streams/StreamDashboard.vue'

definePageMeta({
  layout: 'default',
  hasAuthRequired: true
})

const authStore = useLoggedInUser()
const currentUser = computed(() => authStore.user)

useHead({
  title: 'My Streams',
  meta: [
    {
      name: 'description',
      content: 'Manage your custom content feeds and streams'
    }
  ]
})
</script>
