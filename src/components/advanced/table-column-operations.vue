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

const showOperations = computed(() => {
  return operations.value.slice(0, 2);
});

const moreOperations = computed(() => {
  return operations.value.slice(2);
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
    <template v-for="other in showOperations" :key="other.label">
      <NPopconfirm
        v-if="(other.vif === undefined || other.vif(row)) && other.confirm"
        :positive-text="other.positiveText ?? $t('common.confirm')"
        :negative-text="other.negativeText ?? $t('common.cancel')"
        @positive-click="yesHandle(other)"
        @negative-click="noHandle(other)"
      >
        <template #trigger>
          <NButton
            ghost
            :size="other.size ?? size"
            :type="other.type ?? type"
            :disabled="other.disabled && other.disabled(row)"
          >
            {{ other.label }}
          </NButton>
        </template>
        {{ other.confirmText ?? $t('common.confirmOperations', { name: other.label }) }}
      </NPopconfirm>
      <NButton
        v-else-if="other.vif === undefined || other.vif(row)"
        :disabled="other.disabled && other.disabled(row)"
        ghost
        :size="other.size ?? size"
        :type="other.type ?? type"
        @click="yesHandle(other)"
      >
        {{ other.label }}
      </NButton>
    </template>

    <NPopover
      v-if="moreOperations && moreOperations.length > 0"
      trigger="click"
      class="w-160px !ml-0px !mr-0px !pl-0px !pr-0px"
    >
      <template #trigger>
        <NButton type="default" ghost size="small">...</NButton>
      </template>
      <template v-for="other in moreOperations" :key="other.label">
        <NPopconfirm
          v-if="(other.vif === undefined || other.vif(row)) && other.confirm"
          :positive-text="other.positiveText ?? $t('common.confirm')"
          :negative-text="other.negativeText ?? $t('common.cancel')"
          @positive-click="yesHandle(other)"
          @negative-click="noHandle(other)"
        >
          <template #trigger>
            <NButton
              quaternary
              :type="other.type ?? type"
              :disabled="other.disabled && other.disabled(row)"
              class="w-100% justify-left"
            >
              {{ other.label }}
            </NButton>
          </template>
          {{ other.confirmText ?? $t('common.confirmOperations', { name: other.label }) }}
        </NPopconfirm>
        <NButton
          v-else-if="other.vif === undefined || other.vif(row)"
          :disabled="other.disabled && other.disabled(row)"
          quaternary
          :type="other.type ?? type"
          class="w-100% justify-left"
          @click="yesHandle(other)"
        >
          {{ other.label }}
        </NButton>
      </template>
    </NPopover>
  </div>
</template>

<style scoped></style>
