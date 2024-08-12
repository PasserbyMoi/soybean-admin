import { camelCase, upperFirst } from 'lodash-es';
import { REG_EXTERNAL_LINK } from '@/constants/reg';

export function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

/**
 * 去除空格
 *
 * @param {string} str - 字符串
 * @param {string} pos - 去除空格的位置 pos="both": 去除两边空格 pos="left": 去除左边空格 pos="right": 去除右边空格 pos="all": 去除所有空格
 */
type Pos = 'both' | 'left' | 'right' | 'all';
export function trim(str: string, pos: Pos = 'both'): string {
  if (pos === 'both') {
    return str.replace(/^\s+|\s+$/g, '');
  } else if (pos === 'left') {
    return str.replace(/^\s*/, '');
  } else if (pos === 'right') {
    return str.replace(/(\s*$)/g, '');
  } else if (pos === 'all') {
    return str.replace(/\s+/g, '');
  }
  return str;
}

/**
 * 根据数字获取对应的汉字
 *
 * @param {number} num - 数字(0-10)
 */
export function getHanByNumber(num: number): string {
  const str = '零一二三四五六七八九十';
  return str.charAt(num);
}

/**
 * 获取指定整数范围内的随机整数
 *
 * @param {number} start - 开始范围
 * @param {number} end - 结束范围
 */
export function getRandomInterger(end: number, start = 0): number {
  const range = end - start;
  return Math.floor(Math.random() * range + start);
}

/** 千分位格式化 */
export function formatMoney(money: string) {
  return money.replace(new RegExp(`(?!^)(?=(\\d{3})+${money.includes('.') ? '\\.' : '$'})`, 'g'), ',');
}

/** 数据类型检测方法 */
export function getTypeOf(value: any) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

/**
 * 格式化电话号码
 *
 * @demo 183-7983-6654
 */
export function formatPhone(mobile: string, formatStr = '-') {
  return mobile.replace(/(?=(\d{4})+$)/g, formatStr);
}

/**
 * 手机号脱敏
 *
 * @demo 155****8810
 */
export function hidePhone(phone: string) {
  return phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
}

/** 检测数据是否为空数据 */
export function isEmpty(data: unknown) {
  if (data === '' || data === 'undefined' || data === undefined || data === null || data === 'null') {
    return true;
  }
  return JSON.stringify(data) === '{}' || JSON.stringify(data) === '[]' || JSON.stringify(data) === '[{}]';
}

/**
 * 大小写转换
 *
 * @param {string} str 待转换的字符串
 * @param {number} type 1:全大写 2:全小写 3:首字母大写
 */
export function toCase(str: string, type: number) {
  switch (type) {
    case 1:
      return str.toUpperCase();
    case 2:
      return str.toLowerCase();
    case 3:
      return str[0].toUpperCase() + str.substring(1).toLowerCase();
    default:
      return str;
  }
}

/**
 * 获取随机数
 *
 * @param {number} min 最小值
 * @param {number} max 最大值
 */
export const randomNum = (min: number, max: number) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

/** 获取最大值 */
export const max = (arr: number[]) => {
  return Math.max.apply(null, arr);
};

/** 获取最小值 */
export const min = (arr: number[]) => {
  return Math.min.apply(null, arr);
};

/** 求和 */
export const sum = (arr: number[]) => {
  return arr.reduce((pre, cur) => pre + cur);
};

/** 获取平均值 */
export const average = (arr: number[]) => {
  return sum(arr) / arr.length;
};

/**
 * 判断是否是闰年
 *
 * @param {number} year 年份
 */
export const isLeapYear = (year: number) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

/**
 * 判断是否是奇数
 *
 * @param {number} num 数字
 */
export const isOdd = (num: number) => {
  return num % 2 !== 0;
};

/**
 * 判断是否是偶数
 *
 * @param {number} num 数字
 */
export const isEven = (num: number) => {
  return !isOdd(num);
};

/** 获取随机十六进制颜色 */
export const randomHex = () => {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padEnd(6, '0')}`;
};

/** 问候 */
export function goodTimeText() {
  const time = new Date();
  const hour = time.getHours();
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour <= 18 ? '下午好' : '晚上好';
}

/** 格式化文件大小 */
export const formatFileSize = (fileSize: number) => {
  if (!fileSize || fileSize === 0) {
    return '0 Bytes';
  }
  const unitArr = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let index = 0;
  const srcSize = Number.parseFloat(fileSize.toString());
  index = Math.floor(Math.log(srcSize) / Math.log(1024));
  const size = srcSize / 1024 ** index;
  return `${size.toFixed(2)} ${unitArr[index]}`;
};

/** 复制文本 */
export const copyText = (text: any) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  window.$message?.success('复制成功');
};

/**
 * 动态路由 path 转 name
 *
 * @demo /system => System
 * @demo /system/menu => SystemMenu
 * @demo /data-manage/detail => DataManageDetail
 */
export const transformPathToName = (path: string) => {
  if (!path) return '';
  if (REG_EXTERNAL_LINK.test(path)) return '';
  return upperFirst(camelCase(path));
};

export const resetSize = (vm: any) => {
  let img_width;
  let img_height;
  let bar_width;
  let bar_height; // 图片的宽度、高度，移动条的宽度、高度

  const parentWidth = vm.$el.parentNode.offsetWidth || window.innerWidth;
  const parentHeight = vm.$el.parentNode.offsetHeight || window.innerHeight;
  if (vm.imgSize.width.includes('%')) {
    img_width = `${(Number.parseInt(vm.imgSize.width, 10) / 100) * parentWidth}px`;
  } else {
    img_width = vm.imgSize.width;
  }

  if (vm.imgSize.height.includes('%')) {
    img_height = `${(Number.parseInt(vm.imgSize.height, 10) / 100) * parentHeight}px`;
  } else {
    img_height = vm.imgSize.height;
  }

  if (vm.barSize.width.includes('%')) {
    bar_width = `${(Number.parseInt(vm.barSize.width, 10) / 100) * parentWidth}px`;
  } else {
    bar_width = vm.barSize.width;
  }

  if (vm.barSize.height.includes('%')) {
    bar_height = `${(Number.parseInt(vm.barSize.height, 10) / 100) * parentHeight}px`;
  } else {
    bar_height = vm.barSize.height;
  }

  return {
    imgWidth: img_width,
    imgHeight: img_height,
    barWidth: bar_width,
    barHeight: bar_height
  };
};
