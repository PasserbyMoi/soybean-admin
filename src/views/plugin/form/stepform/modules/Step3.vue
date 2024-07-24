<script lang="tsx" setup>
const emit = defineEmits(['finish', 'prevStep']);
function prevStep() {
  emit('prevStep');
}

function finish() {
  emit('finish');
}
</script>

<template>
  <div>
    <NResult status="success" title="操作成功" description="预计两小时内到账" class="step-result">
      <template #default>
        <div class="information">
          <NGrid cols="2 s:2 m:3 l:3 xl:3 2xl:3" responsive="screen" class="my-1">
            <NGi>付款账户：</NGi>
            <NGi>NaiveUiAdmin@163.com</NGi>
          </NGrid>
          <NGrid cols="2 s:2 m:3 l:3 xl:3 2xl:3" responsive="screen" class="my-1">
            <NGi>收款账户：</NGi>
            <NGi>xiaoma@qq.com</NGi>
          </NGrid>
          <NGrid cols="2 s:2 m:3 l:3 xl:3 2xl:3" responsive="screen" class="my-1">
            <NGi>收款人姓名：</NGi>
            <NGi>啊俊</NGi>
          </NGrid>
          <NGrid cols="2 s:2 m:3 l:3 xl:3 2xl:3" responsive="screen" class="my-1">
            <NGi>转账金额：</NGi>
            <NGi>
              ￥
              <span class="money">1980</span>
              元
            </NGi>
          </NGrid>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <NButton type="primary" class="mr-4" @click="finish">再转一笔</NButton>
          <NButton @click="prevStep">查看账单</NButton>
        </div>
      </template>
    </NResult>
  </div>
</template>

<style lang="css" scoped>
.step-result {
  max-width: 560px;
  margin: 40px auto 0;

  ::v-deep(.n-result-content) {
    background-color: #fafafa;
    padding: 24px 40px;
  }

  .information {
    line-height: 22px;

    .ant-row:not(:last-child) {
      margin-bottom: 24px;
    }
  }

  .money {
    font-family: 'Helvetica Neue', sans-serif;
    font-weight: 500;
    font-size: 20px;
    line-height: 14px;
  }
}
</style>
