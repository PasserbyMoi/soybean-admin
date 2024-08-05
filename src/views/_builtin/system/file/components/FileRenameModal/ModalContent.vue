<script lang="ts" setup>
import type { FormInstance } from '@arco-design/web-vue';
import type { FileItem } from '@/apis';

interface Props {
  data: FileItem;
}
const props = withDefaults(defineProps<Props>(), {});

const formRef = ref<FormInstance>();
const form = reactive({
  name: props.data?.name || ''
});

defineExpose({ formRef });
</script>

<template>
  <NRow justify="center" align="center" style="padding: 0 5%">
    <NForm ref="formRef" :model="form" auto-label-width class="w-full">
      <NFormItem label="文件名称" field="name" :rules="[{ required: true, message: '请输入文件名称' }]" class="mb-0px">
        <NInput v-model="form.name" placeholder="请输入文件名称" allow-clear />
      </NFormItem>
    </NForm>
  </NRow>
</template>

<style lang="scss" scoped></style>
