<script setup lang="ts">
import { listUserSocial } from '@/apis';
import { useAuthStore } from '@/store/modules/auth';
import { $t } from '@/locales';
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
        title: 'phone',
        icon: 'phone-color',
        value: userInfo.value.phone,
        subtitle: $t('page.profile.security.accountTip', {
          account: userInfo.value.phone ? '' : $t('page.profile.base.phone')
        }),
        type: 'phone',
        jumpMode: 'modal',
        status: Boolean(userInfo.value.phone)
        // statusString: userInfo.value.phone ? $t('common.bind.bound') : $t('common.bind.unbound')
      },
      {
        title: 'mail',
        icon: 'email-color',
        value: userInfo.value.email,
        subtitle: $t('page.profile.security.accountTip', {
          account: userInfo.value.email ? '' : $t('page.profile.base.mail')
        }),
        type: 'email',
        jumpMode: 'modal',
        status: Boolean(userInfo.value.email)
        // statusString: userInfo.value.email ? $t('common.bind.bound') : $t('common.bind.unbound')
      },
      {
        title: 'password',
        icon: 'password-color',
        subtitle: userInfo.value.pwdResetTime
          ? $t('page.profile.security.passwordUpdateTip')
          : $t('page.profile.security.passwordSettingTip'),
        type: 'password',
        jumpMode: 'modal',
        status: Boolean(userInfo.value.pwdResetTime)
        // statusString: userInfo.value.pwdResetTime ? $t('common.setting.isSet') : $t('common.setting.isNotSet')
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
  <NCard :title="$t('page.profile.security.title')" bordered size="small">
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
            {{ ['password'].includes(item.type) || item.status ? $t('common.modify') : $t('common.bind.bind') }}
          </NButton>
        </template>
        <div>
          <div class="mb-6px">
            <NText>{{ $t('page.profile.security.' + item.title) }}</NText>
            <NText :type="item.status ? 'success' : 'warning'" class="ml-10px font-size-12px">
              <icon-local-check-circle v-if="item.status" class="success" />
              <icon-local-exclamation-circle v-else class="warning" />
              {{ item.status ? $t('common.bind.bound') : $t('common.bind.unbound') }}
            </NText>
          </div>
          <div class="font-size-12px color-#666666">
            {{
              item.title === 'password'
                ? item.status
                  ? $t('page.profile.security.passwordUpdateTip')
                  : $t('page.profile.security.passwordSettingTip')
                : $t('page.profile.security.accountTip', {
                    prefix: item.status ? item.value : $t('page.profile.base.' + item.title)
                  })
            }}
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
