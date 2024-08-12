import { request } from '@/service/request';
import type * as System from './type';

const BASE_URL = '/system/option';

/** 查询参数列表 */
export function listOption(query: System.OptionQuery) {
  return request<System.OptionResp[]>({
    url: `${BASE_URL}`,
    method: 'get',
    params: query
  });
}

/** 修改参数 */
export function updateOption(data: any) {
  return request({
    url: `${BASE_URL}`,
    method: 'put',
    data
  });
}

/** 重置参数 */
export function resetOptionValue(data: System.OptionQuery) {
  return request({
    url: `${BASE_URL}/value`,
    method: 'patch',
    data
  });
}
