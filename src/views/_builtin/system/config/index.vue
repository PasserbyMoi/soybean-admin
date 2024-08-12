<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import ConfigBasic from './modules/basic.vue';
import ConfigMail from './modules/mail.vue';
import ConfigSecurity from './modules/security.vue';

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
  <div>
    <NCard class="h-full" title="系统配置">
      <NTabs v-model:active-key="activeKey" placement="right" animated @change="change">
        <NTabPane name="基础配置" table="base">
          <ConfigBasic />
        </NTabPane>
        <NTabPane name="邮件配置" table="mail">
          <ConfigMail />
        </NTabPane>
        <NTabPane name="安全配置" table="security">
          <ConfigSecurity />
        </NTabPane>
      </NTabs>
    </NCard>
  </div>
</template>

<style scoped></style>
