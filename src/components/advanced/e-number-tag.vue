<script setup lang="tsx">
import type TagProps from 'naive-ui/es/tag/src/Tag';

defineOptions({
  name: 'ENumberTag'
});

interface Props {
  value: number;
  numbers?: Array<number>;
  types?: Array<import('naive-ui/es/tag/src/Tag').TagProps['size']>;
}

const props = defineProps<Props>();

const yes = ref();
const no = ref();
_default.onMounted(() => {
  if (Number.isNaN(props.value)) {
    yes.value = props.yesLabel ?? '是';
    no.value = props.noLabel ?? '否';
  } else {
    yes.value = props.yesLabel ?? '成功';
    no.value = props.noLabel ?? '失败';
  }
});
</script>

<template>
  <NTag v-if="value === 1 || value === 'Y'" :bordered="bordered" class="w-40px justify-center" type="success1">
    {{ yes }}
  </NTag>
  <NTag v-else :bordered="false" size="small" class="w-40px justify-center" type="error">
    {{ no }}
  </NTag>
</template>

<style scoped></style>
