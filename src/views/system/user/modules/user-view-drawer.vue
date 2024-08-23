<script setup lang="ts">
import { type UserResp, getUser } from '@/apis';

defineOptions({
  name: 'UserViewDrawer'
});

const rowId = defineModel<string | null>('rowId', {
  default: () => null
});
const visible = defineModel<boolean>('visible', {
  default: false
});

const dataDetail = ref<UserResp>();

// 查询详情
const getDataDetail = async () => {
  if (rowId.value) {
    const { data, error } = await getUser(rowId.value);
    if (error) {
      throw error;
    }
    dataDetail.value = data;
  }
};

// 关闭窗口
function closeDrawer() {
  dataDetail.value = undefined;
  visible.value = false;
}

watch(visible, () => {
  if (visible.value) {
    getDataDetail();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="700" close-on-esc @after-leave="closeDrawer">
    <NDrawerContent closable>
      <template #header>用户信息</template>
      <NDescriptions :column="2" label-placement="left" label-align="right" label-style="w-180px" size="small" bordered>
        <NDescriptionsItem label="ID" :span="2">
          <CopyText :value="dataDetail?.id" :show-text="true"></CopyText>
        </NDescriptionsItem>
        <NDescriptionsItem label="用户名">{{ dataDetail?.username }}</NDescriptionsItem>
        <NDescriptionsItem label="昵称">{{ dataDetail?.nickname }}</NDescriptionsItem>
        <NDescriptionsItem label="性别">
          <GenderTag :value="dataDetail?.gender" :show-text="true"></GenderTag>
        </NDescriptionsItem>
        <NDescriptionsItem label="状态">
          <EnableTag :value="dataDetail?.status" :show-text="true"></EnableTag>
        </NDescriptionsItem>
        <NDescriptionsItem label="手机号">
          <CopyText :value="dataDetail?.phone" default-text="暂无" :show-text="true"></CopyText>
        </NDescriptionsItem>
        <NDescriptionsItem label="邮箱">
          <CopyText :value="dataDetail?.email" default-text="暂无" :show-text="true"></CopyText>
        </NDescriptionsItem>
        <NDescriptionsItem label="所属部门">{{ dataDetail?.deptName }}</NDescriptionsItem>
        <NDescriptionsItem label="角色">
          <Tags v-if="dataDetail?.roleNames" :values="dataDetail?.roleNames" />
        </NDescriptionsItem>
        <NDescriptionsItem label="创建人">{{ dataDetail?.createUserString }}</NDescriptionsItem>
        <NDescriptionsItem label="创建时间">{{ dataDetail?.createTime }}</NDescriptionsItem>
        <NDescriptionsItem label="修改人">{{ dataDetail?.updateUserString }}</NDescriptionsItem>
        <NDescriptionsItem label="修改时间">{{ dataDetail?.updateTime }}</NDescriptionsItem>
        <NDescriptionsItem label="描述" :span="2">{{ dataDetail?.description }}</NDescriptionsItem>
      </NDescriptions>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
