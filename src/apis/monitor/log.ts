import { request } from '@/service/request';
import type { ArcoTreeNodeData } from '../system/type';
import type * as Monitor from './type';

const BASE_URL = '/system/log';

/** 查询日志列表 */
export function listLog(query: Api.Common.EPaginatingSearchParams<Monitor.LogQuery>) {
  return request<Api.Common.PaginatingQueryRecord<Monitor.LogResp[]>>({
    url: `${BASE_URL}`,
    method: 'get',
    params: query
  });
}

/** 查询日志详情 */
export function getLog(id: string) {
  return request<Monitor.LogDetailResp>({
    url: `${BASE_URL}/${id}`,
    method: 'get'
  });
}

/** 导出登录日志 */
export function exportLoginLog(query: Monitor.LogQuery) {
  // return http.download<any>(`${BASE_URL}/export/login`, query);
  return request<any[], 'stream'>({
    url: `${BASE_URL}/export/login`,
    method: 'get',
    params: query
  });
}

/** 导出操作日志 */
export function exportOperationLog(query: Monitor.LogQuery) {
  // return http.download<any>(`${BASE_URL}/export/operation`, query);
  return request<ArcoTreeNodeData[], 'stream'>({
    url: `${BASE_URL}/export/operation`,
    method: 'get',
    params: query
  });
}
