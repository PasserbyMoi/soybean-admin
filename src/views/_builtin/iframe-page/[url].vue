<script setup lang="ts">
interface Props {
  url: string;
}

const props = defineProps<Props>();

onMounted(() => {
  console.log('mounted');
});

onActivated(() => {
  console.log('activated');
});
</script>

<template>
  <div class="h-full">
    <iframe id="iframePage" class="size-full" :src="url"></iframe>
  </div>
</template>

<style scoped></style>
