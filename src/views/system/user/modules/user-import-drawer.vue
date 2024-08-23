<script setup lang="ts">
import type { UploadCustomRequestOptions } from 'naive-ui';
import { NButton, NSpace } from 'naive-ui';
import type { UserImportResp } from '@/apis';
import { downloadImportUserTemplate, importUser, parseImportUser } from '@/apis';
import { $t } from '@/locales';
import { useNaiveForm } from '@/hooks/common/form';
import { useDownload } from '@/hooks/business/useDownload';
import { downloadByUrl } from '@/utils/download';
import { useThemeStore } from '@/store/modules/theme';

defineOptions({
  name: 'UserDetailDrawer'
});

interface Props {}
const props = defineProps<Props>();
const visible = defineModel<boolean>('visible', {
  default: false
});

interface Emits {
  (e: 'submitted'): void;
}
const emit = defineEmits<Emits>();

const themeStore = useThemeStore();
const { formRef, validate, restoreValidation } = useNaiveForm();

const model = reactive(createDefaultModel());

function createDefaultModel() {
  return {
    importKey: '',
    disabled: false,
    errorPolicy: 1,
    duplicateUser: 1,
    duplicateEmail: 1,
    duplicatePhone: 1,
    defaultStatus: 1
  };
}
const dataResult = ref<UserImportResp>({
  importKey: undefined,
  totalRows: 0,
  validRows: 0,
  duplicateUserRows: 0,
  duplicateEmailRows: 0,
  duplicatePhoneRows: 0
});

const uploadFile = ref([]);

// 提交
async function handleSubmit() {
  await validate();
  if (!dataResult.value.importKey) {
    return;
  }
  model.importKey = dataResult.value.importKey;
  const { data, error } = await importUser(model);
  if (!error) {
    window.$message?.success(`导入成功，新增${data.insertRows},修改${data.updateRows}`);
    closeDrawer(true);
  }
}

// 上传
const handleUpload = ({ file, onFinish, onError, onProgress }: UploadCustomRequestOptions) => {
  const controller = new AbortController();
  (async function requestWrap() {
    onProgress({ percent: 20 });
    const formData = new FormData();
    formData.append('file', file.file as File);
    const { data, error } = await parseImportUser(formData);
    if (!error) {
      onFinish();
      window.$message?.success($t('common.uploadSuccess'));
      dataResult.value = data;
    }
  })();
  return {
    abort() {
      controller.abort();
    }
  };
};

// 下载模板
const downloadTemplate = () => {
  useDownload(() => downloadImportUserTemplate(), true, 'ssss');
};

// 关闭窗口
function closeDrawer(submitted: boolean = false) {
  visible.value = false;
  uploadFile.value = [];
  dataResult.value.importKey = undefined;
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
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="560" close-on-esc @after-leave="closeDrawer">
    <NDrawerContent title="导入用户" closable>
      <NForm ref="formRef" :model="model" label-placement="left">
        <NSpace justify="space-between" :class="'selection-' + themeStore.themeScheme">
          <NText>数据导入请严格按照模板填写，格式要求和新增一致！</NText>
          <NButton size="small" type="primary" @click="downloadTemplate">下载模板</NButton>
        </NSpace>
        <fieldset :class="'fieldset-' + themeStore.themeScheme">
          <legend>1.上传解析文件</legend>
          <div class="file-box">
            <NUpload
              v-model:file-list="uploadFile"
              :custom-request="handleUpload"
              :max="1"
              directory-dnd
              tip="仅支持xls、xlsx格式"
              accept=".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            >
              <NUploadDragger>
                <div class="mb-12px">
                  <icon-local-upload class="size-42px" />
                </div>
                <NText class="font-size-1rem">点击或者拖动文件到该区域来上传</NText>
                <NP depth="3" class="ml-8px">仅支持xls、xlsx格式</NP>
              </NUploadDragger>
            </NUpload>
          </div>
          <div v-if="dataResult.importKey">
            <div class="file-box">
              <NSpace justify="space-between" size="small">
                <NStatistic label="总计行数" tabular-nums :value="dataResult.totalRows" />
                <NStatistic label="正常行数" tabular-nums :value="dataResult.validRows" />
                <NStatistic label="已存在用户" tabular-nums :value="dataResult.duplicateUserRows" />
                <NStatistic label="已存在邮箱" tabular-nums :value="dataResult.duplicateEmailRows" />
                <NStatistic label="已存在手机" tabular-nums :value="dataResult.duplicatePhoneRows" />
              </NSpace>
            </div>
          </div>
        </fieldset>
        <fieldset :class="'fieldset-' + themeStore.themeScheme">
          <legend>2.导入策略</legend>
          <NFormItem label="用户已存在" field="duplicateUser">
            <NRadioGroup v-model:value="model.duplicateUser" size="small">
              <NRadioButton :value="1">跳过该行</NRadioButton>
              <NRadioButton :value="3">停止导入</NRadioButton>
              <NRadioButton :value="2">修改数据</NRadioButton>
            </NRadioGroup>
          </NFormItem>
          <NFormItem label="邮箱已存在" field="duplicateEmail">
            <NRadioGroup v-model:value="model.duplicateEmail" size="small">
              <NRadioButton :value="1">跳过该行</NRadioButton>
              <NRadioButton :value="3">停止导入</NRadioButton>
            </NRadioGroup>
          </NFormItem>
          <NFormItem label="手机已存在" field="duplicatePhone">
            <NRadioGroup v-model:value="model.duplicatePhone" size="small">
              <NRadioButton :value="1">跳过该行</NRadioButton>
              <NRadioButton :value="3">停止导入</NRadioButton>
            </NRadioGroup>
          </NFormItem>
          <NFormItem label="默认状态" field="defaultStatus">
            <NSwitch v-model="model.defaultStatus" :checked-value="1" :unchecked-value="2" :round="false">
              <template #checked>启用</template>
              <template #unchecked>禁用</template>
            </NSwitch>
          </NFormItem>
        </fieldset>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer(false)">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style lang="scss" scoped>
.fieldset-light {
  padding: 15px 15px 10px 15px;
  margin-bottom: 25px;
  border: 1px solid #efeff5;
  border-radius: 4px;
}

.fieldset-light legend {
  padding: 2px 5px 2px 5px;
  border: 1px solid #efeff5;
  border-radius: 4px;
}

.fieldset-dark {
  padding: 15px 15px 10px 15px;
  margin-bottom: 25px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 4px;
}

.fieldset-dark legend {
  padding: 2px 5px 2px 5px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 4px;
}

.selection-light {
  margin-bottom: 16px;
  padding: 10px;
  border-radius: 2px;
  align-items: center;
  background-color: #efeff5;
}

.selection-dark {
  margin-bottom: 16px;
  padding: 10px;
  border-radius: 2px;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.06);
}
</style>
