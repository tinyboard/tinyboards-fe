<template>
  <StreamDashboard />
</template>

<script setup lang="ts">
import StreamDashboard from '@/components/streams/StreamDashboard.vue'

definePageMeta({
  layout: 'default',
  hasAuthRequired: true
})

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
