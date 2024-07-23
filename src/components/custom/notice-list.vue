<script setup lang="ts">
interface Props {
  list?: Api.SystemManage.Message[];
}
const props = defineProps<Props>();

const emit = defineEmits<Emits>();
interface Emits {
  (e: 'read', val: number): void;
}
</script>

<template>
  <NScrollbar style="height: 400px">
    <NList hoverable clickable>
      <NListItem v-for="item in props.list" :key="item.id" @click="emit('read', item.id)">
        <NThing content-indented :class="{ 'opacity-30': item.isRead }">
          <template #header>
            <NEllipsis :line-clamp="1">
              {{ item.title }}
            </NEllipsis>
          </template>
          <template #avatar>
            <NovaIcon :icon="item.icon" :size="30" class="c-primary" />
          </template>
          <template v-if="item.tagTitle" #header-extra>
            <NTag :bordered="false" :type="item.tagType" size="small">
              {{ item.tagTitle }}
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
        </NThing>
      </NListItem>
    </NList>
  </NScrollbar>
</template>

<style scoped></style>
