<script setup lang="ts">
  defineProps<{ currentTab?: 'music' | 'movies' }>()
</script>

<template>
  <div class="grid w-fit gap-8">
    <div class="flex w-full justify-around gap-4 pb-2">
      <FormsUpload :current-tab="currentTab" />
      <UploadList :current-tab="currentTab" />
    </div>
  </div>
</template>
