<script setup lang="ts">
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';

const appStore = useAppStore();

defineOptions({
  name: 'TableHeaderOperation'
});

interface Props {
  itemAlign?: NaiveUI.Align;
  hasAdd?: boolean;
  hasDelete?: boolean;
  hasExport?: boolean;
  disabledAdd?: boolean;
  disabledDelete?: boolean;
  loading?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  itemAlign: 'flex-end',
  hasAdd: true,
  hasDelete: true,
  hasExport: true,
  disabledAdd: false,
  disabledDelete: false
});

interface Emits {
  (e: 'add'): void;
  (e: 'delete'): void;
  (e: 'export'): void;
  (e: 'refresh'): void;
}
const emit = defineEmits<Emits>();

const columns = defineModel<NaiveUI.TableColumnCheck[]>('columns', {
  default: () => []
});

const sizeOptions = ref([
  { label: $t('theme.space.tableSize.small'), key: 'small' },
  { label: $t('theme.space.tableSize.medium'), key: 'medium' },
  { label: $t('theme.space.tableSize.large'), key: 'large' }
]);

const sizeHandleSelect = (key: UnionKey.TableSpaceSize) => {
  appStore.tableSize = key;
};

function add() {
  emit('add');
}

function batchDelete() {
  emit('delete');
}

function batchExport() {
  emit('export');
}

function refresh() {
  emit('refresh');
}
</script>

<template>
  <NSpace :align="itemAlign" wrap class="lt-sm:w-200px">
    <slot name="prefix"></slot>
    <slot name="default">
      <NButton v-if="hasAdd" size="small" ghost type="primary" :disabled="disabledAdd" @click="add">
        <template #icon>
          <icon-ic-round-plus class="text-icon" />
        </template>
        {{ $t('common.add') }}
      </NButton>
      <NPopconfirm v-if="hasDelete" @positive-click="batchDelete">
        <template #trigger>
          <NButton size="small" ghost type="error" :disabled="disabledDelete">
            <template #icon>
              <icon-ic-round-delete class="text-icon" />
            </template>
            {{ $t('common.delete') }}
          </NButton>
        </template>
        {{ $t('common.confirmDelete') }}
      </NPopconfirm>
      <NPopconfirm v-if="hasExport" @positive-click="batchExport">
        <template #trigger>
          <NButton size="small" ghost type="warning">
            <template #icon>
              <icon-ic-round-get-app class="text-icon" />
            </template>
            {{ $t('common.export') }}
          </NButton>
        </template>
        {{ $t('common.confirmExport') }}
      </NPopconfirm>
    </slot>
    <NButton size="small" @click="refresh">
      <template #icon>
        <icon-mdi-refresh class="text-icon" :class="{ 'animate-spin': loading }" />
      </template>
    </NButton>
    <NDropdown v-model:value="appStore.tableSize" :options="sizeOptions" trigger="click" @select="sizeHandleSelect">
      <NButton size="small">
        <template #icon>
          <icon-ic-round-expand class="text-icon" :class="{ 'animate-spin': loading }" />
        </template>
      </NButton>
    </NDropdown>
    <NSwitch v-model:value="appStore.isStriped" />
    <TableColumnSetting v-model:columns="columns" />
    <slot name="suffix"></slot>
  </NSpace>
</template>

<style scoped></style>
