<script lang="ts" setup>
import { useMessage } from 'naive-ui';

const myAccountList = [
  {
    label: 'NaiveUiAdmin@163.com',
    value: 1
  },
  {
    label: 'NaiveUiAdmin@qq.com',
    value: 2
  }
];

const accountTypeList = [
  {
    label: '微信',
    value: 1
  },
  {
    label: '支付宝',
    value: 2
  }
];

const emit = defineEmits(['nextStep']);

const form1Ref: any = ref(null);
const message = useMessage();

const formValue = ref({
  accountType: 1,
  myAccount: null,
  account: 'xioama@qq.com',
  money: '1980',
  name: 'Ah jung'
});

const rules = {
  name: {
    required: true,
    message: '请输入收款人姓名',
    trigger: 'blur'
  },
  account: {
    required: true,
    message: '请输入收款账户',
    trigger: 'blur'
  },
  money: {
    required: true,
    message: '请输入转账金额',
    trigger: 'blur'
  },
  myAccount: {
    required: true,
    type: 'number',
    message: '请选择付款账户',
    trigger: 'change'
  }
};

function formSubmit() {
  form1Ref.value.validate(errors => {
    if (!errors) {
      emit('nextStep');
    } else {
      message.error('验证失败，请填写完整信息');
    }
  });
}
</script>

<template>
  <NForm
    ref="form1Ref"
    :label-width="100"
    :model="formValue"
    :rules="rules"
    label-placement="left"
    style="max-width: 500px; margin: 40px auto 0 80px"
  >
    <NFormItem label="付款账户" path="myAccount">
      <NSelect v-model:value="formValue.myAccount" placeholder="请选择付款账户" :options="myAccountList" />
    </NFormItem>
    <NFormItem label="收款账户" path="account">
      <NInputGroup>
        <NSelect
          v-model:value="formValue.accountType"
          placeholder="请选择"
          :options="accountTypeList"
          :style="{ width: '20%' }"
        />
        <NInput v-model:value="formValue.account" placeholder="请输入收款账户" :style="{ width: '80%' }" />
      </NInputGroup>
    </NFormItem>
    <NFormItem label="收款人姓名" path="name">
      <NInput v-model:value="formValue.name" placeholder="请输入收款人姓名" />
    </NFormItem>
    <NFormItem label="转账金额" path="money">
      <NInput v-model:value="formValue.money" placeholder="请输入转账金额">
        <template #prefix>
          <span class="text-gray-400">￥</span>
        </template>
      </NInput>
    </NFormItem>
    <div style="margin-left: 80px">
      <NSpace>
        <NButton type="primary" @click="formSubmit">下一步</NButton>
      </NSpace>
    </div>
  </NForm>
</template>
