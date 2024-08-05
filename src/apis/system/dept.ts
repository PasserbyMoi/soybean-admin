import { request } from '@/service/request';
import type * as System from './type';

const BASE_URL = '/system/dept';

/** 查询部门列表 */
export function listDept(query: System.DeptQuery) {
  return request<System.DeptResp[]>({
    url: `${BASE_URL}/tree`,
    method: 'get',
    params: query
  });
}

/** 查询部门详情 */
export function getDept(id: string) {
  return request<System.DeptResp>({
    url: `${BASE_URL}/${id}`,
    method: 'get'
  });
}

/** 新增部门 */
export function addDept(data: any) {
  return request<boolean>({
    url: `${BASE_URL}`,
    method: 'post',
    data
  });
}

/** 修改部门 */
export function updateDept(data: any, id: string) {
  return request({
    url: `${BASE_URL}/${id}`,
    method: 'put',
    data
  });
}

/** 删除部门 */
export function deleteDept(id: string) {
  return request({
    url: `${BASE_URL}/${id}`,
    method: 'delete'
  });
}

/** 导出部门 */
export function exportDept(query: System.DeptQuery) {
  // return http.download<any>(`${BASE_URL}/export`, query);
  return request<any, 'stream'>({
    url: `${BASE_URL}/export`,
    method: 'get',
    params: query
  });
}
