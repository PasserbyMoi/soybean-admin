<script setup lang="tsx">
// import type { FormItemRule, FormRules } from 'naive-ui';
// import { NButton } from 'naive-ui';

defineOptions({
  name: 'TableColumnEdit'
});

type FormType = 'input' | 'inputNumber' | 'select' | 'treeSelect' | 'datepicker' | 'timepicker' | 'datetimepicker';

interface Props {
  mvalue: any;
  mlabel?: string;
  formType?: FormType;
  autoClose?: boolean;
  options?: any;
  // rules: FormItemRule;
  // onUpdateValue: [Function, Array<string | number>];
}

const props = withDefaults(defineProps<Props>(), {
  formType: 'input',
  autoClose: true
});

// interface Emits {
//   (e: 'delete', id: string | number): void;
//   (e: 'batchDelete', ids: string[] | number[]): void;
//   (e: 'export'): void;
// }
// const emit = defineEmits<Emits>();

const value = ref(props.mvalue);
const label = ref();
const isEdit = ref(false);
const inputRef = ref();

let remindVal = value.value;

if (props.mlabel) {
  label.value = props.mlabel;
} else if (props.options) {
  label.value = props.options.filter((val, lab) => val === value.value).slice(0, 1).label;
}
if (!label.value) {
  label.value = props.mvalue;
}

const handleOnClick = () => {
  isEdit.value = true;
  nextTick(() => {
    inputRef.value?.focus();
  });
};

const handleChange = (isChange: boolean): void => {
  if (isChange) {
    remindVal = value.value;
  } else {
    value.value = remindVal;
  }
  nextTick(() => {
    isEdit.value = false;
  });
};
</script>

<template>
  <NInput
    v-if="formType === 'input' && isEdit"
    ref="inputRef"
    v-model:value="value"
    type="text"
    size="small"
    class="max-w-80% text-align-left"
    @keyup.enter="handleChange(true)"
  />
  <NInputNumber
    v-if="formType === 'inputNumber' && isEdit"
    ref="inputRef"
    v-model:value="value"
    size="small"
    @keyup.enter="handleChange(true)"
  />
  <NTimePicker v-if="formType === 'timepicker' && isEdit" ref="inputRef" v-model:value="value" size="small"/>
  <NDatePicker
    v-if="formType === 'datepicker' && isEdit"
    ref="inputRef"
    v-model:value="value"
    type="date"
    size="small"
  />
  <NDatePicker
    v-if="formType === 'datetimepicker' && isEdit"
    ref="inputRef"
    v-model:value="value"
    type="datetime"
    size="small"
  />
  <NSelect
    v-if="formType === 'select' && isEdit"
    ref="inputRef"
    v-model:value="value"
    :options="options"
    size="small"
    @keyup.enter="handleChange(true)"
  />
  <NTreeSelect
    v-if="formType === 'treeSelect' && isEdit"
    ref="inputRef"
    v-model:value="value"
    :options="options"
    size="small"
    @keyup.enter="handleChange(true)"
  />
  <icon-ic-round-check v-if="isEdit" class="min-w-28px cursor-pointer text-icon" @click="handleChange(true)"/>
  <icon-ic-round-clear v-if="isEdit" class="min-w-28px cursor-pointer text-icon" @click="handleChange(false)"/>
  <NTag v-if="formType === 'select' && !isEdit" @click="handleOnClick">{{ label }}</NTag>
  <NP
    v-if="
      (formType === 'input' ||
        formType === 'inputNumber' ||
        formType === 'datetimepicker' ||
        formType === 'timepicker' ||
        formType === 'datepicker') &&
      !isEdit
    "
    @dblclick="handleOnClick"
  >
    {{ label }}
  </NP>
</template>

<style scoped></style>
<!-- v-model:visible="drawerVisible" :operate-type="operateType" :row-data="editingData" @submitted="getDataByPage" -->
