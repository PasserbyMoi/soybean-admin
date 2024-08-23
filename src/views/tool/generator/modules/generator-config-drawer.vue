<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui';
import type { FieldConfigResp } from '@/apis';
import { getGenConfig, listFieldConfig, saveGenConfig } from '@/apis';
import { $t } from '@/locales';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { useAppStore } from '@/store/modules/app';
import { useDict } from '@/hooks/business/dict';

defineOptions({
  name: 'GeneratorConfigDrawer'
});

const rowId = defineModel<string | null>('rowId', {
  default: () => null
});
const visible = defineModel<boolean>('visible', {
  default: false
});

interface Emits {
  (e: 'submitted'): void;
}
const emit = defineEmits<Emits>();

const appStore = useAppStore();
const { form_type_enum, query_type_enum } = useDict('form_type_enum', 'query_type_enum');
const { formRef, validate, restoreValidation } = useNaiveForm();
const fieldDetail = ref<FieldConfigResp[]>();

const title = computed(() => {
  return `${rowId.value} 表生成配置`;
});

interface FormModel {
  tableName: string;
  author: string;
  businessName: string;
  moduleName: string;
  packageName: string;
  tablePrefix: string;
  isOverride: boolean;
}
const model: FormModel = reactive({
  tableName: '',
  author: '',
  businessName: '',
  moduleName: '',
  packageName: '',
  tablePrefix: '',
  isOverride: false
});
const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  const { formRules } = useFormRules();
  return {
    tableName: formRules.defaultRequiredRule,
    author: formRules.defaultRequiredRule,
    businessName: formRules.defaultRequiredRule,
    moduleName: formRules.defaultRequiredRule,
    packageName: formRules.defaultRequiredRule,
    tablePrefix: formRules.defaultRequiredRule,
    isOverride: formRules.defaultPassRule
  };
});

// 初始化 model、数据
function handleInitModel() {
  if (rowId.value) {
    getGenConfig(rowId.value).then(res => {
      Object.assign(model, res.data ?? {});
    });
    listFieldConfig(rowId.value, false).then(res => {
      fieldDetail.value = res.data ?? [];
    });
  }
}

// 提交
async function handleSubmit() {
  await validate();
  if (rowId.value) {
    const { error } = await saveGenConfig(rowId.value, {
      genConfig: model,
      fieldConfigs: fieldDetail.value ?? []
    });
    if (!error) {
      window.$message?.success($t('common.updateSuccess'));
      closeDrawer(true);
    }
  }
}

// 关闭窗口
function closeDrawer(submitted: boolean = false) {
  visible.value = false;
  if (submitted) {
    nextTick(() => {
      emit('submitted');
    });
  }
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="960" close-on-esc @after-leave="closeDrawer">
    <NDrawerContent :title="title" closable>
      <NTabs>
        <NTabPane key="1" name="生成配置">
          <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="100">
            <NFormItem label="作者名称" path="author">
              <NInput v-model:value="model.author" placeholder="请输入作者名称" class="max-w-320px" />
            </NFormItem>
            <NFormItem label="业务名称" path="businessName">
              <NInput v-model:value="model.businessName" placeholder="自定义业务名称，例如：用户" class="max-w-320px" />
            </NFormItem>
            <NFormItem label="所属模块" path="moduleName">
              <NInput
                v-model:value="model.moduleName"
                placeholder="项目模块名称，例如：continew-admin-system"
                class="max-w-320px"
              />
            </NFormItem>
            <NFormItem label="模块包名" path="packageName">
              <NInput
                v-model:value="model.packageName"
                placeholder="项目模块包名，例如：top.continew.admin.system"
                class="max-w-320px"
              />
            </NFormItem>
            <NFormItem label="去表前缀" path="tablePrefix">
              <NInput v-model:value="model.tablePrefix" placeholder="数据库表前缀，例如：sys_" class="max-w-320px" />
            </NFormItem>
            <NFormItem label="是否覆盖" path="isOverride">
              <NSwitch v-model:value="model.isOverride" :checked-value="true" :unchecked-value="false">
                <template #checked>是</template>
                <template #unchecked>否</template>
              </NSwitch>
            </NFormItem>
          </NForm>
        </NTabPane>
        <NTabPane key="2" name="字段配置">
          <NTable :size="appStore.tableSize" :striped="appStore.isStriped">
            <thead>
              <tr>
                <th class="">名称</th>
                <th class="">类型</th>
                <th class="">描述</th>
                <th class="">列表</th>
                <th class="">表单</th>
                <th class="">必填</th>
                <th class="">查询</th>
                <th class="">表单类型</th>
                <th>查询方式</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="field in fieldDetail" :key="field.columnName">
                <td>{{ field.fieldName }}</td>
                <td>
                  <span v-if="field.fieldType">{{ field.fieldType }}</span>
                  <NTooltip v-else>
                    <template #trigger>
                      <icon-local-exclamation-circle class="text-#f53f3f" />
                    </template>
                    请检查 generator.properties 配置
                  </NTooltip>
                </td>
                <td>
                  <NInput v-model:value="field.comment" :size="appStore.tableSize" class="max-w-200px"></NInput>
                </td>
                <td>
                  <NCheckbox
                    v-model:checked="field.showInList"
                    :checked-value="true"
                    :unchecked-value="false"
                    :size="appStore.tableSize"
                  ></NCheckbox>
                </td>
                <td>
                  <NCheckbox
                    v-model:checked="field.showInForm"
                    :checked-value="true"
                    :unchecked-value="false"
                    :size="appStore.tableSize"
                  ></NCheckbox>
                </td>
                <td>
                  <NCheckbox
                    v-if="field.showInForm"
                    v-model:checked="field.isRequired"
                    :checked-value="true"
                    :unchecked-value="false"
                    :size="appStore.tableSize"
                  />
                  <NCheckbox v-else disabled />
                </td>
                <td>
                  <NCheckbox
                    v-model:checked="field.showInQuery"
                    :checked-value="true"
                    :unchecked-value="false"
                    :size="appStore.tableSize"
                  ></NCheckbox>
                </td>
                <td>
                  <NSelect
                    v-if="field.showInForm || field.showInQuery"
                    v-model:value="field.formType"
                    :options="form_type_enum"
                    placeholder="请选择表单类型"
                    class="min-w-120px"
                    :size="appStore.tableSize"
                  />
                  <span v-else>无需设置</span>
                </td>
                <td>
                  <NSelect
                    v-if="field.showInQuery"
                    v-model:value="field.queryType"
                    :options="query_type_enum"
                    placeholder="请选择查询方式"
                    class="min-w-120px"
                    :size="appStore.tableSize"
                  />
                  <span v-else>无需设置</span>
                </td>
              </tr>
            </tbody>
          </NTable>
        </NTabPane>
      </NTabs>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer(false)">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
