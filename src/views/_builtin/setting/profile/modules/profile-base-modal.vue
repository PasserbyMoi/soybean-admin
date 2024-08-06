<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui';
import { type UserResp, updateUserBaseInfo } from '@/apis';
import { $t } from '@/locales';
import { useNaiveForm } from '@/hooks/common/form';
import { useAuthStore } from '@/store/modules/auth';

defineOptions({
  name: 'ProfileBaseModal'
});

const visible = defineModel<boolean>('visible', {
  default: false
});

interface Emits {
  (e: 'submitted'): void;
}
const emit = defineEmits<Emits>();

const userStore = useAuthStore();
const userInfo = computed(() => userStore.userInfo);
const { formRef, validate, restoreValidation } = useNaiveForm();

const model = reactive(createDefaultModel());
function createDefaultModel() {
  return {
    nickname: userInfo.value.nickname,
    gender: userInfo.value.gender
  };
}

type RuleKey = Extract<keyof UserResp, 'nickname' | 'gender'>;
const rules: Record<RuleKey, App.Global.FormRule[]> = {
  nickname: [{ required: true, message: '请输入昵称' }],
  gender: [{ required: true, message: '请选择性别' }]
};

// 提交
async function handleSubmit() {
  await validate();
  const { error } = await updateUserBaseInfo(model);
  if (!error) {
    window.$message?.success($t('common.updateSuccess'));
    await userStore.initUserInfo();
    closeDrawer(true);
  }
}

// 关闭窗口
function closeDrawer(submitted: boolean = false) {
  visible.value = false;
  if (submitted) {
    nextTick(() => {
      emit('submitted');
    });
  }
}

watch(visible, () => {
  if (visible.value) {
    // handleInitModel();
    restoreValidation();
  }
});
</script>

<template>
  <NModal
    v-model:show="visible"
    preset="card"
    segmented
    title="编辑基础信息"
    class="w-500px"
    close-on-esc
    @after-leave="closeDrawer"
  >
    <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="80px">
      <NFormItem label="昵称" path="nickname">
        <NInput v-model:value="model.nickname" placeholder="请输入昵称" :max-length="150" clearable />
      </NFormItem>
      <NFormItem label="类型" path="gender">
        <NRadioGroup v-model:value="model.gender" name="gender" size="small" :default-value="model.gender">
          <NRadio :value="1" name="gender-1">男</NRadio>
          <NRadio :value="2" name="gender-2">女</NRadio>
          <NRadio :value="0" name="gender-0" disabled>未知</NRadio>
        </NRadioGroup>
      </NFormItem>
    </NForm>
    <template #footer>
      <NSpace :size="16" justify="end">
        <NButton @click="closeDrawer(false)">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>
