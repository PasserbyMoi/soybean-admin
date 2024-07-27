import { request } from '@/service/request';
import type * as Area from './type';

/** 获取地区列表 */
export const getAreaList = (params: { type: 'province' | 'city' | 'area'; code?: string }) => {
  return request<Area.AreaItem>({
    url: '/area/list',
    method: 'get',
    params
  });
};
