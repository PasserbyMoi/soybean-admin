import { request } from '@/service/request';
import type * as System from './type';

const BASE_URL = '/system/file';

/** 查询文件列表 */
export function listFile(query: Api.Common.EPaginatingSearchParams<System.FileQuery>) {
  return request<Api.Common.PaginatingQueryRecord<System.FileItem[]>>({
    url: `${BASE_URL}`,
    method: 'get',
    params: query
  });
}

/** 修改文件 */
export function updateFile(data: any, id: string) {
  return request({
    url: `${BASE_URL}/${id}`,
    method: 'put',
    params: data
  });
}

/** 删除文件 */
export function deleteFile(ids: string | Array<string>) {
  return request({
    url: `${BASE_URL}/${ids}`,
    method: 'delete'
  });
}

/** 查询文件资源统计统计 */
export function getFileStatistics() {
  return request<System.FileStatisticsResp>({
    url: `${BASE_URL}/statistics`,
    method: 'get'
  });
}
