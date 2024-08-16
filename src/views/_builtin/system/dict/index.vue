<script setup lang="tsx">
import type { DictItemQuery, DictItemResp } from '@/apis';
import { deleteDictItem, listDict, listDictItem } from '@/apis';
import { $t } from '@/locales';
import EnableTag from '@/components/custom/enable-tag.vue';
import DictTag from '@/components/custom/dict-tag.vue';
import type { TableColumn } from '@/hooks/common/table';
import DictListCard from './modules/dict-list-card.vue';
import DictItemDetailDrawer from './modules/dict-item-detail-drawer.vue';

defineOptions({ name: 'SystemDict' });

const apiParams: Api.Common.EPaginatingSearchParams<DictItemQuery> = {
  page: 1,
  size: 10,
  sort: ['createTime, desc'],
  description: null
};

const columns = ref<TableColumn<any>[]>([
  {
    title: '标签',
    key: 'label',
    align: 'center',
    resizable: true,
    maxWidth: 120,
    ellipsis: { tooltip: true },
    fixed: 'left',
    render: row => {
      return h(DictTag, { text: row.label, color: row.color });
    }
  },
  {
    title: '值',
    key: 'value',
    align: 'center',
    width: 110,
    maxWidth: 110,
    ellipsis: { tooltip: true }
  },
  {
    title: '状态',
    key: 'status',
    align: 'center',
    width: 110,
    maxWidth: 110,
    render: row => {
      return h(EnableTag, { value: row.status });
    }
  },
  {
    title: '字典',
    key: 'dictId',
    align: 'center',
    maxWidth: 120,
    ellipsis: { tooltip: true },
    render: row => {
      return dictMap.value?.filter(o => o.id === row.dictId)[0].name ?? row.dictId;
    }
  },
  { title: '排序', key: 'sort', align: 'center', width: 80, ellipsis: { tooltip: true } },
  {
    title: '描述',
    key: 'description',
    align: 'center',
    maxWidth: 160,
    ellipsis: { tooltip: true }
  },
  {
    title: '创建人',
    key: 'createUserString',
    align: 'center',
    maxWidth: 120,
    ellipsis: { tooltip: true },
    hide: true
  },
  {
    title: '创建时间',
    key: 'createTime',
    align: 'center',
    maxWidth: 160,
    ellipsis: { tooltip: true },
    hide: true
  },
  {
    title: '修改人',
    key: 'updateUserString',
    align: 'center',
    maxWidth: 120,
    ellipsis: { tooltip: true },
    hide: true
  },
  {
    title: '修改时间',
    key: 'updateTime',
    align: 'center',
    maxWidth: 160,
    ellipsis: { tooltip: true },
    hide: true
  }
]);

const operations: App.Table.Operation<DictItemResp>[] = [
  {
    label: $t('common.edit'),
    yesHandle(row, _index) {
      if (row.id) editHandle(row.id);
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

const rowId = ref<string>();
const dictId = ref<string | number>();
const visible = ref<boolean>();
const operateType = ref<NaiveUI.TableOperateType>('add');
const dictMap = ref<Array<{ id: string; name: string }>>([]);

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

function deleteHandle(id: string) {
  deleteDictItem(id)
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

// 根据选中部门查询
const handleSelectDict = (key: string | number) => {
  dictId.value = key;
  tableRef.value.searchParams.dictId = key;
  tableRef.value.getDataByPage();
};

// 初始化数据
async function handleInitModel() {
  const { data, error } = await listDict({});
  if (error) {
    window.$message?.error(`获取字典数据失败：${error}`);
  }
  data?.forEach(dict => {
    dictMap.value?.push({ id: dict.id, name: dict.name });
  });
}

onBeforeMount(() => {
  handleInitModel();
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <TableCard
      ref="tableRef"
      row-key="id"
      :api-fn="listDictItem"
      :api-params="apiParams"
      :columns="columns"
      :show-selection="false"
      :scroll-x="1160"
      :columns-operations="operations"
      :header-operations="['add', 'export', 'refresh', 'height', 'stripe', 'columnSetting']"
      @add="addHandle"
      @edit="editHandle"
      @delete="deleteHandle"
    >
      <template #search="{ searchParams }">
        <NFormItemGi span="24 s:12 m:5" label="关键词" path="description">
          <NInput v-model:value="searchParams.description" placeholder="请输入关键词" clearable />
        </NFormItemGi>
      </template>
      <template #sider>
        <DictListCard placeholder="请输入关键词" @switch="handleSelectDict" />
      </template>
    </TableCard>

    <DictItemDetailDrawer
      ref="detailRef"
      v-model:visible="visible"
      v-model:row-id="rowId"
      v-model:dict-id="dictId"
      :operate-type="operateType"
      @submitted="submited"
    />
  </div>
</template>

<style scoped></style>
