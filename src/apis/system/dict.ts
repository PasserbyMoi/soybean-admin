import { request } from '@/service/request';
import type * as System from './type';

const BASE_URL = '/system/dict';

/** 查询字典列表 */
export function listDict(query: System.DictQuery) {
  return request<System.DeptResp[]>({
    url: `${BASE_URL}/list`,
    method: 'get',
    params: query
  });
}

/** 查询字典详情 */
export function getDict(id: string) {
  return request<System.DictResp>({
    url: `${BASE_URL}/${id}`,
    method: 'get'
  });
}

/** 新增字典 */
export function addDict(data: any) {
  return request({
    url: `${BASE_URL}`,
    method: 'post',
    params: data
  });
}

/** 修改字典 */
export function updateDict(data: any, id: string) {
  return request({
    url: `${BASE_URL}/${id}`,
    method: 'put',
    params: data
  });
}

/** 删除字典 */
export function deleteDict(id: string) {
  return request({
    url: `${BASE_URL}/${id}`,
    method: 'delete'
  });
}

/** 查询字典项列表 */
export function listDictItem(query: System.DictItemPageQuery) {
  return request<App.Service.Page<System.DictItemResp[]>>({
    url: `${BASE_URL}/item`,
    method: 'get',
    params: query
  });
}

/** 查询字典项详情 */
export function getDictItem(id: string) {
  return request({
    url: `${BASE_URL}/item/${id}`,
    method: 'get'
  });
}

/** 新增字典项 */
export function addDictItem(data: any) {
  return request({
    url: `${BASE_URL}/item`,
    method: 'post',
    params: data
  });
}

/** 修改字典项 */
export function updateDictItem(data: any, id: string) {
  return request({
    url: `${BASE_URL}/item/${id}`,
    method: 'put',
    params: data
  });
}

/** 删除字典项 */
export function deleteDictItem(id: string) {
  return request({
    url: `${BASE_URL}/item/${id}`,
    method: 'delete'
  });
}
