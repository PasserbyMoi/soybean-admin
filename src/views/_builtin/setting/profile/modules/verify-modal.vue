<script setup lang="ts">
import type { FormItemRule } from 'naive-ui';
import { NButton, NSpace } from 'naive-ui';
import { getEmailCaptcha, getSmsCaptcha, updateUserEmail, updateUserPassword, updateUserPhone } from '@/apis';
import { $t } from '@/locales';
import { useNaiveForm } from '@/hooks/common/form';
import { encryptByRsa } from '@/utils/encrypt';
import { useAuthStore } from '@/store/modules/auth';
import VueVerify from '@/components/custom/vue-verify/index.vue';
import { REG_PHONE } from '@/constants/reg';

defineOptions({
  name: 'VerifyModal'
});

const verifyType = ref<CommonType.UserVerifyType>('phone');
const visible = ref<boolean>(false);

interface Emits {
  (e: 'submitted'): void;
}
const emit = defineEmits<Emits>();

const userStore = useAuthStore();
const userInfo = computed(() => userStore.userInfo);
const { formRef, validateField, restoreValidation } = useNaiveForm();

const title = computed(() => {
  const titles: Record<CommonType.UserVerifyType, string> = {
    phone: '修改手机号',
    password: '修改密码',
    email: '修改邮箱'
  };
  return titles[verifyType.value];
});

const model = reactive(createDefaultModel());
function createDefaultModel() {
  return {
    phone: '',
    email: '',
    captcha: '',
    oldPassword: '',
    newPassword: '',
    rePassword: ''
  };
}

const rules: Record<string, App.Global.FormRule[]> = {
  phone: [
    { key: 'phone', required: true, message: '请输入手机号' },
    { key: 'phone', type: 'string', pattern: REG_PHONE, message: '请输入正确的手机号' }
  ],
  email: [
    { key: 'email', required: true, message: '请输入邮箱' },
    { key: 'email', type: 'email', message: '请输入正确的邮箱' }
  ],
  captcha: [{ required: true, message: '请输入验证码' }],
  oldPassword: [{ required: true, message: '请输入当前密码' }],
  newPassword: [
    { required: true, message: '请输入新密码' },
    {
      message: '新密码不能与当前密码相同',
      validator: (_rule: FormItemRule, value: any) => {
        return value !== model.oldPassword;
      }
    }
  ],
  rePassword: [
    { required: true, message: '请再次输入新密码' },
    {
      message: '两次输入的密码不一致',
      validator: (_rule: FormItemRule, value: any) => {
        return value !== model.newPassword;
      }
    }
  ]
};

const verifyRef = ref<InstanceType<any>>();
const captchaType = ref('blockPuzzle');
const captchaMode = ref('pop');
const captchaTimer = ref();
const captchaTime = ref(60);
const captchaBtnName = ref('获取验证码');
const captchaDisable = ref(false);
const captchaLoading = ref(false);

// 弹出行为验证码
const onCaptcha = async () => {
  if (captchaLoading.value) return;
  restoreValidation();
  const valid = await validateField(['phone', 'email']);
  if (valid) {
    verifyRef.value.show();
  }
};

// 获取验证码
const getCaptcha = async () => {
  // 发送验证码
  try {
    captchaLoading.value = true;
    captchaBtnName.value = '发送中...';
    if (verifyType.value === 'phone') {
      await getSmsCaptcha({
        phone: model.phone
      });
    } else if (verifyType.value === 'email') {
      await getEmailCaptcha({
        email: model.email
      });
    }
    captchaLoading.value = false;
    captchaDisable.value = true;
    captchaBtnName.value = `获取验证码(${(captchaTime.value -= 1)}s)`;
    window.$message?.success('仅提供效果演示，实际使用请查看代码取消相关注释');
    captchaTimer.value = window.setInterval(() => {
      captchaTime.value -= 1;
      captchaBtnName.value = `获取验证码(${captchaTime.value}s)`;
      if (captchaTime.value <= 0) {
        resetCaptcha();
      }
    }, 1000);
  } catch (error) {
    resetCaptcha();
  } finally {
    captchaLoading.value = false;
  }
};

