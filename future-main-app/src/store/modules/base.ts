import { defineStore } from 'pinia';
import { getDictionaryAll } from '@/api/systemData/dictionary';
interface DicChildItem {
  isTree?: number;
  id: string;
  enCode: string;
  fullName: string;
}
interface DicItem extends DicChildItem {
  dictionaryList: DicChildItem[];
}
interface BaseState {
  dictionaryList: DicItem[];
}

export const useBaseStore = defineStore({
  id: 'app-base',
  state: (): BaseState => ({
    dictionaryList: [],
  }),
  getters: {
    getDicList(): DicItem[] {
      return this.dictionaryList;
    },
  },
  actions: {
    resetState() {
      this.dictionaryList = [];
    },
    setDictionaryList(list: DicItem[] = []) {
      this.dictionaryList = list;
    },
    async getDictionaryAll(): Promise<DicItem[]> {
      try {
        if (this.dictionaryList.length) {
          return this.dictionaryList;
        } else {
          const res = await getDictionaryAll();
          if (!res) return [];
          this.dictionaryList = res.data.list;
          return res.data.list;
        }
      } catch (error) {
        return [];
      }
    },
    async getDictionaryData(encode: string, id: string = ''): Promise<DicChildItem[] | DicChildItem> {
      try {
        let list: DicItem[] = [],
          data: Partial<DicItem> = {},
          json: DicChildItem[] | DicChildItem = [];
        if (!this.dictionaryList.length) {
          list = await this.getDictionaryAll();
        } else {
          list = this.dictionaryList;
        }
        if (encode) {
          let arr = list.filter(o => o.enCode === encode);
          if (!arr.length) return [];
          data = arr[0];
          if (!id) {
            json = data.dictionaryList as DicChildItem[];
          } else {
            let rowData: DicChildItem[] = [];
            if (!data.isTree) {
              rowData = (data.dictionaryList as DicChildItem[]).filter(o => o.id === id);
            } else {
              function findData(list) {
                for (let i = 0; i < list.length; i++) {
                  const e = list[i];
                  if (e.id === id) {
                    rowData[0] = e;
                    break;
                  }
                  if (e.children && e.children.length) {
                    findData(e.children);
                  }
                }
              }
              findData(data.dictionaryList);
            }
            if (rowData.length) {
              json = rowData[0];
            } else {
              json = {
                id: '',
                fullName: '',
                enCode: '',
              };
            }
          }
          return json;
        }
        return json;
      } catch (error) {
        return [];
      }
    },
    async getDicDataSelector(value: string, key: string = 'id'): Promise<DicChildItem[]> {
      try {
        let list: DicItem[] = [],
          data: Partial<DicItem> = {},
          json: DicChildItem[] = [];
        if (!this.dictionaryList.length) {
          list = await this.getDictionaryAll();
        } else {
          list = this.dictionaryList;
        }
        if (!value) return [];
        let arr = list.filter(o => {
          return o[key] === value;
        });
        if (!arr.length) return [];
        data = arr[0];
        json = data.dictionaryList as DicChildItem[];
        return json;
      } catch (error) {
        return [];
      }
    },
  },
});
