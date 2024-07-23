<script lang="ts"></script>

<script setup lang="ts">
import AMap from '@/components/custom/map/AMap.vue';
import BMap from '@/components/custom/map/BMap.vue';

defineOptions({
  name: 'PluginMap'
});

const maps = [
  {
    id: 'AMap',
    label: '高德地图',
    component: AMap
  },
  {
    id: 'BMap',
    label: '百度地图',
    component: BMap
  }
];
</script>

<template>
  <NCard title="地图示例(keepalive缓存)">
    <NTabs type="line" animated>
      <NTabPane v-for="item in maps" :key="item.id" :name="item.id" :tab="item.label" class="h-600px">
        <component :is="item.component" />
      </NTabPane>
    </NTabs>
  </NCard>
</template>

<style scoped></style>
