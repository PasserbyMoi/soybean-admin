<script setup lang="ts">
import { listUserSocial } from '@/apis';
import { useAuthStore } from '@/store/modules/auth';
import type { ModeItem } from '../type';
import VerifyModel from './verify-modal.vue';

defineOptions({
  name: 'ProfileSecurity'
});

const userStore = useAuthStore();
const userInfo = computed(() => userStore.userInfo);
const socialList = ref<any>([]);
const modeList = ref<ModeItem[]>([]);

// 初始化数据
const initData = () => {
  listUserSocial().then(res => {
    socialList.value = res.data?.map(el => el.source);
    modeList.value = [
      {
        title: '安全手机',
        icon: 'phone-color',
        value: userInfo.value.phone,
        subtitle: `${userInfo.value.phone ? '' : '手机号'}可用于登录、身份验证、密码找回、通知接收`,
        type: 'phone',
        jumpMode: 'modal',
        status: Boolean(userInfo.value.phone),
        statusString: userInfo.value.phone ? '已绑定' : '未绑定'
      },
      {
        title: '安全邮箱',
        icon: 'email-color',
        value: userInfo.value.email,
        subtitle: `${userInfo.value.email ? '' : '邮箱'}可用于登录、身份验证、密码找回、通知接收`,
        type: 'email',
        jumpMode: 'modal',
        status: Boolean(userInfo.value.email),
        statusString: userInfo.value.email ? '已绑定' : '未绑定'
      },
      {
        title: '登录密码',
        icon: 'password-color',
        subtitle: userInfo.value.pwdResetTime
          ? `为了您的账号安全，建议定期修改密码`
          : '请设置密码，可通过账号+密码登录',
        type: 'password',
        jumpMode: 'modal',
        status: Boolean(userInfo.value.pwdResetTime),
        statusString: userInfo.value.pwdResetTime ? '已设置' : '未设置'
      }
    ];
  });
};

const verifyModelRef = ref<InstanceType<typeof VerifyModel>>();
// 修改
const onUpdate = (type: CommonType.UserVerifyType, _status: boolean) => {
  verifyModelRef.value?.open(type);
};

onMounted(() => {
  initData();
});
</script>

<template>
  <NCard title="安全设置" bordered size="small">
    <NList :bordered="false">
      <NListItem v-for="item in modeList" :key="item.title">
        <template #prefix>
          <NAvatar round color="#f2f3f5" class="size-48px">
            <SvgIcon :local-icon="item.icon" class="size-28px" />
          </NAvatar>
        </template>
        <template #suffix>
          <NButton
            v-if="item.jumpMode === 'modal'"
            size="small"
            :type="item.status ? 'default' : 'primary'"
            @click="onUpdate(item.type, item.status)"
          >
            {{ ['password'].includes(item.type) || item.status ? '修改' : '绑定' }}
          </NButton>
        </template>
        <div>
          <div class="mb-6px">
            <NText>{{ item.title }}</NText>
            <NText :type="item.status ? 'success' : 'warning'" class="ml-10px font-size-12px">
              <icon-local-check-circle v-if="item.status" class="success" />
              <icon-local-exclamation-circle v-else class="warning" />
              {{ item.status ? '已绑定' : '未绑定' }}
            </NText>
          </div>
          <div class="font-size-12px color-#666666">
            <span class="value">{{ item.value }}</span>
            {{ item.subtitle }}
          </div>
        </div>
      </NListItem>
    </NList>
    <VerifyModel ref="verifyModelRef" />
  </NCard>
</template>

<style lang="scss" scoped>
:deep(.n-upload-trigger.n-upload-trigger--disabled) {
  opacity: 100;
}
</style>
