import { request } from '@/service/request';
import { encryptByRsa } from '@/utils/encrypt';
import type * as Auth from './type';

const BASE_URL = '/auth';

/** 账号登录 */
export function accountLogin(req: Auth.AccountLoginReq) {
  const acountLoginReq: Auth.AccountLoginReq = { ...req };
  acountLoginReq.password = encryptByRsa(req.password) || '';
  return request<Auth.LoginResp>({
    url: `${BASE_URL}/account`,
    method: 'post',
    data: acountLoginReq
  });
}

/** 手机号登录 */
export function phoneLogin(req: Auth.PhoneLoginReq) {
  return request<Auth.LoginResp>({
    url: `${BASE_URL}/phone`,
    method: 'post',
    data: req
  });
}

/** 邮箱登录 */
export function emailLogin(req: Auth.EmailLoginReq) {
  return request<Auth.LoginResp>({
    url: `${BASE_URL}/email`,
    method: 'post',
    data: req
  });
}

/** 三方账号登录 */
export function socialLogin(source: string, req: any) {
  return request<Auth.LoginResp>({
    url: `/oauth/${source}`,
    method: 'post',
    data: req
  });
}

/** 三方账号登录授权 */
export function socialAuth(source: string) {
  return request<Auth.SocialAuthAuthorizeResp>({
    url: `/oauth/${source}`,
    method: 'get'
  });
}

/** 退出登录 */
export function logout() {
  return request({
    url: `${BASE_URL}/logout`,
    method: 'post'
  });
}

/** 获取用户信息 */
export const getUserInfo = () => {
  return request<Auth.UserInfo>({
    url: `${BASE_URL}/user/info`,
    method: 'get'
  });
};

/** 获取路由信息 */
export const getUserRoute = () => {
  return request<Auth.RouteItem[]>({
    url: `${BASE_URL}/route`,
    method: 'get'
  });
};
