import { request } from '@/service/request';
import type * as System from './type';

const BASE_URL = '/system/user';

/** 查询用户列表 */
export function listUser(query: Api.Common.EPaginatingSearchParams<System.UserQuery>) {
  return request<Api.Common.PaginatingQueryRecord<System.UserResp[]>>({
    url: `${BASE_URL}`,
    method: 'get',
    params: query
  });
}

/** 查询用户详情 */
export function getUser(id: string) {
  return request<System.UserDetailResp>({
    url: `${BASE_URL}/${id}`,
    method: 'get'
  });
}

/** 新增用户 */
export function addUser(data: any) {
  return request({
    url: `${BASE_URL}`,
    method: 'post',
    params: data
  });
}

/** 修改用户 */
export function updateUser(data: any, id: string) {
  return request({
    url: `${BASE_URL}/${id}`,
    method: 'put',
    params: data
  });
}

/** 删除用户 */
export function deleteUser(ids: string | Array<string>) {
  return request({
    url: `${BASE_URL}/${ids}`,
    method: 'delete'
  });
}

/** 导出用户 */
export function exportUser(query: System.UserQuery) {
  return request<any, 'stream'>({
    url: `${BASE_URL}/export`,
    method: 'get',
    params: query
  });
}

/** 重置密码 */
export function resetUserPwd(data: any, id: string) {
  return request({
    url: `${BASE_URL}/${id}/password`,
    method: 'patch',
    params: data
  });
}
