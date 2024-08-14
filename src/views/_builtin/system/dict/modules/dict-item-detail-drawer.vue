<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui';
import tinycolor from 'tinycolor2';
import type { SelectMixedOption } from 'naive-ui/es/select/src/interface';
import type { DictItemResp } from '@/apis';
import { addDictItem, getDictItem, listDict, updateDictItem } from '@/apis';
import { $t } from '@/locales';
import { useNaiveForm } from '@/hooks/common/form';
import { useDept } from '@/hooks/business/useDept';
import { useRole } from '@/hooks/business/useRole';

defineOptions({
  name: 'DictItemDetailDrawer'
});

interface Props {
  operateType: NaiveUI.TableOperateType;
}
const props = defineProps<Props>();

const dictId = defineModel<string | number | null>('dictId', {
  default: () => null
});
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

const { deptList, getDeptList } = useDept();
const { roleList, getRoleList } = useRole();
const { formRef, validate, restoreValidation } = useNaiveForm();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增字典项',
    edit: '编辑字典项'
  };
  return titles[props.operateType];
});

const model = reactive(createDefaultModel());

function createDefaultModel() {
  return {
    label: '',
    value: '',
    dictId: '',
    color: '',
    sort: 999,
    status: 1,
    description: ''
  };
}

type RuleKey = Extract<keyof DictItemResp, 'username' | 'nickname' | 'deptId' | 'roleIds'> & 'password';

const rules: Record<RuleKey, App.Global.FormRule[]> = {
  label: [{ required: true, message: '请输入标签' }],
  value: [{ required: true, message: '请输入标签值' }],
  dictId: [{ required: true, message: '请选择标签字典' }]
};

const dataDetail = ref<DictItemResp>();
const dictList = ref<SelectMixedOption[]>([]);
const isEdit = computed(() => props.operateType === 'edit');

const hex8Color = computed(() => tinycolor(model.color).toHex8String());

// 查询详情
const getDataDetail = async () => {
  if (rowId.value) {
    const { data, error } = await getDictItem(rowId.value);
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
  } else {
    model.dictId = dictId.value ?? null;
  }
  if (!deptList.value.length) {
    getDeptList();
  }
  if (!roleList.value?.length) {
    getRoleList();
  }
  if (!dictList.value || dictList.value.length <= 0) {
    listDict({}).then(dicts => {
      dicts.data?.forEach(dict => {
        dictList.value?.push({ value: dict.id, label: dict.name });
      });
    });
  }
}

// 提交
async function handleSubmit() {
  await validate();
  if (isEdit.value && rowId.value) {
    const { error } = await updateDictItem(model, rowId.value);
    if (!error) {
      window.$message?.success($t('common.updateSuccess'));
      closeDrawer(true);
    }
  } else {
    const { error } = await addDictItem(model);
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
      <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="80px">
        <NFormItem label="字典" path="dictId">
          <NSelect v-model:value="model.dictId" :options="dictList"></NSelect>
        </NFormItem>
        <NFormItem label="标签" path="label">
          <NInput v-model:value="model.label" placeholder="请输入标签" :max-length="64" />
        </NFormItem>
        <NFormItem label="值" path="value">
          <NInput v-model:value="model.value" placeholder="请输入值" :max-length="30" />
        </NFormItem>
        <NFormItem label="标签颜色" path="color">
          <NColorPicker
            v-model:value="model.color"
            :default-value="hex8Color"
            :modes="['hex']"
            :show-alpha="true"
            :show-preview="true"
            size="small"
          />
        </NFormItem>
        <NFormItem label="排序" path="sort">
          <NInputNumber v-model:value="model.sort" placeholder="请输入排序" :max-length="5" />
        </NFormItem>
        <NFormItem label="描述" path="description">
          <NInput
            v-model:value="model.description"
            type="textarea"
            placeholder="请输入描述"
            show-count
            :maxlength="200"
            :autosize="{ minRows: 3, maxRows: 5 }"
          />
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
          <NButton @click="closeDrawer(false)">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
