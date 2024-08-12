import { blob } from 'node:stream/consumers';
import { request } from '@/service/request';
import type {
  FieldConfigResp,
  GenConfigResp,
  GeneratePreviewResp,
  GeneratorConfigResp,
  TableQuery,
  TableResp
} from './type';

const BASE_URL = '/generator';

// Api.SystemManage.UserSearchParams
// Api.SystemManage.UserList

/** 查询代码生成列表 */
export function listGenerator(query: Api.Common.EPaginatingSearchParams<TableQuery>) {
  return request<Api.Common.PaginatingQueryRecord<TableResp[]>>({
    url: `${BASE_URL}/table`,
    method: 'get',
    params: query
  });
}

/** 查询字段配置列表 */
export function listFieldConfig(tableName: string, requireSync: boolean = false) {
  return request<FieldConfigResp[]>({
    url: `${BASE_URL}/field/${tableName}?requireSync=${requireSync}`,
    method: 'get'
  });
}

/** 查询生成配置信息 */
export function getGenConfig(tableName: string) {
  return request<GenConfigResp>({
    url: `${BASE_URL}/config/${tableName}`,
    method: 'get'
  });
}

/** 保存配置信息 */
export function saveGenConfig(tableName: string, req: GeneratorConfigResp) {
  return request({
    url: `${BASE_URL}/config/${tableName}`,
    method: 'post',
    data: req
  });
}

/** 生成预览 */
export function genPreview(tableName: string) {
  return request<GeneratePreviewResp[]>({
    url: `${BASE_URL}/preview/${tableName}`,
    method: 'get'
  });
}

/** 生成代码 */
export function generate(tableNames: Array<string>) {
  return request({
    url: `${BASE_URL}/${tableNames}`,
    method: 'post',
    responseType: 'blob'
  });
}
