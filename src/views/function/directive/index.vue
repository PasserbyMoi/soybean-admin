<script setup lang="tsx">
const data = ref<string>();
const a = () => {
  window.$message?.success(`复制成功:${data.value}`);
};
const b = () => {
  window.$message?.success('防抖');
};
const c = () => {
  window.$message?.success('节流');
};
</script>

<template>
  <div class="card content-box">
    <NCard :bordered="false" title="复制指令">
      <NSpace>
        <NInput v-model:value="data" placeholder="输入内容试试" />
        <NButton v-copy="data" type="primary" @click="a">复 制</NButton>
      </NSpace>
    </NCard>
    <NCard :bordered="false" title="防抖指令" class="mt-3">
      <NButton v-debounce="b" type="primary">防抖测试</NButton>
    </NCard>
    <NCard :bordered="false" title="节流指令" class="mt-3">
      <NButton v-throttle="c" type="primary">节流测试</NButton>
    </NCard>
    <NCard :bordered="false" title="拖拽指令" class="mt-3">鼠标放到矩形上面拖拽试试</NCard>
    <div v-draggable class="box"></div>
  </div>
</template>

<style scoped lang="css">
.content-box {
  height: 100vh;
}
.content-box .box {
  width: 100px;
  height: 100px;
  background-color: #2d8cf0;
  position: absolute;
  z-index: 10000000;
  border-radius: 10px;
  margin: 20px 5px;
}
</style>
