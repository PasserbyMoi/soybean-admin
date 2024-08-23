<script setup lang="ts">
import type { DropdownOption, TreeOption } from 'naive-ui';
import type { DeptResp } from '@/apis';
import { deleteDept, listDept } from '@/apis';
import SvgIcon from '@/components/custom/svg-icon.vue';
import { $t } from '@/locales';
import DeptDetailModal from '../../dept/modules/dept-detail-modal.vue';

defineOptions({
  name: 'DictTreeCard'
});

interface Props {
  placeholder?: string;
}
withDefaults(defineProps<Props>(), {
  placeholder: '请输入关键词'
});

interface Emits {
  (e: 'switch', id: string): void;
}
const emit = defineEmits<Emits>();

const pattern = ref<string>();
const dataList = ref<DeptResp[]>();

const rowId = ref<string>();
const visible = ref<boolean>();
const operateType = ref<NaiveUI.TableOperateType>('add');

const menuSelectOption = ref<TreeOption>();
const menuRef = ref();
const menuOptions = ref<DropdownOption[]>([
  {
    key: 'add',
    label: '新增',
    icon: () => {
      return h(SvgIcon, { icon: 'material-symbols:edit-outline' });
    },
    props: {
      onClick: () => {
        addHandle(menuSelectOption.value?.id as string);
      }
    }
  },
  {
    key: 'edit',
    label: '修改',
    icon: () => {
      return h(SvgIcon, { icon: 'material-symbols:edit-outline' });
    },
    props: {
      onClick: () => {
        editHandle(menuSelectOption.value?.id as string);
      }
    }
  },
  {
    key: 'delete',
    label: '删除',
    disabled: menuSelectOption.value?.isSystem as boolean,
    icon: () => {
      return h(SvgIcon, { icon: 'material-symbols:delete-outline' });
    },
    props: {
      onClick: () => {
        window.$dialog?.warning({
          title: $t('common.warning'),
          content: $t('common.confirmDeleteWhat', { name: menuSelectOption.value?.name }),
          positiveText: $t('common.confirm'),
          negativeText: $t('common.cancel'),
          maskClosable: false,
          closeOnEsc: true,
          onPositiveClick() {
            deleteHandle(menuSelectOption.value?.id as string);
          }
        });
      }
    }
  }
]);

function nodeProps({ option }: { option: TreeOption }) {
  return {
    onClick() {
      emit('switch', `${option.id}`);
    },
    onContextmenu(e: MouseEvent): void {
      menuSelectOption.value = option;
      menuRef.value.show(e);
      e.preventDefault();
    }
  };
}

function addHandle(id: string) {
  rowId.value = id;
  visible.value = true;
  operateType.value = 'add';
}

function editHandle(id: string) {
  rowId.value = `${id}`;
  visible.value = true;
  operateType.value = 'edit';
}

function deleteHandle(id: string) {
  deleteDept(id)
    .then(() => {
      window.$message?.info($t('common.deleteSuccess'));
      submited();
    })
    .catch(err => {
      window.$message?.info(err);
    });
}

function submited() {
  handleInitModel();
}

// 初始化数据
async function handleInitModel() {
  const { data, error } = await listDept({});
  if (error) {
    throw error;
  }
  dataList.value = data;
}

onMounted(() => {
  handleInitModel();
});
</script>

<template>
  <NFlex vertical>
    <NInput v-model:value="pattern" size="small" :placeholder="placeholder">
      <template #prefix>
        <icon-material-symbols:search class="text-icon" />
      </template>
    </NInput>
    <NTree
      :data="dataList"
      :pattern="pattern"
      :node-props="nodeProps"
      :show-irrelevant-nodes="false"
      :virtual-scroll="true"
      key-field="id"
      label-field="name"
      block-line
      class="h-full"
    ></NTree>
  </NFlex>
  <!--
 <NDropdown
    trigger="manual"
    placement="bottom-start"
    :show="showDropdownRef"
    :options="optionsRef as any"
    class="w-120px"
    :x="xRef"
    :y="yRef"
    @select="handleSelect"
    @clickoutside="handleClickoutside"
  />
-->
  <ContextMenu ref="menuRef" :options="menuOptions" class="w-120px"></ContextMenu>
  <DeptDetailModal v-model:visible="visible" v-model:row-id="rowId" :operate-type="operateType" @submitted="submited" />
</template>

<style scoped></style>
