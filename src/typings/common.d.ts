/** The common type namespace */
declare namespace CommonType {
  /** The strategic pattern */
  interface StrategicPattern {
    /** The condition */
    condition: boolean;
    /** If the condition is true, then call the action function */
    callback: () => void;
  }

  type YesOrNo = 'Y' | 'N' | 'U';

  type YesOrNoNum = 1 | 0 | 2;

  type EnableStatus = 0 | 1 | 2;

  /**
   * The option type
   *
   * @property value: The option value
   * @property label: The option label
   * @property code: The option code
   */
  type Option<V = string | number> = { value: V; label: string };

  /** 键值对类型 */
  type EOption<V = any, L = string | number> = { label: L; value: V; code?: string; extend?: string };

  /** 字典类型 */
  type DictState = { code: string; items: Array<Option> };

  /** 字典类型 */
  type EDictState = { code: string; items: Array<EOption> };

  /** add null to all properties */
  type RecordNullable<T> = {
    [K in keyof T]?: T[K] | null;
  };
}
