<script setup lang="tsx">
defineOptions({
  name: 'BButtons'
});

interface Props {
  rowId: any;
  edit?: boolean;
  remove?: boolean;
  buttons?: App.Table.TableButton[];
}
const props = withDefaults(defineProps<Props>(), {
  edit: true,
  remove: true,
  buttons: undefined
});

interface Emits {
  (e: 'remove', id: string | number): void;
  (e: 'edit', id: string | number): void;
}

const emit = defineEmits<Emits>();

const handleEdit = (): void => {
  emit('edit', props.rowId);
};
const handleRemove = (): void => {
  emit('remove', props.rowId);
};
const handleOther = (other: App.Table.TableButton, handle: string): void => {
  if (other.clickHandle && handle === 'clcik') {
    other.clickHandle(props.rowId);
  } else if (other.negativeHandle && handle === 'negative') {
    other.negativeHandle(props.rowId);
  } else if (other.positiveHandle && handle === 'positive') {
    other.positiveHandle(props.rowId);
  }
};
</script>

<template>
  <div class="flex-center gap-8px">
    <NButton v-if="edit" ghost size="small" type="primary" @click="handleEdit()">
      {{ $t('common.edit') }}
    </NButton>
    <NPopconfirm
      v-if="remove"
      :positive-text="$t('common.confirm')"
      :negative-text="$t('common.cancel')"
      @positive-click="handleRemove()"
      @negative-click="handleEdit()"
    >
      <template #trigger>
        <NButton ghost size="small" type="error">{{ $t('common.delete') }}</NButton>
      </template>
      {{ $t('common.confirmDelete') }}
    </NPopconfirm>
    <template v-for="other in buttons" :key="other.name">
      <NButton v-if="!other.confirm" ghost size="small" type="info" @click="handleOther(other, 'click')">
        {{ other.name }}
      </NButton>
      <NPopconfirm
        v-if="other.confirm"
        :positive-text="other.positiveText ?? $t('common.confirm')"
        :negative-text="other.negativeText ?? $t('common.cancel')"
        @positive-click="handleOther(other, 'positive')"
        @negative-click="handleOther(other, 'negative')"
      >
        <template #trigger>
          <NButton ghost size="small" type="error">{{ $t('common.delete') }}</NButton>
        </template>
        {{ other.confirmText ?? $t('common.confirmDelete') }}
      </NPopconfirm>
    </template>
  </div>
</template>

<style scoped></style>
