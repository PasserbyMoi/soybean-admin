<script setup lang="ts">
import Step1 from './modules/Step1.vue';
import Step2 from './modules/Step2.vue';
import Step3 from './modules/Step3.vue';

const currentTab = ref(1);
const currentStatus = ref('process');
function nextStep() {
  if (currentTab.value < 3) {
    currentTab.value += 1;
  }
}
function prevStep() {
  if (currentTab.value > 1) {
    currentTab.value -= 1;
  }
}

function finish() {
  currentTab.value = 1;
}
</script>

<template>
  <div>
    <div class="n-layout-page-header">
      <NCard :bordered="false" title="分步表单">将一个冗长或用户不熟悉的表单任务分成多个步骤，指导用户完成。</NCard>
    </div>
    <NCard :bordered="false" class="proCard mt-4">
      <NSpace vertical class="steps" justify="center">
        <NSteps :current="currentTab" :status="currentStatus">
          <NStep title="填写转账信息" description="确保填写正确" />
          <NStep title="确认转账信息" description="确认转账信息" />
          <NStep title="完成转账" description="恭喜您，转账成功" />
        </NSteps>
        <Step1 v-if="currentTab === 1" @next-step="nextStep" />
        <Step2 v-if="currentTab === 2" @next-step="nextStep" @prev-step="prevStep" />
        <Step3 v-if="currentTab === 3" @prev-step="prevStep" @finish="finish" />
      </NSpace>
    </NCard>
  </div>
</template>

<style lang="css" scoped>
.steps {
  max-width: 750px;
  margin: 16px auto;
}
</style>
