<script setup lang="ts">
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui';
import { NButton, NSpace } from 'naive-ui';
import type { OptionResp, SiteConfig } from '@/apis';
import { listOption, resetOptionValue, updateOption, uploadFile } from '@/apis';
import { $t } from '@/locales';
import { useNaiveForm } from '@/hooks/common/form';
import { useConfigStore } from '@/store/modules/config';

defineOptions({
  name: 'ConfigBasic'
});

const configStore = useConfigStore();
const loading = ref<boolean>(false);
const isEdit = ref<boolean>(false);
const { formRef, validate, restoreValidation } = useNaiveForm();

const uploadLogRef = ref();
const uploadFaviconRef = ref();

const faviconFile = ref<UploadFileInfo>({ id: 'favicon', name: 'favicon', status: 'pending', url: '' });
const logoFile = ref<UploadFileInfo>({ id: 'logo', name: 'logo', status: 'pending', url: '' });

const model = reactive(createDefaultModel());
function createDefaultModel() {
  return {
    SITE_FAVICON: '',
    SITE_LOGO: '',
    SITE_TITLE: '',
    SITE_DESCRIPTION: '',
    SITE_COPYRIGHT: '',
    SITE_BEIAN: ''
  };
}
const defaultOptionResp = ref<OptionResp>({
  id: '',
  name: '',
  code: '',
  value: '',
  description: ''
});
type RuleKey = Extract<keyof SiteConfig, 'SITE_TITLE' | 'SITE_COPYRIGHT'>;
const rules: Record<RuleKey, App.Global.FormRule[]> = {
  SITE_TITLE: [{ required: true, message: '请输入系统标题' }],
  SITE_COPYRIGHT: [{ required: true, message: '请输入版权信息' }]
};

const siteConfig = ref<SiteConfig>({
  SITE_FAVICON: defaultOptionResp.value,
  SITE_LOGO: defaultOptionResp.value,
  SITE_TITLE: defaultOptionResp.value,
  SITE_DESCRIPTION: defaultOptionResp.value,
  SITE_COPYRIGHT: defaultOptionResp.value,
  SITE_BEIAN: defaultOptionResp.value
});

// 初始化 model、数据
async function handleInitModel() {
  loading.value = true;
  const { data, error } = await listOption({ category: 'SITE' });
  if (!error) {
    data?.forEach((option: OptionResp) => {
      siteConfig.value[option.code] = { ...option };
    });
    handleCancel();
  }
  loading.value = false;
}

// 修改
const handleEdit = () => {
  isEdit.value = true;
};

// 取消
const handleCancel = () => {
  restoreValidation();
  reset();
  isEdit.value = false;
};

// 提交
async function handleSubmit() {
  await validate();
  const { error } = await updateOption(
    Object.entries(model).map(([key, value]) => {
      return { id: siteConfig.value[key].id, code: key, value };
    })
  );
  if (!error) {
    window.$message?.success($t('common.updateSuccess'));
    configStore.setSiteConfig(model);
    await handleInitModel();
  }
}

// 重置
async function handleDefault() {
  window.$dialog?.warning({
    title: '警告',
    content: '确认恢复基础配置为默认值吗？',
    positiveText: $t('common.confirm'),
    negativeText: $t('common.cancel'),
    maskClosable: false,
    onPositiveClick: () => {
      handleResetValue();
    }
  });
}

// 恢复默认
const handleResetValue = async () => {
  const { error } = await resetOptionValue({ category: 'SITE' });
  if (!error) {
    window.$message?.success('恢复成功');
    await handleInitModel();
    configStore.setSiteConfig(model);
  }
};

// 重置
const reset = () => {
  model.SITE_FAVICON = siteConfig.value.SITE_FAVICON?.value || '';
  model.SITE_LOGO = siteConfig.value.SITE_LOGO?.value || '';
  model.SITE_TITLE = siteConfig.value.SITE_TITLE?.value || '';
  model.SITE_DESCRIPTION = siteConfig.value.SITE_DESCRIPTION?.value || '';
  model.SITE_COPYRIGHT = siteConfig.value.SITE_COPYRIGHT?.value || '';
  model.SITE_BEIAN = siteConfig.value.SITE_BEIAN?.value || '';
  faviconFile.value.url = siteConfig.value.SITE_FAVICON?.value;
  logoFile.value.url = siteConfig.value.SITE_LOGO?.value;
};

// 上传 favicon
const handleUploadFavicon = ({ file, onFinish, onError, onProgress }: UploadCustomRequestOptions) => {
  const controller = new AbortController();
  (async function requestWrap() {
    onProgress({ percent: 20 });
    const formData = new FormData();
    formData.append('file', file.file as File);
    uploadFile(formData)
      .then(res => {
        onFinish();
        model.SITE_FAVICON = res.data?.url ?? '';
        faviconFile.value.url = res.data?.url;
        window.$message?.success('上传成功');
      })
      .catch(_error => {
        onError();
      });
  })();
  return {
    abort() {
      controller.abort();
    }
  };
};
const handleChangeFavicon = (options: { file: UploadFileInfo; fileList: Array<UploadFileInfo>; event?: Event }) => {
  faviconFile.value = {
    ...options.file
  };
};

