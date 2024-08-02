<script setup lang="tsx">
import { NSwitch } from 'naive-ui';

defineOptions({
  name: 'ESwitch'
});

interface Props {
  mvalue: string | number | boolean | Api.Common.EnableStatus;
  checkedValue?: string | number;
  uncheckedValue?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  checkedValue: '1',
  uncheckedValue: '0',
  autoClose: true
});

interface Emits {
  (e: 'onUpdated', checked: string | number | boolean): boolean;
}

const emit = defineEmits<Emits>();

const value = ref(props.mvalue);
const loadingRef = ref(false);

const handleChange = (): void => {
  // value.value = value.value === props.checkedValue ? props.uncheckedValue : props.checkedValue;
};
</script>

<template>
  <NSwitch
    v-model:value="value"
    :checked-value="checkedValue"
    :unchecked-value="uncheckedValue"
    :loading="loadingRef"
    size="small"
    @update:value="handleChange"
  />
</template>

<style scoped></style>
