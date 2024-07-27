import { request } from '@/service/request';
import type * as System from './type';

const BASE_URL = '/system/menu';

/** 查询菜单列表 */
export function listMenu(query: System.MenuQuery) {
  return request<System.MenuResp[]>({
    url: `${BASE_URL}//tree`,
    method: 'get',
    params: query
  });
}

/** 查询菜单详情 */
export function getMenu(id: string) {
  return request<System.MenuResp>({
    url: `${BASE_URL}/${id}`,
    method: 'get'
  });
}

/** 新增菜单 */
export function addMenu(data: any) {
  return request<boolean>({
    url: `${BASE_URL}`,
    method: 'post',
    params: data
  });
}

/** 修改菜单 */
export function updateMenu(data: any, id: string) {
  return request({
    url: `${BASE_URL}/${id}`,
    method: 'put',
    params: data
  });
}

/** 删除菜单 */
export function deleteMenu(id: string) {
  return request({
    url: `${BASE_URL}/${id}`,
    method: 'delete'
  });
}
