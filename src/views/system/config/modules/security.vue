<script lang="ts" setup>
import { toInteger } from 'lodash-es';
import type { FormItemRule } from 'naive-ui';
import type { OptionResp, SecurityConfig } from '@/apis';
import { listOption, resetOptionValue, updateOption } from '@/apis';
import { $t } from '@/locales';
import { useNaiveForm } from '@/hooks/common/form';

defineOptions({ name: 'ConfigSecurity' });

const loading = ref<boolean>(false);
const isEdit = ref(false);
const { formRef, validate, restoreValidation } = useNaiveForm();

const model = reactive(createDefaultModel());
function createDefaultModel() {
  return {
    PASSWORD_ERROR_LOCK_COUNT: 0,
    PASSWORD_ERROR_LOCK_MINUTES: 0,
    PASSWORD_EXPIRATION_DAYS: 0,
    PASSWORD_EXPIRATION_WARNING_DAYS: 0,
    PASSWORD_REPETITION_TIMES: 0,
    PASSWORD_MIN_LENGTH: 0,
    PASSWORD_ALLOW_CONTAIN_USERNAME: 0,
    PASSWORD_REQUIRE_SYMBOLS: 0
  };
}
const defaultOptionResp = ref<OptionResp>({
  id: '',
  name: '',
  code: '',
  value: '',
  description: ''
});

const securityConfig = ref<SecurityConfig>({
  PASSWORD_ERROR_LOCK_COUNT: defaultOptionResp.value,
  PASSWORD_ERROR_LOCK_MINUTES: defaultOptionResp.value,
  PASSWORD_EXPIRATION_DAYS: defaultOptionResp.value,
  PASSWORD_EXPIRATION_WARNING_DAYS: defaultOptionResp.value,
  PASSWORD_REPETITION_TIMES: defaultOptionResp.value,
  PASSWORD_MIN_LENGTH: defaultOptionResp.value,
  PASSWORD_ALLOW_CONTAIN_USERNAME: defaultOptionResp.value,
  PASSWORD_REQUIRE_SYMBOLS: defaultOptionResp.value
});

type RuleKey = Extract<
  keyof SecurityConfig,
  | 'PASSWORD_ERROR_LOCK_COUNT'
  | 'PASSWORD_ERROR_LOCK_MINUTES'
  | 'PASSWORD_EXPIRATION_DAYS'
  | 'PASSWORD_EXPIRATION_WARNING_DAYS'
  | 'PASSWORD_REPETITION_TIMES'
  | 'PASSWORD_MIN_LENGTH'
>;
const rules: Record<RuleKey, App.Global.FormRule[]> = {
  PASSWORD_ERROR_LOCK_COUNT: [{ required: true, message: '请输入值' }],
  PASSWORD_ERROR_LOCK_MINUTES: [{ required: true, message: '请输入值' }],
  PASSWORD_EXPIRATION_DAYS: [{ required: true, message: '请输入值' }],
  PASSWORD_EXPIRATION_WARNING_DAYS: [
    { required: true, message: '请输入值' },
    {
      message: '密码到期前的提示时间应小于密码有效期',
      validator: (_rule: FormItemRule, value: any) => {
        return model.PASSWORD_EXPIRATION_DAYS >= 0 && value < model.PASSWORD_EXPIRATION_DAYS;
      }
    }
  ],
  PASSWORD_REPETITION_TIMES: [{ required: true, message: '请输入值' }],
  PASSWORD_MIN_LENGTH: [{ required: true, message: '请输入值' }]
};

