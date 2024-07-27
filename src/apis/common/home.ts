import { request } from '@/service/request';
import type * as Common from './type';

const BASE_URL = '/dashboard';

/** 查询访问趋势 */
export function listDashboardAccessTrend(days: number) {
  return request<Common.DashboardAccessTrendResp[]>({
    url: `${BASE_URL}/access/trend/${days}`,
    method: 'get'
  });
}

/** 查询公告列表 */
export function listDashboardNotice() {
  return request<Common.DashboardNoticeResp[]>({
    url: `${BASE_URL}/notice`,
    method: 'get'
  });
}
