<script setup lang="tsx">
import _ from 'lodash';
import { $t } from '@/locales';
import { useDict } from '@/hooks/business/dict';
import { listDashboardNotice } from '@/apis/common/home';
import type { DashboardNoticeResp } from '@/apis/common/type';

const currentTab = ref(0);
// function handleRead(id: number) {
//   const data = MassageData.value.find(i => i.id === id);
//   if (data) {
//     data.isRead = true;
//   }
// window.$message.success(`id: ${id}`);
// }
// const massageCount = computed(() => {
//   return MassageData.value.filter(i => !i.isRead).length;
// });

// const { noticeType } = useDict('notice_type');

const dataList = ref<DashboardNoticeResp[]>([]);
const getDataList = async () => {
  const { data, error } = await listDashboardNotice();
  if (!error) {
    dataList.value = data;
  }
  // const groupMessage = computed(() => {
  //   return _.groupBy(MassageData.value, (i: Api.SystemManage.Message) => i.type);
  // });
};

// const NoticeDetailModalRef = ref<InstanceType<typeof NoticeDetailModal>>()
// // 详情
// const onDetail = (id: string) => {
//   NoticeDetailModalRef.value?.onDetail(id);
// };

onMounted(() => {
  getDataList();
});
</script>

<template>
  <NPopover placement="bottom" trigger="click" arrow-point-to-center class="!p-0">
    <template #trigger>
      <NBadge :value="dataList?.length" :max="99" :offset="[-12, 6]">
        <ButtonIcon :tooltip-content="$t('icon.notifications')">
          <icon-icon-park-outline:remind />
        </ButtonIcon>
      </NBadge>
    </template>
    <NTabs v-model:value="currentTab" type="line" animated justify-content="space-evenly" class="w-390px">
      <NTabPane :name="0">
        <template #tab>
          <NSpace class="w-130px" justify="center">
            {{ $t('notifications.notice') }}
            <NEmpty v-if="dataList?.length === 0">暂无通知</NEmpty>
            <NBadge type="info" :value="dataList?.length" :max="99" />
          </NSpace>
        </template>
        <NoticeList :list="dataList" />
      </NTabPane>
      <NTabPane :name="1">
        <template #tab>
          <NSpace class="w-130px" justify="center">
            {{ $t('notifications.message') }}
            <NEmpty v-if="dataList?.length === 0">暂无消息</NEmpty>
            <NBadge type="warning" :value="dataList?.length" :max="99" />
          </NSpace>
        </template>
        <NoticeList :list="dataList" />
      </NTabPane>
      <NTabPane :name="2">
        <template #tab>
          <NSpace class="w-130px" justify="center">
            {{ $t('notifications.todo') }}
            <NEmpty v-if="dataList?.length === 0">暂无待办</NEmpty>
            <NBadge type="error" :value="dataList?.length" :max="99" />
          </NSpace>
        </template>
        <NoticeList :list="dataList" />
      </NTabPane>
    </NTabs>
  </NPopover>
</template>

<style scoped></style>
