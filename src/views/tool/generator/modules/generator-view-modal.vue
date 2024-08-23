<script setup lang="ts">
import type { TreeOption } from 'naive-ui';
import { type ArcoTreeNodeData, type GeneratePreviewResp, genPreview, generate } from '@/apis';
import CodeView from '@/components/custom/code-view.vue';
import SvgIcon from '@/components/custom/svg-icon.vue';

defineOptions({
  name: 'GeneratorViewModal'
});

const rowId = defineModel<string | null>('rowId', {
  default: () => null
});
const visible = defineModel<boolean>('visible', {
  default: false
});

const selectedKeys = ref<Array<string | number>>([]);
const currentPreview = ref<GeneratePreviewResp>();
const genPreviewList = ref<GeneratePreviewResp[]>([]);
const treeRef = ref();
const treeData = ref<ArcoTreeNodeData[]>([]);

// 下载
const onDownload = async () => {
  if (!rowId.value) {
    return;
  }
  const { option, data, error } = await generate([rowId.value]);

  if (!error && data) {
    const downloadElement = document.createElement('a');
    const href = window.URL.createObjectURL(data);
    downloadElement.style.display = 'none';
    downloadElement.href = href;
    downloadElement.download = option?.fileName ?? `${rowId.value}.zip`;
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    window.URL.revokeObjectURL(href);
  }
};

// 查询详情
const getDataDetail = async () => {
  if (rowId.value) {
    const { data, error } = await genPreview(rowId.value);
    if (error) {
      throw error;
    }
    genPreviewList.value = data;
    for (const gp of genPreviewList.value) {
      assembleTree(gp);
    }
    for (const ve of treeData.value) {
      mergeDir(ve);
    }
    selectedKeys.value = [genPreviewList.value[0].fileName];
    currentPreview.value = genPreviewList.value[0];
  }
};

// 自增的一个key 因为key相同的节点会出现一些问题
let autoIncrementKey = 0;
// 将生成的目录组装成树结构
const assembleTree = (_genPreview: GeneratePreviewResp) => {
  const separator = _genPreview.path.includes('/') ? '/' : '\\';
  const paths: string[] = _genPreview.path.split(separator);
  let tempChildren: ArcoTreeNodeData[] | undefined = treeData.value;
  for (const path of paths) {
    autoIncrementKey += 1;
    // 向treeData中推送目录,如果该级目录有那么不推送进行下级的合并
    tempChildren = pushDir(tempChildren, {
      title: path,
      key: autoIncrementKey,
      children: new Array<ArcoTreeNodeData>()
    });
  }
  tempChildren?.push({
    title: _genPreview.fileName,
    key: _genPreview.fileName,
    children: undefined
  });
};

// 合并目录
const mergeDir = (parent: ArcoTreeNodeData): any => {
  // 合并目录
  if (parent.children?.length === 1 && typeof parent.children[0].key === 'number') {
    const mergeTitle = mergeDir(parent.children[0]);
    if (mergeTitle !== '') {
      parent.title = `${parent.title}/${mergeTitle}`;
    }
    parent.children = parent.children[0].children;
    return parent.title;
  }
  // 合并子目录
  if (parent?.children) {
    for (const child of parent.children) {
      mergeDir(child);
    }
  }
  return '';
};

const pushDir = (children: ArcoTreeNodeData[] | undefined, treeNode: ArcoTreeNodeData) => {
  if (children) {
    for (const child of children) {
      if (child.title === treeNode.title) {
        return child.children;
      }
    }
  }
  children?.push(treeNode);
  return treeNode.children;
};

function renderPrefix(info: { option: ArcoTreeNodeData; checked: boolean; selected: boolean }) {
  let icon;
  if (info.option.title?.endsWith('.java')) {
    icon = 'file-java';
  } else if (info.option.title?.endsWith('.vue')) {
    icon = 'file-vue';
  } else if (info.option.title?.endsWith('.ts')) {
    icon = 'file-typescript';
  } else if (info.option.title?.endsWith('.js')) {
    icon = 'file-javascript';
  } else if (info.option.title?.endsWith('.json')) {
    icon = 'file-json';
  } else if (info.option.title?.endsWith('pom.xml')) {
    icon = 'file-maven';
  } else if (info.option.title?.endsWith('.xml')) {
    icon = 'file-xml';
  } else if (info.option.title?.endsWith('.sql')) {
    icon = 'file-sql';
  } else {
    icon = 'directory-open-blue';
  }
  return h(SvgIcon, { localIcon: icon });
}

function nodeClick({ option }: { option: TreeOption }) {
  if (option.children) {
    return 'toggleExpand';
  }
  currentPreview.value = genPreviewList.value.filter(p => p.fileName === option.key)[0];
  return 'default';
}

function updatePrefixWithExpaned(
  _keys: Array<string | number>,
  _option: Array<TreeOption | null>,
  meta: {
    node: TreeOption | null;
    action: 'expand' | 'collapse' | 'filter';
  }
) {
  if (!meta.node) return;
  if (meta.action === 'expand') {
    meta.node.prefix = () => h(SvgIcon, { localIcon: 'directory-open-blue' });
  } else if (meta.action === 'collapse') {
    meta.node.prefix = () => h(SvgIcon, { localIcon: 'directory-blue' });
  }
}

// 关闭窗口
function closeDrawer() {
  autoIncrementKey = 0;
  currentPreview.value = undefined;
  genPreviewList.value = [];
  treeData.value = [];
  visible.value = false;
}

watch(visible, () => {
  if (visible.value) {
    getDataDetail();
  }
});
</script>

<template>
  <NModal
    v-model:show="visible"
    title="表生成预览"
    preset="card"
    class="w-80%"
    close-on-esc
    segmented
    @after-leave="closeDrawer"
  >
    <template #header-extra>
      <NButton size="small" quaternary :focusable="false" type="info" @click="onDownload">
        <template #icon>
          <icon-local-link class="text-icon" />
        </template>
        下载源码
      </NButton>
    </template>
    <div class="preview-content">
      <NSplit :default-size="0.3" :max="0.5" :min="0.25" :resize-trigger-size="1">
        <template #1>
          <NTree
            ref="treeRef"
            :data="treeData"
            :default-expand-all="true"
            :default-selected-keys="selectedKeys"
            :default-checked-keys="selectedKeys"
            :render-prefix="renderPrefix"
            :override-default-node-click-behavior="nodeClick"
            :on-update:expanded-keys="updatePrefixWithExpaned"
            label-field="title"
            show-line
            expand-on-click
            virtual-scroll
            class="max-h-730px"
          ></NTree>
        </template>
        <template #2>
          <NCard :bordered="false" segmented>
            <template #header>
              <div class="m-0px pa-0px font-size-0.9rem">
                {{
                  currentPreview?.path +
                  (currentPreview?.path.indexOf('/') !== -1 ? '/' : '\\') +
                  currentPreview?.fileName
                }}
              </div>
            </template>
            <NScrollbar class="h-650px overflow-auto">
              <CopyText :value="currentPreview?.content" class="position-absolute right-20px z-999" />
              <CodeView
                :type="'vue' === currentPreview?.fileName.split('.')[1] ? 'vue' : 'javascript'"
                :code-json="currentPreview?.content"
              />
            </NScrollbar>
          </NCard>
        </template>
      </NSplit>
    </div>
  </NModal>
</template>

<style scoped></style>
