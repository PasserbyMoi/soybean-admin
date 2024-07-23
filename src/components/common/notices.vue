<script setup lang="tsx">
import _ from 'lodash';
import { $t } from '@/locales';

const MassageData = ref<Api.SystemManage.Message[]>([
  {
    id: 0,
    type: 0,
    title: 'Admin 已经完成40%了！',
    icon: 'icon-park-outline:tips-one',
    tagTitle: '未开始',
    tagType: 'info',
    description: '项目稳定推进中，很快就能看到正式版了',
    date: '2022-2-2 12:22',
    status: '1'
  },
  {
    id: 1,
    type: 0,
    title: 'Admin 已经添加通知功能！',
    icon: 'icon-park-outline:comment-one',
    tagTitle: '未开始',
    tagType: 'success',
    date: '2022-2-2 12:22',
    status: '1'
  },
  {
    id: 2,
    type: 0,
    title: 'Admin 已经添加路由功能！',
    icon: 'icon-park-outline:message-emoji',
    tagTitle: '未开始',
    tagType: 'warning',
    description: '项目稳定推进中...',
    date: '2022-2-5 18:32',
    status: '1'
  },
  {
    id: 3,
    type: 0,
    title:
      'Admin 已经添加菜单导航功能！Admin 已经添加菜单导航功能！Admin 已经添加菜单导航功能！Admin 已经添加菜单导航功能！',
    icon: 'icon-park-outline:tips-one',
    tagTitle: '未开始',
    tagType: 'error',
    description:
      '项目稳定推进中...项目稳定推进中...项目稳定推进中...项目稳定推进中...项目稳定推进中...项目稳定推进中...项目稳定推进中...',
    date: '2022-2-5 18:32',
    status: '1'
  },
  {
    id: 4,
    type: 0,
    title: 'Admin开始启动了！',
    icon: 'icon-park-outline:tips-one',
    tagTitle: '未开始',
    description: '项目稳定推进中...',
    date: '2022-2-5 18:32',
    status: '1'
  },
  {
    id: 5,
    type: 1,
    title: '相见恨晚??',
    icon: 'icon-park-outline:comment',
    description: '项目稳定推进中，很快就能看到正式版了',
    date: '2022-2-2 12:22',
    status: '1'
  },
  {
    id: 6,
    type: 1,
    title: '动态路由已完成！',
    icon: 'icon-park-outline:comment',
    description: '项目稳定推进中，很快就能看到正式版了',
    date: '2022-2-25 12:22',
    status: '1'
  },
  {
    id: 7,
    type: 2,
    title: '接下来需要完善一些',
    icon: 'icon-park-outline:beach-umbrella',
    tagTitle: '未开始',
    description: '项目稳定推进中，很快就能看到正式版了',
    date: '2022-2-2 12:22',
    status: '1'
  }
]);
const currentTab = ref(0);
function handleRead(id: number) {
  const data = MassageData.value.find(i => i.id === id);
  if (data) {
    data.isRead = true;
  }
  // window.$message.success(`id: ${id}`);
}
const massageCount = computed(() => {
  return MassageData.value.filter(i => !i.isRead).length;
});
const groupMessage = computed(() => {
  return _.groupBy(MassageData.value, (i: Api.SystemManage.Message) => i.type);
});
</script>

<template>
  <NPopover placement="bottom" trigger="click" arrow-point-to-center class="!p-0">
    <template #trigger>
      <NBadge :value="massageCount" :max="99" :offset="[-12, 6]">
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
            <NBadge
              type="info"
              :value="groupMessage[0]?.filter((i: Api.SystemManage.Message) => !i.isRead).length"
              :max="99"
            />
          </NSpace>
        </template>
        <NoticeList :list="groupMessage[0]" @read="handleRead" />
      </NTabPane>
      <NTabPane :name="1">
        <template #tab>
          <NSpace class="w-130px" justify="center">
            {{ $t('notifications.message') }}
            <NBadge
              type="warning"
              :value="groupMessage[1]?.filter((i: Api.SystemManage.Message) => !i.isRead).length"
              :max="99"
            />
          </NSpace>
        </template>
        <NoticeList :list="groupMessage[1]" @read="handleRead" />
      </NTabPane>
      <NTabPane :name="2">
        <template #tab>
          <NSpace class="w-130px" justify="center">
            {{ $t('notifications.todo') }}
            <NBadge
              type="error"
              :value="groupMessage[2]?.filter((i: Api.SystemManage.Message) => !i.isRead).length"
              :max="99"
            />
          </NSpace>
        </template>
        <NoticeList :list="groupMessage[2]" @read="handleRead" />
      </NTabPane>
    </NTabs>
  </NPopover>
</template>

<style scoped></style>
