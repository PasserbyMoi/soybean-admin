import { request } from '@/service/request';
import type * as System from './type';

const BASE_URL = '/system/role';

/** 查询角色列表 */
export function listRole(query: Api.Common.EPaginatingSearchParams<System.RoleQuery>) {
  return request<Api.Common.PaginatingQueryRecord<System.RoleResp[]>>({
    url: `${BASE_URL}`,
    method: 'get',
    params: query
  });
}

/** 查询角色详情 */
export function getRole(id: string) {
  return request<System.RoleDetailResp>({
    url: `${BASE_URL}/${id}`,
    method: 'get'
  });
}

/** 新增角色 */
export function addRole(data: any) {
  return request({
    url: `${BASE_URL}`,
    method: 'post',
    data
  });
}

/** 修改角色 */
export function updateRole(data: any, id: string) {
  return request({
    url: `${BASE_URL}/${id}`,
    method: 'put',
    data
  });
}

/** 删除角色 */
export function deleteRole(ids: string | Array<string>) {
  return request({
    url: `${BASE_URL}/${ids}`,
    method: 'delete'
  });
}
