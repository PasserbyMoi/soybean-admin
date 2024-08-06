import { ref, toValue } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import type { FormInst, FormItemRule, FormValidationError } from 'naive-ui';
import type { FormValidateCallback, ShouldRuleBeApplied } from 'naive-ui/es/form/src/interface';
import type { RuleItem, ValidateError, ValidateMessages, ValidateOption } from 'async-validator';
import { REG_CAPTCHA_FOUR, REG_CODE_SIX, REG_EMAIL, REG_PHONE, REG_PWD, REG_USER_NAME } from '@/constants/reg';
import { $t } from '@/locales';

export function useFormRules() {
  const patternRules = {
    username: {
      pattern: REG_USER_NAME,
      message: $t('form.userName.invalid'),
      trigger: ['change', 'blur']
    },
    phone: {
      pattern: REG_PHONE,
      message: $t('form.phone.invalid'),
      trigger: ['change', 'blur']
    },
    pwd: {
      pattern: REG_PWD,
      message: $t('form.pwd.invalid'),
      trigger: ['change', 'blur']
    },
    captcha: {
      pattern: REG_CAPTCHA_FOUR,
      message: $t('form.code.invalid'),
      trigger: ['change', 'blur']
    },
    code: {
      pattern: REG_CODE_SIX,
      message: $t('form.code.invalid'),
      trigger: ['change', 'blur']
    },
    email: {
      pattern: REG_EMAIL,
      message: $t('form.required'),
      trigger: ['change', 'blur']
    },
    uuid: {}
  } satisfies Record<string, App.Global.FormRule>;

  const formRules = {
    username: [createRequiredRule($t('form.userName.required')), patternRules.username],
    phone: [createRequiredRule($t('form.phone.required')), patternRules.phone],
    pwd: [createRequiredRule($t('form.pwd.required')), patternRules.pwd],
    captcha: [createRequiredRule($t('form.code.required')), patternRules.captcha],
    code: [createRequiredRule($t('form.code.required')), patternRules.code],
    email: [createRequiredRule($t('form.email.required')), patternRules.email],
    uuid: [createRequiredRule($t('form.required'))]
  } satisfies Record<string, App.Global.FormRule[]>;

  /** the default required rule */
  const defaultRequiredRule = createRequiredRule($t('form.required'));

  function createRequiredRule(message: string): App.Global.FormRule {
    return {
      required: true,
      trigger: 'blur',
      message
    };
  }

  /** create a rule for confirming the password */
  function createConfirmPwdRule(pwd: string | Ref<string> | ComputedRef<string>) {
    const confirmPwdRule: App.Global.FormRule[] = [
      { required: true, message: $t('form.confirmPwd.required') },
      {
        asyncValidator: (rule, value) => {
          if (value.trim() !== '' && value !== toValue(pwd)) {
            return Promise.reject(rule.message);
          }
          return Promise.resolve();
        },
        message: $t('form.confirmPwd.invalid'),
        trigger: 'input'
      }
    ];
    return confirmPwdRule;
  }

  return {
    patternRules,
    formRules,
    defaultRequiredRule,
    createRequiredRule,
    createConfirmPwdRule
  };
}

export function useNaiveForm() {
  const formRef = ref<FormInst | null>(null);

  async function validateField(keys?: Array<string>): Promise<boolean> {
    let valid = false;
    await formRef.value?.validate(
      error => {
        if (!error) {
          valid = true;
        }
      },
      rule => {
        if (keys && keys.length > 0) {
          return keys.includes(rule?.key ?? '');
        }
        return true;
      }
    );
    return valid;
  }

  async function validate(callback?: FormValidateCallback, shouldRuleBeApplied?: ShouldRuleBeApplied) {
    return await formRef.value?.validate(callback, shouldRuleBeApplied);
  }

  async function restoreValidation() {
    formRef.value?.restoreValidation();
  }

  return {
    formRef,
    validate,
    validateField,
    restoreValidation
  };
}
