<script setup lang="ts">
import { MdPreview } from 'md-editor-v3';
import { type NoticeResp, getNotice } from '@/apis';
import { useThemeStore } from '@/store/modules/theme';

defineOptions({
  name: 'NoticeViewModal'
});

const themeStore = useThemeStore();

const rowId = defineModel<string | null>('rowId', {
  default: () => null
});
const visible = defineModel<boolean>('visible', {
  default: false
});

const dataDetail = ref<NoticeResp>();
const mdPreviewRef = ref();

// 查询详情
const getDataDetail = async () => {
  if (rowId.value) {
    const { data, error } = await getNotice(rowId.value);
    if (error) {
      throw error;
    }
    dataDetail.value = data;
  }
};

// 关闭窗口
function closeDrawer() {
  dataDetail.value = undefined;
  visible.value = false;
}

watch(visible, () => {
  if (visible.value) {
    getDataDetail();
  }
});
</script>

<template>
  <NModal v-model:show="visible" preset="card" class="h-90% w-80%" close-on-esc segmented @after-leave="closeDrawer">
    <div class="mt-10px text-center">
      <NH1>{{ dataDetail?.title }}</NH1>
      <NSpace justify="center">
        <span class="mt-10px w-full text-center">
          <icon-icon-park-outline:user class="mb-4px mr-4px w-14px" />
          <span class="label">发布人：</span>
          <span>{{ dataDetail?.createUserString }}</span>
        </span>
        <span class="gap-4px">
          <icon-icon-park-outline:history class="mb-4px mr-4px w-14px" />
          <span class="label">发布时间：</span>
          <span>{{ dataDetail?.effectiveTime ? dataDetail?.effectiveTime : dataDetail?.createTime }}</span>
        </span>
      </NSpace>
    </div>
    <div class="mb-20px mt-20px">
      <NScrollbar class="h-560px">
        <MdPreview
          ref="mdPreviewRef"
          :model-value="dataDetail?.content"
          :editor-id="dataDetail?.id"
          :theme="themeStore.darkMode ? 'dark' : 'light'"
          preview-theme="github"
        />
      </NScrollbar>
    </div>
    <NSpace v-if="dataDetail?.updateTime" justify="end">
      <div>
        <icon-icon-park-outline:time class="mb-4px mr-4px w-14px" />
        <span>最后更新于：</span>
        <span>{{ dataDetail?.updateTime }}</span>
      </div>
    </NSpace>
    <template #footer>
      <NSpace :size="16" justify="end">
        <NButton @click="closeDrawer()">{{ $t('common.close') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
