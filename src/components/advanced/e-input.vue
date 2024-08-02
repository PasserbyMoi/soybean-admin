<script setup lang="tsx">
defineOptions({
  name: 'EInput'
});

interface Props {
  mvalue: string | [string, string];
  autoClose?: boolean;
  // rules: FormItemRule;
}

interface Emits {
  (e: 'onUpdated', id: string | [string, string]): boolean;
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
  <div v-if="isEdit" class="flex gap-2">
    <NInput
      ref="inputRef"
      v-model:value="value"
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
  <NP v-if="!isEdit" @dblclick="isEdit = true">
    {{ value }}
  </NP>
</template>

<style scoped></style>