// 重置验证码
const resetCaptcha = () => {
  window.clearInterval(captchaTimer.value);
  captchaTime.value = 60;
  captchaBtnName.value = '获取验证码';
  captchaDisable.value = false;
};

// 提交
async function handleSubmit() {
  const valid = await validateField();
  if (!valid) {
    return false;
  }
  try {
    if (verifyType.value === 'phone') {
      await updateUserPhone({
        phone: model.phone,
        captcha: model.captcha,
        oldPassword: encryptByRsa(model.oldPassword) as string
      });
    } else if (verifyType.value === 'email') {
      await updateUserEmail({
        email: model.email,
        captcha: model.captcha,
        oldPassword: encryptByRsa(model.oldPassword) as string
      });
    } else if (verifyType.value === 'password') {
      if (model.newPassword !== model.rePassword) {
        window.$message?.error('两次新密码不一致');
        return false;
      }
      if (model.newPassword === model.oldPassword) {
        window.$message?.error('新密码与旧密码不能相同');
        return false;
      }
      await updateUserPassword({
        oldPassword: encryptByRsa(model.oldPassword) || '',
        newPassword: encryptByRsa(model.newPassword) || ''
      });
    }
    window.$message?.success('修改成功');
    // 修改成功后，重新获取用户信息
    await userStore.initUserInfo();
    return true;
  } catch (error) {
    window.$message?.error(`修改失败：${error}`);
    return false;
  }
}

// 关闭窗口
function closeDrawer(submitted: boolean = false) {
  visible.value = false;
  resetCaptcha();
  if (submitted) {
    nextTick(() => {
      emit('submitted');
    });
  }
}

watch(visible, () => {
  if (visible.value) {
    restoreValidation();
  }
});

// 打开弹框
const open = (type: CommonType.UserVerifyType) => {
  verifyType.value = type;
  visible.value = true;
};

defineExpose({ open });
</script>

<template>
  <NModal
    v-model:show="visible"
    preset="card"
    class="w-560px"
    :title="title"
    close-on-esc
    segmented
    @after-leave="closeDrawer"
  >
    <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="100px">
      <NFormItem v-if="verifyType === 'phone'" label="手机号" path="phone">
        <NInput v-model:value="model.phone" placeholder="请输入手机号" :max-length="150" clearable />
      </NFormItem>
      <NFormItem v-if="verifyType === 'email'" label="邮箱" path="email">
        <NInput v-model:value="model.email" placeholder="请输入邮箱" :max-length="150" clearable />
      </NFormItem>
      <NFormItem v-if="verifyType !== 'password'" label="验证码" path="captcha">
        <NInput v-model:value="model.captcha" placeholder="请输入验证码" :max-length="150" clearable />
        <NButton class="ml-16px" :loading="captchaLoading" :disabled="captchaDisable" @click="onCaptcha">
          {{ captchaBtnName }}
        </NButton>
      </NFormItem>
      <NFormItem v-if="userInfo.pwdResetTime" label="当前密码" path="oldPassword">
        <NInput
          v-model:value="model.oldPassword"
          type="password"
          placeholder="请输入当前密码"
          :max-length="150"
          clearable
        />
      </NFormItem>
      <NFormItem v-if="verifyType === 'password'" label="新密码" path="newPassword">
        <NInput
          v-model:value="model.newPassword"
          type="password"
          placeholder="请输入新密码"
          :max-length="150"
          clearable
        />
      </NFormItem>
      <NFormItem v-if="verifyType === 'password'" label="确认新密码" path="rePassword">
        <NInput
          v-model:value="model.rePassword"
          type="password"
          placeholder="请再次输入新密码"
          :max-length="150"
          clearable
        />
      </NFormItem>
    </NForm>
    <template #footer>
      <NSpace :size="16" justify="end">
        <NButton @click="closeDrawer(false)">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
  <VueVerify
    ref="verifyRef"
    :captcha-type="captchaType"
    :mode="captchaMode"
    :img-size="{ width: '330px', height: '155px' }"
    @success="getCaptcha"
  />
</template>
