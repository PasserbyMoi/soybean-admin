<script setup lang="ts">
import type { DashboardNoticeResp } from '@/apis/common/type';

interface Props {
  list?: DashboardNoticeResp[];
}
const props = defineProps<Props>();

const emit = defineEmits<Emits>();
interface Emits {
  (e: 'read', val: number): void;
}
</script>

<template>
  <NScrollbar class="h-400px">
    <NList hoverable clickable>
      <NListItem v-for="item in props.list" :key="item.id" @click="emit('read', item.id)">
        <NThing content-indented :class="{ 'opacity-30': item.id > 10 }">
          <template #header>
            <NEllipsis :line-clamp="1">
              {{ item.title }}
            </NEllipsis>
          </template>
          <!--
 <template v-if="item.type" #header-extra>
            <NTag
              :bordered="false"
              :type="{{ item.type === 1 'primary' : item.type === 2 ? 'waring' : '' }}"
              size="small"
            >
              {{ item.type }}
            </NTag>
          </template>
          <template v-if="item.description" #description>
            <NEllipsis :line-clamp="2">
              {{ item.description }}
            </NEllipsis>
          </template>
          <template #footer>
            {{ item.date }}
          </template>
-->
        </NThing>
      </NListItem>
    </NList>
  </NScrollbar>
</template>

<style scoped></style>
