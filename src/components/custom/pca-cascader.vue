<script setup lang="tsx">
import type { CascaderOption } from 'naive-ui';

// 获取原始数据，数据来源仓库 https://github.com/modood/Administrative-divisions-of-China
const pcaCode = shallowRef<CascaderOption[]>();
async function fetchPcaCode() {
  return await fetch('https://cdn.jsdelivr.net/gh/modood/Administrative-divisions-of-China/dist/pca-code.json').then(
    res => res.json()
  );
}
onMounted(async () => {
  pcaCode.value = await fetchPcaCode();
});
</script>

<template>
  <NCascader :options="pcaCode" value-field="code" label-field="name" check-strategy="all" filterable clearable />
</template>
