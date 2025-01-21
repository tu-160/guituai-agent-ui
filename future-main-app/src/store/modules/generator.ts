import { defineStore } from 'pinia';

interface BaseState {
  hasTable: boolean;
  allTable: any[];
  subTable: any[];
  formItemList: any[];
  relationData: any;
  dynamicModelExtra: any;
}

export const useGeneratorStore = defineStore({
  id: 'app-generator',
  state: (): BaseState => ({
    hasTable: false,
    subTable: [],
    allTable: [],
    formItemList: [],
    relationData: {},
    dynamicModelExtra: {},
  }),
  getters: {
    getHasTable(): boolean {
      return this.hasTable;
    },
    getAllTable(): any[] {
      return this.allTable;
    },
    getSubTable(): any[] {
      return this.subTable;
    },
    getFormItemList(): any[] {
      return this.formItemList;
    },
    getRelationData(): any {
      return this.relationData;
    },
    getDynamicModelExtra(): any {
      return this.dynamicModelExtra;
    },
  },
  actions: {
    setHasTable(hasTable: boolean = false) {
      this.hasTable = hasTable;
    },
    setAllTable(val) {
      this.allTable = val;
    },
    setSubTable(val) {
      this.subTable = val;
    },
    setFormItemList(val) {
      this.formItemList = val;
    },
    setRelationData(val) {
      this.relationData = val;
    },
    setDynamicModelExtra(val) {
      this.dynamicModelExtra = val;
    },
  },
});
