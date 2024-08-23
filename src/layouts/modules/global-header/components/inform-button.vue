<script setup lang="tsx">
import _ from 'lodash';
import { $t } from '@/locales';
import type { DashboardNoticeResp, MessageResp } from '@/apis';
import { listDashboardNotice, listMessage, readMessage } from '@/apis';
import InformMessage from './inform/inform-message.vue';
import InformNotice from './inform/inform-notice.vue';

const noticeList = ref<DashboardNoticeResp[]>([]);
const messageList = ref<MessageResp[]>([]);
const messageCount = computed(() => {
  return messageList.value.filter(o => !o.isRead).length;
});

const getDataList = async () => {
  const { data, error } = await listDashboardNotice();
  if (!error) {
    noticeList.value = data;
  }
};

const getMessageList = async () => {
  const { data, error } = await listMessage({ page: 1, size: 1000, isRead: false });
  if (!error) {
    messageList.value = data.list;
  }
};

async function handleRead(item?: MessageResp) {
  const { error } = await readMessage(item?.id);
  if (!error) {
    if (item) {
      item.isRead = true;
    } else {
      messageList.value.forEach(element => {
        element.isRead = true;
      });
    }
  }
}

onMounted(() => {
  getDataList();
  getMessageList();
});
</script>

<template>
  <NPopover placement="bottom" trigger="click" scrollable arrow-point-to-center class="!p-0">
    <template #trigger>
      <NBadge :value="messageCount" dot :offset="[-16, 14]">
        <ButtonIcon :tooltip-content="$t('icon.notifications')">
          <icon-icon-park-outline:remind />
        </ButtonIcon>
      </NBadge>
    </template>
    <NTabs default-value="message" type="line" size="small" animated justify-content="space-evenly" class="w-300px">
      <NTabPane key="message" name="message">
        <template #tab>
          <NSpace class="w-130px" justify="center">
            {{ $t('page.home.message') }}
            <NBadge type="error" :value="messageCount" :max="99" />
          </NSpace>
        </template>
        <NEmpty v-if="messageList?.length === 0">暂无{{ $t('page.home.message') }}</NEmpty>
        <InformMessage v-else :list="messageList" @read="handleRead" />
      </NTabPane>
      <NTabPane key="notice" name="notice">
        <template #tab>
          <NSpace class="w-130px" justify="center">
            {{ $t('page.home.notice') }}
            <NBadge type="success" :value="noticeList?.length" :max="99" />
          </NSpace>
        </template>
        <NEmpty v-if="noticeList?.length === 0">暂无{{ $t('page.home.notice') }}</NEmpty>
        <InformNotice v-else :list="noticeList" />
      </NTabPane>
    </NTabs>
  </NPopover>
</template>

<style scoped></style>
