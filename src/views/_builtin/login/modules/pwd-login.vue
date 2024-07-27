<script setup lang="ts">
import { computed, reactive } from 'vue';
import { $t } from '@/locales';
import { loginModuleRecord } from '@/constants/app';
import { useRouterPush } from '@/hooks/common/router';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { useAuthStore } from '@/store/modules/auth';
import { getImageCaptcha } from '@/apis/common/captcha';
import type { AccountLoginReq } from '@/apis/auth/type';

defineOptions({
  name: 'PwdLogin'
});

const authStore = useAuthStore();
const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useNaiveForm();

const model: AccountLoginReq = reactive({
  username: 'admin',
  password: 'admin123',
  captcha: '',
  uuid: ''
});

const rules = computed<Record<keyof AccountLoginReq, App.Global.FormRule[]>>(() => {
  // inside computed to make locale reactive, if not apply i18n, you can define it without computed
  const { formRules } = useFormRules();

  return {
    username: formRules.username,
    password: formRules.pwd,
    captcha: formRules.captcha,
    uuid: formRules.uuid
  };
});

async function handleSubmit() {
  await validate();
  await authStore.login(model);
}

// type AccountKey = 'super' | 'admin' | 'user';

// interface Account {
//   key: AccountKey;
//   label: string;
//   userName: string;
//   password: string;
// }

// const accounts = computed<Account[]>(() => [
//   {
//     key: 'super',
//     label: $t('page.login.pwdLogin.superAdmin'),
//     userName: 'Super',
//     password: '123456'
//   },
//   {
//     key: 'admin',
//     label: $t('page.login.pwdLogin.admin'),
//     userName: 'Admin',
//     password: '123456'
//   },
//   {
//     key: 'user',
//     label: $t('page.login.pwdLogin.user'),
//     userName: 'User',
//     password: '123456'
//   }
// ]);

// async function handleAccountLogin(account: Account) {
//   await authStore.login(model);
// }

const captchaImgBase64 = ref<string>();
const expired = ref<boolean>(true);

// 验证码过期定时器
let timer: string | number | NodeJS.Timeout | undefined;
const startTimer = (expireTime: number) => {
  if (timer) {
    clearTimeout(timer);
  }
  const remainingTime = expireTime - Date.now();
  if (remainingTime <= 0) {
    expired.value = true;
    return;
  }
  timer = setTimeout(() => {
    expired.value = true;
  }, remainingTime);
};

// 获取验证码
const getCaptcha = () => {
  getImageCaptcha().then(res => {
    if (res.data) {
      const { uuid, img, expireTime } = res.data;
      model.uuid = uuid;
      captchaImgBase64.value = img;
      expired.value = false;
      startTimer(expireTime);
    }
  });
};

// 组件销毁时清理定时器
onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer);
  }
});

onMounted(() => {
  getCaptcha();
});
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false">
    <NFormItem path="userName">
      <NInput v-model:value="model.username" :placeholder="$t('page.login.common.userNamePlaceholder')" />
    </NFormItem>
    <NFormItem path="password">
      <NInput
        v-model:value="model.password"
        type="password"
        show-password-on="click"
        :placeholder="$t('page.login.common.passwordPlaceholder')"
      />
    </NFormItem>
    <NFormItem path="captcha" class="justify-between">
      <NInput
        v-model:value="model.captcha"
        :max-length="4"
        :placeholder="$t('page.login.common.codePlaceholder')"
        @keyup.enter="handleSubmit"
      />
      <div class="captcha-container" @click="getCaptcha">
        <img :src="captchaImgBase64" alt="验证码" class="captcha" />
        <div v-if="expired" class="overlay">
          <p>{{ $t('page.login.common.codeExpired') }}</p>
        </div>
      </div>
    </NFormItem>
    <NSpace vertical :size="24">
      <div class="flex-y-center justify-between">
        <NCheckbox>{{ $t('page.login.pwdLogin.rememberMe') }}</NCheckbox>
        <NButton quaternary @click="toggleLoginModule('reset-pwd')">
          {{ $t('page.login.pwdLogin.forgetPassword') }}
        </NButton>
      </div>
      <NButton type="primary" size="large" round block :loading="authStore.loginLoading" @click="handleSubmit">
        {{ $t('common.confirm') }}
      </NButton>
      <div class="flex-y-center justify-between gap-12px">
        <NButton class="flex-1" block @click="toggleLoginModule('code-login')">
          {{ $t(loginModuleRecord['code-login']) }}
        </NButton>
        <NButton class="flex-1" block @click="toggleLoginModule('register')">
          {{ $t(loginModuleRecord.register) }}
        </NButton>
      </div>
      <!--
  TODO: 第三方登录
 <NDivider class="text-14px text-#666 !m-0">{{ $t('page.login.pwdLogin.otherAccountLogin') }}</NDivider>
      <div class="flex-center gap-12px">
        <NButton v-for="item in accounts" :key="item.key" type="primary" @click="handleAccountLogin(item)">
          {{ item.label }}
        </NButton>
      </div>
-->
    </NSpace>
  </NForm>
</template>

<style scoped>
.captcha-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.captcha-container {
  position: relative;
  display: inline-block;
}

.captcha {
  width: 110px;
  height: 36px;
  margin: 0 0 0 0px;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(51, 51, 51, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay p {
  font-size: 12px;
  color: white;
}
</style>