// 上传 Logo
const handleUploadLogo = ({ file, onFinish, onError, onProgress }: UploadCustomRequestOptions) => {
  const controller = new AbortController();
  (async function requestWrap() {
    onProgress({ percent: 20 });
    const formData = new FormData();
    formData.append('file', file.file as File);
    uploadFile(formData)
      .then(res => {
        onFinish();
        model.SITE_LOGO = res.data?.url ?? '';
        logoFile.value.url = res.data?.url;
        window.$message?.success('上传成功');
      })
      .catch(_error => {
        onError();
      });
  })();
  return {
    abort() {
      controller.abort();
    }
  };
};
const handleChangeLogo = (options: { file: UploadFileInfo; fileList: Array<UploadFileInfo>; event?: Event }) => {
  logoFile.value = {
    ...options.file
  };
};

// 打开裁剪框
const onBeforeUpload = (): boolean => {
  return isEdit.value;
};

onMounted(() => {
  handleInitModel();
});
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" :disabled="!isEdit" label-placement="left" label-width="100px">
    <NList :bordered="false" :loading="loading">
      <NFormItem field="SITE_LOGO" :show-label="false">
        <NSpace vertical>
          <div strong>{{ siteConfig.SITE_LOGO?.name }}</div>
          <NText depth="3">{{ siteConfig.SITE_LOGO?.description }}</NText>
          <div>
            <NUpload
              ref="uploadLogRef"
              :file-list="logoFile ? [logoFile] : []"
              :show-file-list="false"
              :on-before-upload="onBeforeUpload"
              :custom-request="handleUploadLogo"
              accept="image/*"
              list-type="image"
              @change="handleChangeLogo"
            >
              <NAvatar
                v-if="logoFile && logoFile.url"
                :img-props="{ src: logoFile.url }"
                :size="48"
                color="#ffffff"
                class="cursor-pointer"
              ></NAvatar>
            </NUpload>
          </div>
        </NSpace>
      </NFormItem>
      <NFormItem field="SITE_FAVICON" :show-label="false">
        <NSpace vertical>
          <NText strong>{{ siteConfig.SITE_FAVICON?.name }}</NText>
          <NText depth="3">{{ siteConfig.SITE_FAVICON?.description }}</NText>
          <div>
            <NUpload
              ref="uploadFaviconRef"
              :file-list="faviconFile ? [faviconFile] : []"
              accept="image/*"
              list-type="image"
              :show-file-list="false"
              :on-before-upload="onBeforeUpload"
              :custom-request="handleUploadFavicon"
              @change="handleChangeFavicon"
            >
              <NAvatar
                v-if="faviconFile && faviconFile.url"
                :img-props="{ src: faviconFile.url }"
                :size="48"
                color="#ffffff"
                class="z-9999 cursor-pointer"
              ></NAvatar>
            </NUpload>
          </div>
        </NSpace>
      </NFormItem>

      <NFormItem path="SITE_TITLE" :label="siteConfig.SITE_TITLE?.name">
        <NInput v-model:value="model.SITE_TITLE" placeholder="请输入网站标题" :max-length="32" class="max-w-380px" />
      </NFormItem>
      <NFormItem path="SITE_DESCRIPTION" :label="siteConfig.SITE_DESCRIPTION?.name">
        <NInput
          v-model:value="model.SITE_DESCRIPTION"
          placeholder="请输入网站描述"
          :max-length="64"
          class="max-w-380px"
        />
      </NFormItem>
      <NFormItem path="SITE_COPYRIGHT" :label="siteConfig.SITE_COPYRIGHT?.name">
        <NInput
          v-model:value="model.SITE_COPYRIGHT"
          placeholder="请输入版权信息"
          :max-length="32"
          class="max-w-380px"
        />
      </NFormItem>
      <NFormItem path="SITE_BEIAN" :label="siteConfig.SITE_BEIAN?.name">
        <NInput v-model:value="model.SITE_BEIAN" placeholder="请输入备案信息" :max-length="32" class="max-w-380px" />
      </NFormItem>
    </NList>
  </NForm>
  <NSpace>
    <NButton v-if="!isEdit" type="primary" @click="handleEdit">
      <template #icon>
        <icon-local-edit />
      </template>
      修改
    </NButton>
    <NButton v-if="!isEdit" @click="handleDefault">
      <template #icon>
        <icon-local-undo />
      </template>
      恢复默认
    </NButton>
    <NButton v-if="isEdit" type="primary" @click="handleSubmit">
      <template #icon>
        <icon-local-save />
      </template>
      保存
    </NButton>
    <NButton v-if="isEdit" @click="reset">
      <template #icon>
        <icon-local-refresh />
      </template>
      重置
    </NButton>
    <NButton v-if="isEdit" @click="handleCancel">
      <template #icon>
        <icon-local-undo />
      </template>
      取消
    </NButton>
  </NSpace>
</template>

<style lang="scss" scoped>
:deep(.n-upload-trigger.n-upload-trigger--disabled) {
  opacity: 100;
}
</style>
