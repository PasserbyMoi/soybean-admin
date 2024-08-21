<script setup lang="ts">
import { MdPreview } from 'md-editor-v3';
import type { FileItem } from '@/apis';
import { isImage, isMusic, isOffice, isPrePdf, isText, isVideo } from '@/constants/file';
import { useMdEditor } from '@/hooks/business/useMdEditor';
import { useThemeStore } from '@/store/modules/theme';

defineOptions({ name: 'FilePreview', inheritAttrs: false });

interface Props {
  title?: string;
}

withDefaults(defineProps<Props>(), {
  title: '文件预览',
  download: true
});

const files = defineModel<FileItem[]>('files', {
  default: () => []
});

const visible = ref<boolean>(false);
const showFile = ref<FileItem>();
const { mdEditorRef, theme, previewTheme } = useMdEditor();

const el = ref<HTMLElement | null>(null);
const handleRef = ref<HTMLElement | null>(null);
const { style } = useDraggable(el, {
  initialValue: {
    x: window.innerWidth / 2 - (el.value?.clientWidth ?? 800 / 2),
    y: window.innerHeight / 2 - (el.value?.clientHeight ?? 600 / 2)
  }
});

const miniView = ref<boolean>(false);
const initIndex = ref();
const initType = ref<string>('');
const textContent = ref<string>('');
const imgList = ref<Array<string>>([]);
const styleWidth = ref<string>();
const styleMaxWidth = ref<string>('860px');
const styleMaxHeight = ref<string>(`${window.innerHeight - 40}px`);

async function enterDrawer() {
  if (!showFile.value) {
    return;
  }
  if (isImage(showFile.value.extension)) {
    initType.value = 'image';
    styleWidth.value = '860px';
    imgList.value = files.value.filter((i: FileItem) => isImage(i.extension) && i.url).map((a: FileItem) => a.url);
    initIndex.value = imgList.value.findIndex(url => url === showFile.value?.url);
  } else if (isVideo(showFile.value.extension)) {
    styleWidth.value = 'auto';
    initType.value = 'video';
  } else if (isMusic(showFile.value.extension)) {
    styleWidth.value = 'auto';
    initType.value = 'music';
  } else if (isPrePdf(showFile.value.extension)) {
    window.open(showFile.value.url, '_blank');
    close();
  } else if (isText(showFile.value.extension)) {
    const response = await fetch(showFile.value.url);
    if (response.ok) {
      textContent.value = (await response.text()) ?? '';
    }
    initType.value = 'md';
  } else if (isOffice(showFile.value.extension)) {
    initType.value = 'office';
  }
}

function show(file: FileItem) {
  showFile.value = file;
  miniView.value = false;
  visible.value = true;
  enterDrawer();
}

function mini() {
  miniView.value = !miniView.value;
}

// 关闭窗口
function close() {
  initType.value = '';
  visible.value = false;
}

defineExpose({
  show,
  mini,
  close
});
</script>

<template>
  <Transition name="zoom-fade" mode="out-in" appear>
    <div>
      <div ref="el" :style="style" class="card-continer">
        <NFloatButton v-show="miniView" :right="30" :bottom="70" class="z-999" @click="mini()">
          <icon-local-eye />
        </NFloatButton>
        <NCard
          v-if="visible"
          v-show="!miniView"
          segmented
          size="small"
          :style="{ width: styleWidth, maxWidth: styleMaxWidth, maxHeight: styleMaxHeight }"
        >
          <video
            v-if="initType === 'video'"
            :src="showFile?.url"
            :type="'video/' + showFile?.extension"
            controls
            preload="metadata"
          />
          <audio v-else-if="initType === 'music'" :src="showFile?.url" controls />
          <NCarousel
            v-else-if="initType === 'image'"
            v-model:current-index="initIndex"
            :centered-slides="true"
            :show-dots="true"
            :space-between="6"
            :show-arrow="true"
            autoplay
          >
            <img v-for="(img, index) in imgList" :key="index" :src="img" class="carousel-img" />
          </NCarousel>
          <div v-else-if="initType === 'md'">
            <CopyText :value="textContent" :show-text="false" class="position-absolute right-28px top-72px z-999" />
            <NScrollbar class="h-700px">
              <MdPreview ref="mdEditorRef" :model-value="textContent" :theme="theme" :preview-theme="previewTheme" />
            </NScrollbar>
          </div>
          <NEmpty v-else description="暂时还不支持" class="h-230px w-460px justify-center" />
          <template #header>
            <div ref="handleRef">{{ title }}</div>
          </template>
          <template #header-extra>
            <NButton quaternary @click="mini()">
              <template #icon>
                <icon-local-minus />
              </template>
            </NButton>
            <NButton quaternary @click="close()">
              <template #icon>
                <icon-local-close />
              </template>
            </NButton>
          </template>
        </NCard>
      </div>
    </div>
  </Transition>
</template>

<style lang="css" scoped>
.carousel-img {
  width: 100%;
  height: 630px;
  object-fit: cover;
}
.card-continer {
  position: fixed;
  z-index: 1000000000;
  box-shadow:
    rgba(17, 17, 26, 0.1) 0px 4px 16px,
    rgba(17, 17, 26, 0.1) 0px 8px 24px,
    rgba(17, 17, 26, 0.1) 0px 16px 56px;
}
</style>
