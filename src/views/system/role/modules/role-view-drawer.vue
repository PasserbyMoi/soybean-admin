<script setup lang="ts">
import type { RoleDetailResp } from '@/apis';
import { getRole } from '@/apis';
import { useDict } from '@/hooks/business/dict';
import { useDept } from '@/hooks/business/useDept';
import { useMenu } from '@/hooks/business/useMenu';
import { useThemeStore } from '@/store/modules/theme';

defineOptions({
  name: 'RoleDetailDrawer'
});

const rowId = defineModel<string | null>('rowId', {
  default: () => null
});
const visible = defineModel<boolean>('visible', {
  default: false
});

const themeStore = useThemeStore();
const { data_scope_enum } = useDict('data_scope_enum');
const { deptList, getDeptList } = useDept();
const { menuList, getMenuList } = useMenu();

const dataDetail = ref<RoleDetailResp>();

// 查询详情
const getDataDetail = async () => {
  if (rowId.value) {
    const { data, error } = await getRole(rowId.value);
    if (error) {
      throw error;
    }
    dataDetail.value = data;
  }
};

// 初始化 model、数据
function handleInitModel() {
  getDataDetail();
  if (!menuList.value.length) {
    getMenuList();
  }
  if (!deptList.value.length) {
    getDeptList();
  }
}

// 关闭窗口
function closeDrawer() {
  visible.value = false;
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="560" close-on-esc @after-leave="closeDrawer">
    <NDrawerContent title="角色信息" closable>
      <NDescriptions title="基础信息" :column="2" size="small" bordered label-placement="left" class="mb-10px">
        <NDescriptionsItem label="名称" :span="2">{{ dataDetail?.name }}</NDescriptionsItem>
        <NDescriptionsItem label="编码">{{ dataDetail?.code }}</NDescriptionsItem>
        <NDescriptionsItem label="排序">{{ dataDetail?.sort }}</NDescriptionsItem>
        <NDescriptionsItem label="描述" :span="2">{{ dataDetail?.description }}</NDescriptionsItem>
      </NDescriptions>
      <fieldset :class="'fieldset-' + themeStore.themeScheme">
        <legend>功能权限</legend>
        <NTree
          :checked-keys="dataDetail?.menuIds"
          :data="menuList"
          :show-label="false"
          :show-line="true"
          label-field="title"
          checkable
        />
      </fieldset>
      <fieldset :class="'fieldset-' + themeStore.themeScheme">
        <legend>数据权限</legend>
        <NSelect
          :value="dataDetail?.dataScope"
          :options="data_scope_enum"
          disabled
          placeholder="请选择数据权限"
          class="mb-10px"
        />
        <NTree
          v-if="dataDetail?.dataScope === 5"
          :checked-keys="dataDetail?.deptIds"
          :data="deptList"
          :show-label="false"
          :show-line="true"
          label-field="title"
          checkable
        />
      </fieldset>
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
