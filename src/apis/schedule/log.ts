import { request } from '@/service/request';
import type * as Schedule from './type';

const BASE_URL = '/schedule/log';

/** 查询任务日志列表 */
export function listJobLog(query: Api.Common.EPaginatingSearchParams<Schedule.JobLogQuery>) {
  return request<Api.Common.PaginatingQueryRecord<Schedule.JobLogResp>>({
    url: `${BASE_URL}`,
    method: 'get',
    params: query
  });
}

/** 查询任务日志详情 */
export function getJobLogDetail(id: number) {
  return request<boolean>({
    url: `${BASE_URL}/${id}`,
    method: 'get'
  });
}

/** 停止任务 */
export function stopJob(id: number) {
  return request({
    url: `${BASE_URL}/stop/${id}`,
    method: 'post'
  });
}

/** 重试任务 */
export function retryJob(id: number) {
  return request({
    url: `${BASE_URL}/retry/${id}`,
    method: 'post'
  });
}

/** 查询任务实例列表 */
export function listJobInstance(query: Schedule.JobInstanceQuery) {
  return request<Schedule.JobInstanceResp[]>({
    url: `${BASE_URL}/instance`,
    method: 'get',
    params: query
  });
}

/** 查询任务实例日志列表 */
export function listJobInstanceLog(query: Schedule.JobInstanceLogQuery) {
  return request<Schedule.JobInstanceLogResp>({
    url: `${BASE_URL}/instance/log`,
    method: 'get',
    params: query
  });
}
