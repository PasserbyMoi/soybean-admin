<script setup lang="tsx">
defineOptions({
  name: 'TableColumnOperations'
});

interface Props {
  type?: import('naive-ui/es/tag/src/Tag').TagProps['type'];
  size?: import('naive-ui/es/tag/src/Tag').TagProps['size'];
}
withDefaults(defineProps<Props>(), {
  type: 'primary',
  size: 'small'
});
//  secondary tertiary quaternary  strong round  circle dashed ghost color

const row = defineModel<any>('row', {
  default: () => []
});

const operations = defineModel<Array<UnionKey.TableColumnOperation<any>>>('operations', {
  default: () => []
});

const yesHandle = (other: App.Table.Operation<any>): void => {
  if (other.yesHandle) {
    other.yesHandle(row.value);
  }
};

const noHandle = (other: App.Table.Operation<any>): void => {
  if (other.noHandle) {
    other.noHandle(row.value);
  }
};
</script>

<template>
  <div class="flex-center gap-8px">
    <template v-for="other in operations" :key="other.label">
      <NPopconfirm
        v-if="(other.vif === undefined || other.vif(row)) && other.confirm"
        :positive-text="other.positiveText ?? $t('common.confirm')"
        :negative-text="other.negativeText ?? $t('common.cancel')"
        @positive-click="yesHandle(other)"
        @negative-click="noHandle(other)"
      >
        <template #trigger>
          <NButton
            strong
            secondary
            :size="other.size ?? size"
            :type="other.type ?? type"
            :disabled="other.disabled && other.disabled(row)"
          >
            {{ other.label }}
          </NButton>
        </template>
        {{ other.confirmText ?? $t('common.confirmOperations', other.label) }}
      </NPopconfirm>
      <NButton
        v-else-if="other.vif === undefined || other.vif(row)"
        :disabled="other.disabled && other.disabled(row)"
        strong
        secondary
        :size="other.size ?? size"
        :type="other.type ?? type"
        @click="yesHandle(other)"
      >
        {{ other.label }}
      </NButton>
    </template>
  </div>
</template>

<style scoped></style>
