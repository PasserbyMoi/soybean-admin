<script setup lang="ts">
import type { UploadFileInfo } from 'naive-ui';
import { NButton, NSpace } from 'naive-ui';
import { VueCropper } from 'vue-cropper';
import { uploadAvatar } from '@/apis';
import { $t } from '@/locales';
import { useAuthStore } from '@/store/modules/auth';
import 'vue-cropper/dist/index.css';

defineOptions({
  name: 'ProfileAvatarModal'
});

const visible = defineModel<boolean>('visible', {
  default: false
});

const options = defineModel<any>('options', {
  default: {}
});

const avatarFiles = defineModel<UploadFileInfo[]>('avatarFiles', {
  default: {}
});

const userStore = useAuthStore();
const userInfo = computed(() => userStore.userInfo);
const cropperRef = ref();

const previews: any = ref({});
const previewStyle: any = ref({});

// 实时预览
const handleRealTime = (data: any) => {
  previews.value = data;
  previewStyle.value = {
    width: `${data.w}px`,
    height: `${data.h}px`,
    overflow: 'hidden',
    margin: '0',
    zoom: 100 / data.h,
    borderRadius: '50%'
  };
};

// 提交
async function handleSubmit() {
  cropperRef.value.getCropBlob((data: any) => {
    const formData = new FormData();
    formData.append('avatarFile', data, avatarFiles.value[0].name);
    uploadAvatar(formData).then(res => {
      userInfo.value.avatar = res.data.avatar;
      avatarFiles.value[0].url = res.data.avatar;
      window.$message?.success($t('common.uploadSuccess'));
      closeDrawer();
    });
  });
}

// 关闭窗口
function closeDrawer() {
  visible.value = false;
  options.value.img = null;
}
</script>

<template>
  <NModal
    v-model:show="visible"
    preset="card"
    :title="$t('common.upload')"
    class="w-500px"
    close-on-esc
    segmented
    @after-leave="closeDrawer"
  >
    <NSpace :wrap="false">
      <div class="h-200px w-200px">
        <VueCropper
          ref="cropperRef"
          :img="options.img"
          :info="true"
          :auto-crop="options.autoCrop"
          :auto-crop-width="options.autoCropWidth"
          :auto-crop-height="options.autoCropHeight"
          :fixed-box="options.fixedBox"
          :fixed="options.fixed"
          :full="options.full"
          :center-box="options.centerBox"
          :can-move="options.canMove"
          :output-type="options.outputType"
          :output-size="options.outputSize"
        />
      </div>
    </NSpace>
    <template #footer>
      <NSpace :size="16" justify="end">
        <NButton @click="closeDrawer()">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
