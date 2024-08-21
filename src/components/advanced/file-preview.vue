<script setup lang="ts">
import { MdPreview } from 'md-editor-v3';
import type { FileItem } from '@/apis';
import { isImage, isMusic, isOffice, isPrePdf, isText, isVideo } from '@/constants/file';
import { useMdEditor } from '@/hooks/business/useMdEditor';

defineOptions({ name: 'FilePreview', inheritAttrs: false });

interface Props {
  title?: string;
}

withDefaults(defineProps<Props>(), {
  title: '文件预览',
  download: true
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const visible = defineModel<boolean>('visible', {
  default: false
});
const initFileItem = defineModel<FileItem>('init', {
  default: undefined
});
const files = defineModel<FileItem[]>('files', {
  default: () => []
});

const { mdEditorRef, theme, previewTheme } = useMdEditor();

const el = ref<HTMLElement | null>(null);
const handleRef = ref<HTMLElement | null>(null);
const { style } = useDraggable(el, {
  initialValue: {
    x: window.innerWidth / 2 - (el.value?.clientWidth ?? 800 / 2),
    y: window.innerHeight / 2 - (el.value?.clientHeight ?? 600 / 2)
  }
});

const initIndex = ref();
const initType = ref<string>('');
const textContent = ref<string>('');
const imgList = ref<Array<string>>([]);
const styleWidth = ref<string>();
const styleMaxWidth = ref<string>('860px');
const styleMaxHeight = ref<string>(`${window.innerHeight - 40}px`);

async function enterDrawer() {
  if (isImage(initFileItem.value.extension)) {
    initType.value = 'image';
    styleWidth.value = '860px';
    imgList.value = files.value.filter((i: FileItem) => isImage(i.extension) && i.url).map((a: FileItem) => a.url);
    initIndex.value = imgList.value.findIndex(url => url === initFileItem.value.url);
  } else if (isVideo(initFileItem.value.extension)) {
    styleWidth.value = 'auto';
    initType.value = 'video';
  } else if (isMusic(initFileItem.value.extension)) {
    styleWidth.value = 'auto';
    initType.value = 'music';
  } else if (isPrePdf(initFileItem.value.extension)) {
    window.open(initFileItem.value.url, '_blank');
    closeDrawer();
  } else if (isText(initFileItem.value.extension)) {
    const response = await fetch(initFileItem.value.url);
    if (response.ok) {
      textContent.value = (await response.text()) ?? '';
    }
    initType.value = 'md';
  } else if (isOffice(initFileItem.value.extension)) {
    initType.value = 'office';
  }
}

// 关闭窗口
function closeDrawer() {
  initType.value = '';
  visible.value = false;
  emit('close');
}

watch(visible, () => {
  if (visible.value) {
    enterDrawer();
  }
});
</script>

<template>
  <div ref="el" :style="style" class="position-fixed z-1000000000">
    <NCard
      v-if="visible"
      segmented
      size="small"
      :style="{ width: styleWidth, maxWidth: styleMaxWidth, maxHeight: styleMaxHeight }"
    >
      <video
        v-if="initType === 'video'"
        controls
        :src="initFileItem.url"
        :type="'video/' + initFileItem.extension"
        preload="metadata"
      />
      <audio v-else-if="initType === 'music'" controls :src="initFileItem.url" />
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
        <CopyText
          :value="textContent"
          :show-text="false"
          class="position-absolute right-28px top-72px z-999"
        ></CopyText>
        <NScrollbar class="h-700px">
          <MdPreview ref="mdEditorRef" :model-value="textContent" :theme="theme" :preview-theme="previewTheme" />
        </NScrollbar>
      </div>
      <NEmpty v-else description="暂时还不支持" class="h-230px w-460px justify-center" />
      <template #header>
        <div ref="handleRef">{{ title }}</div>
      </template>
      <template #header-extra>
        <NButton quaternary @click="closeDrawer()">
          <template #icon>
            <icon-local-minus />
          </template>
        </NButton>
        <NButton quaternary @click="closeDrawer()">
          <template #icon>
            <icon-local-close />
          </template>
        </NButton>
      </template>
    </NCard>
  </div>
</template>

<style lang="css" scoped>
.carousel-img {
  width: 100%;
  height: 630px;
  object-fit: cover;
}
</style>
