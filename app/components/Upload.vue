<script setup lang="ts">
  defineProps<{ currentTab?: 'music' | 'movies' }>()
</script>

<template>
  <div class="grid w-full gap-8">
    <FormsUpload :current-tab="currentTab" />
    <UploadList :current-tab="currentTab" />
  </div>
</template>