// 查询列表数据
const handleInitModel = async () => {
  loading.value = true;
  const { data, error } = await listOption({ category: 'PASSWORD' });
  if (!error) {
    securityConfig.value = data.reduce((obj: SecurityConfig, option: OptionResp) => {
      obj[option.code] = { ...option, value: toInteger(option.value) };
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
  if (securityConfig.value) {
    const { error } = await updateOption(
      Object.entries(model).map(([key, value]) => {
        return { id: securityConfig.value[key].id, code: key, value };
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
  const { error } = await resetOptionValue({ category: 'PASSWORD' });
  if (!error) {
    window.$message?.success('恢复成功');
    await handleInitModel();
  }
};

// 重置
const reset = () => {
  restoreValidation();
  model.PASSWORD_ERROR_LOCK_COUNT = toInteger(securityConfig.value.PASSWORD_ERROR_LOCK_COUNT.value) || 0;
  model.PASSWORD_ERROR_LOCK_MINUTES = toInteger(securityConfig.value.PASSWORD_ERROR_LOCK_MINUTES.value) || 0;
  model.PASSWORD_EXPIRATION_DAYS = toInteger(securityConfig.value.PASSWORD_EXPIRATION_DAYS.value) || 0;
  model.PASSWORD_EXPIRATION_WARNING_DAYS = toInteger(securityConfig.value.PASSWORD_EXPIRATION_WARNING_DAYS.value) || 0;
  model.PASSWORD_REPETITION_TIMES = toInteger(securityConfig.value.PASSWORD_REPETITION_TIMES.value) || 0;
  model.PASSWORD_MIN_LENGTH = toInteger(securityConfig.value.PASSWORD_MIN_LENGTH.value) || 0;
  model.PASSWORD_ALLOW_CONTAIN_USERNAME = toInteger(securityConfig.value.PASSWORD_ALLOW_CONTAIN_USERNAME.value) || 0;
  model.PASSWORD_REQUIRE_SYMBOLS = toInteger(securityConfig.value.PASSWORD_REQUIRE_SYMBOLS.value) || 0;
};

onMounted(() => {
  handleInitModel();
});
</script>

<template>
  <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="250" :disabled="!isEdit">
    <NList :bordered="false" :loading="loading">
      <NFormItem
        path="PASSWORD_ERROR_LOCK_COUNT"
        :label="securityConfig.PASSWORD_ERROR_LOCK_COUNT.name"
        :feedback="securityConfig.PASSWORD_ERROR_LOCK_COUNT.description"
      >
        <NInputNumber
          v-model:value="model.PASSWORD_ERROR_LOCK_COUNT"
          :show-button="false"
          :default-value="0"
          :precision="0"
          :min="0"
          :max="10"
        >
          <template #suffix>次</template>
        </NInputNumber>
      </NFormItem>
      <NFormItem
        path="PASSWORD_ERROR_LOCK_MINUTES"
        :label="securityConfig.PASSWORD_ERROR_LOCK_MINUTES.name"
        :feedback="securityConfig.PASSWORD_ERROR_LOCK_MINUTES.description"
      >
        <NInputNumber
          v-model:value="model.PASSWORD_ERROR_LOCK_MINUTES"
          :show-button="false"
          :precision="0"
          :min="1"
          :max="1440"
        >
          <template #suffix>分</template>
        </NInputNumber>
      </NFormItem>
      <NFormItem
        path="PASSWORD_EXPIRATION_DAYS"
        :label="securityConfig.PASSWORD_EXPIRATION_DAYS.name"
        :feedback="securityConfig.PASSWORD_EXPIRATION_DAYS.description"
      >
        <NInputNumber
          v-model:value="model.PASSWORD_EXPIRATION_DAYS"
          :show-button="false"
          :precision="0"
          :min="0"
          :max="999"
        >
          <template #suffix>天</template>
        </NInputNumber>
      </NFormItem>
      <NFormItem
        :label="securityConfig.PASSWORD_EXPIRATION_WARNING_DAYS.name"
        path="PASSWORD_EXPIRATION_WARNING_DAYS"
        :feedback="securityConfig.PASSWORD_EXPIRATION_WARNING_DAYS.description"
      >
        <NInputNumber
          v-model:value="model.PASSWORD_EXPIRATION_WARNING_DAYS"
          :show-button="false"
          :precision="0"
          :min="0"
          :max="998"
        >
          <template #suffix>天</template>
        </NInputNumber>
      </NFormItem>
      <NFormItem
        path="PASSWORD_REPETITION_TIMES"
        :label="securityConfig.PASSWORD_REPETITION_TIMES.name"
        :feedback="securityConfig.PASSWORD_REPETITION_TIMES.description"
      >
        <NInputNumber
          v-model:value="model.PASSWORD_REPETITION_TIMES"
          :show-button="false"
          :precision="0"
          :min="3"
          :max="32"
        >
          <template #suffix>次</template>
        </NInputNumber>
      </NFormItem>
      <NFormItem
        path="PASSWORD_MIN_LENGTH"
        :label="securityConfig.PASSWORD_MIN_LENGTH.name"
        :feedback="securityConfig.PASSWORD_MIN_LENGTH.description"
      >
        <NInputNumber
          v-model:value="model.PASSWORD_MIN_LENGTH"
          :show-button="false"
          :precision="0"
          :min="8"
          :max="32"
        />
      </NFormItem>
      <NFormItem path="PASSWORD_ALLOW_CONTAIN_USERNAME" :label="securityConfig.PASSWORD_ALLOW_CONTAIN_USERNAME.name">
        <NSwitch v-model:value="model.PASSWORD_ALLOW_CONTAIN_USERNAME" :checked-value="1" :unchecked-value="0">
          <template #checked>是</template>
          <template #unchecked>否</template>
        </NSwitch>
      </NFormItem>
      <NFormItem path="PASSWORD_REQUIRE_SYMBOLS" :label="securityConfig.PASSWORD_REQUIRE_SYMBOLS.name">
        <NSwitch v-model:value="model.PASSWORD_REQUIRE_SYMBOLS" :checked-value="1" :unchecked-value="0">
          <template #checked>是</template>
          <template #unchecked>否</template>
        </NSwitch>
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
