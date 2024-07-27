<script setup lang="tsx">
import { useAuthStore } from '@/store/modules/auth';

const authStore = useAuthStore();

const { userInfo } = authStore;
const formRef = ref();
const formValue = ref({
  user: {
    name: '张三',
    age: ''
  },
  phone: ''
});
const rules = {
  user: {
    name: {
      required: true,
      message: '请输入姓名',
      trigger: 'blur'
    },
    age: {
      required: true,
      message: '请输入年龄',
      trigger: ['input', 'blur']
    }
  },
  phone: {
    required: true,
    message: '请输入电话号码',
    trigger: ['input']
  }
};

function handleValidateClick() {
  formRef.value?.validate((errors: any) => {
    if (!errors) window.$message?.success('验证通过');
    else window.$message?.error('验证不通过');
  });
}
</script>

<template>
  <NSpace vertical>
    <NCard title="个人信息">
      <NSpace size="large">
        <NAvatar round :size="128" :src="userInfo?.avatar" />

        <NDescriptions
          label-placement="left"
          :column="2"
          :title="`傍晚好，${userInfo?.nickname}，这里是简单的个人中心模板`"
        >
          <NDescriptionsItem label="id">
            {{ userInfo?.id }}
          </NDescriptionsItem>
          <NDescriptionsItem label="用户名">
            {{ userInfo?.userName }}
          </NDescriptionsItem>
          <NDescriptionsItem label="真实名称">
            {{ userInfo?.nickname }}
          </NDescriptionsItem>
          <NDescriptionsItem label="角色">
            {{ userInfo?.roles }}
          </NDescriptionsItem>
        </NDescriptions>
      </NSpace>
    </NCard>
    <NCard title="信息修改">
      <NSpace justify="center">
        <NForm ref="formRef" class="w-500px" :label-width="80" :model="formValue" :rules="rules">
          <NFormItem label="姓名" path="user.name">
            <NInput v-model:value="formValue.user.name" placeholder="输入姓名" />
          </NFormItem>
          <NFormItem label="年龄" path="user.age">
            <NInput v-model:value="formValue.user.age" placeholder="输入年龄" />
          </NFormItem>
          <NFormItem label="电话号码" path="phone">
            <NInput v-model:value="formValue.phone" placeholder="电话号码" />
          </NFormItem>
          <NFormItem>
            <NButton type="primary" attr-type="button" block @click="handleValidateClick">验证</NButton>
          </NFormItem>
        </NForm>
      </NSpace>
    </NCard>
  </NSpace>
</template>

<style scoped></style>
