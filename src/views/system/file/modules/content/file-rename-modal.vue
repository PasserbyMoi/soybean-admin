<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui';
import { $t } from '@/locales';
import type { FileItem } from '@/apis';
import { updateFile } from '@/apis';
import { useNaiveForm } from '@/hooks/common/form';

defineOptions({
  name: 'FileRenameModal'
});

const fileItem = defineModel<FileItem>('fileItem', {
  default: () => null
});
const visible = defineModel<boolean>('visible', {
  default: false
});

interface Emits {
  (e: 'submitted'): void;
}
const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useNaiveForm();
const model = reactive(createDefaultModel());
function createDefaultModel() {
  return {
    name: ''
  };
}
type RuleKey = Extract<keyof FileItem, 'name'>;
const rules: Record<RuleKey, App.Global.FormRule[]> = {
  name: [{ key: 'name', trigger: 'input', required: true, message: '请输入文件新名称' }]
};

// 提交
async function handleSubmit() {
  await validate();
  if (fileItem.value) {
    const { error } = await updateFile({ name: model.name }, fileItem.value.id);
    if (!error) {
      window.$message?.success($t('common.updateSuccess'));
    }
  }
  closeDrawer();
  nextTick(() => {
    emit('submitted');
  });
}

// 关闭窗口
function closeDrawer() {
  visible.value = false;
}

watch(visible, () => {
  restoreValidation();
  if (visible.value) {
    Object.assign(model, fileItem.value);
  }
});
</script>

<template>
  <NModal
    v-model:show="visible"
    preset="card"
    class="w-120 w-500px"
    title="文件重命名"
    segmented
    close-on-esc
    @after-leave="closeDrawer"
  >
    <NForm ref="formRef" :model="model" :rules="rules" :show-label="false">
      <NFormItem :show-label="false" path="name">
        <NInputGroup>
          <NButton type="primary">新名称</NButton>
          <NInput v-model:value="model.name" placeholder="请输入文件新名称" :max-length="128" />
        </NInputGroup>
      </NFormItem>
    </NForm>
    <template #footer>
      <NSpace :size="16" justify="end">
        <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
