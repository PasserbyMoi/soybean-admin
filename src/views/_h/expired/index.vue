<script setup lang="ts">
import { computed } from 'vue';
import { getPaletteColorByNumber, mixColor } from '@sa/color';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { useRouterPush } from '@/hooks/common/router';
import { encryptByRsa } from '@/utils/encrypt';
import { updateUserPassword } from '@/apis';
import { useAuthStore } from '@/store/modules/auth';
import { clearAuthStorage } from '@/store/modules/auth/shared';

const appStore = useAppStore();
const themeStore = useThemeStore();
const { formRef, validateField } = useNaiveForm();
const { goLogin } = useRouterPush(false);

const bgThemeColor = computed(() =>
  themeStore.darkMode ? getPaletteColorByNumber(themeStore.themeColor, 600) : themeStore.themeColor
);

const bgColor = computed(() => {
  const COLOR_WHITE = '#ffffff';
  const ratio = themeStore.darkMode ? 0.5 : 0.2;
  return mixColor(COLOR_WHITE, themeStore.themeColor, ratio);
});

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
      window.$message?.info($t('common.modifySuccess'), { duration: 4500 });
      const authStore = useAuthStore();
      clearAuthStorage();
      authStore.$reset();
      goLogin();
    }
  }
}
</script>

<template>
  <div class="relative size-full flex-center overflow-hidden" :style="{ backgroundColor: bgColor }">
    <WaveBg :theme-color="bgThemeColor" />
    <NCard :bordered="false" class="relative z-4 w-auto rd-12px">
      <div class="w-400px lt-sm:w-300px">
        <header class="flex-y-center justify-between">
          <SystemLogo class="text-64px text-primary lt-sm:text-48px" />
          <h3 class="text-28px text-primary font-500 lt-sm:text-22px">{{ $t('system.title') }}</h3>
          <div class="i-flex-col">
            <ThemeSchemaSwitch
              :theme-schema="themeStore.themeScheme"
              :show-tooltip="false"
              class="text-20px lt-sm:text-18px"
              @switch="themeStore.toggleThemeScheme"
            />
            <LangSwitch
              :lang="appStore.locale"
              :lang-options="appStore.localeOptions"
              :show-tooltip="false"
              @change-lang="appStore.changeLocale"
            />
          </div>
        </header>
        <main class="pt-24px">
          <!-- <h3 class="text-18px text-primary font-medium">{{ $t(activeModule.label) }}</h3> -->
          <NSpace vertical :size="24">
            <NAlert type="error" :bordered="false">{{ $t('page.login.common.modifyNotify') }}</NAlert>
            <NForm ref="formRef" :model="model" :rules="rules" :show-label="false">
              <NFormItem path="oldPassword">
                <NInput
                  v-model:value="model.oldPassword"
                  size="large"
                  type="password"
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
        </main>
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>
