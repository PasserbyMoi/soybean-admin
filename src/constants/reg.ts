export const REG_USER_NAME = /^[\u4E00-\u9FA5a-zA-Z0-9_-]{4,16}$/;

/**
 * Password reg
 *
 * 6-18 characters, including letters, numbers, and underscores
 */
export const REG_PWD = /^\w{6,18}$/;

/** 正则-密码(密码为8-18位数字/字符/符号的组合) */
export const REG_COMP_PWD =
  /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,18}$/;

/** Phone reg */
export const REG_PHONE =
  /^[1](([3][0-9])|([4][01456789])|([5][012356789])|([6][2567])|([7][0-8])|([8][0-9])|([9][012356789]))[0-9]{8}$/;

/** Email reg */
export const REG_EMAIL = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

/** Phone Or Email reg */
export const REG_PHONE_OR_EMAIL =
  /^[1](([3][0-9])|([4][01456789])|([5][012356789])|([6][2567])|([7][0-8])|([8][0-9])|([9][012356789]))[0-9]{8}$|^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

/** Six digit code reg */
export const REG_CODE_SIX = /^\d{6}$/;

/** Four digit code reg */
export const REG_CODE_FOUR = /^\d{4}$/;

/** Four captcha code reg */
export const REG_CAPTCHA_FOUR = /^[a-zA-Z0-9]{4}$/;

/** Six captcha code reg */
export const REG_CAPTCHA_SIX = /^[a-zA-Z0-9]{6}$/;

/** 正则-只能是中文 */
export const REG_CH = /^[\u4E00-\u9FA5]+$/gi;

/** 正则-只能是英文 */
export const REG_EN = /^[a-zA-Z]*$/;

/** 正则 HEX 16进颜色值 #333 #8c8c8c */
export const REG_HEX_COLOR = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;

/** Url reg */
export const REG_URL =
  /(((^https?:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

/** Ipv4 reg */
export const REG_IP_V4 =
  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

export const REG_EXTERNAL_LINK = /^(https?:|mailto:|tel:)/;

export const REG_HTTP = /^(https:\/\/|http:\/\/)/;
