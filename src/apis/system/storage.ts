import { request } from '@/service/request';
import type * as System from './type';

const BASE_URL = '/system/storage';

/** 查询存储列表 */
export function listStorage(query: Api.Common.EPaginatingSearchParams<System.StoragePageQuery>) {
  return request<Api.Common.PaginatingQueryRecord<System.StorageResp[]>>({
    url: `${BASE_URL}`,
    method: 'get',
    params: query
  });
}

/** 查询存储详情 */
export function getStorage(id: string) {
  return request<System.StorageResp>({
    url: `${BASE_URL}/${id}`,
    method: 'get'
  });
}

/** 新增存储 */
export function addStorage(data: any) {
  return request({
    url: `${BASE_URL}`,
    method: 'post',
    data
  });
}

/** 修改存储 */
export function updateStorage(data: any, id: string) {
  return request({
    url: `${BASE_URL}/${id}`,
    method: 'put',
    data
  });
}

/** 删除存储 */
export function deleteStorage(id: string) {
  return request({
    url: `${BASE_URL}/${id}`,
    method: 'delete'
  });
}
