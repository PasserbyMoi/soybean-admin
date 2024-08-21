<script setup lang="ts">
import type { UploadFileInfo } from 'naive-ui';
import { useAuthStore } from '@/store/modules/auth';
import { $t } from '@/locales';
import ProfileBaseModal from './profile-base-modal.vue';
import ProfileAvatarModal from './profile-avatar-modal.vue';

defineOptions({
  name: 'ProfileBasicInfo'
});

const userStore = useAuthStore();
const userInfo = computed(() => userStore.userInfo);

const visibleAvatar = ref(false);
const visibleBase = ref(false);
const uploadRef = ref();
const avatarFiles = ref<UploadFileInfo[]>([
  { id: '1', name: 'avatar.png', status: 'pending', url: userInfo.value.avatar }
]);

const options = reactive({
  img: userInfo.value.avatar,
  autoCrop: true,
  autoCropWidth: 160,
  autoCropHeight: 160,
  fixedBox: true,
  fixed: true,
  full: false,
  centerBox: true,
  canMove: true,
  outputSize: 1,
  outputType: 'png'
});

// 打开裁剪框
const onBeforeUpload = (option: { file: UploadFileInfo; fileList: UploadFileInfo[] }): boolean => {
  if (!option.file || !option.file.name || !option.file.file) {
    window.$message?.error($t('common.uploadCancel'));
  } else {
    avatarFiles.value[0].name = option.file.name;
    const reader = new FileReader();
    reader.readAsDataURL(option.file.file);
    reader.onload = () => {
      window.$message?.success($t('common.uploadSuccess'));
      options.img = reader.result as string;
    };
    visibleAvatar.value = true;
  }
  return false;
};

// 修改基本信息
const onUpdateBase = async () => {
  visibleBase.value = true;
};
</script>

<template>
  <NCard :title="$t('page.profile.base.title')" bordered size="small" segmented>
    <NFlex vertical justify="center" class="h-300px items-center">
      <div>
        <NUpload
          ref="uploadRef"
          accept="image/*"
          list-type="image"
          :file-list="avatarFiles"
          :show-file-list="false"
          :on-before-upload="onBeforeUpload"
        >
          <NAvatar :size="100" round class="cursor-pointer" :img-props="{ src: avatarFiles[0].url ?? '' }"></NAvatar>
          <NAvatar :size="30" round class="position-relative left--30px top-0px cursor-pointer bg-#ddddddBB">
            <icon-local-camera class="text-size-20px" />
          </NAvatar>
        </NUpload>
      </div>
      <NSpace>
        <NText class="text-size-18px">{{ userInfo.nickname }}</NText>
        <icon-local-edit class="cursor-pointer" @click="onUpdateBase" />
      </NSpace>
      <NSpace>
        <icon-local-id class="text-size-16px" />
        <NText class="text-size-12px">{{ userInfo.id }}</NText>
      </NSpace>
    </NFlex>
    <NDescriptions
      :column="1"
      size="large"
      label-placement="left"
      separator="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
      class="mb-24px ml-12px"
    >
      <NDescriptionsItem :span="1">
        <template #label>
          <th class="th-label">
            <icon-local-user />
            <span>
              {{ $t('page.profile.base.username') }}
            </span>
          </th>
        </template>
        {{ userInfo.username }}
        <icon-local-man v-if="userInfo.gender === 1" class="text-#19bbf1" />
        <icon-local-woman v-else-if="userInfo.gender === 2" class="text-#fa7fa9" />
      </NDescriptionsItem>
      <NDescriptionsItem :span="1">
        <template #label>
          <th class="th-label">
            <icon-local-mobile />
            <span>{{ $t('page.profile.base.phone') }}</span>
          </th>
        </template>
        {{ userInfo.phone || $t('page.profile.base.notYet') }}
      </NDescriptionsItem>
      <NDescriptionsItem :span="1">
        <template #label>
          <th class="th-label">
            <icon-local-email />
            <span>{{ $t('page.profile.base.mail') }}</span>
          </th>
        </template>
        {{ userInfo.email || $t('page.profile.base.notYet') }}
      </NDescriptionsItem>
      <NDescriptionsItem :span="1">
        <template #label>
          <th class="th-label">
            <icon-local-mind-mapping />
            <span>{{ $t('page.profile.base.dept') }}</span>
          </th>
        </template>
        {{ userInfo.deptName }}
      </NDescriptionsItem>
      <NDescriptionsItem :span="1">
        <template #label>
          <th class="th-label">
            <icon-local-user-group />
            <span>{{ $t('page.profile.base.role') }}</span>
          </th>
        </template>
        {{ userInfo.roles.join('，') }}
      </NDescriptionsItem>
    </NDescriptions>
    <template #footer>
      <NFlex justify="center" class="h-40px items-center">
        <div class="text-size-12px">{{ $t('page.profile.base.registeredIn') + userInfo.registrationDate }}</div>
      </NFlex>
    </template>
  </NCard>

  <ProfileBaseModal v-model:visible="visibleBase" />
  <ProfileAvatarModal v-model:visible="visibleAvatar" v-model:options="options" v-model:avatar-files="avatarFiles" />
</template>

<style lang="css" scoped>
.th-label {
  min-width: 95px;
}
.th-label span {
  font-size: 0.8rem;
  font-weight: 500;
  color: #666666;
  margin-left: 5px;
}
.th-label svg {
  margin-bottom: 3px;
}
</style>
