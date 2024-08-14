<script setup lang="ts">
import { useConfigStore } from '@/store/modules/config';

defineOptions({
  name: 'GlobalLogo'
});

interface Props {
  /** Whether to show the title */
  showTitle?: boolean;
}

withDefaults(defineProps<Props>(), {
  showTitle: true
});

const configStore = useConfigStore();
</script>

<template>
  <RouterLink to="/" class="w-full flex-center nowrap-hidden">
    <!-- <SystemLogo class="text-32px text-primary" /> -->
    <NAvatar :src="configStore.getLogo()" color="#00000000"></NAvatar>
    <h2 v-show="showTitle" class="pl-8px text-16px text-primary font-bold transition duration-300 ease-in-out">
      {{ configStore.getTitle() }}
    </h2>
  </RouterLink>
</template>

<style scoped></style>
