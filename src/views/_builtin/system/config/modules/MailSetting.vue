<script lang="ts" setup>
import type { FormInst } from 'naive-ui';
import { type MailConfig, type OptionResp, listOption, resetOptionValue, updateOption } from '@/apis';
import { $t } from '@/locales';

defineOptions({ name: 'MailSetting' });

const loading = ref<boolean>(false);
const formRef = ref<FormInst>();

const mailConfig = ref<MailConfig>({
  MAIL_PROTOCOL: undefined,
  MAIL_HOST: undefined,
  MAIL_PORT: undefined,
  MAIL_USERNAME: undefined,
  MAIL_PASSWORD: undefined,
  MAIL_SSL_ENABLED: undefined,
  MAIL_SSL_PORT: undefined
});

const form = ref();

const rules: FormInst['rules'] = {
  MAIL_HOST: [{ required: true, message: '请输入值' }],
  MAIL_PORT: [{ required: true, message: '请输入值' }],
  MAIL_USERNAME: [{ required: true, message: '请输入值' }],
  MAIL_PASSWORD: [{ required: true, message: '请输入值' }],
  MAIL_SSL_PORT: [{ required: true, message: '请输入值' }]
};

// 重置
const reset = () => {
  // formRef.value?.resetFields();
  form.value.MAIL_PROTOCOL = mailConfig.value?.MAIL_PROTOCOL?.value || null;
  form.value.MAIL_HOST = mailConfig.value?.MAIL_HOST?.value || null;
  form.value.MAIL_PORT = mailConfig.value?.MAIL_PORT?.value || null;
  form.value.MAIL_USERNAME = mailConfig.value?.MAIL_USERNAME?.value || null;
  form.value.MAIL_PASSWORD = mailConfig.value?.MAIL_PASSWORD?.value || null;
  form.value.MAIL_SSL_ENABLED = mailConfig.value?.MAIL_SSL_ENABLED?.value || null;
  form.value.MAIL_SSL_PORT = mailConfig.value?.MAIL_SSL_PORT?.value || null;
};

const isUpdate = ref(false);
// 修改
const onUpdate = () => {
  isUpdate.value = true;
};

const queryForm = {
  category: 'MAIL'
};

// 取消
const handleCancel = () => {
  reset();
  isUpdate.value = false;
};

// 查询列表数据
const getDataList = async () => {
  loading.value = true;
  const { data, error } = await listOption(queryForm);
  if (!error) {
    mailConfig.value = data?.reduce((obj: MailConfig, option: OptionResp) => {
      obj[option.code] = {
        ...option,
        value: ['MAIL_PORT', 'MAIL_SSL_PORT'].includes(option.code) ? Number.parseInt(option.value, 10) : option.value
      };
      return obj;
    }, {});
    handleCancel();
    console.log(JSON.stringify(mailConfig.value));
  } else {
    window.$message?.error(`获取配置信息失败：${error.message}`);
  }
  loading.value = false;
};

// 保存
const handleSave = async () => {
  const isInvalid = false; // await formRef.value?.validate();
  JSON.stringify(mailConfig.value);
  if (!isInvalid && mailConfig.value) {
    await updateOption(
      Object.entries(form).map(([key, value]) => {
        return { id: mailConfig.value[key].id, code: key, value };
      })
    );
    await getDataList();
    window.$message?.success('保存成功');
  }
};

// 恢复默认
const handleResetValue = async () => {
  await resetOptionValue(queryForm);
  window.$message?.success('恢复成功');
  await getDataList();
};

const onResetValue = () => {
  window.$dialog?.warning({
    title: $t('common.tip'),
    content: '确认恢复邮件配置为默认值吗？',
    type: 'warning',
    maskClosable: false,
    positiveText: $t('common.confirm'),
    negativeText: $t('common.cancel'),
    onPositiveClick: () => {
      handleResetValue();
    }
  });
};

onMounted(() => {
  getDataList();
});
</script>

<template>
  <NSpace>
    <NForm ref="formRef" :model="form" :rules="rules" label-placement="left" :label-width="120" :disabled="!isUpdate">
      <NList :bordered="false" :loading="loading">
        <NFormItem path="MAIL_PROTOCOL" :label="mailConfig?.MAIL_PROTOCOL?.name">
          <NSelect v-model:value="form.MAIL_PROTOCOL" :options="[{ label: 'SMTP', value: 'smtp' }]"></NSelect>
        </NFormItem>
        <NFormItem path="MAIL_HOST" :label="mailConfig?.MAIL_HOST?.name">
          <NInput v-model:value="form.MAIL_HOST" minlength="10" maxlength="56" />
        </NFormItem>
        <NFormItem path="MAIL_PORT" :label="mailConfig?.MAIL_PORT?.name">
          <NInputNumber v-model:value="form.MAIL_PORT" minlength="10" maxlength="56" />
        </NFormItem>
        <NFormItem path="MAIL_USERNAME" :label="mailConfig?.MAIL_USERNAME?.name">
          <NInput v-model:value="form.MAIL_USERNAME" minlength="10" maxlength="56" />
        </NFormItem>
        <NFormItem path="MAIL_PASSWORD" :label="mailConfig?.MAIL_PASSWORD?.name">
          <NInput v-model:value="form.MAIL_PASSWORD" type="password" minlength="6" maxlength="16" />
        </NFormItem>
        <NFormItem path="MAIL_SSL_ENABLED" :label="mailConfig?.MAIL_SSL_ENABLED?.name">
          <NRadioGroup v-model:value="form.MAIL_SSL_ENABLED">
            <NRadio value="1">启用</NRadio>
            <NRadio value="0">禁用</NRadio>
          </NRadioGroup>
        </NFormItem>
        <NFormItem v-if="form.MAIL_SSL_ENABLED === '1'" field="MAIL_SSL_PORT" :label="mailConfig?.MAIL_SSL_PORT?.name">
          <NInputNumber v-model:value="form.MAIL_SSL_PORT" :min="0" />
        </NFormItem>
        <NSpace>
          <NButton v-if="!isUpdate" v-permission="['system:config:update']" type="primary" @click="onUpdate">
            <template #icon><icon-local-edit /></template>
            修改
          </NButton>
          <NButton v-if="!isUpdate" v-permission="['system:config:reset']" @click="onResetValue">
            <template #icon><icon-local-undo /></template>
            恢复默认
          </NButton>
          <NButton v-if="isUpdate" type="primary" @click="handleSave">
            <template #icon><icon-local-save /></template>
            保存
          </NButton>
          <NButton v-if="isUpdate" @click="reset">
            <template #icon><icon-local-refresh /></template>
            重置
          </NButton>
          <NButton v-if="isUpdate" @click="handleCancel">
            <template #icon><icon-local-undo /></template>
            取消
          </NButton>
        </NSpace>
      </NList>
    </NForm>
  </NSpace>
</template>

<style scoped></style>
