<script setup lang="ts">
import { listUserSocial, socialAuth, unbindSocialAccount } from '@/apis';
import type { ModeItem } from '../type';
import VerifyModel from './verify-modal.vue';

defineOptions({
  name: 'ProfileSocial'
});

const socialList = ref<any>([]);
const modeList = ref<ModeItem[]>([]);

// 初始化数据
const initData = () => {
  listUserSocial().then(res => {
    socialList.value = res.data?.map(el => el.source);
    modeList.value = [
      {
        title: '绑定 Gitee',
        icon: 'gitee',
        subtitle: `${socialList.value.includes('GITEE') ? '' : '绑定后，'}可通过 Gitee 进行登录`,
        jumpMode: 'link',
        type: 'gitee',
        status: socialList.value.includes('GITEE')
      },
      {
        title: '绑定 GitHub',
        icon: 'github',
        subtitle: `${socialList.value.includes('GITHUB') ? '' : '绑定后，'}可通过 GitHub 进行登录`,
        type: 'github',
        jumpMode: 'link',
        status: socialList.value.includes('GITHUB')
      }
    ];
  });
};

// 绑定
const onBinding = (type: string, status: boolean) => {
  if (!status) {
    socialAuth(type).then(res => {
      window.open(res.data?.authorizeUrl, '_self');
    });
  } else {
    unbindSocialAccount(type).then(() => {
      initData();
      window.$message?.success('解绑成功');
    });
  }
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
  <NCard title="第三方账号" bordered size="small">
    <NList :bordered="false">
      <NListItem v-for="item in modeList" :key="item.title">
        <template #prefix>
          <NAvatar round color="#f2f3f5" class="size-48px">
            <SvgIcon :local-icon="item.icon" class="size-28px color-#333" />
          </NAvatar>
        </template>
        <template #suffix>
          <NButton
            v-if="item.jumpMode === 'modal'"
            :type="item.status ? 'default' : 'primary'"
            size="small"
            @click="onUpdate(item.type, item.status)"
          >
            {{ item.status ? '修改' : '绑定' }}
          </NButton>
          <NButton
            v-else-if="item.jumpMode === 'link'"
            size="small"
            :type="item.status ? 'default' : 'primary'"
            @click="onBinding(item.type, item.status)"
          >
            {{ item.status ? '解绑' : '绑定' }}
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
  </NCard>
  <VerifyModel ref="verifyModelRef" />
</template>

<style lang="scss" scoped>
:deep(.n-upload-trigger.n-upload-trigger--disabled) {
  opacity: 100;
}
</style>
