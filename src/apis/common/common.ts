import { request } from '@/service/request';
import type { ArcoTreeNodeData, OptionQuery } from '@/apis';

const BASE_URL = '/common';

/** 查询部门树 */
export function listDeptTree(query: { description: string }) {
  return request<ArcoTreeNodeData[]>({
    url: `${BASE_URL}/tree/dept`,
    method: 'get',
    params: query
  });
}

/** 查询菜单树 */
export function listMenuTree(query: { description: string }) {
  return request<ArcoTreeNodeData[]>({
    url: `${BASE_URL}/tree/menu`,
    method: 'get',
    params: query
  });
}

/** 查询角色列表 */
export function listRoleDict(query?: { name: string; status: number }) {
  return request<CommonType.EOption[]>({
    url: `${BASE_URL}/dict/role`,
    method: 'get',
    params: query
  });
}

/** 查询字典列表 */
export function listCommonDict(code: string) {
  return request<CommonType.EOption[]>({
    url: `${BASE_URL}/dict/${code}`,
    method: 'get'
  });
}

/** 查询参数列表 */
export function listOptionDict(query: OptionQuery) {
  return request<CommonType.EOption[]>({
    url: `${BASE_URL}/dict/option`,
    method: 'get',
    params: query
  });
}

/** 上传文件 */
export function uploadFile(data: FormData) {
  return request<boolean>({
    url: `${BASE_URL}/file`,
    method: 'post',
    data
  });
}
