<script setup lang="tsx">
const value = ref();

const cbValue = ref();
const cbOption = ref();
const cbPathValues = ref();

const formRef = ref();
const formValue = ref({
  region: null
});

function handleUpdateValue(_value: string, option: any, pathValues: any[]) {
  cbValue.value = _value;
  cbOption.value = { code: option.code, name: option.name };
  cbPathValues.value = pathValues.map(i => ({ code: i.code, name: i.name }));
}

function handleValidateClick() {
  formRef.value?.validate((errors: any) => {
    if (!errors) window.$message?.success('Valid');
    else window.$message?.error('Invalid');
  });
}
</script>

<template>
  <NCard title="省市区联动">
    <NH2>当前选择行政区：{{ value }}</NH2>
    <PcaCascader v-model:value="value" @update:value="handleUpdateValue" />
    <div>
      <NH2>回调value</NH2>
      <pre class="bg-#eee">
      {{ cbValue }}
    </pre
      >
    </div>
    <div>
      <NH2>回调option</NH2>
      <pre class="bg-#eee">
      {{ cbOption }}
    </pre
      >
    </div>
    <div>
      <NH2>回调pathValues</NH2>
      <pre class="bg-#eee">
      {{ cbPathValues }}
    </pre
      >
    </div>

    <NH2>表单验证</NH2>
    <NForm ref="formRef" inline :label-width="80" :model="formValue">
      <NFormItem label="地区" path="region" :rule="[{ required: true, message: '地区必填' }]">
        <PcaCascader v-model:value="formValue.region" />
      </NFormItem>
      <NFormItem>
        <NButton attr-type="button" @click="handleValidateClick">验证</NButton>
      </NFormItem>
    </NForm>
  </NCard>
</template>

<style scoped></style>
