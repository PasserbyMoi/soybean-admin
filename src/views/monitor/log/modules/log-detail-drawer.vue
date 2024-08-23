<script lang="ts" setup>
import { type LogDetailResp, getLog } from '@/apis';
import JsonPretty from '@/components/custom/json-pretty.vue';

defineOptions({
  name: 'LogDetailDrawer'
});

interface Props {
  rowId: string;
}
const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

// 查询详情
const dataDetail = ref<LogDetailResp>();
const getDataDetail = async () => {
  const { data, error } = await getLog(props.rowId);
  if (error) {
    window.$message?.error(error.message);
  } else {
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
  <NDrawer v-model:show="visible" display-directive="show" :width="800" close-on-esc @after-leave="closeDrawer">
    <NDrawerContent closable>
      <template #header>日志详情</template>
      <NDescriptions
        title="基本信息"
        :column="2"
        size="small"
        label-placement="left"
        label-align="right"
        label-style="w-180px"
        bordered
      >
        <NDescriptionsItem label="日志 ID">{{ dataDetail?.id }}</NDescriptionsItem>
        <NDescriptionsItem label="Trace ID">
          <CopyText :value="dataDetail?.traceId" :show-text="true" />
        </NDescriptionsItem>
        <NDescriptionsItem label="操作人">{{ dataDetail?.createUserString }}</NDescriptionsItem>
        <NDescriptionsItem label="操作时间">{{ dataDetail?.createTime }}</NDescriptionsItem>
        <NDescriptionsItem label="操作内容">{{ dataDetail?.description }}</NDescriptionsItem>
        <NDescriptionsItem label="所属模块">{{ dataDetail?.module }}</NDescriptionsItem>
        <NDescriptionsItem label="操作 IP">
          <CopyText :value="dataDetail?.ip" :show-text="true" />
        </NDescriptionsItem>
        <NDescriptionsItem label="操作地点">{{ dataDetail?.address }}</NDescriptionsItem>
        <NDescriptionsItem label="浏览器">{{ dataDetail?.browser }}</NDescriptionsItem>
        <NDescriptionsItem label="终端系统">{{ dataDetail?.os }}</NDescriptionsItem>
        <NDescriptionsItem label="状态">
          <NTag v-if="dataDetail?.status === 1" type="success">{{ $t('common.status.succeed') }}</NTag>
          <NTag v-else type="error">{{ $t('common.status.failed') }}</NTag>
        </NDescriptionsItem>
        <NDescriptionsItem label="耗时">
          <NTag v-if="dataDetail?.timeTaken && dataDetail?.timeTaken > 500" type="error">
            {{ dataDetail?.timeTaken }}ms
          </NTag>
          <NTag v-else-if="dataDetail?.timeTaken && dataDetail?.timeTaken > 200" type="warning">
            {{ dataDetail?.timeTaken }}ms
          </NTag>
          <NTag v-else type="success">{{ dataDetail?.timeTaken }} ms</NTag>
        </NDescriptionsItem>
        <NDescriptionsItem label="请求 URI" :span="2">
          <CopyText :value="dataDetail?.requestUrl" :show-text="true" max-length="100%" />
        </NDescriptionsItem>
      </NDescriptions>
      <NDescriptions title="响应信息" :column="2" class="mt-20px">
        <NDescriptionsItem :span="2">
          <NTabs type="card" size="small">
            <NTabPane name="1" tab="响应头" animated>
              <JsonPretty v-if="dataDetail?.responseHeaders" :json="dataDetail?.responseHeaders" />
              <NEmpty v-else description="你什么也找不到" class="mt-50px" />
            </NTabPane>
            <NTabPane name="2" tab="响应体">
              <JsonPretty v-if="dataDetail?.responseBody" :json="dataDetail?.responseBody" />
              <NEmpty v-else description="你什么也找不到" class="mt-50px" />
            </NTabPane>
          </NTabs>
        </NDescriptionsItem>
      </NDescriptions>
      <NDescriptions title="请求信息" :column="2" class="mt-20px">
        <NDescriptionsItem :span="2">
          <NTabs type="card" size="small" animated>
            <NTabPane name="1" tab="请求头">
              <JsonPretty v-if="dataDetail?.requestHeaders" :json="dataDetail?.requestHeaders" />
              <NEmpty v-else description="你什么也找不到" class="mt-50px" />
            </NTabPane>
            <NTabPane name="2" tab="请求体">
              <JsonPretty v-if="dataDetail?.requestBody" :json="dataDetail?.requestBody" />
              <NEmpty v-else description="你什么也找不到" class="mt-50px" />
            </NTabPane>
          </NTabs>
        </NDescriptionsItem>
      </NDescriptions>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
