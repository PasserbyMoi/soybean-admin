<script setup lang="ts">
import { computed, reactive } from 'vue';
import { $t } from '@/locales';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { updateUserPassword } from '@/apis';
import { encryptByRsa } from '@/utils/encrypt';
import { useRouterPush } from '@/hooks/common/router';

defineOptions({
  name: 'ModifyPwd'
});

const { formRef, validateField } = useNaiveForm();
const { goLogin } = useRouterPush(false);

interface FormModel {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const model: FormModel = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

type RuleRecord = Partial<Record<keyof FormModel, App.Global.FormRule[]>>;
const rules = computed<RuleRecord>(() => {
  const { formRules, createConfirmPwdRule } = useFormRules();
  return {
    oldPassword: formRules.pwd,
    newPassword: formRules.pwd,
    confirmPassword: createConfirmPwdRule(model.newPassword)
  };
});

async function handleSubmit() {
  const valid = await validateField();
  if (valid) {
    const params = {
      oldPassword: encryptByRsa(model.oldPassword) || '',
      newPassword: encryptByRsa(model.newPassword) || ''
    };
    const { error } = await updateUserPassword(params);
    if (!error) {
      window.$message?.info('密码修改成功', { duration: 4500 });
      goLogin();
    }
  }
}
</script>

<template>
  <NSpace vertical :size="24">
    <NAlert type="warning" :bordered="false">{{ $t('page.login.common.modifyNotify') }}</NAlert>
    <NForm ref="formRef" :model="model" :rules="rules" :show-label="false">
      <NFormItem path="oldPassword">
        <NInput
          v-model:value="model.oldPassword"
          size="large"
          :placeholder="$t('page.login.common.passwordOldPlaceholder')"
        />
      </NFormItem>
      <NFormItem path="newPassword">
        <NInput
          v-model:value="model.newPassword"
          type="password"
          size="large"
          show-password-on="click"
          :placeholder="$t('page.login.common.passwordNewPlaceholder')"
        />
      </NFormItem>
      <NFormItem path="confirmPassword">
        <NInput
          v-model:value="model.confirmPassword"
          size="large"
          type="password"
          show-password-on="click"
          :placeholder="$t('page.login.common.confirmNewPasswordPlaceholder')"
        />
      </NFormItem>
      <NSpace vertical :size="18" class="w-full">
        <NButton type="primary" round block @click="handleSubmit">
          {{ $t('common.confirm') }}
        </NButton>
      </NSpace>
    </NForm>
  </NSpace>
</template>

<style scoped></style>
