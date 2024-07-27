import { defineStore } from 'pinia';

const storeSetup = () => {
  const dictData = ref<CommonType.EDictState[]>([]);

  // 设置字典
  const setDict = (_code: string, items: Array<CommonType.EOption>) => {
    if (_code !== null && _code !== '') {
      dictData.value.push({
        code: _code,
        items
      });
    }
  };

  // 获取字典
  const getDict = (_code: string) => {
    if (!_code || _code === '') {
      return null;
    }
    for (let i = 0; i < dictData.value.length; i += 1) {
      if (dictData.value[i].code === _code) {
        return dictData.value[i].items;
      }
    }
    return null;
  };

  // 删除字典
  const deleteDict = (_code: string) => {
    let bln = false;
    try {
      for (let i = 0; i < dictData.value.length; i += 1) {
        if (dictData.value[i].code === _code) {
          dictData.value.splice(i, 1);
          return true;
        }
      }
    } catch (e) {
      bln = false;
    }
    return bln;
  };
  // 清空字典
  const cleanDict = () => {
    dictData.value = [];
  };
  return {
    setDict,
    getDict,
    deleteDict,
    cleanDict
  };
};

export const useDictStore = defineStore('dict', storeSetup, { persist: true });
