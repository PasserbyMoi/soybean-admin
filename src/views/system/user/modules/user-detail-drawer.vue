<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui';
import type { ArcoTreeNodeData, UserDetailResp } from '@/apis';
import { addUser, getUser, updateUser } from '@/apis';
import { $t } from '@/locales';
import { useNaiveForm } from '@/hooks/common/form';
import { useDept } from '@/hooks/business/useDept';
import { encryptByRsa } from '@/utils/encrypt';
import { useRole } from '@/hooks/business/useRole';

defineOptions({
  name: 'UserDetailDrawer'
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

const { deptList, getDeptList } = useDept();
const { roleList, getRoleList } = useRole();
const { formRef, validate, restoreValidation } = useNaiveForm();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增用户',
    edit: '编辑用户'
  };
  return titles[props.operateType];
});

const model = reactive(createDefaultModel());

function createDefaultModel() {
  return {
    username: null,
    nickname: null,
    gender: 0,
    phone: null,
    email: null,
    password: null,
    status: 1,
    isSystem: false,
    description: null,
    deptId: null,
    roleIds: []
  };
}

type RuleKey = Extract<keyof UserDetailResp, 'username' | 'nickname' | 'deptId' | 'roleIds'> & 'password';

const rules: Record<RuleKey, App.Global.FormRule[]> = {
  username: [{ required: true, message: '请输入用户名' }],
  nickname: [{ required: true, message: '请输入昵称' }],
  password: [{ required: true, message: '请输入密码' }],
  deptId: [{ required: true, message: '请选择所属部门' }],
  roleIds: [{ required: true, message: '请选择角色' }]
};

const dataDetail = ref<UserDetailResp>();

const isEdit = computed(() => props.operateType === 'edit');

// 过滤部门
const filterDeptOptions = (searchKey: string, nodeData: ArcoTreeNodeData) => {
  if (nodeData.title) {
    return nodeData.title.toLowerCase().includes(searchKey.toLowerCase());
  }
  return false;
};

// 查询详情
const getDataDetail = async () => {
  if (rowId.value) {
    const { data, error } = await getUser(rowId.value);
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
  if (!roleList.value?.length) {
    getRoleList();
  }
}

// 提交
async function handleSubmit() {
  const rawPassword = model.password;
  await validate();
  if (isEdit.value && rowId.value) {
    const { error } = await updateUser(model, rowId.value);
    if (!error) {
      window.$message?.success($t('common.updateSuccess'));
      closeDrawer(true);
    } else {
      model.password = rawPassword;
    }
  } else {
    model.password = encryptByRsa(model.password) || '';
    const { error } = await addUser(model);
    if (!error) {
      window.$message?.success($t('common.addSuccess'));
      closeDrawer(true);
    } else {
      model.password = rawPassword;
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
        <NFormItem label="用户名" path="username">
          <NInput v-model:value="model.username" placeholder="请输入用户名" :max-length="64" />
        </NFormItem>
        <NFormItem label="昵称" path="nickname">
          <NInput v-model:value="model.nickname" placeholder="请输入昵称" :max-length="30" />
        </NFormItem>
        <NFormItem v-if="!isEdit" label="密码" path="rowPassword">
          <NInput v-model:value="model.rowPassword" type="password" placeholder="请输入密码" :max-length="32" />
        </NFormItem>
        <NFormItem label="手机号码" path="phone">
          <NInput v-model:value="model.phone" placeholder="请输入手机号码" :max-length="11" />
        </NFormItem>
        <NFormItem label="邮箱" path="email">
          <NInput v-model:value="model.email" placeholder="请输入邮箱" :max-length="255" />
        </NFormItem>
        <NFormItem label="性别" path="gender">
          <NRadioGroup v-model:value="model.gender">
            <NRadio :value="1">男</NRadio>
            <NRadio :value="2">女</NRadio>
            <NRadio :value="0" disabled>未知</NRadio>
          </NRadioGroup>
        </NFormItem>
        <NFormItem label="所属部门" path="deptId">
          <NTreeSelect
            v-model:value="model.deptId"
            :options="deptList"
            label-field="title"
            placeholder="请选择所属部门"
            allow-clear
            allow-search
            :filter-tree-node="filterDeptOptions"
          />
        </NFormItem>
        <NFormItem label="角色" path="roleIds">
          <NSelect
            v-model:value="model.roleIds"
            :options="roleList"
            placeholder="请选择角色"
            multiple
            allow-clear
            :allow-search="{ retainInputValue: true }"
          />
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
          <NSwitch v-model:value="model.status" :disabled="model.isSystem" :checked-value="1" :unchecked-value="2">
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
