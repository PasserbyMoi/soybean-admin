import { computed } from 'vue';
import { useCountDown, useLoading } from '@sa/hooks';
import { $t } from '@/locales';
import { REG_EMAIL, REG_PHONE } from '@/constants/reg';
import { getEmailCaptcha, getSmsCaptcha } from '@/apis';

export function useCaptcha() {
  const { loading, startLoading, endLoading } = useLoading();
  const { count, start, stop, isCounting } = useCountDown(60);

  const label = computed(() => {
    let text = $t('page.login.codeLogin.getCode');
    const countingLabel = $t('page.login.codeLogin.reGetCode', { time: count.value });
    if (loading.value) {
      text = '';
    }
    if (isCounting.value) {
      text = countingLabel;
    }
    return text;
  });

  function isPhoneValid(phone: string) {
    if (phone.trim() === '') {
      window.$message?.error?.($t('form.phone.required'));
      return false;
    }
    if (!REG_PHONE.test(phone)) {
      window.$message?.error?.($t('form.phone.invalid'));
      return false;
    }
    return true;
  }

  function isEmailValid(email: string) {
    if (email.trim() === '') {
      window.$message?.error?.($t('form.email.required'));
      return false;
    }
    if (!REG_EMAIL.test(email)) {
      window.$message?.error?.($t('form.email.invalid'));
      return false;
    }
    return true;
  }

  function isPhoneOrEmailValid(phoneOrEmail: string) {
    if (phoneOrEmail.trim() === '') {
      window.$message?.error?.($t('form.phoneOrEmail.required'));
      return false;
    }
    if (!REG_EMAIL.test(phoneOrEmail) && !REG_PHONE.test(phoneOrEmail)) {
      window.$message?.error?.($t('form.phoneOrEmail.invalid'));
      return false;
    }
    return true;
  }

  async function getCaptcha(phoneOrEmail: string) {
    const valid = isPhoneOrEmailValid(phoneOrEmail);
    if (!valid || loading.value) {
      return;
    }
    startLoading();
    if (REG_PHONE.test(phoneOrEmail)) {
      const { data } = await getSmsCaptcha({
        phone: phoneOrEmail
      });
      if (!data) {
        window.$message?.error?.($t('page.login.codeLogin.sendCodeFail'));
      } else {
        window.$message?.success?.($t('page.login.codeLogin.sendCodeSuccess'));
      }
    }
    if (REG_EMAIL.test(phoneOrEmail)) {
      const { data } = await getEmailCaptcha({
        email: phoneOrEmail
      });
      if (!data) {
        window.$message?.error?.($t('page.login.codeLogin.sendCodeFail'));
      } else {
        window.$message?.success?.($t('page.login.codeLogin.sendCodeSuccess'));
      }
    }
    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
    start();
    endLoading();
  }

  return {
    label,
    start,
    stop,
    isCounting,
    loading,
    getCaptcha
  };
}
