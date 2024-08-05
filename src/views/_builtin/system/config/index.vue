<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import BasicSetting from './modules/BasicSetting.vue';
// import MailSetting from './modules/MailSetting.vue';
// import SecuritySetting from './modules/SecuritySetting.vue';

defineOptions({ name: 'SystemConfig' });

const route = useRoute();
const router = useRouter();
const activeKey = ref('1');

const change = (key: string | number) => {
  activeKey.value = key as string;
  router.replace({ path: route.path, query: { tabKey: key } });
};

watch(
  () => route.query,
  () => {
    if (route.query.tabKey) {
      activeKey.value = String(route.query.tabKey);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="gi_page">
    <NCard class="general-card" title="系统配置">
      <NTabs v-model:active-key="activeKey" animated @change="change">
        <NTabPane name="基础配置" table="base">
          <BasicSetting />
        </NTabPane>

        <!--
 <NTabPane name="邮件配置" table="mail">
          <MailSetting />
        </NTabPane>
-->
        <!--
 <NTabPane name="安全配置" table="security">
          <SecuritySetting />
        </NTabPane>
-->
      </NTabs>
    </NCard>
  </div>
</template>

<style scoped></style>
