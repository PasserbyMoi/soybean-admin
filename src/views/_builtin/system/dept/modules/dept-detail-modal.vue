<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui';
import type { DeptResp } from '@/apis';
import { addDept, getDept, updateDept } from '@/apis';
import { $t } from '@/locales';
import { useNaiveForm } from '@/hooks/common/form';
import { useDept } from '@/hooks/business/useDept';

defineOptions({
  name: 'DeptDetailModal'
});

interface Props {
  operateType: NaiveUI.TableOperateType;
}
const props = defineProps<Props>();

const rowId = defineModel<string | number | null>('rowId', {
  default: () => null
});
const visible = defineModel<boolean>('visible', {
  default: false
});

interface Emits {
  (e: 'submitted'): void;
}
const emit = defineEmits<Emits>();

const { deptList, getDeptList } = useDept();
const { formRef, validate, restoreValidation } = useNaiveForm();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增部门',
    edit: '编辑部门'
  };
  return titles[props.operateType];
});

const model = reactive(createDefaultModel());

function createDefaultModel() {
  return {
    parentId: null,
    name: '',
    sort: 1,
    description: '',
    status: 1
  };
}

type RuleKey = Extract<keyof DeptResp, 'parentId' | 'name'>;

const rules: Record<RuleKey, App.Global.FormRule[]> = {
  parentId: [{ required: true, message: '请选择上级部门' }],
  name: [{ required: true, message: '请输入名称' }]
};

const dataDetail = ref<DeptResp>();

const isEdit = computed(() => props.operateType === 'edit');

// 查询详情
const getDataDetail = async () => {
  if (rowId.value) {
    const { data, error } = await getDept(rowId.value);
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
  if (!deptList.value.length) {
    getDeptList();
  }
  if (rowId.value) {
    model.parentId = rowId.value;
  }
}

// 提交
async function handleSubmit() {
  await validate();
  if (isEdit.value && rowId.value) {
    const { error } = await updateDept(model, rowId.value);
    if (!error) {
      window.$message?.success($t('common.updateSuccess'));
      closeDrawer(true);
    }
  } else {
    const { error } = await addDept(model);
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
    <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="80px">
      <NFormItem v-if="model.parentId !== 0" label="上级部门" path="parentId">
        <NTreeSelect
          v-model:value="model.parentId"
          v-model:default-value="model.parentId"
          :options="deptList"
          :max-length="150"
          label-field="title"
          placeholder="请选择上级部门"
          clearable
        />
      </NFormItem>
      <NFormItem label="名称" path="name">
        <NInput v-model:value="model.name" placeholder="请输入名称" clearable />
      </NFormItem>
      <NFormItem label="排序" path="sort">
        <NInputNumber v-model:value="model.sort" min="1" max="99999" placeholder="请输入排序" />
      </NFormItem>
      <NFormItem label="描述" path="description">
        <NInput
          v-model:value="model.description"
          type="textarea"
          show-count
          maxlength="200"
          :autosize="{ minRows: 3, maxRows: 5 }"
          placeholder="请输入描述"
          clearable
        />
      </NFormItem>
      <NFormItem label="状态" path="status">
        <NSwitch v-model:value="model.status" :checked-value="1" :unchecked-value="2">
          <template #checked>启用</template>
          <template #unchecked>禁用</template>
        </NSwitch>
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
