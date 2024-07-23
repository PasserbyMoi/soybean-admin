<script lang="tsx" setup>
import Draggable from 'vuedraggable';

const demandList = reactive([
  { name: '预约表单页面，能填写预约相关信息', id: 1 },
  { name: '促销活动页面，包含促销广告展示', id: 2 },
  { name: '商品列表，需要一个到货提醒功能', id: 3 },
  { name: '商品需要一个评价功能', id: 4 },
  { name: '商品图片需要提供放大镜', id: 5 },
  { name: '订单需要提供删除到回收站', id: 6 },
  { name: '用户头像上传，需要支持裁剪', id: 7 },
  { name: '据说Vue3.2发布了，setup啥时候支持？', id: 8 }
]);

const exploitList = reactive([{ name: '商品图片需要提供放大镜', id: 5 }]);
const completeList = reactive([{ name: '商品图片需要提供放大镜', id: 5 }]);
const approvedList = reactive([{ name: '商品图片需要提供放大镜', id: 5 }]);
</script>

<template>
  <div>
    <div class="n-layout-page-header">
      <NCard :bordered="false" title="拖拽">常用于卡片，事项，预约，流程，计划等，</NCard>
    </div>

    <NAlert title="花式拖拽演示" type="info" class="mt-4">
      每个卡片，都可以上下拖拽顺序，另外不同卡片，也可以拖拽过去，拖拽过来，都不在话下呢，快试试O(∩_∩)O哈哈~
    </NAlert>

    <NGrid cols="1 s:2 m:3 l:4 xl:4 2xl:4" class="proCard mt-4" responsive="screen" :x-gap="12" :y-gap="8">
      <NGridItem>
        <NCard title="需求池" :segmented="{ content: true, footer: true }" size="small" :bordered="false">
          <template #header-extra>
            <NTag type="info">月</NTag>
          </template>

          <Draggable class="draggable-ul" animation="300" :list="demandList" group="people" item-key="name">
            <template #item="{ element }">
              <div class="draggable-li cursor-move">
                <NTag type="info">需求</NTag>
                <span class="ml-2">{{ element.name }}</span>
              </div>
            </template>
          </Draggable>
        </NCard>
      </NGridItem>

      <NGridItem>
        <NCard title="开发中" :segmented="{ content: true, footer: true }" size="small" :bordered="false">
          <template #header-extra>
            <NTag type="info">月</NTag>
          </template>

          <Draggable class="draggable-ul" animation="300" :list="exploitList" group="people" item-key="name">
            <template #item="{ element }">
              <div class="draggable-li cursor-move">
                <NTag type="warning">开发中</NTag>
                <span class="ml-2">{{ element.name }}</span>
              </div>
            </template>
          </Draggable>
        </NCard>
      </NGridItem>

      <NGridItem>
        <NCard title="已完成" :segmented="{ content: true, footer: true }" size="small" :bordered="false">
          <template #header-extra>
            <NTag type="info">月</NTag>
          </template>
          <Draggable class="draggable-ul" animation="300" :list="completeList" group="people" item-key="name">
            <template #item="{ element }">
              <div class="draggable-li cursor-move">
                <NTag type="error">已完成</NTag>
                <span class="ml-2">{{ element.name }}</span>
              </div>
            </template>
          </Draggable>
        </NCard>
      </NGridItem>

      <NGridItem>
        <NCard title="已验收" :segmented="{ content: true, footer: true }" size="small" :bordered="false">
          <template #header-extra>
            <NTag type="info">月</NTag>
          </template>
          <Draggable class="draggable-ul" animation="300" :list="approvedList" group="people" item-key="name">
            <template #item="{ element }">
              <div class="draggable-li cursor-move">
                <NTag type="success">已验收</NTag>
                <span class="ml-2">{{ element.name }}</span>
              </div>
            </template>
          </Draggable>
        </NCard>
      </NGridItem>
    </NGrid>
  </div>
</template>

<style lang="css" scoped>
.draggable-ul {
  width: 100%;
  overflow: hidden;
  margin-top: -16px;

  .draggable-li {
    width: 100%;
    padding: 16px 10px;
    color: #333;
    border-bottom: 1px solid #efeff5;
  }
}
.draggable-ul .draggable-li {
  width: 100%;
  padding: 16px 10px;
  color: #333;
  border-bottom: 1px solid #efeff5;
}
</style>
