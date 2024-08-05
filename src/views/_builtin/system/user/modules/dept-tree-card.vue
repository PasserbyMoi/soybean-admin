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

const xRef = ref(0);
const yRef = ref(0);
const showDropdownRef = ref(false);
const optionsRef = ref<DropdownOption[]>([]);

function nodeProps({ option }: { option: TreeOption }) {
  return {
    onClick() {
      emit('switch', `${option.id}`);
    },
    onContextmenu(e: MouseEvent): void {
      optionsRef.value = [
        {
          key: 'add',
          label: '新增',
          icon: () => {
            return h(SvgIcon, { icon: 'material-symbols:edit-outline' });
          },
          props: {
            onClick: () => {
              addHandle(option.id as string);
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
              editHandle(option.id as string);
            }
          }
        },
        {
          key: 'delete',
          label: '删除',
          disabled: option.isSystem as boolean,
          icon: () => {
            return h(SvgIcon, { icon: 'material-symbols:delete-outline' });
          },
          props: {
            onClick: () => {
              window.$dialog?.warning({
                title: $t('common.warning'),
                content: `确认删除 ${option.name} 吗？`,
                positiveText: $t('common.confirm'),
                negativeText: $t('common.cancel'),
                maskClosable: false,
                closeOnEsc: true,
                onPositiveClick() {
                  deleteHandle(option.id as string);
                }
              });
            }
          }
        }
      ];
      showDropdownRef.value = true;
      xRef.value = e.clientX;
      yRef.value = e.clientY;
      e.preventDefault();
    }
  };
}
function handleSelect() {
  showDropdownRef.value = false;
}
function handleClickoutside() {
  showDropdownRef.value = false;
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
  <NFlex vertical class="w-300px">
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
  <DeptDetailModal v-model:visible="visible" v-model:row-id="rowId" :operate-type="operateType" @submitted="submited" />
</template>

<style lang="scss" scoped>
// :deep(.n-tree-node) {
//   height: 34px !important;
//   border-radius: 4px;
// }

// :deep(.n-tree-node-wrapper) {
//   height: 36px !important;
// }

// :deep(.n-tree-node-switcher) {
//   width: 8px !important;
// }

// :deep(.n-tree-node-switcher--hide) {
//   width: 8px !important;
// }
</style>
