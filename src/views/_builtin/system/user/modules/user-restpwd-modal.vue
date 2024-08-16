<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui';
import { resetUserPwd } from '@/apis';
import { $t } from '@/locales';
import { encryptByRsa } from '@/utils/encrypt';

defineOptions({
  name: 'UserRestpwdModal'
});

const newPassword = ref();
const feedbackClass = ref('info');
const rowId = defineModel<string | null>('rowId', {
  default: () => null
});
const visible = defineModel<boolean>('visible', {
  default: false
});

interface Emits {
  (e: 'submitted'): void;
}
const emit = defineEmits<Emits>();

// 提交
async function handleSubmit() {
  if (!validate()) {
    return;
  }
  if (rowId.value) {
    const { error } = await resetUserPwd({ newPassword: encryptByRsa(newPassword.value) || '' }, rowId.value);
    if (!error) window.$message?.success($t('common.updateSuccess'), { duration: 4500 });
  }
  closeDrawer();
  nextTick(() => {
    emit('submitted');
  });
}

const PASSWORD = /^(?=.*\d)(?=.*[a-z]).{8,32}$/;

function validate(): boolean {
  const pass = PASSWORD.test(newPassword.value);
  if (!pass) {
    feedbackClass.value = 'error';
  } else {
    feedbackClass.value = 'info';
  }
  return pass;
}

// 关闭窗口
function closeDrawer() {
  visible.value = false;
  feedbackClass.value = '';
}

watch(visible, () => {
  if (visible.value) {
    newPassword.value = null;
  }
});
</script>

<template>
  <NModal
    v-model:show="visible"
    preset="card"
    class="w-500pxpx w-120"
    title="重置密码"
    segmented
    close-on-esc
    @after-leave="closeDrawer"
  >
    <NInputGroup>
      <NButton type="primary">新密码</NButton>
      <NInput
        v-model:value="newPassword"
        placeholder="请输入新密码"
        type="password"
        show-password-on="mousedown"
        :max-length="32"
        @blur="validate"
        @change="validate"
      />
    </NInputGroup>
    <div class="mt-6px" :class="feedbackClass">
      密码长度为 8-32 个字符，支持大小写字母、数字、特殊字符，至少包含字母和数字
    </div>
    <template #footer>
      <NSpace :size="16" justify="end">
        <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style lang="css" scoped>
.error {
  color: red;
  margin-top: 4px;
}
.info {
  color: gray;
  margin-top: 4px;
}
</style>
