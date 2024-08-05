<script setup lang="ts">
import { MenuMixedOption } from 'naive-ui/es/menu/src/interface';
import { FileTypeList, type FileTypeListItem } from '@/constants/file';
import FileAsideStatistics from './FileAsideStatistics.vue';

const route = useRoute();
const router = useRouter();

const selectedKey = ref('0');

// 监听路由变化
watch(
  () => route.query,
  () => {
    if (route.query.type) {
      selectedKey.value = route.query.type as string;
    }
  },
  {
    immediate: true
  }
);

// 点击事件
const onClickItem = (item: FileTypeListItem) => {
  router.push({ name: 'SystemFile', query: { type: item.value } });
};
</script>

<template>
  <div>
    <NCard title="文件管理" :bordered="false" :body-style="{ padding: 0 }">
      <NMenu :options="FileTypeList" key-field="value" label-field="name"></NMenu>
    </NCard>
    <FileAsideStatistics />
  </div>
</template>

<style lang="scss" scoped>
:deep(.arco-card) {
  .arco-card-header {
    border-bottom-style: dashed;
    margin: 0 16px;
    padding-left: 0;
    padding-right: 0;
    .arco-card-header-title {
      color: var(--color-text-1);
      font-size: 18px;
      font-weight: 500;
      line-height: 1.5;
    }
  }
}
</style>
