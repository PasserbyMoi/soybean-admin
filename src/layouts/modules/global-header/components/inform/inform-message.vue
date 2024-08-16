<script setup lang="ts">
import { type MessageResp, listCommonDict } from '@/apis';
import { useRouterPush } from '@/hooks/common/router';

interface Props {
  list?: MessageResp[];
}
const props = defineProps<Props>();
const routerPush = useRouterPush();
const messageType = ref();

interface Emits {
  (e: 'read', item?: MessageResp): void;
}
const emit = defineEmits<Emits>();

function viewMore() {
  routerPush.routerPushByKey('setting_message');
}

onMounted(() => {
  listCommonDict('message_type').then(res => {
    messageType.value = res.data;
  });
});
</script>

<template>
  <NScrollbar class="max-h-580px">
    <NList clickable size="small">
      <NListItem v-for="item in props.list" :key="item.id" size="small" @click="viewMore()">
        <NThing :title="item.title" size="small" content-indented>
          <template #header-extra>
            <TableTag :value="item.type" :options="messageType" round size="small" class="text-size-0.7rem"></TableTag>
          </template>
          <template #header>
            <NEllipsis :line-clamp="1" :class="{ 'opacity-60': item.isRead }" class="max-w-200px font-size-0.9rem">
              {{ item.title }}
            </NEllipsis>
          </template>
          <template #description>
            <NEllipsis
              :line-clamp="1"
              :tooltip="false"
              :class="{ 'opacity-50': item.isRead }"
              class="max-w-300px font-size-0.8rem"
            >
              {{ item.content }}
            </NEllipsis>
          </template>
          <NFlex justify="space-between">
            <NText :depth="3" class="justify-items-end font-size-12px">{{ item.createTime }}</NText>
            <NButton text type="primary" :disabled="item.isRead" @click="emit('read', item)">
              {{ $t('common.read.read') }}
            </NButton>
          </NFlex>
        </NThing>
      </NListItem>
    </NList>
    <NDivider class="!mb-8px !mt-0" />
    <NFlex justify="space-between" class="m-4px mt-10px">
      <NButton text :focusable="false" size="small" type="primary" @click="viewMore()">
        {{ $t('common.read.viewMore') }}
      </NButton>
      <NPopconfirm @positive-click="emit('read')">
        <template #trigger>
          <NButton text :focusable="false" size="small" type="primary">{{ $t('common.read.allRead') }}</NButton>
        </template>
        {{ $t('common.confirmOperations', { name: $t('common.read.allRead') }) }}
      </NPopconfirm>
    </NFlex>
  </NScrollbar>
</template>

<style scoped></style>
