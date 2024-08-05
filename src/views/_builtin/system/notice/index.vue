<script setup lang="tsx">
import { NA } from 'naive-ui';
import type { NoticeQuery, NoticeResp } from '@/apis';
import { deleteNotice, listNotice } from '@/apis';
import TableTag from '@/components/advanced/table-tag.vue';
import { $t } from '@/locales';
import { useDict } from '@/hooks/business/dict';
import NoticeDetailModal from './modules/notice-detail-modal.vue';
import NoticeViewModal from './modules/notice-view-modal.vue';

defineOptions({ name: 'SystemStorage' });

const { notice_type, notice_status_enum } = useDict('notice_type', 'notice_status_enum');

const apiParams: Api.Common.EPaginatingSearchParams<NoticeQuery> = {
  page: 1,
  size: 10,
  sort: ['createTime, desc'],
  title: null,
  type: null
};
const columns = ref<NaiveUI.TableColumn<any>[]>([
  {
    title: '标题',
    key: 'title',
    resizable: true,
    ellipsis: { tooltip: true },
    render(row) {
      return h(NA, { size: 'small', onClick: () => viewHandle(row.id) }, { default: () => row.title });
    }
  },
  {
    title: '类型',
    key: 'type',
    align: 'center',
    resizable: true,
    render: row => {
      return h(TableTag, { value: row.type, options: notice_type.value }, { default: () => row.type });
    }
  },
  {
    title: '状态',
    key: 'status',
    align: 'center',
    resizable: true,
    render: row => {
      return h(TableTag, { value: row.status, options: notice_status_enum.value }, { default: () => row.status });
    }
  },
  { title: '生效时间', key: 'effectiveTime', align: 'center', resizable: true, ellipsis: { tooltip: true } },
  { title: '终止时间', key: 'terminateTime', align: 'center', resizable: true, ellipsis: { tooltip: true } },
  { title: '创建人', key: 'createUserString', align: 'center', resizable: true, ellipsis: { tooltip: true } },
  { title: '创建时间', key: 'createTime', align: 'center', resizable: true, ellipsis: { tooltip: true } }
]);

const operations: App.Table.Operation<NoticeResp>[] = [
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
    yesHandle(row, _index) {
      if (row.id) deleteHandle(row.id);
    }
  }
];

const tableRef = ref();
const detailRef = ref();
const viewRef = ref();

const rowId = ref<string>();
const visible = ref<boolean>();
const visibleView = ref<boolean>();
const operateType = ref<NaiveUI.TableOperateType>('add');

function addHandle() {
  rowId.value = undefined;
  visible.value = true;
  operateType.value = 'add';
}

function editHandle(id: string) {
  rowId.value = `${id}`;
  visible.value = true;
  operateType.value = 'edit';
}

function viewHandle(id: string) {
  rowId.value = `${id}`;
  visibleView.value = true;
}

function deleteHandle(id: string) {
  deleteNotice(id)
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
      :api-fn="listNotice"
      :api-params="apiParams"
      :columns="columns"
      :show-selection="false"
      :columns-operations="operations"
      :header-operations="['add', 'export', 'refresh', 'height', 'stripe', 'columnSetting']"
      @add="addHandle"
      @edit="editHandle"
      @delete="deleteHandle"
    >
      <template #search="{ searchParams }">
        <NFormItemGi span="24 s:12 m:5" label="标题" path="title">
          <NInput v-model:value="searchParams.title" placeholder="请输入公告标题" clearable />
        </NFormItemGi>
        <NFormItemGi span="24 s:12 m:5" label="类型" path="type">
          <NSelect v-model:value="searchParams.type" :options="notice_type" placeholder="请选择类型" clearable />
        </NFormItemGi>
      </template>
    </TableCard>
    <NoticeDetailModal
      ref="detailRef"
      v-model:visible="visible"
      v-model:row-id="rowId"
      :operate-type="operateType"
      @submitted="submited"
    />
    <NoticeViewModal
      ref="viewRef"
      v-model:visible="visibleView"
      v-model:row-id="rowId"
      :operate-type="operateType"
      @submitted="submited"
    />
  </div>
</template>

<style scoped></style>
