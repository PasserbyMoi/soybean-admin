// import { computed, reactive, ref } from 'vue';
// import type { Ref } from 'vue';
// import useBoolean from './use-boolean';
// import useLoading from './use-loading';

// export type FixedMaybePromise<T> = T | Promise<T>;

// export type FixedUrls = (args: any);
// export type FixedParams = (args: any) => Promise<unknown>;

// export type FixedTableColumnCheck = {
//   key: string;
//   title: string;
//   checked: boolean;
// };

// export type FixedTableDataWithIndex<T> = T & { index: number };

// export type FixedTransformedData<T> = {
//   data: FixedTableDataWithIndex<T>[];
//   pageNum: number;
//   pageSize: number;
//   total: number;
// };

// export type FixedTransformer<T, Response> = (response: Response) => FixedTransformedData<T>;

// export type FixedTableConfig<A extends FixedApiFn, T, C> = {
//   /** api function to get table data */
//   apiFn: A;
//   /** api params */
//   apiParams?: Parameters<A>[0];
//   /** transform api response to table data */
//   transformer: FixedTransformer<T, Awaited<ReturnType<A>>>;
//   /** columns factory */
//   columns: () => C[];
//   /**
//    * get column checks
//    *
//    * @param columns
//    */
//   getColumnChecks: (columns: C[]) => FixedTableColumnCheck[];
//   /**
//    * get columns
//    *
//    * @param columns
//    */
//   getColumns: (columns: C[], checks: FixedTableColumnCheck[]) => C[];
//   /**
//    * callback when response fetched
//    *
//    * @param transformed transformed data
//    */
//   onFetched?: (transformed: FixedTransformedData<T>) => FixedMaybePromise<void>;
//   /**
//    * whether to get data immediately
//    *
//    * @default true
//    */
//   immediate?: boolean;
// };

// export default function useHookFixedTable<A extends FixedApiFn, T, C>(config: FixedTableConfig<A, T, C>) {
//   const { loading, startLoading, endLoading } = useLoading();
//   const { bool: empty, setBool: setEmpty } = useBoolean();

//   const { apiFn, apiParams, transformer, immediate = true, getColumnChecks, getColumns } = config;

//   const searchParams: NonNullable<Parameters<A>[0]> = reactive({ ...apiParams });

//   const allColumns = ref(config.columns()) as Ref<C[]>;

//   const data: Ref<T[]> = ref([]);

//   const columnChecks: Ref<FixedTableColumnCheck[]> = ref(getColumnChecks(config.columns()));

//   const columns = computed(() => getColumns(allColumns.value, columnChecks.value));

//   function reloadColumns() {
//     allColumns.value = config.columns();

//     const checkMap = new Map(columnChecks.value.map(col => [col.key, col.checked]));

//     const defaultChecks = getColumnChecks(allColumns.value);

//     columnChecks.value = defaultChecks.map(col => ({
//       ...col,
//       checked: checkMap.get(col.key) ?? col.checked
//     }));
//   }

//   async function getData() {
//     startLoading();

//     const formattedParams = formatSearchParams(searchParams);

//     const response = await apiFn(formattedParams);

//     const transformed = transformer(response as Awaited<ReturnType<A>>);

//     data.value = transformed.data;

//     setEmpty(transformed.data.length === 0);

//     await config.onFetched?.(transformed);

//     endLoading();
//   }

//   function formatSearchParams(params: Record<string, unknown>) {
//     const formattedParams: Record<string, unknown> = {};

//     Object.entries(params).forEach(([key, value]) => {
//       if (value !== null && value !== undefined) {
//         formattedParams[key] = value;
//       }
//     });

//     return formattedParams;
//   }

//   /**
//    * update search params
//    *
//    * @param params
//    */
//   function updateSearchParams(params: Partial<Parameters<A>[0]>) {
//     Object.assign(searchParams, params);
//   }

//   /** reset search params */
//   function resetSearchParams() {
//     Object.assign(searchParams, apiParams);
//   }

//   if (immediate) {
//     getData();
//   }

//   return {
//     loading,
//     empty,
//     data,
//     columns,
//     columnChecks,
//     reloadColumns,
//     getData,
//     searchParams,
//     updateSearchParams,
//     resetSearchParams
//   };
// }
