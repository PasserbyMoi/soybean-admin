<script setup lang="ts">
import { computed, reactive } from 'vue';
import { $t } from '@/locales';
import { useRouterPush } from '@/hooks/common/router';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import VueVerify from '@/components/custom/vue-verify/index.vue';
import { REG_EMAIL, REG_PHONE } from '@/constants/reg';
import { useCaptcha } from '@/hooks/business/captcha';
import { updateUserEmail, updateUserPhone } from '@/apis';
import { encryptByRsa } from '@/utils/encrypt';

defineOptions({
  name: 'ResetPwd'
});

const { toggleLoginModule } = useRouterPush();
const { formRef, validateField, restoreValidation } = useNaiveForm();
const { label, isCounting, loading, getCaptcha } = useCaptcha();

const verifyRef = ref<InstanceType<any>>();
const captchaType = ref('blockPuzzle');
const captchaMode = ref('pop');
const captchaLoading = ref(false);

interface FormModel {
  phoneOrEmail: string;
  code: string;
  password: string;
  confirmPassword: string;
}

const model: FormModel = reactive({
  phoneOrEmail: '',
  code: '',
  password: '',
  confirmPassword: ''
});

type RuleRecord = Partial<Record<keyof FormModel, App.Global.FormRule[]>>;
const rules = computed<RuleRecord>(() => {
  const { formRules, createConfirmPwdRule } = useFormRules();
  return {
    phoneOrEmail: formRules.phoneOrEmail,
    password: formRules.pwd,
    confirmPassword: createConfirmPwdRule(model.password)
  };
});

async function handleSubmit() {
  const valid = await validateField();
  if (valid) {
    if (REG_PHONE.test(model.phoneOrEmail)) {
      const { error } = await updateUserPhone({
        phone: model.phoneOrEmail,
        captcha: model.code,
        oldPassword: encryptByRsa(model.confirmPassword) as string
      });
      if (!error) {
        window.$message?.info('密码重置成功');
      }
    }
    if (REG_EMAIL.test(model.phoneOrEmail)) {
      const { error } = await updateUserEmail({
        email: model.phoneOrEmail,
        captcha: model.code,
        oldPassword: encryptByRsa(model.confirmPassword) as string
      });
      if (!error) {
        window.$message?.info('密码重置成功');
      }
    }
  }
}

// 弹出行为验证码
const onPuzzleCaptcha = async () => {
  if (captchaLoading.value) return;
  restoreValidation();
  const valid = await validateField(['phoneOrEmail']);
  if (valid) {
    verifyRef.value.show();
  }
};
</script>

<template>
  <div>
    <NForm ref="formRef" :model="model" :rules="rules" :show-label="false">
      <NFormItem path="phoneOrEmail">
        <NInput v-model:value="model.phoneOrEmail" :placeholder="$t('form.phoneOrEmail.required')" />
      </NFormItem>
      <NFormItem path="code">
        <div class="w-full flex-y-center gap-16px">
          <NInput v-model:value="model.code" :placeholder="$t('page.login.common.codePlaceholder')" />
          <NButton size="large" :disabled="isCounting" :loading="loading" @click="onPuzzleCaptcha">
            {{ label }}
          </NButton>
        </div>
      </NFormItem>
      <NFormItem path="password">
        <NInput
          v-model:value="model.password"
          type="password"
          show-password-on="click"
          :placeholder="$t('page.login.common.passwordPlaceholder')"
        />
      </NFormItem>
      <NFormItem path="confirmPassword">
        <NInput
          v-model:value="model.confirmPassword"
          type="password"
          show-password-on="click"
          :placeholder="$t('page.login.common.confirmPasswordPlaceholder')"
        />
      </NFormItem>
      <NSpace vertical :size="18" class="w-full">
        <NButton type="primary" size="large" round block @click="handleSubmit">
          {{ $t('common.confirm') }}
        </NButton>
        <NButton size="large" round block @click="toggleLoginModule('pwd-login')">
          {{ $t('page.login.common.back') }}
        </NButton>
      </NSpace>
    </NForm>
    <VueVerify
      ref="verifyRef"
      :captcha-type="captchaType"
      :mode="captchaMode"
      :img-size="{ width: '330px', height: '155px' }"
      @success="getCaptcha(model.phoneOrEmail)"
    />
  </div>
</template>

<style scoped></style>
