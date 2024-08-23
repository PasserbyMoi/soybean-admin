<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui';
import type { DictResp } from '@/apis';
import { addDict, getDict, updateDict } from '@/apis';
import { $t } from '@/locales';
import { useNaiveForm } from '@/hooks/common/form';

defineOptions({
  name: 'DictDetailModal'
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

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增自动',
    edit: '编辑字典'
  };
  return titles[props.operateType];
});

const model = reactive(createDefaultModel());

function createDefaultModel() {
  return {
    name: '',
    code: '',
    description: ''
  };
}

type RuleKey = Extract<keyof DictResp, 'name' | 'code' | 'description'>;

const rules: Record<RuleKey, App.Global.FormRule[]> = {
  name: [{ required: true, message: '请输入名称' }],
  code: [{ required: true, message: '请输入编码' }],
  description: [{ required: true, message: '请输入描述' }]
};

const dataDetail = ref<DictResp>();
const isEdit = computed(() => props.operateType === 'edit');

// 查询详情
const getDataDetail = async () => {
  if (rowId.value) {
    const { data, error } = await getDict(rowId.value);
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
    const { error } = await updateDict(model, rowId.value);
    if (!error) {
      window.$message?.success($t('common.updateSuccess'));
      closeDrawer(true);
    }
  } else {
    const { error } = await addDict(model);
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
  <NModal
    v-model:show="visible"
    preset="card"
    class="w-500px"
    :title="title"
    close-on-esc
    segmented
    @after-leave="closeDrawer"
  >
    <NForm ref="formRef" :model="model" :rules="rules">
      <NFormItem label="名称" path="name">
        <NInput v-model:value="model.name" placeholder="请输入名称" :maxlength="32" clearable />
      </NFormItem>
      <NFormItem label="编码" path="code">
        <NInput v-model:value="model.code" placeholder="请输入编码" :maxlength="32" :disabled="isEdit" clearable />
      </NFormItem>
      <NFormItem label="描述" path="description">
        <NInput
          v-model:value="model.description"
          type="textarea"
          :maxlength="200"
          :autosize="{
            minRows: 3,
            maxRows: 5
          }"
          placeholder="请输入描述"
          show-count
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
</template>
