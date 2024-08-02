<script setup lang="tsx">
defineOptions({
  name: 'TableBTag'
});

interface Props {
  value: boolean;
}
defineProps<Props>();
</script>

<template>
  <NTag :bordered="false" class="justify-center" :type="value ? 'primary' : 'error'">
    {{ value ? '是' : '否' }}
  </NTag>
</template>

<style scoped></style>
