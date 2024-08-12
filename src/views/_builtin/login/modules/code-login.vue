<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useFps } from '@vueuse/core';
import { $t } from '@/locales';
import { useRouterPush } from '@/hooks/common/router';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { useCaptcha } from '@/hooks/business/captcha';
import VueVerify from '@/components/custom/vue-verify/index.vue';
import { useAuthStore } from '@/store/modules/auth';
import { REG_EMAIL, REG_PHONE } from '@/constants/reg';

const currentFps = useFps();

defineOptions({
  name: 'CodeLogin'
});

const userStore = useAuthStore();
const { toggleLoginModule } = useRouterPush();
const { formRef, validateField, restoreValidation } = useNaiveForm();
const { label, isCounting, loading, getCaptcha } = useCaptcha(currentFps.value);

interface FormModel {
  phoneOrEmail: string;
  code: string;
}

const model: FormModel = reactive({
  phoneOrEmail: '',
  code: ''
});

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  const { formRules } = useFormRules();
  return {
    phoneOrEmail: formRules.phoneOrEmail,
    code: formRules.code
  };
});

const verifyRef = ref<InstanceType<any>>();
const captchaType = ref('blockPuzzle');
const captchaMode = ref('pop');
const captchaLoading = ref(false);

// 弹出行为验证码
const onPuzzleCaptcha = async () => {
  if (captchaLoading.value) return;
  restoreValidation();
  const valid = await validateField(['phoneOrEmail']);
  if (valid) {
    verifyRef.value.show();
  }
};

async function handleSubmit() {
  const valid = await validateField();
  if (valid) {
    if (REG_PHONE.test(model.phoneOrEmail)) {
      userStore
        .loginByPhone(model.phoneOrEmail, model.code)
        .then(() => {
          window.$message?.success($t('page.login.common.validateSuccess'));
        })
        .catch(() => {
          window.$message?.error('0000000000000');
        });
    }
    if (REG_EMAIL.test(model.phoneOrEmail)) {
      userStore
        .loginByEmail(model.phoneOrEmail, model.code)
        .then(() => {
          window.$message?.success($t('page.login.common.validateSuccess'));
        })
        .catch(() => {
          window.$message?.error('0000000000000');
        });
    }
  }
}
</script>

<template>
  <div>
    <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
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
