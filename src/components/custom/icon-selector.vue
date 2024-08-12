<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { getLocalIcons } from '@/utils/icon';

defineOptions({ name: 'IconSelector' });

interface Props {
  enableCopy?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  enableCopy: false
});

const value = defineModel<string>('value', {
  default: () => null
});

const searchValue = ref(''); // 搜索词
const isGridView = ref(false); // 图标列表
const iconList: string[] = getLocalIcons();
const pageSize = 42;
const current = ref(1);
const total = ref(iconList.length); // 图标总数

// 当前页的图标列表
const currentPageIconList = ref(iconList.slice(0, pageSize));
// 搜索列表
const searchList = ref<string[]>([]);

// 页码改变
const onPageChange = (page: number) => {
  current.value = page;
  if (!searchList.value.length) {
    currentPageIconList.value = iconList.slice((page - 1) * pageSize, page * pageSize);
  } else {
    currentPageIconList.value = searchList.value.slice((page - 1) * pageSize, page * pageSize);
  }
};

// 搜索
const search = () => {
  if (searchValue.value) {
    const temp = searchValue.value.toLowerCase();
    searchList.value = iconList.filter(item => {
      return item.toLowerCase().startsWith((temp.startsWith('icon') ? '' : 'icon') + temp);
    });
    total.value = searchList.value.length;
    currentPageIconList.value = searchList.value.slice(0, pageSize);
  } else {
    searchList.value = [];
    total.value = iconList.length;
    currentPageIconList.value = iconList.slice((current.value - 1) * pageSize, current.value * pageSize);
  }
};

// 点击选择图标
const handleSelectedIcon = async (icon: string) => {
  value.value = icon;
  if (props.enableCopy) {
    const { isSupported, copied, copy } = useClipboard();
    if (isSupported) {
      await copy(`<SvgIcon :local-icon="${icon}" />`);
      if (copied) {
        window.$message?.success(`已选择并且复制成功 ${icon} 图标`);
      }
    }
  }
};
</script>

<template>
  <NPopover trigger="click">
    <template #trigger>
      <NInput placeholder="请选择图标" :value="value" readonly clearable>
        <template #prefix>
          <SvgIcon :local-icon="value ?? 'find-replace'" />
        </template>
      </NInput>
    </template>

    <div class="container" :class="{ 'is-list': !isGridView }">
      <NRow>
        <section style="flex: 1; margin-right: 8px">
          <NInput
            v-model:value="searchValue"
            placeholder="搜索图标名称"
            clearable
            size="small"
            @input="search"
            @clear="search"
          >
            <template #prefix>
              <SvgIcon local-icon="search" />
            </template>
          </NInput>
        </section>
        <NButton size="small" @click="isGridView = !isGridView">
          <template #icon>
            <SvgIcon v-if="isGridView" local-icon="apps" />
            <SvgIcon v-else local-icon="align-center" />
          </template>
        </NButton>
      </NRow>

      <section class="icon-list">
        <NRow wrap :gutter="4">
          <NCol v-for="item of currentPageIconList" :key="item" :span="isGridView ? 4 : 8">
            <div class="icon-item" :class="{ active: value === item }" @click="handleSelectedIcon(item)">
              <SvgIcon :local-icon="item" :size="20"></SvgIcon>
              <div class="gi_line_1 icon-name">{{ item }}</div>
            </div>
          </NCol>
        </NRow>
      </section>

      <NSpace justify="center">
        <NPagination
          size="small"
          :page="current"
          :page-size="pageSize"
          :total="total"
          :page-count="Math.ceil(total / pageSize)"
          @update:page="onPageChange"
        />
      </NSpace>
    </div>
  </NPopover>
</template>

<style lang="scss" scoped>
.container {
  width: 300px;
  overflow: hidden;
  .icon-list {
    margin-top: 10px;
    margin-bottom: 10px;
    .icon-item {
      height: 30px;
      margin-bottom: 4px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      border: 1px dashed #e5e7eb;
      .icon-name {
        display: none;
      }
      &.active {
        border: 1px dashed #e5e7eb;
        background-color: #e4e4e4;
      }
      &:not(.active) {
        &:hover {
          border-color: #e5e7eb;
        }
      }
    }
  }
}

.is-list {
  min-width: 400px;
  .icon-list {
    height: 300px;
    overflow: hidden;
    overflow-y: auto;
    .icon-item {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      padding-left: 4px;
      box-sizing: border-box;
      .icon-name {
        margin-left: 6px;
        font-size: 12px;
        display: block;
      }
    }
  }
}
</style>
