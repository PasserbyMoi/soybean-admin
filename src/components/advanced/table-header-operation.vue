<script setup lang="ts">
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';

defineOptions({
  name: 'TableHeaderOperation'
});

const appStore = useAppStore();
const appThemeStore = useThemeStore();

interface Props {
  itemAlign: NaiveUI.Align;
  loading: boolean;
}
defineProps<Props>();

interface Emits {
  (e: 'add'): void;
  (e: 'batchDelete'): void;
  (e: 'export'): void;
  (e: 'refresh'): void;
}
const emit = defineEmits<Emits>();

const columnChecks = defineModel<NaiveUI.TableColumnCheck[]>('columns', {
  default: () => []
});

const operations = defineModel<Array<UnionKey.TableHeaderOperation<any>>>('operations', {
  default: () => []
});

const deleteDisabled = defineModel<boolean>('deleteDisabled', {
  default: () => false
});

const expand = defineModel<boolean>('expand', {
  default: () => false
});
const searchVisible = defineModel<boolean>('searchVisible', {
  default: () => true
});

const sizeOptions = ref([
  { label: $t('theme.space.tableSize.small'), key: 'small' },
  { label: $t('theme.space.tableSize.medium'), key: 'medium' },
  { label: $t('theme.space.tableSize.large'), key: 'large' }
]);

const sizeHandleSelect = (key: UnionKey.TableSpaceSize) => {
  appStore.tableSize = key;
};

function toggleTableFullScreen() {
  appStore.toggleFullContent();
  searchVisible.value = !searchVisible.value;
  appThemeStore.tab.visible = !appThemeStore.tab.visible;
}
function toggleExpand() {
  expand.value = !expand.value;
}
</script>

<template>
  <NSpace :align="itemAlign" wrap class="lt-sm:w-200px !items-center">
    <slot name="default">
      <NButton v-if="operations.includes('add')" size="small" ghost type="primary" @click="emit('add')">
        <template #icon>
          <icon-material-symbols:add class="text-icon" :class="{ 'animate-spin': loading }" />
        </template>
        {{ $t('common.add') }}
      </NButton>
      <NPopconfirm v-if="operations.includes('delete')" @positive-click="emit('batchDelete')">
        <template #trigger>
          <NButton size="small" ghost type="error" :disabled="deleteDisabled">
            <template #icon>
              <icon-material-symbols:delete class="text-icon" :class="{ 'animate-spin': loading }" />
            </template>
            <!-- {{ $t('common.delete') }} -->
          </NButton>
        </template>
        {{ $t('common.confirmDelete') }}
      </NPopconfirm>
      <NPopconfirm v-if="operations.includes('export')" @positive-click="emit('export')">
        <template #trigger>
          <NButton size="small" ghost type="warning">
            <template #icon>
              <icon-material-symbols:arrow-downward class="text-icon" :class="{ 'animate-spin': loading }" />
            </template>
            <!-- {{ $t('common.export') }} -->
          </NButton>
        </template>
        {{ $t('common.confirmExport') }}
      </NPopconfirm>
    </slot>
    <NButton size="small" @click="emit('refresh')">
      <template #icon>
        <icon-material-symbols:refresh class="text-icon" :class="{ 'animate-spin': loading }" />
      </template>
    </NButton>
    <NDropdown
      v-if="operations.includes('height')"
      v-model:value="appStore.tableSize"
      trigger="click"
      :options="sizeOptions"
      @select="sizeHandleSelect"
    >
      <NButton size="small">
        <template #icon>
          <icon-material-symbols:expand class="text-icon" :class="{ 'animate-spin': loading }" />
        </template>
      </NButton>
    </NDropdown>
    <NButton v-if="operations.includes('expand')" size="small" @click="toggleExpand">
      <template #icon>
        <icon-material-symbols:arrow-right-alt v-if="expand" title=" $t('icon.collapseList')" />
        <icon-material-symbols:arrow-split v-else title=" $t('icon.expandList')" />
      </template>
    </NButton>
    <NSwitch v-if="operations.includes('stripe')" v-model:value="appStore.isStriped" size="small" />
    <TableColumnSetting
      v-model:columns="columnChecks"
      :loading="loading"
      :column-setting="operations.includes('columnSetting')"
    />
    <NButton size="small" @click="toggleTableFullScreen">
      <template #icon>
        <icon-gridicons-fullscreen-exit v-if="!searchVisible" title=" $t('icon.fullscreenExit')" />
        <icon-gridicons-fullscreen v-else title=" $t('icon.fullscreen')" />
      </template>
    </NButton>
  </NSpace>
</template>

<style scoped></style>
