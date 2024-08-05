import { request } from '@/service/request';
import type * as System from './type';

const BASE_URL = '/system/user';

/** 上传头像 */
export function uploadAvatar(data: FormData) {
  return request({
    url: `${BASE_URL}/avatar`,
    method: 'post',
    data
  });
}

/** 修改用户基本信息 */
export function updateUserBaseInfo(data: { nickname: string; gender: number }) {
  return request({
    url: `${BASE_URL}/basic/info`,
    method: 'patch',
    data
  });
}

/** 修改密码 */
export function updateUserPassword(data: { oldPassword: string; newPassword: string }) {
  return request({
    url: `${BASE_URL}/password`,
    method: 'patch',
    data
  });
}

/** 修改手机号 */
export function updateUserPhone(data: { phone: string; captcha: string; oldPassword: string }) {
  return request({
    url: `${BASE_URL}/phone`,
    method: 'patch',
    data
  });
}

/** 修改邮箱 */
export function updateUserEmail(data: { email: string; captcha: string; oldPassword: string }) {
  return request({
    url: `${BASE_URL}/email`,
    method: 'patch',
    data
  });
}

/** 获取绑定的三方账号 */
export function listUserSocial() {
  return request<System.BindSocialAccountRes[]>({
    url: `${BASE_URL}/social`,
    method: 'get'
  });
}

/** 绑定三方账号 */
export function bindSocialAccount(source: string, data: any) {
  return request({
    url: `${BASE_URL}/social/${source}`,
    method: 'post',
    data
  });
}

/** 解绑三方账号 */
export function unbindSocialAccount(source: string) {
  return request({
    url: `${BASE_URL}/social/${source}`,
    method: 'delete'
  });
}
