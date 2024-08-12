<script lang="ts" setup>
import { toInteger } from 'lodash-es';
import { type MailConfig, type OptionResp, listOption, resetOptionValue, updateOption } from '@/apis';
import { $t } from '@/locales';
import { useNaiveForm } from '@/hooks/common/form';

defineOptions({ name: 'ConfigMail' });

const loading = ref<boolean>(false);
const isEdit = ref(false);
const { formRef, validate, restoreValidation } = useNaiveForm();

const model = reactive(createDefaultModel());
function createDefaultModel() {
  return {
    MAIL_PROTOCOL: '',
    MAIL_HOST: '',
    MAIL_PORT: 0,
    MAIL_USERNAME: '',
    MAIL_PASSWORD: '',
    MAIL_SSL_ENABLED: '',
    MAIL_SSL_PORT: 0
  };
}
const defaultOptionResp = ref<OptionResp>({
  id: '',
  name: '',
  code: '',
  value: '',
  description: ''
});

const mailConfig = ref<MailConfig>({
  MAIL_PROTOCOL: defaultOptionResp.value,
  MAIL_HOST: defaultOptionResp.value,
  MAIL_PORT: defaultOptionResp.value,
  MAIL_USERNAME: defaultOptionResp.value,
  MAIL_PASSWORD: defaultOptionResp.value,
  MAIL_SSL_ENABLED: defaultOptionResp.value,
  MAIL_SSL_PORT: defaultOptionResp.value
});

type RuleKey = Extract<
  keyof MailConfig,
  'MAIL_HOST' | 'MAIL_PORT' | 'MAIL_USERNAME' | 'MAIL_PASSWORD' | 'MAIL_SSL_PORT'
>;
const rules: Record<RuleKey, App.Global.FormRule[]> = {
  MAIL_HOST: [{ required: true, message: '请输入值' }],
  MAIL_PORT: [{ required: true, message: '请输入值' }],
  MAIL_USERNAME: [{ required: true, message: '请输入值' }],
  MAIL_PASSWORD: [{ required: true, message: '请输入值' }],
  MAIL_SSL_PORT: [{ required: true, message: '请输入值' }]
};

// 查询列表数据
const handleInitModel = async () => {
  loading.value = true;
  const { data, error } = await listOption({ category: 'MAIL' });
  if (!error) {
    mailConfig.value = data?.reduce((obj: MailConfig, option: OptionResp) => {
      obj[option.code] = {
        ...option,
        value: ['MAIL_PORT', 'MAIL_SSL_PORT'].includes(option.code) ? Number.parseInt(option.value, 10) : option.value
      };
      return obj;
    }, {});
    handleCancel();
  } else {
    window.$message?.error(`获取配置信息失败：${error.message}`);
  }
  loading.value = false;
};

// 修改
const handleEdit = () => {
  isEdit.value = true;
};

// 取消
const handleCancel = () => {
  reset();
  isEdit.value = false;
};

// 保存
const handleSubmit = async () => {
  await validate();
  if (mailConfig.value) {
    const { error } = await updateOption(
      Object.entries(model).map(([key, value]) => {
        return { id: mailConfig.value[key].id, code: key, value };
      })
    );
    if (!error) {
      window.$message?.success($t('common.updateSuccess'));
      await handleInitModel();
    }
  }
};

const handleDefault = () => {
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

// 恢复默认
const handleResetValue = async () => {
  const { error } = await resetOptionValue({ category: 'MAIL' });
  if (!error) {
    window.$message?.success('恢复成功');
    await handleInitModel();
  }
};

// 重置
const reset = () => {
  // formRef.value?.resetFields();
  restoreValidation();
  model.MAIL_PROTOCOL = mailConfig.value?.MAIL_PROTOCOL?.value || '';
  model.MAIL_HOST = mailConfig.value?.MAIL_HOST?.value || '';
  model.MAIL_PORT = toInteger(mailConfig.value?.MAIL_PORT?.value) || 0;
  model.MAIL_USERNAME = mailConfig.value?.MAIL_USERNAME?.value || '';
  model.MAIL_PASSWORD = mailConfig.value?.MAIL_PASSWORD?.value || '';
  model.MAIL_SSL_ENABLED = mailConfig.value?.MAIL_SSL_ENABLED?.value || '';
  model.MAIL_SSL_PORT = toInteger(mailConfig.value?.MAIL_SSL_PORT?.value) || 0;
};

onMounted(() => {
  handleInitModel();
});
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="160" :disabled="!isEdit">
    <NList :bordered="false" :loading="loading">
      <NFormItem path="MAIL_PROTOCOL" :label="mailConfig?.MAIL_PROTOCOL?.name">
        <NSelect
          v-model:value="model.MAIL_PROTOCOL"
          :options="[{ label: 'SMTP', value: 'smtp' }]"
          class="max-w-220px"
        ></NSelect>
      </NFormItem>
      <NFormItem path="MAIL_HOST" :label="mailConfig?.MAIL_HOST?.name">
        <NInput v-model:value="model.MAIL_HOST" :minlength="10" :maxlength="56" class="max-w-220px" />
      </NFormItem>
      <NFormItem path="MAIL_PORT" :label="mailConfig?.MAIL_PORT?.name">
        <NInputNumber v-model:value="model.MAIL_PORT" :minlength="10" :maxlength="56" class="max-w-220px" />
      </NFormItem>
      <NFormItem path="MAIL_USERNAME" :label="mailConfig?.MAIL_USERNAME?.name">
        <NInput v-model:value="model.MAIL_USERNAME" :minlength="10" :maxlength="56" class="max-w-220px" />
      </NFormItem>
      <NFormItem path="MAIL_PASSWORD" :label="mailConfig?.MAIL_PASSWORD?.name">
        <NInput
          v-model:value="model.MAIL_PASSWORD"
          type="password"
          :minlength="6"
          :maxlength="16"
          class="max-w-220px"
        />
      </NFormItem>
      <NFormItem path="MAIL_SSL_ENABLED" :label="mailConfig?.MAIL_SSL_ENABLED?.name">
        <NRadioGroup v-model:value="model.MAIL_SSL_ENABLED">
          <NRadio value="1">启用</NRadio>
          <NRadio value="0">禁用</NRadio>
        </NRadioGroup>
      </NFormItem>
      <NFormItem v-if="model.MAIL_SSL_ENABLED === '1'" field="MAIL_SSL_PORT" :label="mailConfig?.MAIL_SSL_PORT?.name">
        <NInputNumber v-model:value="model.MAIL_SSL_PORT" :min="0" class="max-w-220px" />
      </NFormItem>
      <NSpace>
        <NButton v-if="!isEdit" type="primary" @click="handleEdit">
          <template #icon><icon-local-edit /></template>
          修改
        </NButton>
        <NButton v-if="!isEdit" @click="handleDefault">
          <template #icon><icon-local-undo /></template>
          恢复默认
        </NButton>
        <NButton v-if="isEdit" type="primary" @click="handleSubmit">
          <template #icon><icon-local-save /></template>
          保存
        </NButton>
        <NButton v-if="isEdit" @click="reset">
          <template #icon><icon-local-refresh /></template>
          重置
        </NButton>
        <NButton v-if="isEdit" @click="handleCancel">
          <template #icon><icon-local-undo /></template>
          取消
        </NButton>
      </NSpace>
    </NList>
  </NForm>
</template>

<style scoped></style>
