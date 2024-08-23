<script setup lang="ts">
import { type DashboardNoticeResp, listCommonDict } from '@/apis';
import { useRouterPush } from '@/hooks/common/router';
import NoticeViewModal from '@/views/system/notice/modules/notice-view-modal.vue';

interface Props {
  list?: DashboardNoticeResp[];
}
const props = defineProps<Props>();
const routerPush = useRouterPush();
const noticeType = ref();

const viewRef = ref();
const rowId = ref<string>();
const visible = ref<boolean>();
const operateType = ref<NaiveUI.TableOperateType>('add');

function viewMore() {
  routerPush.routerPushByKey('system_notice');
}

function viewHandle(id?: number) {
  if (id) {
    rowId.value = `${id}`;
    visible.value = true;
  }
}

onMounted(() => {
  listCommonDict('notice_type').then(res => {
    noticeType.value = res.data;
  });
});
</script>

<template>
  <NScrollbar class="max-h-580px">
    <NList clickable size="small">
      <NListItem v-for="item in props.list" :key="item.id" @click="viewHandle(item.id)">
        <NThing size="small" content-indented>
          <template #header>
            <NEllipsis :line-clamp="1" :tooltip="false" class="max-w-300px font-size-0.8rem opacity-50">
              {{ item.title }}
            </NEllipsis>
          </template>
          <template #header-extra>
            <TableTag :value="item.type" :options="noticeType" round size="small" class="text-size-0.7rem"></TableTag>
          </template>
        </NThing>
      </NListItem>
    </NList>
    <NDivider class="!mb-8px !mt-0" />
    <NFlex justify="space-between" class="m-4px mt-10px">
      <NButton text :focusable="false" size="small" type="primary" @click="viewMore()">
        {{ $t('common.read.viewMore') }}
      </NButton>
    </NFlex>
  </NScrollbar>
  <NoticeViewModal ref="viewRef" v-model:visible="visible" v-model:row-id="rowId" :operate-type="operateType" />
</template>

<style scoped></style>
