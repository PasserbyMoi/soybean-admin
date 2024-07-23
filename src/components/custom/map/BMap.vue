<script setup lang="tsx">
import { useScriptTag } from '@vueuse/core';

/* https://lbsyun.baidu.com/index.php?title=jspopular3.0 百度地图开发者文档 */
const { load } = useScriptTag(
  'https://api.map.baidu.com/getscript?v=3.0&ak=MwqQwPxa5ipusyNmH1WT62y5DKhYxIgb&services=&t=20220816154130'
);

onMounted(() => {
  initMap();
});

const domRef = ref<HTMLDivElement>();
let map = null;

async function initMap() {
  await load();
  if (!domRef.value) return;
  map = new BMap.Map(domRef.value);
  const point = new BMap.Point(117.19, 31.84);
  map.centerAndZoom(point, 15);
  map.enableScrollWheelZoom();
}
</script>

<template>
  <div ref="domRef" class="h-full w-full" />
</template>

<style scoped></style>
import { useScriptTag } from '@vueuse/core'; import { onMounted, ref } from 'vue';
