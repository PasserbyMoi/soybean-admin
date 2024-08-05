<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui';
import type { RoleDetailResp } from '@/apis';
import { addRole, getRole, updateRole } from '@/apis';
import { useDict } from '@/hooks/business/dict';
import { $t } from '@/locales';
import { useNaiveForm } from '@/hooks/common/form';
import { useDept } from '@/hooks/business/useDept';
import { useMenu } from '@/hooks/business/useMenu';

defineOptions({
  name: 'RoleDetailDrawer'
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

const { data_scope_enum } = useDict('data_scope_enum');
const { deptList, deptKeys, getDeptList } = useDept();
const { menuList, menuKeys, getMenuList } = useMenu();
const { formRef, validate, restoreValidation } = useNaiveForm();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增角色',
    edit: '编辑角色'
  };
  return titles[props.operateType];
});

const model: RoleDetailResp = reactive(createDefaultModel());

function createDefaultModel(): RoleDetailResp {
  return {
    name: '',
    code: '',
    sort: 1,
    disabled: false,
    isSystem: false,
    dataScope: null,
    description: '',
    menuIds: [],
    deptIds: []
  };
}

type RuleKey = Extract<keyof RoleDetailResp, 'name' | 'code' | 'dataScope'>;

const rules: Record<RuleKey, App.Global.FormRule[]> = {
  name: [{ required: true, message: '请输入名称' }],
  code: [{ required: true, message: '请输入编码' }],
  dataScope: [{ required: true, message: '请选择数据权限' }]
};

const dataDetail = ref<RoleDetailResp>();

const isEdit = computed(() => props.operateType === 'edit');

const menuTreeRef = ref();
const deptTreeRef = ref();
const isMenuExpanded = ref(false);
const isDeptExpanded = ref(false);
const isMenuCheckStrictly = ref(true);
const isDeptCheckStrictly = ref(true);

// 展开/折叠
const menuExpanded = (expanded: boolean) => {
  isMenuExpanded.value = expanded;
};
const deptExpanded = (expanded: boolean) => {
  isDeptExpanded.value = expanded;
};

// 全选/全不选
const menuCheckedAll = (checkedAll: boolean) => {
  if (checkedAll) {
    model.menuIds = menuKeys.value;
  } else {
    model.menuIds = dataDetail.value?.menuIds;
  }
};
const deptCheckedAll = (checkedAll: boolean) => {
  if (checkedAll) {
    model.deptIds = deptKeys.value;
  } else {
    model.deptIds = dataDetail.value?.deptIds;
  }
};

// 联动/非联动
const menuCheckedStrictl = (checkedAll: boolean) => {
  isMenuCheckStrictly.value = checkedAll;
};
const deptCheckedStrictl = (checkedAll: boolean) => {
  isDeptCheckStrictly.value = checkedAll;
};

// 查询详情
const getDataDetail = async () => {
  if (rowId.value) {
    isMenuCheckStrictly.value = false;
    isDeptCheckStrictly.value = false;
    const { data, error } = await getRole(rowId.value);
    if (error) {
      throw error;
    }
    dataDetail.value = data;
  } else {
    isMenuCheckStrictly.value = true;
    isDeptCheckStrictly.value = true;
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
  if (!menuList.value.length) {
    getMenuList();
  }
  if (!deptList.value.length) {
    getDeptList();
  }
}

// 提交
async function handleSubmit() {
  await validate();
  if (isEdit.value && rowId.value) {
    const { error } = await updateRole(model, rowId.value);
    if (!error) {
      window.$message?.success($t('common.updateSuccess'));
      closeDrawer(true);
    }
  } else {
    const { error } = await addRole(model);
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
      <NForm ref="formRef" :model="model" :rules="rules">
        <NAlert v-if="isEdit" type="warning" class="mb-15px">变更功能权限或数据权限后，关联在线用户会自动下线！</NAlert>
        <fieldset>
          <legend>基础信息</legend>
          <NFormItem label="名称" path="name">
            <NInput v-model:value="model.name" placeholder="请输入名称" />
          </NFormItem>
          <NFormItem label="编码" path="code">
            <NInput v-model:value="model.code" placeholder="请输入编码" :disabled="isEdit" />
          </NFormItem>
          <NFormItem label="排序" path="sort">
            <NInputNumber v-model:value="model.sort" placeholder="请输入排序" :min="1" mode="button" />
          </NFormItem>
          <NFormItem label="描述" path="description">
            <NInput
              v-model:value="model.description"
              type="textarea"
              placeholder="请输入描述"
              show-count
              :maxlength="200"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </NFormItem>
        </fieldset>
        <fieldset>
          <legend>功能权限</legend>
          <NFormItem :disabled="model.isSystem" :show-label="false">
            <NSpace class="mt-0px">
              <NCheckbox :disabled="model.isSystem" @update:checked="menuExpanded">展开/折叠</NCheckbox>
              <NCheckbox :disabled="model.isSystem" @update:checked="menuCheckedAll">全选/全不选</NCheckbox>
              <NCheckbox :disabled="model.isSystem" @update:checked="menuCheckedStrictl">父子联动</NCheckbox>
            </NSpace>
          </NFormItem>
          <NFormItem :show-label="false">
            <NTree
              ref="menuTreeRef"
              v-model:checked-keys="model.menuIds"
              :disabled="model.isSystem"
              :data="menuList"
              :default-expand-all="isMenuExpanded"
              :cascade="isMenuCheckStrictly"
              :show-label="false"
              :show-line="true"
              label-field="title"
              checkable
            />
          </NFormItem>
        </fieldset>
        <fieldset>
          <legend>数据权限</legend>
          <NFormItem hide-label path="dataScope">
            <NSelect
              v-model:value="model.dataScope"
              :options="data_scope_enum"
              :disabled="model.isSystem"
              placeholder="请选择数据权限"
            />
          </NFormItem>
          <NFormItem v-if="model.dataScope === 5" :show-label="false">
            <NSpace>
              <NCheckbox :disabled="model.isSystem" @update:checked="deptExpanded">展开/折叠</NCheckbox>
              <NCheckbox :disabled="model.isSystem" @update:checked="deptCheckedAll">全选/全不选</NCheckbox>
              <NCheckbox :disabled="model.isSystem" @update:checked="deptCheckedStrictl">父子联动</NCheckbox>
            </NSpace>
          </NFormItem>
          <NFormItem v-if="model.dataScope === 5" :show-label="false">
            <NTree
              ref="deptTreeRef"
              v-model:checked-keys="model.deptIds"
              :data="deptList"
              :default-expand-all="isDeptExpanded"
              :cascade="isDeptCheckStrictly"
              :show-label="false"
              :show-line="true"
              label-field="title"
              checkable
            />
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
fieldset {
  padding: 15px 15px 0 15px;
  margin-bottom: 15px;
  border: 1px solid #efeff5;
  border-radius: 3px;
}

fieldset legend {
  padding: 2px 5px 2px 5px;
  border: 1px solid #efeff5;
  border-radius: 3px;
}
</style>
