<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui';
import type { MenuResp } from '@/apis';
import { addMenu, getMenu, updateMenu } from '@/apis';
import { $t } from '@/locales';
import { useNaiveForm } from '@/hooks/common/form';
import { useMenu } from '@/hooks/business/useMenu';
import IconSelector from '@/components/custom/icon-selector.vue';
import { transformPathToName } from '@/utils';

defineOptions({
  name: 'MenuDetailModal'
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

const { menuList, getMenuList } = useMenu();
const { formRef, validate, restoreValidation } = useNaiveForm();

const tabTitle = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增菜单',
    edit: '编辑菜单'
  };
  return titles[props.operateType];
});

const model = reactive(createDefaultModel());

function createDefaultModel() {
  return {
    parentId: null,
    title: '',
    path: '',
    name: '',
    type: 1,
    icon: '',
    redirect: '',
    component: '',
    permission: '',
    sort: 1,
    isHidden: false,
    isCache: false,
    isExternal: false,
    status: 1
  };
}

type RuleKey1 = Extract<keyof MenuResp, 'name' | 'title' | 'path'>;
type RuleKey2 = Extract<keyof MenuResp, 'parentId' | 'title' | 'permission'>;

const rules: Record<RuleKey1 | RuleKey2, App.Global.FormRule[]> = computed(() => {
  if ([1, 2].includes(model.type)) {
    const allRules: Record<RuleKey1, App.Global.FormRule[]> = {
      title: [{ required: true, message: '请输入菜单标题' }],
      path: [{ required: true, message: '请输入路由地址' }],
      name: [{ required: true, message: '请输入组件名称' }]
    };
    return allRules;
  } else if (model.type === 3) {
    const allRules: Record<RuleKey2, App.Global.FormRule[]> = {
      parentId: [{ required: true, message: '请选择上级菜单' }],
      title: [{ required: true, message: '请输入菜单标题' }],
      permission: [{ required: true, message: '请输入权限标识' }]
    };
    return allRules;
  }
  return null;
});

const dataDetail = ref<MenuResp>();
const isEdit = computed(() => props.operateType === 'edit');
const componentName = computed(() => transformPathToName(model.path));

// 切换类型清除校验
const onChangeType = () => {
  restoreValidation();
};

// 设置建议组件名
const inputComponentName = () => {
  model.name = componentName.value;
};

// 查询详情
const getDataDetail = async () => {
  if (rowId.value) {
    const { data, error } = await getMenu(`${rowId.value}`);
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
  if (!menuList.value.length) {
    getMenuList();
  }
  if (rowId.value) {
    model.parentId = rowId.value;
  }
}

// 提交
async function handleSubmit() {
  await validate();
  if (isEdit.value && rowId.value) {
    const { error } = await updateMenu(model, `${rowId.value}`);
    if (!error) {
      window.$message?.success($t('common.updateSuccess'));
      closeDrawer(true);
    }
  } else {
    const { error } = await addMenu(model);
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
    class="w-680px"
    :title="tabTitle"
    close-on-esc
    segmented
    @after-leave="closeDrawer"
  >
    <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="80px">
      <NFormItem label="菜单类型" path="type">
        <NRadioGroup v-model:value="model.type" type="button" :disabled="isEdit" @change="onChangeType">
          <NRadio :value="1">目录</NRadio>
          <NRadio :value="2">菜单</NRadio>
          <NRadio :value="3">按钮</NRadio>
        </NRadioGroup>
      </NFormItem>
      <NFormItem label="上级部门" path="parentId">
        <NTreeSelect
          v-model:value="model.parentId"
          v-model:default-value="model.parentId"
          :options="menuList"
          label-field="title"
          placeholder="请选择上级菜单"
          clearable
        />
      </NFormItem>
      <NFormItem v-if="[1, 2].includes(model.type)" label="菜单图标" path="icon">
        <IconSelector v-model:value="model.icon" />
      </NFormItem>
      <NFormItem label="菜单标题" path="title">
        <NInput v-model:value="model.title" placeholder="请输入菜单标题" allow-clear />
      </NFormItem>
      <NFormItem v-if="[1, 2].includes(model.type)" label="路由地址" path="path">
        <NInput v-model:value="model.path" placeholder="请输入路由地址" allow-clear />
      </NFormItem>
      <NFormItem v-if="[1, 2].includes(model.type) && !model.isExternal" label="重定向" path="redirect">
        <NInput v-model:value="model.redirect" placeholder="请输入重定向地址" allow-clear />
      </NFormItem>
      <NFormItem v-if="[1, 2].includes(model.type) && !model.isExternal" label="组件名称" path="name">
        <NInput v-model:value="model.name" placeholder="请输入组件名称" allow-clear />
        <template #extra>
          <div v-if="componentName">
            <span>建议组件名称：</span>
            <NTag checkable @check="inputComponentName">{{ componentName }}</NTag>
          </div>
        </template>
      </NFormItem>
      <NFormItem v-if="model.type === 2" label="组件路径" path="component">
        <NInput v-if="model.isExternal" v-model:value="model.component" placeholder="请输入组件路径" allow-clear />
        <NInput v-else v-model:value="model.component" placeholder="请输入组件路径" allow-clear>
          <template #prepend>@/views/</template>
          <template #append>.vue</template>
        </NInput>
      </NFormItem>
      <NFormItem v-if="model.type === 3" label="权限标识" path="permission">
        <NInput v-model:value="model.permission" placeholder="system:user:add" allow-clear />
      </NFormItem>
      <NSpace v-if="[1, 2].includes(model.type)" :gutter="16">
        <NFormItem label="是否隐藏" path="hidden">
          <NSwitch v-model:value="model.isHidden" :checked-value="true" :unchecked-value="false">
            <template #checked>是</template>
            <template #unchecked>否</template>
          </NSwitch>
        </NFormItem>
        <NFormItem label="是否缓存" path="keepAlive">
          <NSwitch v-model:value="model.isCache" :checked-value="true" :unchecked-value="false">
            <template #checked>是</template>
            <template #unchecked>否</template>
          </NSwitch>
        </NFormItem>
        <NFormItem v-if="model.type === 2" label="是否外链" path="isExternal">
          <NSwitch v-model:value="model.isExternal" :checked-value="true" :unchecked-value="false">
            <template #checked>是</template>
            <template #unchecked>否</template>
          </NSwitch>
        </NFormItem>
      </NSpace>
      <NFormItem label="菜单排序" path="sort">
        <NInputNumber v-model:value="model.sort" placeholder="请输入菜单排序" :min="1" mode="button" />
      </NFormItem>
      <NFormItem label="状态" path="status">
        <NSwitch v-model:value="model.status" :checked-value="1" :unchecked-value="2">
          <template #checked>是</template>
          <template #unchecked>否</template>
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
