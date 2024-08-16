/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    /** common search params */
    export type SearchParams = Pick<Common.PaginatingCommonParams, 'page' | 'size'>;

    export type EPaginatingSearchParams<T = any> = Pick<Common.PaginatingCommonParams, 'page' | 'size' | 'sort'> & T;

    /** common page search params */
    export type PaginatingSearchParams = Pick<Common.PaginatingCommonParams, 'page' | 'size'>;

    /** common delete params */
    export type DeleteParams = { id: number | string };

    /** common batch delete params */
    export type BatchDeleteParams = { ids: number[] | string[] };

    /** common params of paginating */
    interface PaginatingCommonParams {
      /** current page number */
      current: number;
      page: number;
      /** page size */
      size: number;
      /** total count */
      total: number;
      sort?: Array<string> | null,
    }

    /** common params of paginating query list data */
    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      records: T[];
      /** 适配 Continew */
      list: T[];
    }

    /**
     * enable status
     *
     * - "0": disabled
     * - "1": enabled
     * - "2": unknow
     */
    type EnableStatus = '0' | '1' | '2';
    type DeleteStatus = '0' | '1';

    /** common record */
    type CommonRecord<T = any> = {
      /** record id */
      id?: number | string;
      /** record creator */
      createBy?: string;
      createUser?: string;
      /** record create time */
      createTime?: string;
      /** record updater */
      updateBy?: string;
      updateUser?: string;
      /** record update time */
      updateTime?: string;
      /** record status */
      status?: EnableStatus | null;
      isDelete?: DeleteStatus | null;
    } & T;
  }

  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginToken {
      token: string;
      refreshToken: string;
    }

    interface UserInfo {
      id?: string;
      avatar?: string;
      userId?: string;
      userName: string;
      nickname?: string;
      roles: string[];
      buttons: string[];
    }
  }

  /**
   * namespace Route
   *
   * backend api module: "route"
   */
  namespace Route {
    type ElegantConstRoute = import('@elegant-router/types').ElegantConstRoute;

    interface MenuRoute extends ElegantConstRoute {
      id: string;
    }

    interface UserRoute {
      routes: MenuRoute[];
      home: import('@elegant-router/types').LastLevelRouteKey;
    }
  }
}
