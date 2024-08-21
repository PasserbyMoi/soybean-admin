import { request } from '@/service/request';
import type * as Schedule from './type';

const BASE_URL = '/schedule/job';

/** 查询任务组列表 */
export function listGroup() {
  return request({
    url: `${BASE_URL}/group`,
    method: 'get'
  });
}

/** 查询任务列表 */
export function listJob(query: Api.Common.EPaginatingSearchParams<Schedule.JobQuery>) {
  return request<Api.Common.PaginatingQueryRecord<Schedule.JobResp>>({
    url: `${BASE_URL}`,
    method: 'get',
    params: query
  });
}

/** 新增任务 */
export function addJob(data: any) {
  return request<boolean>({
    url: `${BASE_URL}`,
    method: 'post',
    data
  });
}

/** 修改任务 */
export function updateJob(data: any, id: number) {
  return request<boolean>({
    url: `${BASE_URL}/${id}`,
    method: 'put',
    data
  });
}

/** 修改任务状态 */
export function updateJobStatus(data: any, id: number) {
  return request({
    url: `${BASE_URL}/${id}/status`,
    method: 'patch',
    data
  });
}

/** 删除任务 */
export function deleteJob(id: number) {
  return request({
    url: `${BASE_URL}/${id}`,
    method: 'delete'
  });
}

/** 执行任务 */
export function triggerJob(id: number) {
  return request({
    url: `${BASE_URL}/trigger/${id}`,
    method: 'post'
  });
}
