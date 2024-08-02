<script setup lang="tsx">
defineOptions({
  name: 'EInputNumber'
});

interface Props {
  mvalue: number;
  autoClose?: boolean;
  // rules: FormItemRule;
}

interface Emits {
  (e: 'onUpdated', id: string | number): boolean;
}

const props = withDefaults(defineProps<Props>(), {
  autoClose: true
});

const emit = defineEmits<Emits>();

const value = ref(props.mvalue);
let remindVal = value.value;
const isEdit = ref(false);
const inputRef = ref();

const handleChange = (isChange: boolean): void => {
  if (isChange && emit('onUpdated', value.value)) {
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
  <div v-if="isEdit" class="flex gap-2">
    <NInputNumber
      ref="inputRef"
      v-model:value="value"
      type="text"
      size="small"
      class="text-align-left"
      @keyup.enter="handleChange(true)"
    />
    <NButton text type="success" class="font-size-20px" @click="handleChange(true)">
      <icon-ic-round-check />
    </NButton>
    <NButton text class="font-size-20px" @click="handleChange(false)">
      <icon-ic-round-clear />
    </NButton>
  </div>
  <NP v-if="!isEdit" @dblclick="isEdit = true">
    {{ value }}
  </NP>
</template>

<style scoped></style>
