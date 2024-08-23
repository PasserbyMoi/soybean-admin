<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui';
import { MdEditor } from 'md-editor-v3';
import type { ToolbarNames } from 'md-editor-v3';
import type { NoticeResp } from '@/apis';
import { addNotice, getNotice, updateNotice } from '@/apis';
import { useDict } from '@/hooks/business/dict';
import { $t } from '@/locales';
import { useNaiveForm } from '@/hooks/common/form';
import { useThemeStore } from '@/store/modules/theme';
import 'md-editor-v3/lib/style.css';

defineOptions({
  name: 'NoticeDetailModal'
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

const toolbarsExclude: ToolbarNames[] = ['mermaid', 'katex', 'github', 'htmlPreview', 'catalog'];

const themeStore = useThemeStore();
const { notice_type } = useDict('notice_type');
const { formRef, validate, restoreValidation } = useNaiveForm();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增公告',
    edit: '编辑公告'
  };
  return titles[props.operateType];
});

const model: NoticeResp = reactive(createDefaultModel());

function createDefaultModel(): NoticeResp {
  return {
    title: '',
    type: '',
    content: '',
    effectiveTime: null,
    terminateTime: null
  };
}

type RuleKey = Extract<keyof NoticeResp, 'title' | 'type' | 'content'>;

const rules: Record<RuleKey, App.Global.FormRule[]> = {
  title: [{ required: true, message: '请输入标题' }],
  type: [{ required: true, message: '选择类型' }],
  content: [{ required: true, message: '请输入内容' }]
};

const dataDetail = ref<NoticeResp>();

const isEdit = computed(() => props.operateType === 'edit');
const theme = computed(() => {
  return themeStore.darkMode ? 'dark' : 'light';
});

// 查询详情
const getDataDetail = async () => {
  if (rowId.value) {
    const { data, error } = await getNotice(rowId.value);
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
    const { error } = await updateNotice(model, rowId.value);
    if (!error) {
      window.$message?.success($t('common.updateSuccess'));
      closeDrawer(true);
    }
  } else {
    const { error } = await addNotice(model);
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
    :title="title"
    preset="card"
    class="h-90% w-80%"
    close-on-esc
    segmented
    @after-leave="closeDrawer"
  >
    <NForm ref="formRef" :model="model" :rules="rules">
      <NRow :gutter="16">
        <NCol :span="24">
          <NFormItem label="标题" path="title">
            <NInput v-model:value="model.title" placeholder="请输入标题" :max-length="150" clearable />
          </NFormItem>
        </NCol>
      </NRow>
      <NRow :gutter="16">
        <NCol :span="8">
          <NFormItem label="类型" path="type">
            <NSelect v-model:value="model.type" :options="notice_type" placeholder="请选择类型" clearable />
          </NFormItem>
        </NCol>
        <NCol :span="8">
          <NFormItem label="生效时间" path="effectiveTime" feedback="默认立即生效">
            <NDatePicker
              v-model:formatted-value="model.effectiveTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="请选择生效时间"
              clearable
              class="w-full"
            />
          </NFormItem>
        </NCol>

        <NCol :span="8">
          <NFormItem label="终止时间" path="terminateTime" feedback="默认无终止">
            <NDatePicker
              v-model:formatted-value="model.terminateTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="请选择终止时间"
              clearable
              class="w-full"
            />
          </NFormItem>
        </NCol>
      </NRow>
      <NRow :gutter="16">
        <NCol :span="24">
          <NFormItem label="内容" path="content">
            <MdEditor v-model="model.content" :theme="theme" :toolbars-exclude="toolbarsExclude" />
          </NFormItem>
        </NCol>
      </NRow>
    </NForm>
    <template #footer>
      <NSpace :size="16" justify="end">
        <NButton @click="closeDrawer(false)">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>
