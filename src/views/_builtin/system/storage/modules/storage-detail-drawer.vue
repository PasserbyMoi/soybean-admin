<script setup lang="ts">
import type { FormItemRule } from 'naive-ui';
import { NButton, NSpace } from 'naive-ui';
import type { StorageResp } from '@/apis';
import { addStorage, getStorage, updateStorage } from '@/apis';
import { useDict } from '@/hooks/business/dict';
import { $t } from '@/locales';
import { useNaiveForm } from '@/hooks/common/form';
import { isIPv4 } from '@/utils/validate';

defineOptions({
  name: 'StorageDetailDrawer'
});

interface Props {
  operateType: NaiveUI.TableOperateType;
}
const props = defineProps<Props>();

const rowId = defineModel<string | null>('rowId', {
  default: () => null
});
const visible = defineModel<boolean>('visible', {
  default: false
});

interface Emits {
  (e: 'submitted'): void;
}
const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useNaiveForm();
const { storage_type_enum } = useDict('storage_type_enum');

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增存储',
    edit: '编辑存储'
  };
  return titles[props.operateType];
});

const model: StorageResp = reactive(createDefaultModel());

function createDefaultModel(): StorageResp {
  return {
    name: null,
    code: null,
    type: null,
    accessKey: null,
    secretKey: null,
    endpoint: null,
    bucketName: null,
    domain: null,
    sort: 1,
    status: 1,
    isDefault: false,
    description: null
  };
}

type RuleKey = Extract<
  keyof StorageResp,
  'name' | 'code' | 'type' | 'accessKey' | 'secretKey' | 'secretKey' | 'endpoint' | 'bucketName'
>;

const rules: Record<RuleKey, App.Global.FormRule[]> = {
  name: [{ required: true, message: '请输入名称' }],
  code: [{ required: true, message: '请输入编码' }],
  type: [{ required: true, message: '请选择类型' }],
  accessKey: [{ required: true, message: '请输入访问密钥' }],
  secretKey: [{ required: true, message: '请输入私有密钥' }],
  endpoint: [{ required: true, message: '请输入终端节点' }],
  bucketName: [{ required: true, message: '请输入桶名称' }]
};

const dataDetail = ref<StorageResp>();

const isEdit = computed(() => props.operateType === 'edit');

/** 获取url的protocol和endpoint */
const stripProtocol = (url: string): { endpoint: string; protocol: string } => {
  if (url.startsWith('http://')) {
    return { endpoint: url.substring(7), protocol: 'http://' };
  } else if (url.startsWith('https://')) {
    return { endpoint: url.substring(8), protocol: 'https://' };
  }
  return { endpoint: url, protocol: 'http://' };
};

/** 按规则拼接当前默认domain */
const defaultDomain = computed(() => {
  const { endpoint: initialEndpoint, bucketName, domain, type } = model;
  if (domain || type !== 1 || !initialEndpoint || !bucketName) {
    return '';
  }
  const { endpoint, protocol } = stripProtocol(initialEndpoint);
  return isIPv4(endpoint) ? `${protocol}${endpoint}/${bucketName}/` : `${protocol}${bucketName}.${endpoint}/`;
});

// 查询详情
const getDataDetail = async () => {
  if (rowId.value) {
    const { data, error } = await getStorage(rowId.value);
    if (error) {
      throw error;
    }
    dataDetail.value = data;
  }
};

// 初始化 model、数据
function handleInitModel() {
  Object.assign(model, createDefaultModel());
  if (props.operateType === 'edit') {
    getDataDetail().then(() => {
      Object.assign(model, dataDetail.value);
    });
  }
}

// 提交
async function handleSubmit() {
  await validate();
  if (isEdit.value && rowId.value) {
    const { error } = await updateStorage(model, rowId.value);
    if (!error) {
      window.$message?.success($t('common.updateSuccess'));
      closeDrawer(true);
    }
  } else {
    const { error } = await addStorage(model);
    if (!error) {
      window.$message?.success($t('common.addSuccess'));
      closeDrawer(true);
    }
  }
}

// 关闭窗口
function closeDrawer(submitted: boolean = false) {
  visible.value = false;
  if (submitted) {
    nextTick(() => {
      emit('submitted');
    });
  }
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="560" close-on-esc @after-leave="closeDrawer">
    <NDrawerContent :title="title" closable>
      <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="80">
        <NFormItem label="名称" path="name">
          <NInput v-model:value="model.name" placeholder="请输入名称" :maxlength="56" />
        </NFormItem>
        <NFormItem label="编码" path="code">
          <NInput v-model:value="model.code" placeholder="请输入编码" :maxlength="56" :disabled="isEdit" />
        </NFormItem>
        <NFormItem label="类型" path="type">
          <NSelect
            v-model:value="model.type"
            :options="storage_type_enum"
            placeholder=" 请选择类型"
            :disabled="isEdit"
          />
        </NFormItem>
        <NFormItem v-if="model.type === 1" label="访问密钥" path="accessKey">
          <NInput v-model:value="model.accessKey" placeholder="请输入访问密钥" :maxlength="255" />
        </NFormItem>
        <NFormItem v-if="model.type === 1" label="私有密钥" path="secretKey">
          <NInput v-model:value="model.secretKey" placeholder="请输入私有密钥" :maxlength="255" />
        </NFormItem>
        <NFormItem v-if="model.type === 1" label="终端节点" path="endpoint">
          <NInput v-model:value="model.endpoint" placeholder="请输入终端节点" :maxlength="128" />
        </NFormItem>
        <NFormItem label="桶名称" path="bucketName">
          <NInput v-model:value="model.bucketName" placeholder="请输入桶名称" :maxlength="56" />
        </NFormItem>
        <NFormItem v-if="model.type === 1" label="域名" path="domain" :feedback="'留空默认域名：' + defaultDomain">
          <NInput v-model:value="model.domain" placeholder="请输入域名" :maxlength="128" />
        </NFormItem>
        <NFormItem
          v-if="model.type === 2"
          label="域名"
          path="domain"
          :rule="[
            {
              required: true,
              trigger: 'blur',
              message: '域名不能为空，必须以 http:// 或 https:// 开头',
              validator: (rule: FormItemRule, value: any) => {
                return value.startsWith('http://') || value.startsWith('https://');
              }
            }
          ]"
        >
          <NInput v-model:value="model.domain" placeholder="请输入域名" />
        </NFormItem>
        <NFormItem label="排序" path="sort">
          <NInputNumber v-model:value="model.sort" placeholder="请输入排序" :min="1" :max="9999999" mode="button" />
        </NFormItem>
        <NFormItem label="描述" path="description">
          <NInput
            v-model:value="model.description"
            placeholder="请输入描述"
            type="textarea"
            show-count
            :maxlength="200"
            :autosize="{
              minRows: 3,
              maxRows: 5
            }"
          />
        </NFormItem>
        <NFormItem label="默认存储" path="isDefault">
          <NSwitch v-model:value="model.isDefault" :checked-value="true" :unchecked-value="false">
            <template #checked>{{ $t('common.yesOrNo.yes') }}</template>
            <template #unchecked>{{ $t('common.yesOrNo.no') }}</template>
          </NSwitch>
        </NFormItem>
        <NFormItem label="状态" path="status">
          <NSwitch v-model:value="model.status" :checked-value="1" :unchecked-value="2">
            <template #checked>{{ $t('common.enable.enabled') }}</template>
            <template #unchecked>{{ $t('common.enable.disabled') }}</template>
          </NSwitch>
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
