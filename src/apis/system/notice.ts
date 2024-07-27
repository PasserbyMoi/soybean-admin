import { request } from '@/service/request';
import type * as System from './type';

const BASE_URL = '/system/notice';

/** 查询公告列表 */
export function listNotice(query: System.NoticePageQuery) {
  return request<App.Service.Page<System.NoticeResp[]>>({
    url: `${BASE_URL}`,
    method: 'get',
    params: query
  });
}

/** 查询公告详情 */
export function getNotice(id: string) {
  return request<System.NoticeResp[]>({
    url: `${BASE_URL}/${id}`,
    method: 'get'
  });
}

/** 新增公告 */
export function addNotice(data: any) {
  return request({
    url: `${BASE_URL}`,
    method: 'post',
    params: data
  });
}

/** 修改公告 */
export function updateNotice(data: any, id: string) {
  return request({
    url: `${BASE_URL}/${id}`,
    method: 'put',
    params: data
  });
}

/** 删除公告 */
export function deleteNotice(ids: string | Array<number>) {
  return request({
    url: `${BASE_URL}/${ids}`,
    method: 'delete'
  });
}
