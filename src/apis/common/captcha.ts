import { request } from '@/service/request';
import type * as Common from './type';

const BASE_URL = '/captcha';

/** 获取图片验证码 */
export function getImageCaptcha() {
  return request<Common.ImageCaptchaResp>({
    url: `${BASE_URL}/image`,
    method: 'get'
  });
}

/** 获取短信验证码 */
export function getSmsCaptcha(query: { phone: string }) {
  return request<boolean>({
    url: `${BASE_URL}/sms`,
    method: 'get',
    params: query
  });
}

/** 获取邮箱验证码 */
export function getEmailCaptcha(query: { email: string }) {
  return request<boolean>({
    url: `${BASE_URL}/mail`,
    method: 'get',
    params: query
  });
}

/** 获取行为验证码 */
export function getBehaviorCaptcha(req: any) {
  return request<Common.BehaviorCaptchaResp>({
    url: `${BASE_URL}/behavior`,
    method: 'get',
    params: req
  });
}

/** 校验行为验证码 */
export function checkBehaviorCaptcha(req: any) {
  return request<Common.CheckBehaviorCaptchaResp>({
    url: `${BASE_URL}/behavior`,
    method: 'get',
    params: req
  });
}
