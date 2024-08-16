import { request } from '@/service/request';
import type * as System from './type';

const BASE_URL = '/system/message';

/** 查询消息列表 */
export function listMessage(query: Api.Common.EPaginatingSearchParams<System.MessageQuery>) {
  return request<Api.Common.PaginatingQueryRecord<System.MessageResp>>({
    url: `${BASE_URL}`,
    method: 'get',
    params: query
  });
}

/** 删除消息 */
export function deleteMessage(ids: string | Array<string>) {
  return request({
    url: `${BASE_URL}/${ids}`,
    method: 'delete'
  });
}

/** 标记已读 */
export function readMessage(ids?: string | Array<string>) {
  return request({
    url: `${BASE_URL}/read`,
    method: 'patch',
    params: { ids }
  });
}

/** 查询未读消息数量 */
export function getUnreadMessageCount() {
  return request({
    url: `${BASE_URL}/unread`,
    method: 'get'
  });
}
