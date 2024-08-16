<script setup lang="ts">
import { computed, reactive } from 'vue';
import { $t } from '@/locales';
import { loginModuleRecord } from '@/constants/app';
import { useRouterPush } from '@/hooks/common/router';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { useAuthStore } from '@/store/modules/auth';
import { getImageCaptcha } from '@/apis/common/captcha';
import type { AccountLoginReq } from '@/apis/auth/type';
import { socialAuth } from '@/apis';

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
  const { formRules } = useFormRules();
  return {
    username: formRules.username,
    password: formRules.pwd,
    captcha: formRules.captcha,
    uuid: formRules.defaultRequiredRule
  };
});

async function handleSubmit() {
  await validate();
  const error = await authStore.login(model);
  if (error) {
    getCaptcha();
  }
}

type OAuthKey = 'gitee' | 'github';

interface OAuthAccount {
  key: OAuthKey;
  label: string;
  icon: string;
}

const oauthAccounts = computed<OAuthAccount[]>(() => [
  {
    key: 'gitee',
    label: 'Gitee',
    icon: 'gitee'
  },
  {
    key: 'github',
    label: 'Github',
    icon: 'github'
  }
]);

// 第三方登录授权
const handleOauthLogin = async (source: string) => {
  const { data, error } = await socialAuth(source);
  if (!error) {
    window.location.href = data.authorizeUrl;
  }
};

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
      <!-- 第三方登录 -->
      <NDivider class="text-14px text-#666 !m-0">{{ $t('page.login.pwdLogin.otherAccountLogin') }}</NDivider>
      <div class="flex-center gap-16px">
        <NButton v-for="item in oauthAccounts" :key="item.key" quaternary circle @click="handleOauthLogin(item.key)">
          <SvgIcon :local-icon="item.icon" class="size-26px cursor-pointer" />
        </NButton>
      </div>
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
