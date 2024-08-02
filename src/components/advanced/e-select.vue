<script setup lang="tsx">
import type { SelectBaseOption } from 'naive-ui/es/select/src/interface';

defineOptions({
  name: 'ESelect'
});

interface Props {
  mvalue: string | number | null;
  displayTag?: boolean;
  autoClose?: boolean;
  options: CommonType.Option<string | number>[] | SelectBaseOption[];
  // rules: FormItemRule;
}

interface Emits {
  (e: 'onUpdated', id: string | number): boolean;
}

const props = withDefaults(defineProps<Props>(), {
  displayTag: true,
  autoClose: true
});

const emit = defineEmits<Emits>();

const typeArray = ['default', 'primary', 'success', 'warning', 'error', 'info'];

const value = ref(props.mvalue);
const option = ref<CommonType.Option<string | number> | SelectBaseOption>();
let remindVal = value.value;
const isEdit = ref(false);
const inputRef = ref();
const index = ref(0);
const types = ref(typeArray[0]);

props.options.forEach(opt => {
  index.value += 1;
  if (opt.value === value.value) {
    types.value = typeArray[index.value];
    option.value = opt;
  }
});

const handleChange = (isChange: boolean): void => {
  if (isChange) {
    // emit('onUpdated', value.value);
    remindVal = value.value;
    index.value = 0;
    props.options.forEach(opt => {
      index.value += 1;
      if (opt.value === value.value) {
        types.value = typeArray[index.value];
        option.value = opt;
      }
    });
  } else {
    value.value = remindVal;
  }
  nextTick(() => {
    isEdit.value = false;
  });
};
</script>

<template>
  <div v-if="isEdit" class="flex gap-2">
    <NSelect
      ref="inputRef"
      v-model:value="value"
      :options="options"
      type="text"
      size="small"
      class="text-align-left"
      @keyup.enter="handleChange(true)"
    />
    <NButton text class="font-size-20px" type="success" @click="handleChange(true)">
      <icon-ic-round-check />
    </NButton>
    <NButton text class="font-size-20px" @click="handleChange(false)">
      <icon-ic-round-clear />
    </NButton>
  </div>
  <NP v-if="!isEdit && !displayTag && mvalue" @dblclick="isEdit = true">
    {{ option?.label }}
  </NP>
  <NTag v-if="!isEdit && displayTag && mvalue" :type="types" @dblclick="isEdit = true">
    {{ option?.label }}
  </NTag>
</template>

<style scoped></style>
