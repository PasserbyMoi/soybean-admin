/** 系统用户类型 */
export interface UserResp {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
  gender: number;
  email: string;
  phone: string;
  description: string;
  status: 1 | 2;
  isSystem?: boolean;
  createUserString: string;
  createTime: string;
  updateUserString: string;
  updateTime: string;
  deptId: string;
  deptName: string;
  roleIds: Array<number>;
  roleNames: Array<string>;
  disabled: boolean;
}

export type UserDetailResp = UserResp & {
  pwdResetTime?: string;
};

export interface UserQuery {
  description?: string | null;
  status?: number | null;
  deptId?: string;
}

/** 系统角色类型 */
export interface RoleResp {
  id: string;
  name: string;
  code: string;
  sort: number;
  description: string;
  dataScope: number | null;
  isSystem: boolean;
  createUserString: string;
  createTime: string;
  updateUserString: string;
  updateTime: string;
  disabled: boolean;
}

export interface RoleDetailResp {
  id: string;
  name: string;
  code: string;
  sort: number;
  description: string;
  menuIds: Array<number>;
  dataScope: number | null;
  deptIds: Array<number>;
  isSystem: boolean;
  createUserString: string;
  createTime: string;
  updateUserString: string;
  updateTime: string;
  disabled: boolean;
}

export interface RoleQuery {
  description?: string | null;
  sort: Array<string>;
}

/** 系统菜单类型 */
export interface MenuResp {
  id: string | number;
  title: string;
  parentId: string;
  type: 1 | 2 | 3;
  path: string;
  name: string;
  component: string;
  redirect: string;
  icon: string;
  isExternal: boolean;
  isCache: boolean;
  isHidden: boolean;
  permission: string;
  sort: number;
  status: 1 | 2;
  createUserString: string;
  createTime: string;
  updateUserString: string;
  updateTime: string;
  children: MenuResp[];
}

export interface MenuQuery {
  title?: string | null;
  status?: number | null;
}

/** 系统部门类型 */
export interface DeptResp {
  id: string;
  name: string;
  sort: number;
  status: 1 | 2;
  isSystem: boolean;
  description: string;
  createUserString: string;
  createTime: string;
  updateUserString: string;
  updateTime: string;
  parentId: string;
  children: DeptResp[];
}

export interface DeptQuery {
  description?: string | null;
  status?: number | null;
}

/** 系统字典类型 */
export interface DictResp {
  id: string;
  name: string;
  code: string;
  isSystem: boolean;
  description: string;
  createUserString: string;
  createTime: string;
  updateUserString: string;
  updateTime: string;
}

export interface DictQuery {
  description?: string;
  sort?: Array<string>;
}

export type DictItemResp = {
  id: string;
  label: string;
  value: string;
  color: string;
  sort: number;
  description: string;
  status: 1 | 2;
  dictId: number;
  createUserString: string;
  createTime: string;
  updateUserString: string;
  updateTime: string;
};

export interface DictItemQuery {
  description?: string | null;
  status?: number;
  dictId?: string;
}

/** 系统公告类型 */
export interface NoticeResp {
  id?: string;
  title?: string;
  content?: string;
  status?: number;
  type?: string;
  effectiveTime?: string | null;
  terminateTime?: string | null;
  createUserString?: string;
  createTime?: string;
  updateUserString?: string;
  updateTime?: string;
}

export interface NoticeQuery {
  title?: string | null;
  type?: string | null;
}

/** 系统文件类型 */
export type FileItem = {
  id: string;
  name: string;
  size: number;
  url: string;
  thumbnailSize: number;
  thumbnailUrl: string;
  extension: string;
  type: number;
  storageId: string;
  storageName: string;
  createUserString: string;
  createTime: string;
  updateUserString: string;
  updateTime: string;
};

/** 文件资源统计信息 */
export interface FileStatisticsResp {
  type: string;
  size: any;
  number: number;
  unit: string;
  data: Array<FileStatisticsResp>;
}

export interface FileQuery {
  name?: string;
  type?: string;
  sort: Array<string>;
}

/** 系统存储类型 */
export type StorageResp = {
  id?: string | null;
  name?: string | null;
  code?: string | null;
  type?: number | null;
  accessKey?: string | null;
  secretKey?: string | null;
  endpoint?: string | null;
  bucketName?: string | null;
  domain?: string | null;
  description?: string | null;
  isDefault?: boolean;
  sort?: number | null;
  status?: number;
  createUserString?: string | null;
  createTime?: string | null;
  updateUserString?: string | null;
  updateTime?: string | null;
};

export interface StorageQuery {
  description?: string | null;
  status?: number | null;
}

/** 系统参数类型 */
export interface OptionResp {
  id: string;
  name: string;
  code: string;
  value: string;
  description: string;
}

export interface OptionQuery {
  code?: Array<string>;
  category?: string;
}

/** 基础配置类型 */
export interface BasicConfig {
  SITE_FAVICON: string;
  SITE_LOGO: string;
  SITE_TITLE: string;
  SITE_COPYRIGHT: string;
  SITE_BEIAN: string;
}

/** 基础配置类型 */
export interface SiteConfig {
  SITE_FAVICON: OptionResp | null;
  SITE_LOGO: OptionResp | null;
  SITE_TITLE: OptionResp | null;
  SITE_DESCRIPTION: OptionResp | null;
  SITE_COPYRIGHT: OptionResp | null;
  SITE_BEIAN: OptionResp | null;
}

/** 邮箱配置类型 */
export interface MailConfig {
  MAIL_PROTOCOL?: OptionResp;
  MAIL_HOST?: OptionResp;
  MAIL_PORT?: OptionResp;
  MAIL_USERNAME?: OptionResp;
  MAIL_PASSWORD?: OptionResp;
  MAIL_SSL_ENABLED?: OptionResp;
  MAIL_SSL_PORT?: OptionResp;
}

/** 安全配置类型 */
export interface SecurityConfig {
  PASSWORD_ERROR_LOCK_COUNT: OptionResp;
  PASSWORD_ERROR_LOCK_MINUTES: OptionResp;
  PASSWORD_EXPIRATION_DAYS: OptionResp;
  PASSWORD_EXPIRATION_WARNING_DAYS: OptionResp;
  PASSWORD_REPETITION_TIMES: OptionResp;
  PASSWORD_MIN_LENGTH: OptionResp;
  PASSWORD_ALLOW_CONTAIN_USERNAME: OptionResp;
  PASSWORD_REQUIRE_SYMBOLS: OptionResp;
}

/** 绑定三方账号信息 */
export interface UploadResult {
  url: string;
}

/** 绑定三方账号信息 */
export interface BindSocialAccountRes {
  source: string;
  description: string;
}

/** 系统消息类型 */
export interface MessageResp {
  id: string;
  title: string;
  content: string;
  type: number;
  isRead: boolean;
  readTime?: string;
  createUserString?: string;
  createTime: string;
}

export interface MessageQuery {
  title?: string | null;
  type?: number | null;
  isRead?: boolean | null;
}

/** Arco Design 节点 */
export interface ArcoTreeNodeData {
  key?: string | number;
  title?: string;
  selectable?: boolean;
  disabled?: boolean;
  disableCheckbox?: boolean;
  checkable?: boolean;
  draggable?: boolean;
  isLeaf?: boolean;
  icon?: () => VNode;
  switcherIcon?: () => VNode;
  loadingIcon?: () => VNode;
  dragIcon?: () => VNode;
  children?: ArcoTreeNodeData[];
}
