<script setup lang="tsx">
defineOptions({
  name: 'BStatusTag'
});

interface Props {
  value: CommonType.YesOrNo | CommonType.YesOrNoNum;
  bordered?: boolean;
  yesLabel?: string;
  noLabel?: string;
}

const props = defineProps<Props>();

const yes = ref();
const no = ref();

onMounted(() => {
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
  <NTag v-if="value === 1 || value === 'Y'" :bordered="bordered" class="w-40px justify-center" type="success">
    {{ yes }}
  </NTag>
  <NTag v-else :bordered="false" size="small" class="w-40px justify-center" type="error">
    {{ no }}
  </NTag>
</template>

<style scoped></style>
