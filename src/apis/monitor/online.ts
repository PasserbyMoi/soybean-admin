import { request } from '@/service/request';
import type * as Monitor from './type';

const BASE_URL = '/monitor/online';

/** 查询在线用户列表 */
export function listOnlineUser(query: Api.Common.EPaginatingSearchParams<Monitor.OnlineUserQuery>) {
  return request<Api.Common.PaginatingQueryRecord<Monitor.OnlineUserResp[]>[]>({
    url: `${BASE_URL}`,
    method: 'get',
    params: query
  });
}

/** 强退在线用户 */
export function kickout(token: string) {
  return request({
    url: `${BASE_URL}/${token}`,
    method: 'delete'
  });
}
