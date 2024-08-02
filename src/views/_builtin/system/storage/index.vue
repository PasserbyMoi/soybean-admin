<script setup lang="tsx">
import { NBadge, NGradientText, NTag } from 'naive-ui';
import { type StorageQuery, type StorageResp, deleteStorage, listStorage } from '@/apis';
import TableTag from '@/components/advanced/table-tag.vue';
import { enableNextOptions } from '@/constants/common';
import { $t } from '@/locales';
import { useDict } from '@/hooks/business/dict';
import StorageDetailDrawer from './modules/storage-detail-drawer.vue';

defineOptions({ name: 'SystemStorage' });

const { storage_type_enum } = useDict('storage_type_enum');

const apiParams: Api.Common.EPaginatingSearchParams<StorageQuery> = {
  page: 1,
  size: 10,
  sort: ['createTime, desc'],
  description: null,
  status: null
};
const columns = ref<NaiveUI.TableColumn<any>[]>([
  {
    title: '名称',
    key: 'name',
    fixed: 'left',
    align: 'center',
    resizable: true,
    ellipsis: { tooltip: true },
    render: row => {
      return (
        <div>
          {row.name}
          {row.isDefault ? (
            <NTag type="primary" class="ml-10px" round size="tiny">
              默认
            </NTag>
          ) : (
            ''
          )}
        </div>
      );
    }
  },
  { title: '编码', key: 'code', resizable: true, ellipsis: { tooltip: true } },
  {
    title: '状态',
    key: 'status',
    align: 'center',
    resizable: true,
    render: row => {
      return h(TableTag, { value: row.status, options: enableNextOptions }, { default: () => row.status });
    }
  },
  {
    title: '类型',
    key: 'type',
    align: 'center',
    resizable: true,
    render: row => {
      return h(TableTag, { value: row.type, options: storage_type_enum.value }, { default: () => row.type });
    }
  },
  { title: '访问密钥', key: 'accessKey', align: 'center', resizable: true, ellipsis: { tooltip: true } },
  { title: '终端节点', key: 'endpoint', align: 'center', resizable: true, ellipsis: { tooltip: true } },
  { title: '桶名称', key: 'bucketName', align: 'center', resizable: true, ellipsis: { tooltip: true } },
  { title: '域名', key: 'domain', align: 'center', resizable: true, ellipsis: { tooltip: true } },
  { title: '描述', key: 'description', align: 'center', resizable: true, ellipsis: { tooltip: true } },
  { title: '创建人', key: 'createUserString', align: 'center', resizable: true, ellipsis: { tooltip: true } },
  { title: '创建时间', key: 'createTime', align: 'center', resizable: true, ellipsis: { tooltip: true } },
  { title: '修改人', key: 'updateUserString', align: 'center', resizable: true, ellipsis: { tooltip: true } },
  { title: '修改时间', key: 'updateTime', align: 'center', resizable: true, ellipsis: { tooltip: true } }
]);

const operations: App.Table.Operation<StorageResp>[] = [
  {
    label: '编辑',
    yesHandle(row, _index) {
      if (row.id) editHandle(row.id);
    }
  },
  {
    label: '删除',
    type: 'error',
    confirm: true,
    disabled: (row: StorageResp) => row.isDefault ?? true,
    yesHandle(row, _index) {
      if (row.id) deleteHandle(row.id);
    }
  }
];

const tableRef = ref();
const detailRef = ref();

const rowId = ref<string>();
const visible = ref<boolean>();
const operateType = ref<NaiveUI.TableOperateType>('add');

function addHandle() {
  rowId.value = undefined;
  visible.value = true;
  operateType.value = 'add';
  console.log(JSON.stringify(columns.value));
}

function editHandle(id: string) {
  rowId.value = `${id}`;
  visible.value = true;
  operateType.value = 'edit';
}

function deleteHandle(id: string) {
  deleteStorage(id)
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
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <TableCard
      ref="tableRef"
      row-key="id"
      :api-fn="listStorage"
      :api-params="apiParams"
      :columns="columns"
      :show-selection="false"
      :columns-operations="operations"
      :header-operations="['add', 'export', 'refresh', 'height', 'columnSetting']"
      @add="addHandle"
      @edit="editHandle"
      @delete="deleteHandle"
    >
      <template #search="{ searchParams }">
        <NFormItemGi span="24 s:12 m:5" label="关键词" path="description">
          <NInput v-model:value="searchParams.description" placeholder="请输入关键词" clearable />
        </NFormItemGi>
        <NFormItemGi span="24 s:12 m:5" label="状态" path="status">
          <NSelect
            v-model:value="searchParams.status"
            :options="enableNextOptions"
            placeholder="请选择状态"
            clearable
          />
        </NFormItemGi>
      </template>
    </TableCard>
    <StorageDetailDrawer
      ref="detailRef"
      v-model:visible="visible"
      v-model:row-id="rowId"
      :operate-type="operateType"
      @submitted="submited"
    />
  </div>
</template>

<style scoped></style>
