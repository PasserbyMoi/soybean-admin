<script setup lang="ts">
import type { UploadFileInfo } from 'naive-ui';
import { useAuthStore } from '@/store/modules/auth';
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
    window.$message?.error('取消上传');
  } else {
    avatarFiles.value[0].name = option.file.name;
    const reader = new FileReader();
    reader.readAsDataURL(option.file.file);
    reader.onload = () => {
      window.$message?.error('上传成功');
      options.img = reader.result;
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
  <NCard title="基本信息" bordered size="small" segmented>
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
      label-align="right"
      separator="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
      label-class="text-color-#666666 text-size-14px"
      label-style="width: 100px"
      class="mb-24px ml-12px"
    >
      <NDescriptionsItem :span="1" label-class="w-100px">
        <template #label>
          <icon-local-user />
          <span class="ml-5px">用户名</span>
        </template>
        {{ userInfo.username }}
        <icon-local-man v-if="userInfo.gender === 1" class="text-#19bbf1" />
        <icon-local-woman v-else-if="userInfo.gender === 2" class="text-#fa7fa9" />
      </NDescriptionsItem>
      <NDescriptionsItem :span="1">
        <template #label>
          <icon-local-mobile />
          <span class="ml-5px">手&nbsp;&nbsp;&nbsp;机</span>
        </template>
        {{ userInfo.phone || '暂无' }}
      </NDescriptionsItem>
      <NDescriptionsItem :span="1">
        <template #label>
          <icon-local-email />
          <span class="ml-5px">邮&nbsp;&nbsp;&nbsp;箱</span>
        </template>
        {{ userInfo.email || '暂无' }}
      </NDescriptionsItem>
      <NDescriptionsItem :span="1">
        <template #label>
          <icon-local-mind-mapping />
          <span class="ml-5px">部&nbsp;&nbsp;&nbsp;门</span>
        </template>
        {{ userInfo.deptName }}
      </NDescriptionsItem>
      <NDescriptionsItem :span="1">
        <template #label>
          <icon-local-user-group />
          <span class="ml-5px">角&nbsp;&nbsp;&nbsp;色</span>
        </template>
        {{ userInfo.roles.join('，') }}
      </NDescriptionsItem>
    </NDescriptions>
    <template #footer>
      <NFlex justify="center" class="h-40px items-center">
        <div class="text-size-12px">注册于 {{ userInfo.registrationDate }}</div>
      </NFlex>
    </template>
  </NCard>

  <ProfileBaseModal v-model:visible="visibleBase" />
  <ProfileAvatarModal v-model:visible="visibleAvatar" v-model:options="options" v-model:avatar-files="avatarFiles" />
</template>

<style scoped></style>
