<script setup lang="ts">
import { $t } from '@/locales';
import { useNaiveForm } from '@/hooks/common/form';
import type { LogQuery } from '@/apis/monitor/type';

defineOptions({
  name: 'LogSearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useNaiveForm();

const model = defineModel<LogQuery>('model', { required: true });

async function reset() {
  await restoreValidation();
  emit('reset');
}

async function search() {
  await validate();
  emit('search');
}
</script>

<template>
  <NCard :title="$t('common.search')" :bordered="false" size="small" class="card-wrapper">
    <NForm ref="formRef" :model="model" label-placement="left" :label-width="100">
      <NGrid responsive="screen" item-responsive>
        <NFormItemGi span="24 s:12 m:4" label="用户" path="createUserString" class="pr-24px">
          <NInput v-model:value="model.createUserString" placeholder="请输入用户昵称" allow-clear>
            <template #prefix>
              <icon-ic-round-search class="text-icon" />
            </template>
          </NInput>
        </NFormItemGi>
        <NFormItemGi span="24 s:12 m:4" label="IP/地点" path="ip" class="pr-24px">
          <NInput v-model:value="model.ip" placeholder="请输入用户 IP 或地点" allow-clear>
            <template #prefix>
              <icon-ic-round-search class="text-icon" />
            </template>
          </NInput>
        </NFormItemGi>
        <NFormItemGi span="24 s:18 m:6" label="时间" path="createTime" class="pr-24px">
          <NDatePicker
            v-model:formatted-value="model.createTime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            type="datetimerange"
            clearable
          />
        </NFormItemGi>
        <NFormItemGi span="24 s:18 m:4" label="日志类型" path="module" class="pr-24px">
          <NSelect
            v-model:value="model.module"
            placeholder="请选择日志类型"
            :options="[
              { label: '登录/退出', value: '登录' },
              { label: '操作日志', value: undefined }
            ]"
            clearable
          />
        </NFormItemGi>
        <NFormItemGi span="24 m:4" class="pr-24px">
          <NSpace class="w-full" justify="end">
            <NButton @click="reset">
              <template #icon>
                <icon-ic-round-refresh class="text-icon" />
              </template>
              {{ $t('common.reset') }}
            </NButton>
            <NButton type="primary" ghost @click="search">
              <template #icon>
                <icon-ic-round-search class="text-icon" />
              </template>
              {{ $t('common.search') }}
            </NButton>
          </NSpace>
        </NFormItemGi>
      </NGrid>
    </NForm>
  </NCard>
</template>

<style scoped></style>
