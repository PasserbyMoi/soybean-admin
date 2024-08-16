<script setup lang="tsx">
import { type MenuQuery, type MenuResp, deleteMenu, listMenu } from '@/apis';
import EnableTag from '@/components/custom/enable-tag.vue';
import { $t } from '@/locales';
import { enableStatusOptions } from '@/constants/business';
import BoolTag from '@/components/custom/bool-tag.vue';
import MenuTypeTag from '@/components/custom/menu-type-tag.vue';
import SvgIcon from '@/components/custom/svg-icon.vue';
import type { TableColumn } from '@/hooks/common/table';
import MenuDetailModal from './modules/menu-detail-modal.vue';

defineOptions({ name: 'SystemMenu' });

const apiParams: MenuQuery = {
  title: null,
  status: null
};
const columns = ref<TableColumn<any>[]>([
  {
    title: '菜单标题',
    key: 'title',
    titleAlign: 'center',
    align: 'left',
    width: '180px',
    minWidth: '180px',
    fixed: 'left',
    resizable: true,
    ellipsis: { tooltip: true }
  },
  {
    title: '类型',
    key: 'type',
    align: 'center',
    minWidth: 80,
    render: row => {
      return h(MenuTypeTag, { value: row.type });
    }
  },
  {
    title: '状态',
    key: 'status',
    align: 'center',
    minWidth: 120,
    render: row => {
      return h(EnableTag, { value: row.status });
    }
  },
  {
    title: '路由地址',
    key: 'path',
    align: 'center',
    minWidth: 120,
    resizable: true,
    ellipsis: { tooltip: true }
  },
  {
    title: '组件名称',
    key: 'name',
    align: 'center',
    minWidth: 120,
    resizable: true,
    ellipsis: { tooltip: true }
  },
  {
    title: '组件路径',
    key: 'component',
    align: 'center',
    minWidth: 120,
    resizable: true,
    ellipsis: { tooltip: true }
  },
  {
    title: '权限标识',
    key: 'permission',
    align: 'center',
    minWidth: 180,
    resizable: true,
    ellipsis: { tooltip: true }
  },
  {
    title: '外链',
    key: 'isExternal',
    align: 'center',
    width: 60,
    render: row => {
      return h(BoolTag, { value: row.isExternal });
    }
  },
  {
    title: '隐藏',
    key: 'isHidden',
    align: 'center',
    width: 60,
    render: row => {
      return h(BoolTag, { value: row.isHidden });
    }
  },
  {
    title: '缓存',
    key: 'isCache',
    align: 'center',
    width: 60,
    render: row => {
      return h(BoolTag, { value: row.isCache });
    }
  },
  { title: '排序', key: 'sort', align: 'center', width: 60 },
  {
    title: '图标',
    key: 'icon',
    align: 'center',
    width: 60,
    render: row => {
      return row.icon ? h(SvgIcon, { localIcon: row.icon }) : '';
    }
  },
  {
    title: '创建人',
    key: 'createUserString',
    align: 'center',
    minWidth: 100,
    ellipsis: { tooltip: true },
    hide: true
  },
  {
    title: '创建时间',
    key: 'createTime',
    align: 'center',
    minWidth: 160,
    ellipsis: { tooltip: true },
    hide: true
  },
  {
    title: '修改人',
    key: 'updateUserString',
    align: 'center',
    minWidth: 100,
    ellipsis: { tooltip: true },
    hide: true
  },
  {
    title: '修改时间',
    key: 'updateTime',
    align: 'center',
    minWidth: 160,
    ellipsis: { tooltip: true },
    hide: true
  }
]);

const operations: App.Table.Operation<MenuResp>[] = [
  {
    label: $t('common.edit'),
    yesHandle(row, _index) {
      if (row.id) editHandle(row.id);
    }
  },
  {
    label: $t('common.add'),
    type: 'success',
    disabled: row => row.type === 3,
    yesHandle(row, _index) {
      if (row.id) addHandle(row.id);
    }
  },
  {
    label: $t('common.delete'),
    type: 'error',
    confirm: true,
    yesHandle(row, _index) {
      if (row.id) deleteHandle(row.id);
    }
  }
];

const tableRef = ref();
const detailRef = ref();

const rowId = ref<string | number>();
const visible = ref<boolean>();
const operateType = ref<NaiveUI.TableOperateType>('add');

function addHandle(id?: string | number) {
  if (id) {
    rowId.value = id;
  } else {
    rowId.value = undefined;
  }
  operateType.value = 'add';
  visible.value = true;
}

function editHandle(id: string | number) {
  rowId.value = id;
  operateType.value = 'edit';
  visible.value = true;
}

function deleteHandle(id: string | number) {
  deleteMenu(`${id}`)
    .then(() => {
      window.$message?.info($t('common.deleteSuccess'));
      submited();
    })
    .catch(err => {
      window.$message?.info(err);
    });
}

function submited() {
  tableRef.value.getDataByPage();
}
</script>

<template>
  <div class="min-2-1000px min-h-500px flex-col-stretch gap-16px overflow-auto overflow-hidden">
    <TableCard
      ref="tableRef"
      row-key="id"
      :api-fn="listMenu"
      :api-params="apiParams"
      :columns="columns"
      :show-index="false"
      :show-selection="false"
      :columns-operations="operations"
      :header-operations="['add', 'export', 'refresh', 'height', 'columnSetting']"
      @add="addHandle"
      @edit="editHandle"
      @delete="deleteHandle"
    >
      <template #search="{ searchParams }">
        <NFormItemGi span="24 s:12 m:5" label="菜单标题" path="title">
          <NInput v-model:value="searchParams.title" placeholder="请输入菜单标题" clearable />
        </NFormItemGi>
        <NFormItemGi span="24 s:12 m:5" label="状态" path="status">
          <NSelect
            v-model:value="searchParams.status"
            :options="enableStatusOptions"
            placeholder="请选择状态"
            clearable
          />
        </NFormItemGi>
      </template>
    </TableCard>
    <MenuDetailModal
      ref="detailRef"
      v-model:visible="visible"
      v-model:row-id="rowId"
      :operate-type="operateType"
      @submitted="submited"
    />
  </div>
</template>

<style scoped></style>
